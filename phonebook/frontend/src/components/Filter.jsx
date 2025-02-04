import { Form } from 'react-bootstrap';

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <Form.Group controlId="filter">
      <Form.Label>Filter shown with</Form.Label>
      <Form.Control
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Enter name to filter"
      />
    </Form.Group>
  );
};

export default Filter;