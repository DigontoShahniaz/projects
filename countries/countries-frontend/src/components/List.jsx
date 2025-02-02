import { ListGroupItem, Button } from 'react-bootstrap';

const List = ({ name, handleDetails }) => {
  return (
    <ListGroupItem>
      {name}
      <Button variant="primary" size="sm" className="ms-2" onClick={handleDetails}>Show</Button>
    </ListGroupItem>
  );
};

export default List;