import { useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN, ME } from '../queries';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const client = useApolloClient();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "Something went wrong.");
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-token", token);
      client.query({
        query: ME,
        fetchPolicy: 'network-only'
      });
    }
  }, [result.data, setToken, client]);

  const submit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    login({ variables: { username, password } });
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Login</Card.Header>
      <Card.Body>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default LoginForm;