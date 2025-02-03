const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  published: {
    type: Number,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  genres: [
    { type: String }
  ]
});

bookSchema.plugin(uniqueValidator);


const Book = mongoose.model('Book', bookSchema);

module.exports =  Book 