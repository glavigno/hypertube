const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const ViewedController = require('../controllers/ViewedController');

router.post('/', authenticate, async (req, res) => ViewedController.setViewed(req, res));

module.exports = router;