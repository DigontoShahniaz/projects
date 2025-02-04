import { Form, Button } from 'react-bootstrap';

const FormComponent = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <Form onSubmit={addPerson}>
      <Form.Group controlId="formName" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={newName}
          onChange={handleNameChange}
          placeholder="Enter name"
        />
      </Form.Group>

      <Form.Group controlId="formNumber" className="mb-3">
        <Form.Label>Number</Form.Label>
        <Form.Control
          type="text"
          value={newNumber}
          onChange={handleNumberChange}
          placeholder="Enter number"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add
      </Button>
    </Form>
  );
};

export default FormComponent;