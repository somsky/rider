import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
import RiderService from './services/riderService';

@inject(Aurelia, EventAggregator, RiderService)
export class App {

  loggedIn = false;
  showSignup = true;
  
  constructor(au, ea, rs) {
    this.au = au;
    this.ea = ea;
    this.riderService = rs;

    /* the specified callback in subscribe gets called as soon as a new LoginStatus
      gets published */

    ea.subscribe(LoginStatus, msg => {
      console.log(msg);
      
      if (msg.status.success === true) {
        au.setRoot('home').then(() => {
          this.router.navigateToRoute('tweeteditor');
        });
      } else {
        au.setRoot('app').then(() => {
          this.router.navigateToRoute('login');
        });
      }
    
    });
    
  }

  login_dummy(){
    console.log("login pressed");
  }

  signup_dummy(){
    console.log("Signup pressed");
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }
    ]);
    this.router = router;
  }
  
}