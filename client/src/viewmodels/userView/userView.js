import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import RiderService from '../../services/riderService';

@inject(RiderService, Router)
export class UserView {

    constructor(rs, r) {
        this.riderService = rs;
        this.router = r;
        this.riderService.getUserList().then( res => {
            this.entries = res.content;
        });
    }
  
    viewProfile(entry) {
        console.log(entry);
        this.router.navigate('/userProfile/:' + entry._id);                 //TODO
    }

}