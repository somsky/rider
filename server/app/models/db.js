'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//var dbURI =  'mongodb://localhost/donation';
var dbURI =  'mongodb://somsky:secretpassword@ds113098.mlab.com:13098/ridermongodb';
if (process.env.NODE_ENV === 'production') {
    dbURI =  'mongodb://somsky:secretpassword@ds113098.mlab.com:13098/ridermongodb';
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
    if (process.env.NODE_ENV != 'production') {
      var seeder = require('mongoose-seeder');
      const data = require('./data.json');
      
      const Donation = require('./donation');
      const User = require('./user');
      const Tweet = require('./tweet');
      
      seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
        console.log('preloading Test Data');
        console.log(dbData);
      }).catch(err => {
        console.log(error);
      });
    }
  });

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
