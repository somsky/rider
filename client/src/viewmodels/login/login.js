import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';
//import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from '../../services/messages';

@inject(RiderService)
export class Login {

  email = 'marge@simpson.com';
  password = 'secret';
  //error = null;//{message: null};

  constructor(rs) {
    this.riderService = rs;
    //this.ea = ea;
    /*
    ea.subscribe(LoginStatus, msg => {
      this.error = msg.status.message;
      if (!msg.status.success){
        this.error = msg.status.message;
      }
    });
    */
  }

  login() {
    console.log(`Trying to log in ${this.email}`);
    let userInfo = {
      email: this.email,
      password: this.password
    };
    
    this.riderService.login(this.email, this.password, 'reguser');
  }

  logout(){
    console.log('Trying to log out ${this.email}');
    this.riderService.logout();
  }
}
