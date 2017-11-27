const utils = require('./utils');
const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');
const multiparty = require('multiparty');
const util = require('util');
const fs = require('fs');

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
        reply({ success: true, token: token, user: foundUser }).code(201);                           //added user object
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

exports.getTweetsForUser = {
  
  auth: {
    strategy: 'jwt',
  },
  
  handler: function(request, reply) {
    const reqId = request.params.id.substring(1, request.params.id.length);
    console.log(reqId);
    Tweet.find({userId: reqId}).populate('userId').then( foundTweets => {
      reply(foundTweets);
    });
  }
}

exports.getUser = {

  auth: {
    strategy: 'jwt',
  },
  
  handler: function(request, reply) {
    const reqId = request.params.id.substring(1, request.params.id.length);
    console.log(reqId);
    User.findOne({_id: reqId}).then( foundUser => {
      reply(foundUser);
    })
  }
}

exports.getUserList = {
  
  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    User.find({}).then( userList => {
      //for(let i = 0; i < userList.length; i++){
      //  userList[i].password = '';
      //}
      console.log(userList);
      reply(userList);
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

exports.getFriendsTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    console.log('got request');
    User.findOne({ _id: request.auth.credentials.id }).then (user => {
      Tweet.find({ 'userId': { $in: user.friends } }).populate('userId')
        .then(tweets => {
          console.log(tweets);
          reply(tweets);
        });
    });
  }
}

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

exports.deleteTweets = {
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    for (let i = 0; i < request.payload.length; i++){
      console.log(request.payload);
      console.log(request.payload[i]._id);
      Tweet.findOne({_id: request.payload[i]._id}).remove( err => {
        if(err)
          console.log(err);
        });
    }
  }
}

exports.addFriend = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    User.findOne({_id: request.auth.credentials.id}).then( user => {
      user.friends.push(request.payload);
      user.save();
    });
  }
}

exports.removeFriend = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    console.log('in remove' + request.auth.credentials.id);
    User.findOne({_id: request.auth.credentials.id}).then( user => {
      userFriends = user.friends;
      indexToDelete = userFriends.indexOf(request.params.id);
      if (indexToDelete > -1)
        userFriends.splice(indexToDelete, 1);
      user.friends = userFriends;
      user.save();
    });
  }
}



/*
exports.setAvatar = {
  auth: false,

  payload: {
    output: 'stream',
    parse: true,
    allow: 'multipart/form-data'
},

  handler: function (request, reply) {
    var form = new multiparty.Form();
    console.log('---');
    debugger;
    console.log(util.inspect(request.payload, { showHidden: true, depth: 100 }));
    console.log(request.payload.file);
    
    
    form.parse(request, function(err, fields, files) {
        if (err) return reply(err);
        else upload(files, reply);
    });
    
    
  },
}
*/

