import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class Timeline_Friends {

  constructor(rs) {
    this.riderService = rs;
    this.riderService.getStatistics().then(res => {
      this.stats = res.content;
    });
  }

}
