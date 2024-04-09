import {inject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';

@inject(Router, DialogService, 'LocalStorageService', 'GithubService')
export class Viewer {

  @bindable dashboard = null;
  @bindable content = null;

  isProcessing = false;

  constructor(router, dialogService, storageService, githubService) {
    this.router = router;
    this.dialogService = dialogService;
    this.storageService = storageService;
    this.github = githubService;
  }

  activate(params) {
    this.id = params.id;

    if (!this.id) {
      this.router.navigateToRoute('dashboard');
      return;
    }

    if (this.id == "remote") {
      if (params.gistId) {
        this.loadDashboardFromGist(params.gistId);
        return;
      }
  
      if (params.encoded) {
        this.loadDashboardFromEncoded(params.encoded);
        return;
      }

      this.router.navigateToRoute('dashboard');
      // Flash error message
      return;
    }

    this.getDashboard();
  }

  getDashboard(force = false) {
    this.isProcessing = true;
    this.storageService.getDashboard(this.id)
      .then(dashboard => {
        this.dashboard = dashboard;

        if (force && this.dashboard.from == "github") {
          this.dashboard.content = null;
        }
        
        if (this.dashboard.content) {
          console.log("Loading content from Local Storage");
          this.content = dashboard.content;
        } else {
          console.log("Fetching content from Github");
          this.github.getGist(this.dashboard.gistId)
            .then(gist => {
              this.content = JSON.parse(gist.files[Object.keys(gist.files)[0]].content)
              this.dashboard.content = this.content;
              this.dashboard.updatedAt = new Date();

              this.storageService.updateDashboard(this.dashboard);
            });
        }

        this.isProcessing = false;
      });
  }

  reload() {
    this.dashboard = null;
    this.content = null;

    this.getDashboard(true);
  }

  loadDashboardFromGist(gistId) {
    this.isProcessing = true;

    this.dashboard = {
      id: "remote",
      gistId: gistId,
      from: "github",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.github.getGist(this.dashboard.gistId)
      .then(gist => {
        this.content = JSON.parse(gist.files[Object.keys(gist.files)[0]].content)
        this.dashboard.content = this.content;

        this.isProcessing = false;
      });
  }

  loadDashboardFromEncoded(encoded) {
    console.log("here", encoded);

    this.isProcessing = true;

    this.dashboard = {
      id: "remote",
      from: "text",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(this.dashboard, JSON.parse(atob(encoded)));


    this.content = JSON.parse(atob(encoded));
    this.dashboard.content = this.content;

    this.isProcessing = false;
  }
}