import { Card } from 'react-bootstrap';

const Country = ({ country }) => {
  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{country.name.common}</Card.Title>
        <Card.Text>Capital: {country.capital}</Card.Text>
        <Card.Text>Area: {country.area}</Card.Text>
        <Card.Title>Languages:</Card.Title>
        <ul>
          {Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
        <Card.Img variant="top" src={country.flags.png} alt={`Flag of ${country.name.common}`} style={{ width: '100px' }} />
      </Card.Body>
    </Card>
  );
};

export default Country;