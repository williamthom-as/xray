import {inject, computedFrom} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import { generateRandomId } from '../util/generate-random-id';

@inject(Router, DialogController, EventAggregator, 'Validation', 'AppService', 'LocalStorageService', 'GithubService')
export class CreateDashboardDialog {

  isProcessing = false;
  triedOnce = false;
  errorMessage = null;

  constructor(router, controller, ea, validation, app, storageService) {
    this.router = router;
    this.controller = controller;
    this.ea = ea;
    this.app = app;
    this.storageService = storageService;

    this.validator = validation.generateValidator({
      title: ['mandatory', {validate: 'string', minLength: 2, maxLength: 96}],
      description: ['notMandatory', {validate: 'string', minLength: 2, maxLength: 48}],
      author: ['mandatory', {validate: 'string', minLength: 2, maxLength: 48}]
    });
  }

  activate(model) {
    this.model = model;
  }

  submit() {
    if (this.isProcessing) return;

    this.triedOnce = true;
    if (this.hasError) {
      this.app.showError('Error!', 'Please fix the errors before submitting');
      return;
    }

    this.isProcessing = true;

    let dashboard = {
      id: generateRandomId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: this.model
    }
  
    this.storageService.setDashboard(dashboard);

    this.app.showInfo('Success!', 'Your dashboard has been added!');
    this.ea.publish('dashboard-added', dashboard);

    this.controller.ok(dashboard);
  }

  @computedFrom('triedOnce','model.title', 'model.author', 'model.description')
  get errors() {
    if (!this.triedOnce) return {};
    return this.validator(this.model) || {};
  }

  @computedFrom('errors')
  get hasError() {
    return !_.isEmpty(this.errors);
  }  
}