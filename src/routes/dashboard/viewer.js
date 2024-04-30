import {inject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';
import {Router} from 'aurelia-router';
import {generateRandomId} from '../../util/generate-random-id';
import { StaticMessageDialog } from '../../dialog/static_message_dialog';

@inject(Router, DialogService, 'AppService', 'LocalStorageService', 'GithubService')
export class Viewer {
  @bindable dashboard = null;
  @bindable content = null;

  isProcessing = false;

  constructor(router, dialogService, appService, storageService, githubService) {
    this.router = router;
    this.dialogService = dialogService;
    this.storageService = storageService;
    this.github = githubService;
    this.app = appService;
  }

  activate(params) {
    this.id = params.id;

    if (this.id == "remote") {
      if (params.gistId) {
        this.loadDashboardFromGist(params.gistId);
        return;
      }
  
      if (params.encoded) {
        this.loadDashboardFromEncoded(params.encoded);
        return;
      }

      this.router.navigateToRoute('home');
      this.app.showError(
        'Error!', 
        'Missing mandatory parameter gistId or encoded. See docs for further info.'
      );

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
      })
      .catch(error => {
        console.log("here!", this.id, error);
        this.router.navigateToRoute('home');
        this.app.showError('Problem retrieving Dashboard', error);
      });
  }

  reload() {
    this.dashboard = null;
    this.content = null;

    this.app.showInfo(
      'Reloading dashboard', 
      'Just a second while we fetch the latest data...'
    );

    this.getDashboard(true);
  }

  save() {
    if (this.dashboard.id == "remote") {
      this.dashboard.id = generateRandomId();
      this.storageService.setDashboard(this.dashboard).then(() => {
        this.id = this.dashboard.id; // Reset ID
        this.reload();
      });
    }
  }

  loadDashboardFromGist(gistId) {
    this.isProcessing = true;

    this.dashboard = {
      id: 'remote',
      from: 'github',
      gistId: gistId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.github.getGist(this.dashboard.gistId)
      .then(gist => {
        this.content = JSON.parse(gist.files[Object.keys(gist.files)[0]].content)
        this.dashboard.content = this.content;

        this.isProcessing = false;
      })
      .catch((error) => {
        this.router.navigateToRoute('home');
        this.app.showError('Problem retrieving Gist', error);
      });
  }

  loadDashboardFromEncoded(encoded) {
    this.isProcessing = true;

    this.dashboard = {
      id: 'remote',
      from: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      this.content = JSON.parse(atob(encoded));
      this.dashboard.content = this.content;
    } catch (error) {
      this.router.navigateToRoute('home');
      this.app.showError('Problem decoding content', error);
      
      return
    }

    this.isProcessing = false;
  }

  showDescription(panel) {
    this.dialogService.open({
      viewModel: StaticMessageDialog,
      model: {
        title: `About '${panel.title}'`,
        content: panel.description || "No description!",
      },
    }).then(
      (_resp) => {},
      () => {}
    );
  }
}