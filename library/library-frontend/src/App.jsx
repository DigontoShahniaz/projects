import { useState, useEffect } from "react";
import { useSubscription, useQuery } from '@apollo/client';
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { ALL_BOOKS, BOOK_ADDED, ME } from "./queries";
import { Navbar, Nav, Container, Alert, Card } from 'react-bootstrap';

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const userResult = useQuery(ME, {
    skip: !token,
    onCompleted: (data) => {
      if (data && data.me) {
        setUser(data.me);
      }
    }
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        };
      });
    }
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("library-token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token && userResult.refetch) {
      userResult.refetch();
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("library-token");
    setPage("authors");
  };

  return (
    <Container>
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
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
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

      {user && (
        <Alert variant="info" className="mb-4">
          <Alert.Heading>Welcome, {user.username}!</Alert.Heading>
          <p>Your favorite genre is: <strong>{user.favoriteGenre}</strong></p>
        </Alert>
      )}

      {page === "authors" && <Authors show={true} />}
      {page === "books" && <Books show={true} />}
      {!token && page === "login" && <LoginForm setToken={setToken} />}
      {!token && page === "signup" && <SignupForm setToken={setToken} setPage={setPage} />}
      {token && page === "add" && <NewBook show={true} token={token} />}
      {token && page === "recommend" && <Recommend />}
    </Container>
  );
};

export default App;