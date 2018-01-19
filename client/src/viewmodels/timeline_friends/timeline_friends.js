import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class Timeline_Friends {

  constructor(rs) {
    this.riderService = rs;
    this.riderService.getFriendsTweets().then(res => {
        this.tweets = res.content;
        for (let i = 0; i < this.tweets.length; i++){
            this.tweets[i].time = this.tweets[i].time.substring(0, 10) + ', '
                + this.tweets[i].time.substring(11, 16);
        }
        console.log(this.tweets);
    });
  }

}
