import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
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
}
