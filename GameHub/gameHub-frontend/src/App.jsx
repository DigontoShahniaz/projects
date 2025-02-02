import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

import gameServices from './services/gameServices';
import loginServices from './services/loginServices';
import userServices from './services/userServices';

import GameForm from './components/GameForm';
import UserForm from './components/UserForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Games from './components/Games';
import storage from './services/storage';
import Togglable from './components/Togglable';

import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import GamesPage from './pages/GamesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const noteFormRef = useRef();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userServices.getUsers().then((initialUsers) => setUsers(initialUsers));
  }, []);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    gameServices.getGames().then((initialGames) => setGames(initialGames));
  }, []);

  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await loginServices.login(credentials);
      setUser(user);
      storage.saveUser(user);
      notify(`Welcome back, ${user.name}`);
      navigate('/games');
    } catch (error) {
      console.log(error);
      notify('Wrong credentials', 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    storage.removeUser();
    notify(`Bye ${user.name}`);
    navigate('/');
  };

  const handleCreateGame = async (game) => {
    noteFormRef.current.toggleFormVisibility();
    const newGame = await gameServices.createGame(game);
    setGames(games.concat(newGame));
    notify(`Successfully Created: ${newGame.name} by ${newGame.publishers}`);
  };

  const handleVote = async (game) => {
    try {
      const updatedGame = await gameServices.update(game.id, {
        ...game,
        likes: game.likes + 1,
      });

      notify(`You liked ${updatedGame.name} by ${updatedGame.publishers}`);
      setGames(games.map((g) => (g.id === game.id ? updatedGame : g)));
    } catch (error) {
      console.log(error);
      notify(`Please log in to like`, 'error');
    }
  };

  const handleDelete = async (game) => {
    if (window.confirm(`Remove game ${game.name} by ${game.publishers}`)) {
      await gameServices.remove(game.id);
      setGames(games.filter((g) => g.id !== game.id));
      notify(`Game ${game.name}, by ${game.publishers} removed`);
    }
  };

  const handleAddUser = (newUser) => {
    setUsers(users.concat(newUser));
    navigate('/login');
    notify(`User ${newUser.username} created successfully`);
  };

  return (
    <Container>
      {notification && <Notification notification={notification} />}
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="mb-4"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            GameHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/games">
                Games
              </Nav.Link>
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Nav.Link disabled>{user.name} logged in</Nav.Link>
                  <Nav.Link
                    as="span"
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route
          path="/games"
          element={
            <GamesPage
              noteFormRef={noteFormRef}
              games={games}
              handleCreateGame={handleCreateGame}
              handleDelete={handleDelete}
              handleVote={handleVote}
            />
          }
        />
        <Route
          path="/users"
          element={<UsersPage user={user} users={users} />}
        />
        <Route
          path="/login"
          element={<LoginPage handleLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<SignupPage addUser={handleAddUser} />}
        />
        <Route path="users/:id" element={<UserPage users={users} />} />
      </Routes>
    </Container>
  );
};

export default App;
