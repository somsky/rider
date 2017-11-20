import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class TweetEditor {

  constructor(rs) {
    this.riderService = rs;
  }

  postTweet(){
    this.riderService.postTweet(this.tweetText);
  }

}