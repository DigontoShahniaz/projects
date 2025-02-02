import { Container } from 'react-bootstrap';

import Togglable from '../components/Togglable';
import Games from '../components/Games';
import GameForm from '../components/GameForm';

const GamesPage = ({
  noteFormRef,
  handleCreateGame,
  games,
  handleVote,
  handleDelete,
}) => {
  if (!games.length) {
    return <div>Loading blog details...</div>;
  }

  const byLikes = (a, b) => b.likes - a.likes;
  return (
    <Container>
      <Togglable buttonLabel="New Game" ref={noteFormRef}>
        <GameForm doCreate={handleCreateGame} />
      </Togglable>
      <div className="mt-4">
        {games.sort(byLikes).map((game) => (
          <Games
            key={game.id}
            game={game}
            handleVote={handleVote}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </Container>
  );
};

export default GamesPage;
