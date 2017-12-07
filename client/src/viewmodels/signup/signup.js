import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class Signup {

  firstName = 'Paul';
  lastName = 'Panther';
  userName = 'PauliP';
  email = 'Paul@Panther.com';
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

  register() {
    this.showSignup = false;
    this.riderService.register(this.firstName, this.lastName, this.userName, this.email, this.password);
    //this.donationService.login(this.email, this.password);
  }
}
