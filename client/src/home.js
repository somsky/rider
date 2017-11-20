import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'tweeteditor'], name: 'tweeteditor', moduleId: 'viewmodels/tweeteditor/tweeteditor', nav: true, title: 'tweeteditor' },
      { route: 'timeline_global', name: 'timeline_global', moduleId: 'viewmodels/timeline_global/timeline_global', nav: true, title: 'timeline_global' },
      { route: 'timeline_friends', name: 'timeline_friends', moduleId: 'viewmodels/timeline_friends/timeline_friends', nav: true, title: 'timeline_friends' },
      { route: 'settings', name: 'settings', moduleId: 'viewmodels/settings/settings', nav: true, title: 'settings' },
      { route: 'profile', name: 'profile', moduleId: 'viewmodels/profile/profile', nav: true, title: 'profile' },
      //{ route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }
    ]);
    this.router = router;
    
  }
}