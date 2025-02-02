import { useState } from 'react';
import storage from '../services/storage';
import PropTypes from 'prop-types';
import { Button, Card, Collapse } from 'react-bootstrap';

const Games = ({ game, handleVote, handleDelete }) => {
  const [visible, setVisible] = useState(false);

  const nameOfUser = game.user ? game.user.name : 'anonymous';

  const canRemove = game.user ? game.user.username === storage.me() : true;

  return (
    <Card style={{ marginBottom: '1rem' }}>
      <Card.Body>
        <Card.Title>
          {game.name} by {game.publishers}
          <Button
            variant="link"
            style={{ marginLeft: 3 }}
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Hide' : 'View'}
          </Button>
        </Card.Title>

        <Collapse in={visible}>
          <div>
            <Card.Text>
              <a href={game.url} target="_blank" rel="noopener noreferrer">
                {game.url}
              </a>
            </Card.Text>
            <Card.Text>
              Likes: {game.likes}{' '}
              <Button variant="link" onClick={() => handleVote(game)}>
                Like
              </Button>
            </Card.Text>
            <Card.Text>Added by {nameOfUser}</Card.Text>

            {canRemove && (
              <Button variant="danger" onClick={() => handleDelete(game)}>
                Remove
              </Button>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

Games.propTypes = {
  game: PropTypes.object.isRequired,
  handleVote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Games;
