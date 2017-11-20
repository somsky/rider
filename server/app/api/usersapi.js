const utils = require('./utils');
const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');

/* Authenticate sends back a json web token when an email and a matching
    password are provided */

const userValidationSchema = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

exports.authenticate = {
    
  auth: false,

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        const token = utils.createToken(foundUser);
        reply({ success: true, token: token }).code(201);
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(201);
      }
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });
  },

};

exports.postTweet = {
  
  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    const contents = {
      userId: request.auth.credentials.id,
      text: request.payload.text,
    };
    
    const tweet = new Tweet(contents);
    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      //reply(Boom.badImplementation('error creating candidate'));
      console.log('db error ' + err);
    });

  }

}

exports.getAllTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    
    Tweet.find({}).sort({date:-1}).populate('userId').then( tweets => {
      reply(tweets);
    });
    
  }
}

exports.getProfile = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    console.log('2got request');
    Tweet.find({userId: request.auth.credentials.id}).sort({date: -1})
        .populate('userId').then(tweets => {
          console.log(tweets);
          reply(tweets);
    }).catch(err => {
      console.log(err);
    });
  }

}

/*
exports.getViewForUser = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply){
    Tweet.find({userId: request.params.id}).sort({date: -1}).then(tweets => {
      reply(tweets);
    }).catch(err => {
      console.log(err);
    });
  }
}
*/


/* NOTE */
/* user id and email can be retrieved from any request by request.auth.credentials.id/email */




exports.getSettings = {
  
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    var userId = request.auth.credentials.id;
    User.findOne({ _id: userId }).then(foundUser => {
      reply(foundUser);
    }).catch(err => {
      console.log('error getting user information: ' + err);
    });
  },

};


  exports.updateSettings = {
    
    validate: {
  
      payload: userValidationSchema,
  
      failAction: function (request, reply, source, error) {
        console.log('error validating: ' + error);
      },
      
    },

    handler: function (request, reply) {
      const editedUser = request.payload;
      User.findOne({ _id: request.auth.credentials.id }).then(user => {
        user.firstName = editedUser.firstName;
        user.lastName = editedUser.lastName;
        user.userName = editedUser.userName;
        user.email = editedUser.email;
        user.password = editedUser.password;
        return user.save();
      }).then(updatedUser => {
        console.log(updatedUser);
        reply(updatedUser).code(201);;
      }).catch( err => {
        console.log(err);
    })},
  
  };

/*
exports.logout = {
  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },

};
*/

exports.register = {
  auth: false,
  validate: {

    payload: userValidationSchema,

    failAction: function (request, reply, source, error) {
      reply("register: validation error");
    },

  },
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply(user).code(201);;
      console.log('User successfully registered:' + user);
    }).catch(err => {
      reply("register database error").code(201);;
      console.log('error registering user ' + user);
    });
  },

};
