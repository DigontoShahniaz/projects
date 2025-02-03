import { useDispatch, useSelector } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';
import { Card, Button, Badge } from 'react-bootstrap';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);

  const filteredAnecdotes =
    filter === 'ALL'
      ? anecdotes
      : anecdotes.filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        );

  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => Number(b.votes) - Number(a.votes)
  );

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(showNotification(`You voted for "${anecdote.content}"`, 5));
  };

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <Card key={anecdote.id} className="mb-3">
          <Card.Body>
            <Card.Text>{anecdote.content}</Card.Text>
            <Card.Text>
              <Badge bg="secondary">Votes: {anecdote.votes}</Badge>
            </Card.Text>
            <Button variant="success" onClick={() => vote(anecdote)}>
              Vote
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AnecdoteList;