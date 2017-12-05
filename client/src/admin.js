import { inject, Aurelia } from 'aurelia-framework';
import RiderService from 'services/riderService';

@inject(Aurelia, RiderService)
export class Home {

  constructor(au, rs) {
    this.aurelia = au;
    this.riderService = rs;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'administrateTweets'], name: 'administrateTweets', moduleId: 'viewmodels/administrateTweets/administrateTweets', nav: true, title: 'administrateTweets' },
      { route: ['', 'administrateUsers'], name: 'administrateUsers', moduleId: 'viewmodels/administrateUsers/administrateUsers', nav: true, title: 'administrateUsers' },
    ]);
    config.mapUnknownRoutes(instruction => {
      return '';
    });
    this.router = router;

  }

  logout(){
    console.log('logout pressed');
    this.riderService.logout();
    return true;
  }

}
