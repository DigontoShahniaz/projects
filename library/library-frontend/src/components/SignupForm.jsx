import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button, Alert } from "react-bootstrap";
import { SIGNUP } from "../queries";

const SignupForm = ({ setToken, onSignupSuccess, setError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");

  const [signup, result] = useMutation(SIGNUP, {
    onError: (error) => {
      setError(error.graphQLErrors[0]?.message || "Something went wrong.");
    },
  });

  const submit = async (event) => {
    event.preventDefault();
    console.log("Signing up with:", username, password, favoriteGenre); // Debugging
    const normalizedFavoriteGenre = favoriteGenre.toLowerCase();
    signup({ variables: { username, password, favoriteGenre: normalizedFavoriteGenre } });
  };

  React.useEffect(() => {
    if (result.data) {
      const token = result.data.createUser.value;
      setToken(token);
      localStorage.setItem("library-token", token);
      onSignupSuccess();
    }
  }, [result.data, setToken, onSignupSuccess]);

  return (
    <div>
      <h2>Sign Up</h2>
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
        <Form.Group>
          <Form.Label>Favorite Genre:</Form.Label>
          <Form.Control
            value={favoriteGenre}
            onChange={({ target }) => setFavoriteGenre(target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Sign Up
        </Button>
      </Form>
    </div>
  );
};

export default SignupForm;