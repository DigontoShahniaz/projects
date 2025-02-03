import React from "react";
import { useQuery } from "@apollo/client";
import { Table, Alert } from "react-bootstrap";
import { ALL_BOOKS_BY_GENRE, ME } from "../queries";

const Recommend = ({ show, token }) => {
  const { data: userData, loading: userLoading } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre?.toLowerCase();

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (!show || !token) {
    return null;
  }

  if (userLoading || booksLoading) {
    return <div>Loading...</div>;
  }

  if (!userData || !booksData) {
    return <Alert variant="info">No recommendations available.</Alert>;
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre: <strong>{favoriteGenre}</strong>
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {booksData.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Recommend;