const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  avatarPublicId: {
    type: String,
    required: true
  },
  fortyTwoId: {
    type: String,
    required: false
  },
  googleId: {
    type: String,
    required: false
  },
  emailHash: {
    type: String,
    required: true
  },
  locale: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  viewedList: {
    type: Array,
    default: null,
  }
});

module.exports = User = mongoose.model("User", UserSchema);
