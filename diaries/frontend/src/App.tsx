import { useState, useEffect } from 'react';
import { Diaries, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './diaryServices';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState(Visibility.Great);
  const [weather, setWeather] = useState(Weather.Sunny);
  const [comment, setComment] = useState('');
  const [diaries, setDiaries] = useState<Diaries[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newDiary = await createDiary({ date, visibility, weather, comment });
      setDiaries(diaries.concat(newDiary));
      setDate('');
      setVisibility(Visibility.Great);
      setWeather(Weather.Sunny);
      setComment('');
      setError('');
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'error' in err.response.data &&
        Array.isArray((err.response.data as { error?: unknown }).error)
      ) {
        setError(
          ((err.response.data as { error: { message: string }[] }).error)
            .map((e: { message: string }) => e.message)
            .join('\n')
        );
      } else {
        setError('Failed to create diary entry');
      }
    }
  };

  return (
    <Container className="diary-app-container">
      <header className="app-header text-center py-4 mb-5">
        <h1 className="app-title">Travel Diary</h1>
        <p className="app-subtitle">Record your travel experiences</p>
      </header>

      <Row className="justify-content-center">
        <Col lg={8}>
          {error && (
            <Alert variant="danger" className="error-alert mb-4" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <Card className="entry-form-card mb-5">
            <Card.Body className="p-4">
              <Card.Title className="form-title mb-4">Add New Entry</Card.Title>
              <Form onSubmit={diaryCreation}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label d-block mb-3">Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="form-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label d-block mb-3">Visibility</Form.Label>
                  <div className="radio-group">
                    {Object.values(Visibility).map(v => (
                      <Form.Check
                        inline
                        type="radio"
                        key={v}
                        label={v}
                        name="visibility"
                        checked={visibility === v}
                        onChange={() => setVisibility(v)}
                        className="radio-option me-3 mb-2"
                        id={`visibility-${v}`}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label d-block mb-3">Weather</Form.Label>
                  <div className="radio-group">
                    {Object.values(Weather).map(w => (
                      <Form.Check
                        inline
                        type="radio"
                        key={w}
                        label={w}
                        name="weather"
                        checked={weather === w}
                        onChange={() => setWeather(w)}
                        className="radio-option me-3 mb-2"
                        id={`weather-${w}`}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label d-block mb-3">Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input"
                  />
                </Form.Group>

                <div className="text-center mt-4">
                  <Button variant="primary" type="submit" className="submit-button px-4 py-2">
                    Add Entry
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="diary-entries-section">
            <h2 className="entries-title mb-4">Your Diary Entries</h2>
            {diaries.length === 0 ? (
              <div className="no-entries text-center py-5">
                <p className="mb-0">No entries yet. Add your first diary entry!</p>
              </div>
            ) : (
              diaries.map(diary => (
                <Card key={diary.id} className="diary-entry mb-4">
                  <Card.Body className="p-4">
                    <Card.Title className="entry-date mb-4">
                      {new Date(diary.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Card.Title>
                    <div className="entry-details">
                      <div className="detail-item mb-4">
                        <span className="detail-label d-block mb-2">Visibility</span>
                        <span className="detail-value">{diary.visibility}</span>
                      </div>
                      <div className="detail-item mb-4">
                        <span className="detail-label d-block mb-2">Weather</span>
                        <span className="detail-value">{diary.weather}</span>
                      </div>
                      {diary.comment && (
                        <div className="detail-item">
                          <span className="detail-label d-block mb-2">Comment</span>
                          <p className="detail-comment mb-0">{diary.comment}</p>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;