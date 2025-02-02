const mongoose = require('mongoose');
const logger = require('../utils/logger');

const gameSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publishers: {
    type: String,
    required: true,
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Game', gameSchema);
