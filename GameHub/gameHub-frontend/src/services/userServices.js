import axios from 'axios';
const userUrl = '/api/users';

const createUser = async (credentials) => {
  const response = await axios.post(userUrl, credentials);
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get(userUrl);
  return response.data;
};

export default { createUser, getUsers };
