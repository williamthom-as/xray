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

    console.log(params);
    // TODO: if the ID is remote -> create a synthentic dashboard
    // and load the contents. Offer a button to save.

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
}