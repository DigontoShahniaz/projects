import axios from 'axios';
const gameUrl = '/api/games';
import storage from './storage';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser().token}` },
});

const getGames = async () => {
  const request = axios.get(gameUrl);
  return request.then((response) => response.data);
};

const createGame = async (newObject) => {
  const response = await axios.post(gameUrl, newObject, getConfig());
  return response.data;
};

const update = (id, newObject) => {
  const request = axios.put(`${gameUrl}/${id}`, newObject, getConfig());
  return request.then((response) => response.data);
};

const remove = async (id) => {
  const response = await axios.delete(`${gameUrl}/${id}`, getConfig());
  return response.data;
};

export default { getGames, createGame, update, remove };
