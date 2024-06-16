import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';

@inject(DialogController, 'AppService')
export class ShareDashboardDialog {

  encoded = null;

  constructor(controller, appService) {
    this.controller = controller;
    this.app = appService;
  }

  activate(model) {
    this.encoded = model.encoded;
    this.hostAddr = window.location.origin;
    this.urlString = `${this.hostAddr}/dashboard/viewer/remote?encoded=${this.encoded}`;
  }

  copy() {
    navigator.clipboard.writeText(this.urlString)
      .then(() => {
        this.app.showInfo("Copied!", "URL has been copied to your clipboard");
      })
      .catch(err => {
        this.app.showError("Error", "Failed to copy to clipboard. Please manually select text.");
      });
  }
}