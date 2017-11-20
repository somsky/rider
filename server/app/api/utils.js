const jwt = require('jsonwebtoken');
const serverSecret = 'secretpasswordnotrevealedtoanyone';
const User = require('../models/user');

exports.createToken = function (user) {
    console.log('Creating a web token.');
    return jwt.sign({ id: user._id, email: user.email }, serverSecret, {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
};

exports.decodeToken = function (token) {
    console.log('Decoding a web token.');
    var userInfo = {};
    try {
    var decoded = jwt.verify(token, serverSecret);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
    } catch (e) {
    }

    return userInfo;
};


/* validate checks if a user with an id from an decoded json web token exists
in the database */

exports.validate = function (decoded, request, callback) {
    User.findOne({ _id: decoded.id }).then(user => {
        if (user != null) {
            callback(null, true);
        } else {
            callback(null, false);
        }
        }).catch(err => {
            callback(null, false);
    });
};