import express from 'express'
import cors from 'cors'
import anecdoteRoutes from './routes/anecdotes.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())


app.use('/anecdotes', anecdoteRoutes)


app.use(express.static('dist'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
