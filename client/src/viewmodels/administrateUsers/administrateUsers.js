import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import RiderService from '../../services/riderService';

@inject(RiderService, Router)
export class UserView {

  constructor(rs, r) {
    this.riderService = rs;
    this.router = r;
    this.riderService.getUserList().then( res => {
      this.entries = res.content;
    });
  }

  deleteSelectedUsers(entry) {
    let selectedUsers = [];
    this.entries.forEach( entry => {
      if (entry.isSelected) {
        selectedUsers.push(entry);
        let i = this.entries.indexOf(entry);
        this.entries.splice(i, 1);
      }
    });
    this.riderService.adminDeleteUsers(selectedUsers);
  }

}
