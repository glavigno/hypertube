const express = require("express");
const router = express.Router();
const PlayerController = require("../controllers/PlayerController");
const authenticate = require('../middlewares/authenticate');


router.get("/stream", authenticate, async (req, res) => PlayerController.handleTorrent(req, res))

router.get("/subs", authenticate, async (req, res) => PlayerController.handleSubs(req, res));

module.exports = router;
