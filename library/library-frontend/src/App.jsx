import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button, Alert } from "react-bootstrap";
import { useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        };
      });
    },
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("library-token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);
  
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("library-token");
    setPage("authors");
  };

  return (
    <Container fluid className="app-container">
      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand href="#home">Library App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setPage("authors")}>Authors</Nav.Link>
            <Nav.Link onClick={() => setPage("books")}>Books</Nav.Link>
            {token && (
              <>
                <Nav.Link onClick={() => setPage("add")}>Add Book</Nav.Link>
                <Nav.Link onClick={() => setPage("recommend")}>Recommend</Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            )}
            {!token && (
              <>
                <Nav.Link onClick={() => setPage("login")}>Login</Nav.Link>
                <Nav.Link onClick={() => setPage("signup")}>Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {error && <Alert variant="danger">{error}</Alert>}

      {!token && page === "login" && <LoginForm setToken={setToken} setError={setError} />}
      {!token && page === "signup" && <SignupForm setToken={setToken} onSignupSuccess={() => setPage("login")} setError={setError} />}
      {token && (
        <>
          <Authors show={page === "authors"} />
          <Books show={page === "books"} />
          <NewBook show={page === "add"} token={token} />
          <Recommend show={page === "recommend"} token={token} />
        </>
      )}
    </Container>
  );
};

export default App;