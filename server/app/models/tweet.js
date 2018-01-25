'use strict';

const mongoose = require('mongoose');
const User = require('./user');

const tweetSchema = mongoose.Schema({
  userId: { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
  text: String,
  imageURL: String,
  time : { type : Date, default: Date.now }
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
