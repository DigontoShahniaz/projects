import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { CREATE_USER, LOGIN, ME } from '../queries';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const SignupForm = ({ setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [error, setError] = useState("");
  const client = useApolloClient();

  const [createUser] = useMutation(CREATE_USER, {
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "User creation failed");
    },
    onCompleted: (data) => {
      login({ variables: { username, password } });
    }
  });

  const [login, loginResult] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "Login failed after signup");
    },
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-token", token);
      client.query({
        query: ME,
        fetchPolicy: 'network-only'
      });
      setPage("authors");
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password || !favoriteGenre) {
      setError("All fields are required");
      return;
    }
    try {
      await createUser({
        variables: {
          username,
          password,
          favoriteGenre
        }
      });
    } catch (e) {
      console.error("Error in user creation:", e);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Sign Up</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3">
            <Form.Label>Favorite Genre</Form.Label>
            <Form.Control
              type="text"
              value={favoriteGenre}
              onChange={({ target }) => setFavoriteGenre(target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default SignupForm;