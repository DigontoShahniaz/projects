import { gql } from '@apollo/client'

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;



export const ALL_BOOKS_BY_GENRE = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author
      published
      id
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
      id
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title,
      author,
      genres,
      published,
      id
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author
      published
      genres
    }
  }
`;


export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!, $favoriteGenre: String!) {
    createUser(
      username: $username,
      password: $password,
      favoriteGenre: $favoriteGenre
    ) {
      username
      favoriteGenre
    }
  }
`;
