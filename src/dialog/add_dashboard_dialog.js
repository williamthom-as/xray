import {inject, computedFrom} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

import { generateRandomId } from '../util/generate-random-id';

@inject(Router, DialogController, EventAggregator, 'Validation', 'AppService', 'LocalStorageService', 'GithubService')
export class AddDashboardDialog {

  isProcessing = false;
  triedOnce = false;
  errorMessage = null;

  constructor(router, controller, ea, validation, app, storageService, githubService) {
    this.router = router;
    this.controller = controller;
    this.ea = ea;
    this.app = app;
    this.storageService = storageService;
    this.github = githubService;

    validation.addValidator('gistId', {
      validate: /^[a-zA-Z0-9]+$/, message: 'not a valid Gist Id'
    });

    this.validator = validation.generateValidator({
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
      this.model.id = generateRandomId();
      this.model.createdAt = new Date().toISOString();
    }
    
    this.model.updatedAt = new Date().toISOString();

    let contentPromise;

    if (this.model.from === 'github') {
      contentPromise = this.github.getGist(this.model.gistId)
        .then(gist => {
          console.log(gist);
          this.model.content = JSON.parse(gist.files[Object.keys(gist.files)[0]].content);
        })
        .catch(() => {
          throw new Error('Cannot find Gist with the given ID')
        });
    } else if (this.model.from === 'text') {
      // Change here if we need to do anything later.
      contentPromise = Promise.resolve();
    } else {
      throw new Error('Invalid source');
    }

    contentPromise.then(() => {
      this.storageService.setDashboard(this.model)
    })
      .then(() => {
        this.app.showInfo('Success!', 'Your dashboard has been added!');
        this.ea.publish('dashboard-added', this.model);

        this.controller.ok()
      })
      .catch(error => {
        this.isProcessing = false;
        this.app.showError('Unable to save dashboard', error);
      });
  }

  @computedFrom('triedOnce','model.from', 'model.content', 'model.gistId')
  get errors() {
    if (!this.triedOnce) return {};
    return this.validator(this.model) || {};
  }

  @computedFrom('errors')
  get hasError() {
    return !_.isEmpty(this.errors);
  }
}