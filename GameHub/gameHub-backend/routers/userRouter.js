const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const usersRouter = require('express').Router();
const logger = require('../utils/logger');

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      name: body.name,
      username: body.username,
      passwordHash: passwordHash,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (err) {
    logger.error('An error occured while creating the user', err);
    next(err);
  }
});

usersRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body;
    const id = request.params.id;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = {
      name: body.name,
      username: body.username,
      password: passwordHash,
    };

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    response.status(200).json(updatedUser);
  } catch (err) {
    logger.error('An error occured while updating the user', err);
    next(err);
  }
});

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('games');
    response.status(200).json(users);
  } catch (err) {
    logger.error('An error occured while getting the users', err);
    next(err);
  }
});

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const user = await User.findById(id);
    response.status(200).json(user);
  } catch (err) {
    logger.error('An error occured while getting the user', err);
    next(err);
  }
});

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const user = await User.findByIdAndDelete(id);
    response.status(200).json(user);
  } catch (err) {
    logger.error('An error occured while deleting the user', err);
    next(err);
  }
});

module.exports = usersRouter;
