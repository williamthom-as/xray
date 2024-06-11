import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';

@inject(Router, EventAggregator, 'AppService', 'LocalStorageService')
export class Dashboards {

  isProcessing = false;
  dashboards = null;

  view = 'card';

  constructor(router, ea, app, storageService) {
    this.ea = ea;
    this.app = app;
    this.router = router;
    this.storageService = storageService;

    this.getDashboards = this.getDashboards.bind(this);
  }

  bind() {
    this.getDashboards();
  }

  attached() {
    this.subscribers = [
      this.ea.subscribe("dashboard-added", this.getDashboards)
    ];
  }

  getDashboards() {
    this.isProcessing = true;
    this.storageService.getDashboards()
      .then(dashboards => {
        this.dashboards = dashboards;
        this.isProcessing = false;
      })
      .catch(error => console.error(error));
  }

  removeDashboard(id) {
    this.storageService.removeDashboard(id)
      .then(() => {
        this.app.showInfo("Success!", "Dashboard removed");
        this.getDashboards();
      })
      .catch(error => {
        this.app.showError("Error!", error);
      });
  }

  navigateToDashboard(dashboard) {
    this.router.navigateToRoute('dashboard-viewer', { id: dashboard.id });
  }

}