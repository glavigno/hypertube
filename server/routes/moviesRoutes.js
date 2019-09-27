const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const MovieController = require('../controllers/MovieController');

router.get('/:imdbId', authenticate, async (req, res) => MovieController.getMovieInfo(req, res));

module.exports = router;
