const CommentModel = require('../models/CommentModel');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const sanitize = require('mongo-sanitize');

const createComment = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        await UserModel.findById(_id);
        const newComment = new Comment({
            user: _id,
            imdbId: sanitize(req.body.imdbId),
            comment: sanitize(req.body.comment),
        });
        await CommentModel.collection.insertOne(newComment);
        res.status(201).json({ message: 'Comment created' });
    } catch(err) { 
        console.log(err);
        res.status(500).json({ error: err});
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await CommentModel.find({ imdbId: req.params.imdbId }).populate('user', 'username avatarPublicId -_id');
        res.status(200).json({ comments });
    } catch(err) { console.log(err) }
};

module.exports = {
    createComment,
    getComments,
};
