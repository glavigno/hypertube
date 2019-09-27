const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const ObjectID = require('mongodb').ObjectID;
const cloudinary = require(`../Tools/Cloudinary`);
const uuidv1 = require('uuid/v1');
const sendEmail = require('../Tools/Email.js');
const sanitize = require('mongo-sanitize');

const emailIsOK = email => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(String(email).toLowerCase());
};
const firstNameIsOK = firstName => {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]{3,15}$/;
      return regex.test(String(firstName));
};
const lastNameIsOK = lastName => {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,15}$/;
      return regex.test(String(lastName));
};
const usernameIsOK = username => {
      const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ]{5,10}$/;
      return regex.test(String(username));
};
const passwordIsOK = password => {
      const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
      return regex.test(String(password));
};

const newUserIsOK = async (email, firstName, lastName, username, password) => {
    try {
        const helpers = {
              errors: [],
              taken: [],
              usedAsOAuth: [],
        };
        if (!emailIsOK(email)) { helpers.errors.push('email') };
        if (!firstNameIsOK(firstName)) { helpers.errors.push('firstName') };
        if (!lastNameIsOK(lastName)) { helpers.errors.push('lastName') };
        if (!usernameIsOK(username)) { helpers.errors.push('username') };
        if (!passwordIsOK(password)) { helpers.errors.push('password') };
        const emailExists = await UserModel.findOne({ email });
        if (emailExists && emailExists.googleId) {
            helpers.usedAsOAuth.push('Google');
        } else if (emailExists && emailExists.fortyTwoId) {
            helpers.usedAsOAuth.push('42');
        } else if (emailExists) {
            helpers.taken.push('email')
        }
        const usernameExists = await UserModel.findOne({ username });
        if (usernameExists) { helpers.taken.push('username') };
        return helpers;
    } catch(err) { console.log(err); }
};

const findOrCreateUser = (req, res) => {
    try {
        const manageNewUser = async ({ email, firstName, lastName, username, password }) => {
            const helpers = await newUserIsOK(email, firstName, lastName, username, password);
            if (helpers.errors.length !== 0 || helpers.taken.length !== 0 || helpers.usedAsOAuth.length !== 0) {
                res.status(400).json(helpers);
                return;
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const emailHash = uuidv1();
            const newUser = new User({
                email: req.body.email,
                firstName: sanitize(req.body.firstName),
                lastName: sanitize(req.body.lastName),
                username: sanitize(req.body.username),
                password: hash,
                avatarPublicId: sanitize(req.body.avatarPublicId),
                emailHash,
                locale: 'EN',
                confirmed: false,
            });
            await UserModel.collection.insertOne(newUser);
            sendEmail('signup', req.body.email, emailHash);
            res.status(201).json({ message: 'User created' });
        };
        manageNewUser(req.body);
    } catch(err) { console.log(err) }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (user !== null) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                if (user.confirmed) {
                    const authToken = await jwt.sign({ mongoId: user._id }, keys.JWT_SECRET, { expiresIn: '6h' });
                    res.status(200).json({ authToken });
                } else {
                    res.status(401).json({ errorMsg: 'You need to confirmed your email first. Check your inbox.' });
                }
            } else {
                res.status(401).json({ errorMsg: 'Wrong credentials' });
            }
        } else {
            res.status(401).json({ errorMsg: 'Wrong credentials' });
        }
    } catch(err) { res.status(500).json({ errorMsg: 'something went wrong' }); }
};

const getMyProfile = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const data = await UserModel.findOne({ _id });
        let isOAuth = false;
        if (data.fortyTwoId || data.googleId) isOAuth = true;
        const user = {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            avatarPublicId: data.avatarPublicId,
            isOAuth,
            viewedList: data.viewedList,
        };
        res.status(200).json({ user });
    } catch(err) { res.status(401).json({ error: err }); }
};

const getProfile = async (req, res) => {
    try {
        const data = await UserModel.findOne({ username: req.params.username });
        if (data !== null) {
            const user = {
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                avatarPublicId: data.avatarPublicId,
            };
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: 'user does not exists' });
        }
    } catch(err) { res.status(500).json({ error: 'something went wrong' }); }
};

