import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './messages';

@inject(EventAggregator)
export default class LoggedInUser {
    
    constructor(ea) {
        this.ea = ea;
        ea.subscribe(LoginStatus, msg => {
            console.log(msg);
            this.loggedInUser = msg.status.user;
            if (msg.status.success === true) {
                
            }
        });
    }

    getLoggedInUser(user){
        return this.loggedInUser;
    }

    setLoggedInUser(user) {
      this.loggedInUser = user;
    }
}
