import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import userServices from '../services/users';

const UserForm = ({ addUser }) => {
  const [newUserName, setNewUserName] = useState('');
  const [newUseruserName, setNewUseruserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const handleNewUser = async (event) => {
    event.preventDefault();

    try {
      const user = await userServices.createUser({
        username: newUseruserName,
        name: newUserName,
        password: newUserPassword,
      });
      console.log(user, 'created successfully');
      addUser(user);
      setNewUseruserName('');
      setNewUserName('');
      setNewUserPassword('');
    } catch (err) {
      console.log('an error occured', err);
    }
  };

  return (
    <div>
      <Form onSubmit={handleNewUser}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            value={newUserName}
            onChange={({ target }) => setNewUserName(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={newUseruserName}
            onChange={({ target }) => setNewUseruserName(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={newUserPassword}
            onChange={({ target }) => setNewUserPassword(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default UserForm;
