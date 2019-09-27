const CommentModel = require('../models/CommentModel');
const MovieModel = require('../models/MovieModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const getMovieInfo = async (req, res) => {
    try {
        const movieInfo = await MovieModel.find({ imdbId: req.params.imdbId });
        res.status(200).json({ movieInfo });
    } catch(err) { 
        console.log(err)
        res.status(404).send('Movie not found');
    }
};

module.exports = {
    getMovieInfo,
};
