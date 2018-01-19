import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
import RiderService from './services/riderService';
import loggedInUser from './services/loggedInUser';

@inject(Aurelia, EventAggregator, RiderService, loggedInUser)
export class App {

  loggedIn = false;
  showSignup = true;

  constructor(au, ea, rs, lu) {
    this.au = au;
    this.ea = ea;
    this.riderService = rs;
    this.loggedInUser = lu;

    /* navigate to protected routes depending on authentication success */

    ea.subscribe(LoginStatus, msg => {
      this.router.navigate('/', { replace: true, trigger: false });
      if (msg.status.success === true) {
        this.error = null;
        if(msg.type === 'reguser') {
          au.setRoot('home').then(() => {
            this.router.navigateToRoute('tweeteditor');
          });
        }
        else if (msg.type === 'admin') {
          au.setRoot('admin').then(() => {
            this.router.navigateToRoute('administrateTweets');
          });
        }

      } else if (!msg.status.success && msg.type !== 'logout') {
        this.error = msg.status.message;

      } else if (msg.type === 'logout'){
        au.setRoot('app').then(() => {
          this.router.navigateToRoute('login');
        });
      }

    });

  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' },
      { route: 'adminLogin', name: 'adminLogin', moduleId: 'viewmodels/adminLogin/adminLogin', nav: true, title: 'AdminLogin' }
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'login';
    });
    this.router = router;
  }

}
