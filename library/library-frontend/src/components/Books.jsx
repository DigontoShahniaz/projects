import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import { Table, Button, Card, Badge, Spinner, Alert } from 'react-bootstrap';

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data, loading, error } = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  const genres = Array.from(new Set(data.allBooks.flatMap((b) => b.genres)));
  return (
    <Card className="mb-4">
      <Card.Header as="h2">Books</Card.Header>
      <Card.Body>
        {selectedGenre && (
          <Alert variant="info">
            Books in genre: <Badge bg="secondary">{selectedGenre}</Badge>
          </Alert>
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
              .filter((b) => !selectedGenre || b.genres.includes(selectedGenre))
              .map((b) => (
                <tr key={b.title}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.published}</td>
                </tr>
              ))}
          </tbody>
        </Table>

        <div className="d-flex flex-wrap gap-2">
          {genres.map((g) => (
            <Button
              key={g}
              variant="outline-primary"
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </Button>
          ))}
          <Button variant="outline-secondary" onClick={() => setSelectedGenre(null)}>
            All Genres
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Books;