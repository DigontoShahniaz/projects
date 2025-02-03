import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Alert } from "react-bootstrap";
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = ({ show, token }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "Something went wrong.");
    },
  });

  if (!token) {
    return <Alert variant="warning">Please log in to access this feature.</Alert>;
  }

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const publishedInt = parseInt(published, 10);
    const normalizedGenres = genres.map((g) => g.trim().toLowerCase());
    createBook({ variables: { title, author, published: publishedInt, genres: normalizedGenres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    if (genre.trim()) {
      const normalizedGenre = genre.trim().toLowerCase();
      if (!genres.includes(normalizedGenre)) {
        setGenres(genres.concat(normalizedGenre));
      }
      setGenre("");
    }
  };

  return (
    <div>
      <h2>Add New Book</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Published:</Form.Label>
          <Form.Control
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Genre:</Form.Label>
          <Form.Control
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <Button onClick={addGenre} type="button" className="mt-2">
            Add Genre
          </Button>
        </Form.Group>
        <div className="mt-2">Genres: {genres.join(", ")}</div>
        <Button type="submit" className="mt-3">
          Create Book
        </Button>
      </Form>
    </div>
  );
};

export default NewBook;