import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const GameForm = ({ doCreate }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [publishers, setPublishers] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handlePublishersChange = (event) => {
    setPublishers(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    doCreate({ name, url, publishers });
    setName('');
    setUrl('');
    setPublishers('');
  };

  return (
    <div className="container">
      <h2>Add New Game</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="gameName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter game name"
          />
        </Form.Group>

        <Form.Group controlId="gameUrl">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter game URL"
          />
        </Form.Group>

        <Form.Group controlId="gamePublishers">
          <Form.Label>Publishers</Form.Label>
          <Form.Control
            type="text"
            value={publishers}
            onChange={handlePublishersChange}
            placeholder="Enter publishers"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </div>
  );
};

GameForm.propTypes = {
  doCreate: PropTypes.func.isRequired,
};

export default GameForm;
