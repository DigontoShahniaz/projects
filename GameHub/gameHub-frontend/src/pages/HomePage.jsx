import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <Container>
      <h2 className="my-4">Welcome to GameHub</h2>
      <p>
        GameHub is an exciting platform for game lovers! Add your favorite
        games, explore others' favorites, and like games of your choice!
      </p>
      {user === null ? (
        <p>
          Please <Link to="/login">login</Link> to continue.
        </p>
      ) : null}
    </Container>
  );
};

export default HomePage;
