import {bindable} from 'aurelia-framework';

export class Alert {

  @bindable level = "info"
  dismissed = false;

}