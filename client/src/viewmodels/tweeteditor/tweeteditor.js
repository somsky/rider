import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';
import {Router} from 'aurelia-router';

@inject(RiderService, Router)
export class TweetEditor {

  constructor(rs, r) {
    this.riderService = rs;
    this.router = r;
  }

  postTweet() {
    let formData = new FormData();
    // add text to formdata
    if (this.tweetText !== undefined) {
      formData.append('tweetText', this.tweetText);
    }

    // add image to formdata
    if (this.imageFile !== undefined) {
      formData.append('tweetImage', this.imageFile[0]);
    }
    if (this.tweetText !== undefined) {
      this.riderService.postTweet(formData);
      this.router.navigate('timeline_global');
    }
  }



}
