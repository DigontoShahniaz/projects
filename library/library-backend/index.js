const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
require('dotenv').config();
const mongoose = require('mongoose');

const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const app = express();
app.use(express.static("dist"));

mongoose.set('strictQuery', false);
const MONGODB_URI = process.env.MONGODB_URI;
console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connection to MongoDB:', error.message));

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]
    me: User
    recommendedBooks: [Book!]! # Added query for recommended books
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    addAuthor (
      name: String!
      born: Int
    ): Author

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!, 
      favoriteGenre: String!,
      password: String!
    ): Token

    login(
      username: String!, 
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};
      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }
      return Book.find(filter).populate('author', 'name born');
    },
    allAuthors: async () => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books',
          },
        },
        {
          $addFields: {
            bookCount: { $size: '$books' },
          },
        },
        {
          $project: {
            books: 0,
          },
        },
      ]);
    
      return authors.map(author => ({
        id: author._id.toString(),
        name: author.name,
        born: author.born,
        bookCount: author.bookCount,
      }));
    },    
    me: (root, args, context) => context.currentUser,
    recommendedBooks: async (root, args, context) => {
      const { currentUser } = context;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      return Book.find({ genres: { $in: [currentUser.favoriteGenre] } }).populate('author', 'name born');
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const { currentUser } = context;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError('Author validation failed', { extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.author, error } });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return await book.save();
      } catch (error) {
        throw new GraphQLError('Book validation failed', { extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.title, error } });
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new GraphQLError('Author not found');
      }

      author.born = args.setBornTo;
      try {
        return await author.save();
      } catch (error) {
        throw new GraphQLError('Author update failed', { extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error } });
      }
    },
    createUser: async (root, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);
    
      const user = new User({ ...args, password: passwordHash });
      try {
        await user.save();
        const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET);
        return { value: token };
      } catch (error) {
        console.log("Error creating user:", error); // Log the full error
        throw new GraphQLError('User creation failed', { error });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordValid = user ? await bcrypt.compare(args.password, user.password) : false;

      if (!user || !passwordValid) {
        throw new GraphQLError('Invalid credentials');
      }

      const token = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET);
      return { value: token };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
  Book: {
    author: async (root) => {
      const author = await Author.findById(root.author);
      return author ? author.name : null;
    },
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root.id }),
    id: (root) => root.id
  },
};

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          } catch (error) {
            console.error('Authentication error:', error);
          }
        }
        return {};
      },
    }),
  );

  const PORT = 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
