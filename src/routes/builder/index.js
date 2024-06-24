import {inject, bindable, computedFrom} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';
import {SaveWidgetDialog} from './dialog/save-widget-dialog';

import _ from 'lodash';

@inject(Router, DialogService, 'AppService', 'LocalStorageService', 'Validation')
export class Index {

  @bindable dashboard = null;
  originalDashboard = null;

  isProcessing = false;

  constructor(router, dialogService, appService, storageService, validation) {
    this.router = router;
    this.dialogService = dialogService;
    this.app = appService;
    this.storageService = storageService;

    this.validator = validation.generateValidator({
      title: ['mandatory', {validate: 'string', minLength: 2, maxLength: 96}],
      description: ['notMandatory', {validate: 'string', minLength: 2, maxLength: 48}],
    });
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
    this.storageService.updateDashboard(this.dashboard).then(() => {
      this.app.showInfo(
        'Saved dashboard', 
        'This dashboard has been saved.'
      );
    }).finally(() => {
      this.originalDashboard = _.cloneDeep(this.dashboard);
    });
  }

  add() {
    this.dialogService.open({
      viewModel: SaveWidgetDialog,
      model: {},
    }).then(
      (resp) => {
        if (!this.dashboard.content.panels) {
          this.dashboard.content.panels = []
        }

        this.dashboard.content.panels.push(resp);
      },
      () => {}
    )
  }

  @computedFrom('dashboard.content.title', 'dashboard.content.description')
  get errors() {
    return this.validator(this.dashboard.content) || {};
  }

  @computedFrom('errors')
  get hasError() {
    return !_.isEmpty(this.errors);
  }  

}