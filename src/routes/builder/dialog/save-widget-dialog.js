import {inject, computedFrom} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, DialogController, EventAggregator, 'Validation', 'AppService')
export class SaveWidgetDialog {

  isProcessing = false;
  triedOnce = false;
  errorMessage = null;

  constructor(router, controller, ea, validation, app, storageService) {
    this.router = router;
    this.controller = controller;
    this.ea = ea;
    this.app = app;
    this.storageService = storageService;

    this.transformOptions = this.transformOptions.bind(this);

    this.validator = validation.generateValidator({
      title: ['mandatory', {validate: 'string', minLength: 2, maxLength: 64}],
      widget_type: ['mandatory']
    });
  }

  activate(model) {
    this.model = model;
    this.subscribers = [
      this.ea.subscribe(this.seed + "-remove", this.transformOptions)
    ]
  }

  submit() {
    if (this.isProcessing) return;

    this.triedOnce = true;
    if (this.hasError) {
      this.app.showError('Error!', 'Please fix the errors before submitting');
      return;
    }

    this.isProcessing = true;

    this.controller.ok(this.model);
  }

  @computedFrom('triedOnce','model.title')
  get errors() {
    if (!this.triedOnce) return {};
    return this.validator(this.model) || {};
  }

  @computedFrom('errors')
  get hasError() {
    return !_.isEmpty(this.errors);
  }

  transformOptions(o, v) {
    if (v !== null && o !== v) {
      this.model.data = {};
    }
  }
}