const express = require('express');
const app = express();
const cors = require('cors');

const middlewares = require('./utils/middlewares');
const logger = require('./utils/logger');
const config = require('./utils/config');
const gamesRouter = require('./routers/gameRouter');
const usersRouter = require('./routers/userRouter');
const loginRouter = require('./routers/loginRouter');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async (request, response) => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    logger.info('Database connected successfully');
  } catch (err) {
    logger.error('An error occured while connecting to the database', err);
    response
      .status(500)
      .json({ error: 'An error occured while conneting to the database' });
  }
};
connectDB();

app.use(express.static('dist'))
app.use(cors());
app.use(middlewares.requestLogger);
app.use(express.json());

app.use('/api/games', gamesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;
