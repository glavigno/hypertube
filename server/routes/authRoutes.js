const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserController = require('../controllers/UserController');
const passport = require('passport');
const authenticate = require('../middlewares/authenticate');
const ObjectID = require('mongodb').ObjectID;

const addSocketIdtoSession = (req, res, next) => {
      req.session.socketId = req.query.socketId;
      next();
};

router.get('/failureRedirect', (req, res) => { res.redirect("http://localhost:3000/login");} );
router.get('/userIsAuthenticated', authenticate, (req, res) => res.status(200).send('User authenticated'));
router.post('/signup', async (req, res) => UserController.findOrCreateUser(req, res));
router.post('/login', async (req, res) => UserController.loginUser(req, res));
router.get('/google', addSocketIdtoSession, passport.authenticate('google', { scope: ['profile', 'email'] }) );
router.get('/42', addSocketIdtoSession, passport.authenticate('42') );
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/failureRedirect' }),
      async (req, res) => {
            try {
                  const mongoId = new ObjectID(req.user);
                  const authToken = await jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
                  let io = req.app.get("io");
                  io.in(req.session.socketId).emit('redirect', { authToken });
            } catch(err) { console.log(err); }
      });
router.get('/42/callback', passport.authenticate('42', { failureRedirect: '/api/auth/failureRedirect' }),
      async (req, res) => {
            try {
                  const mongoId = new ObjectID(req.user);
                  const authToken = await jwt.sign({ mongoId }, keys.JWT_SECRET, { expiresIn: '6h' });
                  let io = req.app.get("io");
                  io.in(req.session.socketId).emit('redirect', { authToken });
            } catch(err) { console.log(err); }
      });

module.exports = router;
