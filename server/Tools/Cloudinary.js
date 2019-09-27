const cloudinary = require(`cloudinary`).v2;
const keys = require('../config/keys');

cloudinary.config({
    cloud_name: keys.CLOUDINARY_CLOUD_NAME,
    api_key: keys.CLOUDINARY_API_KEY,
    api_secret: keys.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;