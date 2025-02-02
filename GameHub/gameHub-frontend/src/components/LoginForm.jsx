import { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Form, Button } from 'react-bootstrap';

const LoginForm = ({ doLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginFormVisible, setLoginFormVisible] = useState(true);

  /*   const hideForm = { display: loginFormVisible ? 'none' : '' }; */
  const showForm = { display: loginFormVisible ? '' : 'none' };

  const handleLogin = (event) => {
    event.preventDefault();
    doLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <div style={showForm}>
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            login
          </Button>
        </Form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  doLogin: PropTypes.func.isRequired,
};

export default LoginForm;
