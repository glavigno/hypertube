const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const CommentController = require('../controllers/CommentController');

router.post('/', authenticate, async (req, res) => CommentController.createComment(req, res));
router.get('/:imdbId', authenticate, async (req, res) => CommentController.getComments(req, res));

module.exports = router;
