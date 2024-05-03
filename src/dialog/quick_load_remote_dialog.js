import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import {combo} from 'aurelia-combo';
import {Router} from 'aurelia-router';

@inject(Router, DialogController, 'AppService')
export class QuickLoadRemoteDialog {

  value = null;

  constructor(router, controller, app) {
    this.router = router;
    this.controller = controller;
    this.app = app;
  }

  activate(model) {
    this.type = model.type || "gist";
  }

  attached() {
    this.searchInput.focus();
  }

  @combo('enter')
  navigateOnEnter() {
    if (!this.value) {
      return
    }

    this.navigateMenu();
  }

  navigateToGist() {
    if (!this.isValidGist(this.value)) {
      this.app.showError('Hmm, that does not look like a valid Gist!');
      return
    }

    this.controller.cancel();
    this.router.navigateToRoute('dashboard-viewer', { id: 'remote', gistId: this.value });
  }

  isValidGist(value) {
    const regex = /^[0-9a-fA-F]{32}$/;

    return regex.test(value);
  }

}