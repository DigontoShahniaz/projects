require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const connectDB = async function(request, response) {
  try {
    await mongoose.connect(mongoDB)
    console.log('Database connected successfully')
  } catch(err) {
    console.error('An error occurred while connecting to the database', err);
    response.status(500).json({ error: 'Database connection error' });
  }
}

app.use(express.static('public'));

const todoSchema = mongoose.Schema({
  text: {type: String, required: true}
})

const Todo = mongoose.model('Todo', todoSchema)


connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });  
})
.catch((err) => {
  console.error('An error occured while connecting to the server', err)
})

const logger = async function(request, response, next) {
  const date = new Date()
  const localDate = `${date.toLocaleDateString()} || ${date.toLocaleTimeString()}`
  const log = `${localDate} |||| ${request.method} || ${request.url}`
  console.log(log)
  next()
}
app.use(logger)


app.get('/todos', async(request, response) => {
  try {
    const data = await Todo.find({})
    response.json(data)
  } catch(err) {
    console.error('An error occured while fetching the data', err)
    response.status(500).json({ error: 'An error occured from the server side while fetching the data'})
  }
})

app.get('/todos/:id', async(request, response) => {
  try {
    const id = request.params.id
    const data = await Todo.findById(id)
    if (!data) {
      response.status(404).json({ error: 'Todo not found'})
    }
    response.json(data)
  } catch(err) {
    console.error('An error occured while fetching data by id', err)
    response.status(500).json({ error: 'An error occured from the server side while fetching the data by id'})
  }
})

app.post('/todos', async(request, response) => {
  try {
    const text = request.body.text
    if (!text) {
      return response.status(400).json({ error: 'Text field is required' });
    }
    const data = new Todo({text:text})
    const savedTodo = await data.save()
    response.status(201).json(savedTodo)

  } catch(err) {
    console.log('An error occured while posting the data', err)
    response.status(500).json({ error: 'An error occurred while posting the data' })
  }
})

app.put('/todos/:id', async(request, response) => {
  try {
    const id = request.params.id
    const text = request.body.text
    const data = await Todo.findByIdAndUpdate(id, {text:text}, {new: true})
    if (!data) {
      return response.status(404).json({ error: 'Todo not found' });
    }
    response.json(data)
  } catch(err) {
    console.error('An error occured while editing the data', err)
    response.status(500).json({ error: 'An error occurred while editing the data' })
  }
})

app.delete('/todos/:id', async(request, response) => {
  try {
    const id = request.params.id
    const data = await Todo.findByIdAndDelete(id)
    if (!data) {
      return response.status(404).json({ error: 'Todo not found' });
    }
    response.json(data)
  } catch(err) {
    console.error('An error occured while deleting the data', err)
    response.status(500).json({ error: 'An error occurred while deleting the data' })
  }
})
