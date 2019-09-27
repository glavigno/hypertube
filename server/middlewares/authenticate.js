const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const UserModel = require('../models/UserModel');

const authenticate = async (req, res, next) => {
  try {
    const authToken = req.body.authToken || req.query.authToken;
    if (!authToken) {
      res.status(401).send('Unauthorized: No token provided');
    } else {
      const decoded = await jwt.verify(authToken, keys.JWT_SECRET);
      if (decoded) {
        const _id = decoded.mongoId;
        const user = await UserModel.findOne({ _id });
        user !== null ? next() : res.status(401).send('Unauthorized: Invalid token');
      } else {
        res.status(401).send('Unauthorized: Invalid token');
      }
    }
  } catch(err) { res.status(401).send('Unauthorized: Invalid token'); }
}

module.exports = authenticate;
