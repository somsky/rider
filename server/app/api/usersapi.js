const utils = require('./utils');
const User = require('../models/user');
const Tweet = require('../models/tweet');
const Joi = require('joi');
const multiparty = require('multiparty');

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
        reply({ success: true, token: token, user: foundUser }).code(200);                           //added user object
      } else {
        reply({ success: false, message: 'Authentication failed. User not found.' }).code(404);
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
    if (tweet.text.length > 140)
      tweet.text = tweet.text.substring(0, 140);

    tweet.save().then(newTweet => {
      reply(newTweet).code(201);
    }).catch(err => {
      reply(Boom.notFound('internal db failure'));
    });


  }

};

exports.getTweetsForUser = {
  
  auth: {
    strategy: 'jwt',
  },
  
  handler: function(request, reply) {
    const reqId = request.params.id.substring(1, request.params.id.length);
    console.log(reqId);
    Tweet.find({userId: reqId}).populate('userId').then( foundTweets => {
      reply(foundTweets).code(201);
    }).catch(err => {
      reply(Boom.notFound(`tweet dosn't exist`));
    });
  }
};

exports.getUser = {

  auth: {
    strategy: 'jwt',
  },
  
  handler: function(request, reply) {
    const reqId = request.params.id.substring(1, request.params.id.length);
    console.log(reqId);
    User.findOne({_id: reqId}).then( foundUser => {
      reply(foundUser).code(200);
    }).catch(err => {
      reply(Boom.notFound(`tweet dosn't exist`));
    });
  }
};

/* get a list of all users, excluding the one who makes the request*/
exports.getUserList = {
  
  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    User.find({_id : {$ne : request.auth.credentials.id}}).then( userList => {
      reply(userList).code(200);
    }).catch (err => {
      reply(Boom.notFound('No users found'));
      })
  }
};

exports.getAllTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    
    Tweet.find({}).sort({date:-1}).populate('userId').then( tweets => {
      reply(tweets).code(200);
    }).catch(err => {
          reply(Boom.notFound('No tweets found'));
  });
    
  }
};

exports.getProfile = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    Tweet.find({userId: request.auth.credentials.id}).sort({date: -1})
        .populate('userId').then(tweets => {
          reply(tweets).code(200);
    }).catch(err => {
      reply(Boom.badRequest('Unable to query profile'));
    });
  }

};

exports.getFriendsTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    console.log('got request');
    User.findOne({ _id: request.auth.credentials.id }).then (user => {
      Tweet.find({ userId : { $in: user.friends } }).populate('userId')
        .then(tweets => {
          reply(tweets).code(200);
        }).catch ( err => {
          reply(Boom.notFound('Unable to find tweets for specified user'));
      })
    });
  }
};

exports.getSettings = {
  
  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    let userId = request.auth.credentials.id;
    User.findOne({ _id: userId }).then(foundUser => {
      reply(foundUser).code(200);
    }).catch(err => {
      console.log('error getting user information: ' + err);
    });
  },

};

  exports.updateSettings = {
    
    validate: {
  
      payload: userValidationSchema,
  
      failAction: function (request, reply, source, error) {
        reply(Boom.badRequest('wrong data format'));
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
        reply(updatedUser).code(201);
      }).catch( err => {
        reply(Boom.notFound('internal db failure'));
      });
    },
  
  };

/* TODO
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
      reply(Boom.badRequest('wrong data format'));
    },

  },

  handler: function (request, reply) {
    const user = new User(request.payload);
    user.isAdmin = false;
    user.save().then(newUser => {
      reply(user).code(201);
    }).catch(err => {
        Boom.notFound('internal db failure');
    });
  },

};

exports.deleteTweets = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    for (let i = 0; i < request.payload.length; i++){
      Tweet.findOne({_id: request.payload[i]._id}).remove( err => {
        if(err)
            reply(Boom.notFound('internal db failure'));
        else
          reply('tweet ${request.payload[i]._id} deleted').code(200);
        });
    }
  }
};

exports.adminDeleteTweets = {

    auth: {
        strategy: 'jwt',
    },

    handler: function (request, reply) {
      /*  check if user has admin rights */
      User.findOne({_id: request.auth.credentials.id}).then(user => {
            if (user.isAdmin === false)
              reply.Boom.unauthorized('');
        }).catch(err => {
            reply(Boom.badImplementation('internal db failure'));
        });

      /* remove tweets */
        for (let i = 0; i < request.payload.length; i++){
              Tweet.findOne({_id: request.payload[i]._id}).remove( err => {
                  if(err)
                      reply(Boom.notFound('internal db failure'));
                  else
                      reply('tweet ${request.payload[i]._id} deleted').code(200);
              });
          }
    }

};

exports.adminDeleteUsers = {

  auth: {
    strategy: 'jwt',
  },

    handler: function(request, reply) {
        /*  check if user has admin rights */
        User.findOne({_id: request.auth.credentials.id}).then(user => {
            if (user.isAdmin === false)
                reply.Boom.unauthorized('');
        }).catch(err => {
            reply(Boom.badImplementation('internal db failure'));
        });

        let luserId = [];
        request.payload.forEach(user => {
          luserId.push(user._id);
        });

        /* remove tweets of selected users*/
        Tweet.deleteMany({'userId': {$in: luserId}}, err => {
          console.log(err);
        });

        /* delete user accounts */
        User.deleteMany({'_id': {$in: luserId}}, err => {
          console.log(err);
        });
    }
};

exports.addFriend = {

  auth: {
    strategy: 'jwt',
  },

  handler: function(request, reply) {
    User.findOne({_id: request.auth.credentials.id}).then(user => {
      user.friends.push(request.payload);
      user.save().then(newFriend => {
          reply(newFriend).code(201);
      }).catch(err => {
          reply(Boom.badImplementation('internal db failure'));
      });
    }).catch(err => {
        reply(Boom.badImplementation('internal db failure'));
    });
  }
};

exports.removeFriend = {

  auth: {
    strategy: 'jwt',
  },

  handler: function (request, reply) {
    User.findOne({_id: request.auth.credentials.id}).then( user => {
      userFriends = user.friends;
      indexToDelete = userFriends.indexOf(request.params.id);
      if (indexToDelete > -1)
        userFriends.splice(indexToDelete, 1);
      user.friends = userFriends;
      user.save().then (removedFriend => {
          reply('friend deleted').code(200);
      });
    }).catch( err => {
      reply(Boom.notFound('internal db failure'));
    });
  }
};

exports.getStatistics = {

  handler: function (request, reply) {
    let stats = {};
    let promises = [
    Tweet.count({}).then ( count => {
      stats.totalTweets = count;
    }),
    User.count({}).then ( count => {
      stats.totalUsers = count;
    })];
    Promise.all(promises).then (values => {
        reply(stats).code(200);
    });

  }
};

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
