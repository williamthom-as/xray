import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';

@inject(DialogController)
export class ObjectViewerDialog {

  opened = 'json';
  title = 'Object Viewer';
  object = null;
  json = null;

  constructor(controller) {
    this.controller = controller;
  }

  activate(model) {
    this.title = model.title;

    if (model.object) {
      this.object = model.object;
      this.json = JSON.stringify(model.object);
    }
  }

}