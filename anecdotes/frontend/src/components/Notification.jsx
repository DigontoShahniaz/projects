import { useSelector } from 'react-redux';
import { Alert } from 'react-bootstrap';

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  return notification ? (
    <Alert variant="info" className="mb-4">
      {notification}
    </Alert>
  ) : null;
};

export default Notification;