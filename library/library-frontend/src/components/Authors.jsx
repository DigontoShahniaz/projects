import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { Table, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';

const Authors = (props) => {
  const [born, setBorn] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const { data, loading, error } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  const handleSaveBirthYear = (event) => {
    event.preventDefault();
    if (born && selectedAuthor) {
      editAuthor({
        variables: {
          name: selectedAuthor.name,
          setBornTo: parseInt(born, 10),
        },
      });
      setSelectedAuthor(null);
      setBorn("");
    }
  };

  const authorOptions = data.allAuthors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Authors</Card.Header>
      <Card.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Born</th>
              <th>Books</th>
            </tr>
          </thead>
          <tbody>
            {data.allAuthors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Card className="mt-4">
          <Card.Header as="h5">Edit Birth Year</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSaveBirthYear}>
              <Form.Group className="mb-3">
                <Form.Label>Select Author:</Form.Label>
                <Select
                  options={authorOptions}
                  onChange={(option) =>
                    setSelectedAuthor(data.allAuthors.find((a) => a.name === option.value))
                  }
                />
              </Form.Group>

              {selectedAuthor && (
                <Form.Group className="mb-3">
                  <Form.Label>Born Year:</Form.Label>
                  <Form.Control
                    type="number"
                    value={born}
                    onChange={(e) => setBorn(e.target.value)}
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit">
                Update Birth Year
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default Authors;