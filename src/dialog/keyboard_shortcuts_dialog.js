import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';

@inject(DialogController)
export class keyboardShortcutsDialog {

  content = null;

  constructor(controller) {
    this.controller = controller;
  }
}