const UserModel = require('../models/UserModel');
const MovieModel = require('../models/MovieModel');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const schedule = require('node-schedule');

const setViewed = async (req, res) => {
    try {
        const { authToken } = req.query;
        const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
        const _id = decoded.mongoId;
        const imdbId = req.body.imdbId;
        const query = { "imdbId" : imdbId };
        const date = new Date()
        const update = { lastViewed: date }
        await MovieModel.updateOne(query, update)
        await UserModel.updateOne(
            { "_id" : _id},
            { $push: {
                viewedList: {
                    $each: [imdbId],
                    $position : 0
                }}
            })
        res.status(200).send('ok')
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err});
    }
}

module.exports = { setViewed }