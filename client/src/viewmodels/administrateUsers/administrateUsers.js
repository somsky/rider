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
    let newUserList = [];
    this.entries.forEach( entry => {
      if (entry.isSelected) {
        selectedUsers.push(entry);
      }
      else
        newUserList.push(entry);
    });
    this.entries = newUserList;
    this.riderService.adminDeleteUsers(selectedUsers);
  }

}
