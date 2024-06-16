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
    this.hostAddr = window.location.origin;
    this.dashboard = model.dashboard;

    if (this.dashboard.gistId) {
      this.urlString = `${this.hostAddr}/dashboard/viewer/remote?gistId=${this.dashboard.gistId}`;
    } else {
      const encoded = btoa(JSON.stringify(this.dashboard.content));
      this.urlString = `${this.hostAddr}/dashboard/viewer/remote?encoded=${encoded}`;
    }
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