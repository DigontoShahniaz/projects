import { Card } from 'react-bootstrap';

const Weather = ({ country, weatherData, icon }) => {
  return (
    <Card className="mt-4">
      <Card.Body>
        {weatherData ? (
          <>
            <Card.Title>Weather in {country.capital}</Card.Title>
            <Card.Text>Temperature: {weatherData.main.temp} Celsius</Card.Text>
            <Card.Img variant="top" src={icon} alt={weatherData.weather[0].description} />
            <Card.Text>Wind Speed: {weatherData.wind.speed} m/s</Card.Text>
          </>
        ) : (
          <Card.Text>Loading weather data...</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default Weather;