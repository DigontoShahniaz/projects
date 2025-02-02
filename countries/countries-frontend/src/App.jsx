import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import Country from './components/Country';
import List from './components/List';
import Weather from './components/Weather';
import { Container, Form, Card, ListGroup, Button, Navbar, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [value, setValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [icon, setIcon] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => setCountries(response.data))
      .catch(error => console.log('An error occurred while fetching the data', error));
  }, []);

  


useEffect(() => {
  axios.get('/api/config')
    .then(response => {
      const apiKey = response.data.apiKey;
      setApiKey(apiKey);
    })
}, []);

useEffect(() => {
  if (selectedCountry && apiKey) {
    const city = selectedCountry.capital[0];
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => {
        const data = response.data;
        setWeatherData(data);
        const code = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;
        setIcon(iconUrl);
        setWeatherError(null);
      })
      .catch(error => {
        console.log('An error occurred while fetching weather data:', error);
        setWeatherError('Failed to fetch weather data. Please try again.');
      });
  }
}, [selectedCountry, apiKey]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleDetails = (country) => {
    setSelectedCountry(country);
  };

  const filteredCountries = useMemo(() => {
    return value ? countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase())) : [];
  }, [value, countries]);
  const maxDisplay = 10;

  useEffect(() => {
    if (filteredCountries.length === 1 && !selectedCountry) {
      setSelectedCountry(filteredCountries[0]);
    } else if (filteredCountries.length === 0) {
      setSelectedCountry(null);
    }
  }, [filteredCountries, selectedCountry]);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>
            <h1>Weather Fetching App</h1>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Form.Group controlId="formBasicEmail" className="mb-4">
          <Form.Label><h4>Search by Country Name</h4></Form.Label>
          <Form.Control
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Enter country name"
            className="search-input"
          />
        </Form.Group>

        {selectedCountry ? (
          <>
            <Country country={selectedCountry} />
            <Weather country={selectedCountry} weatherData={weatherData} icon={icon} weatherError={weatherError} />
          </>
        ) : (
          <ListGroup>
            {filteredCountries.length > maxDisplay ? (
              <Alert variant="warning">Too many matches, specify another filter</Alert>
            ) : filteredCountries.length === 1 ? (
              <>
                <Country country={filteredCountries[0]} />
                <Weather country={filteredCountries[0]} weatherData={weatherData} icon={icon} weatherError={weatherError} />
              </>
            ) : (
              filteredCountries.map(country => (
                <ListGroup.Item key={country.name.official} className="d-flex justify-content-between align-items-center">
                  {country.name.common}
                  <Button variant="primary" size="sm" onClick={() => handleDetails(country)}>
                    Show
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default App;