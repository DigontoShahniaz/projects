import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Button, Container, Row, Col, Card, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import reducer from './reducer';

const store = createStore(reducer);

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD',
    });
  };

  const ok = () => {
    store.dispatch({
      type: 'OK',
    });
  };

  const bad = () => {
    store.dispatch({
      type: 'BAD',
    });
  };

  const zero = () => {
    store.dispatch({
      type: 'ZERO',
    });
  };

  // Calculate average, max, min
  const ratings = store.getState().allRatings;
  const totalReviews = store.getState().totalReviews;
  const average = totalReviews > 0 ? (ratings.reduce((acc, rating) => acc + rating, 0) / totalReviews).toFixed(2) : 0;
  const max = ratings.length > 0 ? Math.max(...ratings) : 0;
  const min = ratings.length > 0 ? Math.min(...ratings) : 0;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Unicafe Review</Card.Title>
              <div className="d-flex justify-content-between mb-3">
                <Button variant="success" onClick={good}>
                  Good
                </Button>
                <Button variant="warning" onClick={ok}>
                  Ok
                </Button>
                <Button variant="danger" onClick={bad}>
                  Bad
                </Button>
              </div>
              <Button variant="secondary" onClick={zero} className="w-100">
                Reset Stats
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Statistics</Card.Title>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Good</td>
                    <td>{store.getState().good}</td>
                  </tr>
                  <tr>
                    <td>Ok</td>
                    <td>{store.getState().ok}</td>
                  </tr>
                  <tr>
                    <td>Bad</td>
                    <td>{store.getState().bad}</td>
                  </tr>
                  <tr>
                    <td>Average Rating</td>
                    <td>{average}</td>
                  </tr>
                  <tr>
                    <td>Max Rating</td>
                    <td>{max}</td>
                  </tr>
                  <tr>
                    <td>Min Rating</td>
                    <td>{min}</td>
                  </tr>
                  <tr>
                    <td>Total Reviews</td>
                    <td>{totalReviews}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
