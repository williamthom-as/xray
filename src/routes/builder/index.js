import {inject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';

import _ from 'lodash';

@inject(Router, DialogService, 'AppService', 'LocalStorageService')
export class Index {

  @bindable dashboard = null;
  originalDashboard = null;

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

  canDeactivate() {
    if (this.originalDashboard != null && !_.isEqual(this.dashboard, this.originalDashboard)) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }

    return true;
  }

  getDashboard() {
    this.isProcessing = true;
    this.storageService.getDashboard(this.id)
      .then(dashboard => {
        this.dashboard = dashboard;
        this.originalDashboard = _.cloneDeep(dashboard);

        this.isProcessing = false;
      })
      .catch(error => {
        this.router.navigateToRoute('home');
        this.app.showError('Problem retrieving Dashboard', error);
      });
  }

  save() {
    console.log(this.dashboard, this.originalDashboard);
  }

}