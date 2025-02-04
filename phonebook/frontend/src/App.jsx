import { useState, useEffect } from 'react';
import phonebookServices from './servers/phonebookservices';
import Phonebook from './components/Phonebook';
import Form from './components/Form';
import Filter from './components/Filter';
import Notification from './components/Notification';
import { Container, ListGroup, Card } from 'react-bootstrap';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    phonebookServices
      .getAll()
      .then(returnedList => {
        setPersons(returnedList);
      })
      .catch(error => {
        setIsError(true);
        setMessage(`Note: An error occurred while getting data from server. Error: ${error}`);
        setTimeout(() => { setMessage(null) }, 5000);
      });
  }, []);

  const updatePerson = (existingPerson, newNumber) => {
    const confirmUpdate = window.confirm(
      `${existingPerson.name} is already in the phonebook. Replace the old number with the new one?`
    );

    if (confirmUpdate) {
      const updatedPerson = { ...existingPerson, number: newNumber };
      phonebookServices
        .updateUser(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(persons.map(person =>
            person.id !== existingPerson.id ? person : returnedPerson
          ));
          setIsError(false);
          setMessage(`Number changed of ${newName}`);
          setTimeout(() => { setMessage(null) }, 5000);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setIsError(true);
          setMessage(`${error.response.data.error}`);
          setTimeout(() => { setMessage(null) }, 5000);
        });
    }
  };

  const addPerson = (event) => {
    event.preventDefault();

    if (!newName || !newNumber) {
      alert('Please enter both name and number');
      return;
    }

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      updatePerson(existingPerson, newNumber);
    } else {
      const newObject = {
        name: newName,
        number: newNumber,
      };

      phonebookServices
        .create(newObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject));
          setIsError(false);
          setMessage(`Added ${newName}`);
          setTimeout(() => { setMessage(null) }, 5000);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setIsError(true);
          setMessage(`${error.response.data.error}`);
          setTimeout(() => { setMessage(null) }, 5000);
        });
    }
  };

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (personToDelete) {
      phonebookServices
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          setIsError(true);
          setMessage(`Information of ${personToDelete.name} has already been removed from server`);
          setTimeout(() => { setMessage(null) }, 5000);
        });
      setPersons(persons.filter(person => person.id !== id));
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Container>
      <h1>Phonebook</h1>
      <Notification message={message} isError={isError} />

      <Card className="mb-3">
        <Card.Body>
          <Filter filter={filter} handleFilterChange={handleFilterChange} />
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <Form
            addPerson={addPerson}
            newName={newName}
            handleNameChange={handleNameChange}
            newNumber={newNumber}
            handleNumberChange={handleNumberChange}
          />
        </Card.Body>
      </Card>

      <h1>Numbers</h1>
      <ListGroup>
        {filteredPersons.map(person => (
          <Phonebook key={person.id} persons={person} deletePerson={() => deletePerson(person.id)} />
        ))}
      </ListGroup>
    </Container>
  );
};

export default App;