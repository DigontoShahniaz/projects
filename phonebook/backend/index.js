const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('post_data', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :response-time ms :post_data'))



app.get('/info', (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.send(`<h1>Phonebook has info for ${persons.length} people</h1><br/><h1>${new Date()}</h1>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => persons ? response.json(persons) : response.status(404).send( { error: 'not found' } ))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findById(id)
    .then(person => person ? response.json(person) : response.status(404).send({ error: 'not found any person by this id' }))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findByIdAndDelete(id)
    .then(deletedNote => deletedNote ? response.status(204).json(deletedNote) : response.status(404).end())
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).send({ error: 'person not found' })
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  Person
    .findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(409).json({ error: 'name must be unique' })
      }
      const person = new Person({
        name: body.name,
        number: body.number
      })
      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) {
        response.status(201).json(savedPerson)
      }
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})