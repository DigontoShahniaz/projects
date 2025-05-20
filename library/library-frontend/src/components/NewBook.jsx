import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';
import { Form, Button, Card, Alert, Badge } from 'react-bootstrap';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.token) {
    return <Alert variant="warning">Please log in to access this feature.</Alert>;
  }

  if (!props.show) {
    return null;
  }

  const publishedInt = parseInt(published, 10);

  const submit = async (event) => {
    event.preventDefault();
    const normalizedGenres = genres.map((g) => g.trim().toLowerCase());
    createBook({ variables: { title, author, published: publishedInt, genres: normalizedGenres } });
    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    if (genre.trim()) {
      const normalizedGenre = genre.trim().toLowerCase();
      if (!genres.includes(normalizedGenre)) {
        setGenres(genres.concat(normalizedGenre));
      }
      setGenre('');
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Add New Book</Card.Header>
      <Card.Body>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Published</Form.Label>
            <Form.Control
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                value={genre}
                onChange={({ target }) => setGenre(target.value)}
              />
              <Button variant="outline-secondary" onClick={addGenre} type="button">
                Add Genre
              </Button>
            </div>
          </Form.Group>

          <div className="mb-3">
            <strong>Genres:</strong>{' '}
            {genres.map((g, i) => (
              <Badge key={i} bg="secondary" className="me-1">
                {g}
              </Badge>
            ))}
          </div>

          <Button variant="primary" type="submit">
            Create Book
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewBook;