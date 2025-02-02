import { Alert } from 'react-bootstrap';

const Notification = ({ notification }) => {
  if (!notification) {
    return null;
  }

  const { message, type } = notification;

  return (
    <div className="container">
      <Alert variant={type === 'error' ? 'danger' : 'success'}>{message}</Alert>
    </div>
  );
};

export default Notification;
