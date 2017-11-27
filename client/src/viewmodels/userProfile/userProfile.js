import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import RiderService from '../../services/riderService';
import LoggedInUser from '../../services/loggedInUser';

@inject(RiderService, Router, LoggedInUser)
export class UserProfile {

    constructor(rs, r, lu) {
        this.riderService = rs;
        this.router = r;
        this.lu = lu;
        this.loggedInUser = this.lu.getLoggedInUser();
        this.userIsFriend = false;
        
    }

    /* load first user details and then the tweets */
    activate(params) {
        
        this.riderService.getUser(params.id).then( res => {
            this.user = res.content;
        }).then (val => {
            for (let i = 0; i < this.loggedInUser.friends.length; i++) {
                if (this.loggedInUser.friends[i] == this.user._id){
                    this.userIsFriend = true;
                    break;
                }
            }
        });

        this.riderService.getTweetsForUser(params.id).then(res => {
            this.tweets = res.content;
            for (let i = 0; i < this.tweets.length; i++){
                this.tweets[i].time = this.tweets[i].time.substring(0, 10) + ', '
                    + this.tweets[i].time.substring(11, 16);
            }
            //console.log(this.tweets);
        });

    }

    addFriend(){
        this.userIsFriend = true;
        this.riderService.addFriend(this.user._id);
    }

    removeFriend() {
        this.userIsFriend = false;
        this.riderService.removeFriend(this.user._id);
        //todo: remove friend from local loggedinuser object and from loggedinuser-service-object
    }
  
}