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
    this.getDashboard();
  }

  getDashboard(force = false) {
    this.isProcessing = true;
    this.storageService.getDashboard(this.id)
      .then(dashboard => {
        this.dashboard = dashboard;

        if (force && dashboard.from == "github") {
          dashboard.content = null;
        }
        
        if (dashboard.content) {
          console.log("Loading content from Local Storage");
          this.content = JSON.parse(dashboard.content);
        } else {
          console.log("Fetching content from Github");
          this.github.getGist(dashboard.gistId)
            .then(gist => {
              console.log(gist);

              this.content = gist.files[Object.keys(gist.files)[0]].content;

              dashboard.content = this.content;
              dashboard.updatedAt = new Date();

              this.storageService.updateDashboard(dashboard);
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