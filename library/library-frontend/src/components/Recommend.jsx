import { useQuery } from '@apollo/client';
import { ALL_BOOKS_BY_GENRE, ME } from '../queries';
import { Table, Card, Alert, Spinner, Badge } from 'react-bootstrap';

const Recommend = () => {
  const { data: userData, loading: userLoading } = useQuery(ME);
  const favoriteGenre = userData?.me?.favoriteGenre;

  const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (userLoading || booksLoading) {
    return <Spinner animation="border" />;
  }

  if (!userData || !booksData) {
    return <Alert variant="info">No recommendations available</Alert>;
  }

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Recommendations</Card.Header>
      <Card.Body>
        <Alert variant="info">
          Books in your favorite genre <Badge bg="secondary">{favoriteGenre}</Badge>
        </Alert>

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
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default Recommend;