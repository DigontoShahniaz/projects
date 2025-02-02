import { Container, Table, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const UserPage = ({ user, users }) => {
  const id = useParams().id;
  const findUser = users.find((user) => user.id === id);

  if (!users.length) {
    return <div>Loading user details...</div>;
  }

  if (!findUser) {
    return <Alert variant="warning">User not found</Alert>;
  }

  return (
    <Container>
      <h2>{findUser.name}</h2>
      <h3 className="mt-3">Added Games</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Game Name</th>
          </tr>
        </thead>
        <tbody>
          {findUser.games.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserPage;
