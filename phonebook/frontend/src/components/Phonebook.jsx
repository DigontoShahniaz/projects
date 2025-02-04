import { ListGroup, Button } from 'react-bootstrap';

const Phonebook = ({ persons, deletePerson }) => {
  return (
    <ListGroup.Item>
      {persons.name} {persons.number}
      <Button variant="danger" size="sm" onClick={deletePerson}>
        Delete
      </Button>
    </ListGroup.Item>
  );
};

export default Phonebook;