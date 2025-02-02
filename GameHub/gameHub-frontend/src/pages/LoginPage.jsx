import { Container } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ handleLogin }) => {
  return (
    <Container>
      <LoginForm doLogin={handleLogin} />
    </Container>
  );
};

export default LoginPage;
