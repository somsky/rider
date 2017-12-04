import {bindable} from 'aurelia-framework';

export class EntryCustomElement {
    @bindable entry;
    @bindable viewProfileFunction;

    viewProfile() {
      this.viewProfileFunction();
    }

}