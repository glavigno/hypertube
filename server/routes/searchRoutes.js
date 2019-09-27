const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const SearchController = require('../controllers/SearchController');

router.post('/genre', authenticate, async (req, res) => SearchController.search(req, res));

module.exports = router;