import NewAnecdote from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Filter from './components/Filter';
import Notification from './components/Notification';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAnecdotes } from './reducers/anecdoteReducer';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Anecdotes</h1>
          <Notification />
          <Filter />
          <AnecdoteList />
          <NewAnecdote />
        </Col>
      </Row>
    </Container>
  );
};

export default App;