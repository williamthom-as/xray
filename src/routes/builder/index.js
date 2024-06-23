import {inject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';

@inject(Router, DialogService, 'AppService', 'LocalStorageService')
export class Index {

  @bindable dashboard = null;

  isProcessing = false;

  constructor(router, dialogService, appService, storageService) {
    this.router = router;
    this.dialogService = dialogService;
    this.app = appService;
    this.storageService = storageService;
  }

  activate(params) {
    this.id = params.id;
    this.getDashboard();
  }

  getDashboard(force = false) {
    this.isProcessing = true;

    this.storageService.getDashboard(this.id)
      .then(dashboard => {
        this.dashboard = dashboard;
        this.isProcessing = false;
      })
      .catch(error => {
        this.router.navigateToRoute('home');
        this.app.showError('Problem retrieving Dashboard', error);
      });
  }
}