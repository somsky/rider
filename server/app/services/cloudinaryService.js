'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const Tweet = require('../models/tweet');
const Boom = require('boom');

/* include the cloudinary config file */
try {
  cloudinary.config({
      cloud_name: 'dwhbw3aly',
      api_key: 599872134687125,
      api_secret: '0vZGuNHz-CigypdV-XsWh8Jfw5w'
  });
}
catch(e) {
  console.log('cloudinary access failed');
}


const cloudinaryService = {
  uploadPicture(userId, tweet, reply) {
      let name =  userId + tweet.tweetImage.hapi.name;
      let path = __dirname + '/uploads/' + name;
      let file = fs.createWriteStream(path);

      file.on('error', err => {
          console.error(err);
      });
      let image = tweet.tweetImage;
      image.pipe(file);
      image.on('end', err => {
        cloudinary.uploader.upload(path, result => {
            console.log(result.url);

            const contents = {
                userId: userId,
                imageURL: result.url,
                text: tweet.tweetText,
            };

            const mtweet = new Tweet(contents);

            mtweet.save().then(newTweet => {
                reply(newTweet).code(201);
            }).catch(err => {
                reply(Boom.notFound('internal db failure'));
            });

        });
      });
  },

  deletePicture(imageURL) {
      let idStartIndex = imageURL.lastIndexOf('/') + 1;
      let idEndIndex = imageURL.lastIndexOf('.');
      let imgId = imageURL.substring(idStartIndex, idEndIndex);
      cloudinary.v2.uploader.destroy(imgId, res => {
          console.log(imgId + ' destroyed.');
      });
  }

};

module.exports = cloudinaryService;