import fs from 'fs'
import path from 'path'

const dbPath = path.resolve('db.json')

const readData = () => {
  const rawData = fs.readFileSync(dbPath)
  return JSON.parse(rawData)
}

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

export const getAllAnecdotes = (req, res) => {
  const data = readData()
  res.json(data.anecdotes)
}

export const createAnecdote = (req, res) => {
  const data = readData()
  const newAnecdote = {
    id: data.anecdotes.length + 1,
    content: req.body.content,
    votes: 0
  }
  data.anecdotes.push(newAnecdote)
  writeData(data)
  res.status(201).json(newAnecdote)
}

export const updateAnecdote = (req, res) => {
  const { id } = req.params
  const data = readData()
  const anecdoteIndex = data.anecdotes.findIndex(a => a.id === Number(id))

  if (anecdoteIndex === -1) {
    return res.status(404).json({ error: 'Anecdote not found' })
  }

  data.anecdotes[anecdoteIndex] = { ...data.anecdotes[anecdoteIndex], ...req.body }
  writeData(data)

  res.json(data.anecdotes[anecdoteIndex])
}
