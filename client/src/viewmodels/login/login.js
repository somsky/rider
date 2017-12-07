import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class Login {

  email = 'marge@simpson.com';
  password = 'secret';

  constructor(rs) {
    this.riderService = rs;
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
