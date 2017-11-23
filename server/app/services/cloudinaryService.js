'use strict';

const cloudinary = require('cloudinary');

/* include the cloudinary config file */
try {
  const env = require('../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch(e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}


const cloudinaryService = {

  addPicture(userId, title, imageFile, response) {

    imageFile.mv('tempimage', err => {

      if (!err) {
        cloudinary.uploader.upload('tempimage', result => {
          console.log(result);
          const picture = {
            img: result.url,
            title: title,
          };
        });
      }
    });
  },

  deletePicture(userId, image) {
    const id = path.parse(image);
    let album = this.getAlbum(userId);
    _.remove(album.photos, { img: image });
    cloudinary.api.delete_resources([id.name], function (result) {
      console.log(result);
    });
  },

};

module.exports = cloudinaryService;