import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';
import LoggedInUser from '../../services/loggedInUser';

@inject(RiderService, LoggedInUser)
export class Profile {

  constructor(rs, lu) {
    this.riderService = rs;
    this.lu = lu;
    this.loggedInUser = lu.getLoggedInUser();

    this.riderService.getProfile().then(res => {
        this.tweets = res.content;
        for (let i = 0; i < this.tweets.length; i++){
            this.tweets[i].time = this.tweets[i].time.substring(0, 10) + ', '
                + this.tweets[i].time.substring(11, 16);
        }
    });
  }

  deleteSelectedTweets(){
    let tweetsToDelete = [];
    let newTweets = [];
    this.tweets.forEach(tweet => {
      if (tweet.isSelected) {
        tweetsToDelete.push(tweet);
      }
      else
        newTweets.push(tweet);
    });
    this.tweets = newTweets;
    this.riderService.deleteTweets(tweetsToDelete);

  }

}
