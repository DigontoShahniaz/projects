import { Container } from 'react-bootstrap';
import Togglable from '../components/Togglable';
import UserForm from '../components/UserForm';

const SignupPage = ({ addUser }) => {
  return (
    <Container>
      <Togglable buttonLabel="Sign Up">
        <UserForm addUser={addUser} />
      </Togglable>
    </Container>
  );
};

export default SignupPage;
