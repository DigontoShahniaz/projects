import { Container, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UsersPage = ({ user, users }) => {
  return (
    <Container>
      {user === null ? (
        <p>
          Please <Link to="/login">login</Link> to see users.
        </p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Added Games</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.games.length}</td>
                <td>
                  <Link to={`/users/${user.id}`}>
                    <Button variant="primary" size="sm">
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UsersPage;
