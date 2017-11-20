'use strict';

const User = require('../models/user');


exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to Donations' });
  },

};

exports.signup = {
  auth:false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Donations' });
  },

};

exports.login = {
  auth:false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Donations' });
  },

};