const newProfileIsOK = async (_id, email, firstName, lastName, username) => {
    try {
        const helpers = {
              errors: [],
              taken: [],
        };
        if (!emailIsOK(email)) { helpers.errors.push('email') };
        if (!firstNameIsOK(firstName)) { helpers.errors.push('firstName') };
        if (!lastNameIsOK(lastName)) { helpers.errors.push('lastName') };
        if (!usernameIsOK(username)) { helpers.errors.push('username') };
        const emailExists = await UserModel.findOne({ email });
        if (emailExists && emailExists._id.toString() !== _id) { helpers.taken.push('email') };
        const usernameExists = await UserModel.findOne({ username });
        if (usernameExists && usernameExists._id.toString() !== _id) { helpers.taken.push('username') };
        return helpers;
    } catch(err) {
        console.log(err);
    }
};

const updateProfile = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const { email, firstName, lastName, username } = req.body;
        const helpers = await newProfileIsOK(_id, email, firstName, lastName, username);
        if (helpers.errors.length !== 0 || helpers.taken.length !== 0) {
            res.status(400).json(helpers);
            return;
        }
        const objId = new ObjectID(_id);
        await User.findOneAndUpdate(
            {_id: objId},
            {$set: {email, firstName, lastName, username}}
        );
        res.status(200).json({ message: 'Profile edited' });
    } catch(err) { console.log(err) }
};

const updatePassword = async (req, res) => {
    try {
        const { authToken } = req.query;
        const { newPassword } = req.body;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const newPasswordIsOk = passwordIsOK(newPassword);
        if (newPasswordIsOk) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);
            const objId = new ObjectID(_id);
            await User.findOneAndUpdate(
                {_id: objId},
                {$set: {password: hash}}
            );
            res.status(200).json({ message: 'Profile edited' });
        } else {
            res.status(400).send('Invalid new password');
        }
    } catch(err) { console.log(err) }
};

const uploadAvatarSignup = async (req, res) => {
    try {
        const avatarPublicId = uuidv1();
        await cloudinary.uploader.upload(req.body.image, { public_id: avatarPublicId });
        res.status(200).json({ avatarPublicId });
    } catch(err) { console.log(err) }
};

const uploadAvatarEdit = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const avatarPublicId = uuidv1();
        await cloudinary.uploader.upload(req.body.image, { public_id: avatarPublicId });
        const objId = new ObjectID(_id);
        await User.findOneAndUpdate(
            {_id: objId},
            {$set: { avatarPublicId }}
        );
        res.status(200).json({ avatarPublicId });
    } catch(err) { console.log(err) }
};

const resetPasswordEmail = async (req, res) => {
    try {
        const data = await UserModel.findOne({ email: req.body.email });
        if (data) sendEmail('reset', req.body.email, data.emailHash);
        res.status(200).send('Query treated');
    } catch(err) { console.log(err) }
};

const emailHashIsValid = async (req, res) => {
    try {
        const data = await UserModel.findOne({ emailHash: req.body.emailHash });
        data ? res.status(200).send('emailHash is OK') : res.status(400).send('emailHash is NOT Ok');
    } catch(err) { console.log(err) }
};

const resetPassword = async (req, res) => {
    try {
        const regex = /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{6,50}$/;
        if (regex.test(String(req.body.newPassword))) {
            const data = await UserModel.findOne({ emailHash: req.body.emailHash });
            if (data) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(req.body.newPassword, salt);
                await User.findOneAndUpdate(
                    {emailHash: req.body.emailHash},
                    {$set: {password: hash}}
                );
                res.status(200).json({ message: 'Password changed' });
            } else {
                res.status(401).send('Link error');
            }
        } else {
            res.status(400).send('Invalid password');
        }
    } catch(err) { console.log(err) }
};

const getAvatar = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const data = await UserModel.findOne({ _id });
        res.status(200).json({ avatarPublicId: data.avatarPublicId });
    } catch(err) { console.log(err) }
};

const getLocale = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const data = await UserModel.findOne({ _id });
        res.status(200).json({ locale: data.locale });
    } catch(err) { console.log(err) }
};

const setLocale = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const objId = new ObjectID(_id);
        await User.findOneAndUpdate(
            {_id: objId},
            {$set: {locale: req.body.newLocale}}
        );
        res.status(200).send('OK');
    } catch(err) { console.log(err) }
};

const confirmAccount = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            {emailHash: req.body.emailHash},
            {$set: {confirmed: true}}
        );
        if (user) {
            res.status(200).send('OK');
        } else {
            res.status(401).send('Invalid link provided');
        }
    } catch(err) { 
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

module.exports = {
    findOrCreateUser,
    loginUser,
    getMyProfile,
    getProfile,
    updateProfile,
    updatePassword,
    uploadAvatarSignup,
    uploadAvatarEdit,
    resetPasswordEmail,
    emailHashIsValid,
    resetPassword,
    getAvatar,
    getLocale,
    setLocale,
    confirmAccount,
};
