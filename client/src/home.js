import { inject, Aurelia } from 'aurelia-framework';
import RiderService from 'services/riderService';
import {EventAggregator} from 'aurelia-event-aggregator'
import {ServerResponseStatus} from 'services/messages';

@inject(Aurelia, RiderService, EventAggregator)
export class Home {

  constructor(au, rs, ea) {
    this.aurelia = au;
    this.riderService = rs;
    this.ea = ea;
    this.errorMsg = null;
    this.successMsg = null;
    this.ea.subscribe(ServerResponseStatus, msg => {
      if(!msg.status.success) {
        this.errorMsg = msg.status.message;
        this.successMsg = null;
      }
      else {
        this.errorMsg = null;
      }
    });
  }

  logout(){
    this.riderService.logout();
    return true;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'tweeteditor'], name: 'tweeteditor', moduleId: 'viewmodels/tweeteditor/tweeteditor', nav: true, title: 'tweeteditor' },
      { route: 'timeline_global', name: 'timeline_global', moduleId: 'viewmodels/timeline_global/timeline_global', nav: true, title: 'timeline_global' },
      { route: 'timeline_friends', name: 'timeline_friends', moduleId: 'viewmodels/timeline_friends/timeline_friends', nav: true, title: 'timeline_friends' },
      { route: 'settings', name: 'settings', moduleId: 'viewmodels/settings/settings', nav: true, title: 'settings' },
      { route: 'profile', name: 'profile', moduleId: 'viewmodels/profile/profile', nav: true, title: 'profile' },
      { route: 'userView', name: 'userView', moduleId: 'viewmodels/userView/userView', nav: true, title: 'userView' },
      { route: 'userProfile/:id', name: 'userProfile', moduleId: 'viewmodels/userProfile/userProfile', title: 'userProfile' },
      { route: 'statistics', name: 'statistics', moduleId: 'viewmodels/statistics/statistics', nav: true, title: 'statistics' },
      { route: 'socialGraph', name: 'socialGraph', moduleId: 'viewmodels/socialGraph/socialGraph', nav: true, title: 'socialGraph' }
    ]);
    this.router = router;
    
  }



}
