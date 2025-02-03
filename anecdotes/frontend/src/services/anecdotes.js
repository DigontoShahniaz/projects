import axios from 'axios';

const baseUrl = '/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const anecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const update = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject);
  return response.data;
};

export default { getAll, createNew, update }
