import express from 'express'
import { getAllAnecdotes, createAnecdote, updateAnecdote } from '../controllers/anecdotesController.js'

const router = express.Router()

router.get('/', getAllAnecdotes)
router.post('/', createAnecdote)
router.put('/:id', updateAnecdote)

export default router
