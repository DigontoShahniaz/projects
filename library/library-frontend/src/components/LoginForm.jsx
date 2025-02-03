import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Alert } from "react-bootstrap";
import { LOGIN } from "../queries";

const LoginForm = ({ setToken, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "Something went wrong.");
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  React.useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-token", token);
    }
  }, [result.data, setToken]);

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;