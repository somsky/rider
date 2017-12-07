import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';
//import EventAggregator from 'aurelia-event-aggregator';

@inject(RiderService)
export class Login {

  email = 'marge@simpson.com';
  password = 'secret';

  constructor(rs) {
    this.riderService = rs;
    //this.ea = ea;
    /*ea.subscribe(LoginStatus, msg => {
      this.error = msg.status.message;
      if (!msg.status.success){
        this.error = msg.status.message;
      }
    });*/
  }

  login() {
    this.riderService.login(this.email, this.password, 'admin');
  }
  /*
  logout(){
    console.log('Trying to log out ${this.email}');
    this.riderService.logout();
  }
  */
}
