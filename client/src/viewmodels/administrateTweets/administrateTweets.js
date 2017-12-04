import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class Settings {

  constructor(rs) {
    this.riderService = rs;
    rs.getGlobalTweets().then ( res => {
      this.tweets = res.content;
      for (let i = 0; i < this.tweets.length; i++){
        this.tweets[i].time = this.tweets[i].time.substring(0, 10) + ', '
          + this.tweets[i].time.substring(11, 16);
      }
    });
  }

  deleteSelectedTweets(){
    let tweetsToDelete = [];
    this.tweets.forEach(tweet => {
      if (tweet.isSelected) {
        tweetsToDelete.push(tweet);
        let indexDel = this.tweets.indexOf(tweet);
        this.tweets.splice(indexDel, 1);
      }
    });
    this.riderService.adminDeleteTweets(tweetsToDelete);

  }

}
