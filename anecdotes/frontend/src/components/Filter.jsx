import { useDispatch } from 'react-redux';
import { filterChange } from '../reducers/filterReducer';
import { Form } from 'react-bootstrap';

const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(filterChange(event.target.value));
  };

  return (
    <Form className="mb-4">
      <Form.Group>
        <Form.Label>Filter Anecdotes</Form.Label>
        <Form.Control
          type="text"
          name="filter"
          placeholder="Search anecdotes..."
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  );
};

export default Filter;