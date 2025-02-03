import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Table, Button, Alert } from "react-bootstrap";
import { ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data, loading, error } = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  // Normalize genres to lowercase and remove duplicates
  const genres = Array.from(
    new Set(data.allBooks.flatMap((b) => b.genres.map((g) => g.toLowerCase())))
  );

  return (
    <div>
      <h2>Books</h2>
      {selectedGenre && (
        <p>
          Books in genre: <strong>{selectedGenre}</strong>
        </p>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks
            .filter(
              (b) =>
                !selectedGenre ||
                b.genres.map((g) => g.toLowerCase()).includes(selectedGenre.toLowerCase())
            )
            .map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.published}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div>
        {genres.map((g) => (
          <Button key={g} onClick={() => setSelectedGenre(g)} className="me-2">
            {g}
          </Button>
        ))}
        <Button onClick={() => setSelectedGenre(null)}>All Genres</Button>
      </div>
    </div>
  );
};

export default Books;