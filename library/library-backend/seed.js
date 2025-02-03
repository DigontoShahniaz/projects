require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await Author.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});

    // Add authors
    const author1 = new Author({ name: 'J.K. Rowling', born: 1965 });
    const author2 = new Author({ name: 'George R.R. Martin', born: 1948 });
    await author1.save();
    await author2.save();

    // Add books
    const book1 = new Book({
      title: 'Harry Potter and the Philosopher\'s Stone',
      published: 1997,
      author: author1._id,
      genres: ['Fantasy'],
    });
    const book2 = new Book({
      title: 'A Game of Thrones',
      published: 1996,
      author: author2._id,
      genres: ['Fantasy', 'Adventure'],
    });
    await book1.save();
    await book2.save();

    // Add user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    const user = new User({
      username: 'testuser',
      favoriteGenre: 'Fantasy',
      password: passwordHash,
    });
    await user.save();

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
