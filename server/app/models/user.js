'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  friends: [String],
  email: String,
  password: String,
    isAdmin: Boolean,
  avatar: { data: Buffer, contentType: String }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
