import { Alert } from 'react-bootstrap';

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  return (
    <Alert variant={isError ? 'danger' : 'success'}>
      {message}
    </Alert>
  );
};

export default Notification;