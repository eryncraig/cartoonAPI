const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  director: {
    name: String,
    bio: String,
    birth: Date
  },
  year: Date,
  genre: {
    name: String,
    description: String
  },
  actors: [String],
  imagePath: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  name: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthdate: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

