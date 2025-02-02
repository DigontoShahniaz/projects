const logger = require('../utils/logger');
const gamesRouter = require('express').Router();
const Game = require('../models/gameModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

gamesRouter.get('/info', async (request, response, next) => {
  try {
    response.json('Hello from the server side');
  } catch (err) {
    logger.error('An error occured', err);
    next(err);
  }
});

gamesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);

    const game = new Game({
      name: body.name,
      url: body.url,
      publishers: body.publishers,
      likes: body.likes | 0,
      // remember this digonto
      user: user._id,
    });
    const savedGame = await game.save();
    const populatedGame = await savedGame.populate('user', {
      username: 1,
      name: 1,
    });
    user.games = user.games.concat(savedGame._id);
    await user.save();
    response.status(201).json(populatedGame);
  } catch (err) {
    logger.error('An error occured while saving the game', err);
    next(err);
  }
});

gamesRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body;

    const game = {
      name: body.name,
      url: body.url,
      publishers: body.publishers,
      likes: body.likes | 0,
    };

    const updatedGame = await Game.findByIdAndUpdate(request.params.id, game, {
      new: true,
    }).populate('user', { username: 1, name: 1 });
    response.json(updatedGame);
  } catch (err) {
    logger.error('An error occured while updating the game', err);
    next(err);
  }
});

gamesRouter.get('/', async (request, response, next) => {
  try {
    const games = await Game.find({}).populate('user');
    response.status(200).json(games);
  } catch (err) {
    logger.error('An error occured while getting the games', err);
    next(err);
  }
});

gamesRouter.get('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const game = await Game.findById(id);
    response.status(200).json(game);
  } catch (err) {
    logger.error('An error occured while getting the game', err);
    next(err);
  }
});

gamesRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const game = await Game.findByIdAndDelete(id);
    const user = await User.findById(game.user);
    if (user) {
      user.games = user.games.filter((gameId) => gameId.toString() !== id);
      await user.save();
    }
    response.status(200).json(game);
  } catch (err) {
    logger.error('An error ooccured while deleting the data', err);
    next(err);
  }
});

module.exports = gamesRouter;
