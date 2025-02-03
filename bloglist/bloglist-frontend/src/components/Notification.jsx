import { Alert } from "react-bootstrap"; // Import Alert from React Bootstrap

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="container">
      <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
    </div>
  );
};

export default Notification;
