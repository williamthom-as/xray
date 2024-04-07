import {inject, computedFrom} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Router, DialogController, EventAggregator, 'Validation', 'AppService', 'LocalStorageService')
export class AddDashboardDialog {

  isProcessing = false;
  triedOnce = false;
  errorMessage = null;

  constructor(router, controller, ea, validation, app, storageService) {
    this.router = router;
    this.controller = controller;
    this.ea = ea;
    this.app = app;
    this.storageService = storageService;

    validation.addValidator('gistId', {
      validate: /^[a-zA-Z0-9]+$/, message: 'not a valid Gist Id'
    });

    this.validator = validation.generateValidator({
      from: ['mandatory'],
      name: ['mandatory'],
      content: [
        {if: 'from === "text"', validate: 'mandatory'},
        {if: 'type === "github"', validate: 'notMandatory'},
      ],
      gistId: [
        {if: 'from === "text"', validate: 'notMandatory'},
        {if: 'type === "github"', validate: 'mandatory'}, 'gistId',
      ],
    });
  }

  activate(_model) {
    this.model = {
      from: "text",
      name: "",
      description: "",
      content: "",
      gistId: ""
    };
  }

  submit() {
    if (this.isProcessing) return;

    this.triedOnce = true;
    if (this.hasError) {
      this.app.showError('Error!', 'Please fix the errors before submitting');
      return;
    }

    this.isProcessing = true;

    if (!this.model.id) {
      this.model.id = this.generateRandomId();
      this.model.createdAt = new Date().toISOString();
    }

    this.model.updatedAt = new Date().toISOString();

    this.storageService.setDashboard(this.model)
      .then(() => {
        this.app.showInfo('Success!', 'Your dashboard has been added!');
        this.ea.publish('dashboard-added', this.model);

        this.controller.ok()
      })
      .catch(error => {
        this.isProcessing = false;
        this.app.showError("Error!", error);
      });
  }

  @computedFrom('triedOnce','model.from','model.name','model.description', 'model.gistId')
  get errors() {
    if (!this.triedOnce) return {};
    return this.validator(this.model) || {};
  }

  @computedFrom('errors')
  get hasError() {
    return !_.isEmpty(this.errors);
  }

  generateRandomId() {
    let id = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return id;
  }
}