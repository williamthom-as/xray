import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';

@inject(DialogController)
export class StaticMessageDialog {

  title = null;
  content = null;

  constructor(controller) {
    this.controller = controller;
  }

  activate(model) {
    this.title = model.title;
    this.content = model.content;
  }
}