const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
  imdbId: String,
  title: String,
  year: Number,
  plot: String,
  runtime: Number,
  genres: Array,
  trailer: String,
  poster: String,
  certification: String,
  rating: Number,
  torrents: Array,
  lastViewed: Date,
});

module.exports = Movie = mongoose.model("Movie", MovieSchema);
