import {inject} from 'aurelia-framework';
import RiderService from '../../services/riderService';

@inject(RiderService)
export class Settings {

    constructor(rs) {
        this.riderService = rs;
        this.riderService.getSettings().then(res => {
            this.firstName = res.content.firstName;
            this.lastName = res.content.lastName;
            this.userName = res.content.userName;
            this.email = res.content.email;
            this.password = res.content.password;
        });
    }

    updateSettings(){
        console.log('Invoking riderservice to update settings');
        this.riderService.updateSettings(this.firstName, this.lastName, 
            this.userName, this.password, this.email);
    }

}