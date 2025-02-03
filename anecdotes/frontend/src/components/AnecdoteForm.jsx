import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';
import { Form, Button, Card } from 'react-bootstrap';

const NewAnecdote = () => {
  const dispatch = useDispatch();

  const addAnecdoteHandler = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    dispatch(createAnecdote(content));
    dispatch(showNotification(`You added "${content}"`, 5));
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Create New Anecdote</Card.Title>
        <Form onSubmit={addAnecdoteHandler}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="anecdote"
              placeholder="Enter your anecdote"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewAnecdote;