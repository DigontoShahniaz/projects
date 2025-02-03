import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table, Form, Button, Alert } from "react-bootstrap";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ show }) => {
  const [born, setBorn] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const { data, loading, error } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
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
    <div>
      <h2>Authors</h2>
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
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Edit Birth Year</h3>
      <Form onSubmit={handleSaveBirthYear}>
        <Form.Group>
          <Form.Label>Select Author:</Form.Label>
          <Select
            options={authorOptions}
            value={selectedAuthor ? { label: selectedAuthor.name, value: selectedAuthor.name } : null}
            onChange={(option) =>
              setSelectedAuthor(data.allAuthors.find((a) => a.name === option.value))
            }
          />
        </Form.Group>
        {selectedAuthor && (
          <Form.Group>
            <Form.Label>Born Year:</Form.Label>
            <Form.Control
              type="number"
              value={born}
              onChange={(e) => setBorn(e.target.value)}
            />
          </Form.Group>
        )}
        <Button type="submit" disabled={!selectedAuthor || !born}>
          Update Birth Year
        </Button>
      </Form>
    </div>
  );
};

export default Authors;