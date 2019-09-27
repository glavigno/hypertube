const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const UserController = require('../controllers/UserController');

router.get('/', authenticate, async (req, res) => UserController.getMyProfile(req, res));
router.post('/confirmAccount', async (req, res) => UserController.confirmAccount(req, res));
router.post('/emailHashIsValid', async (req, res) => UserController.emailHashIsValid(req, res));
router.post('/resetPasswordEmail', async (req, res) => UserController.resetPasswordEmail(req, res));
router.post('/resetPassword', async (req, res) => UserController.resetPassword(req, res));
router.post('/uploadAvatarSignup', async (req, res) => UserController.uploadAvatarSignup(req, res));
router.get('/getLocale', authenticate, async (req, res) => UserController.getLocale(req, res));
router.post('/setLocale', authenticate, async (req, res) => UserController.setLocale(req, res));
router.post('/updateProfile', authenticate, async (req, res) => UserController.updateProfile(req, res));
router.post('/updatePassword', authenticate, async (req, res) => UserController.updatePassword(req, res));
router.post('/uploadAvatarEdit', authenticate, async (req, res) => UserController.uploadAvatarEdit(req, res));
router.get('/getAvatar', authenticate, async (req, res) => UserController.getAvatar(req, res));
router.get('/:username', authenticate, async (req, res) => UserController.getProfile(req, res));

module.exports = router;
