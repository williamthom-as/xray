import {inject, bindable, computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';

@inject(Router, EventAggregator, 'AppService', 'LocalStorageService')
export class Dashboards {

  isProcessing = false;
  dashboards = null;

  view = 'card';

  sortableColumn = null;
  sortAsc = true;
  filter = null;

  max = 5;
  offset = 0;

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

  @computedFrom('sortableColumn', 'filteredRows', 'sortAsc', 'offset')
  get pagedResult() {
    let filteredRows = this.filteredRows;

    // let idx = this.columns.findIndex(row => row.includes(this.sortableColumn));
    // let sortedRows = filteredRows.sort((a, b) => {
    //   if (a[idx] > b[idx]) return this.sortAsc ? 1 : -1;
    //   if (a[idx] < b[idx]) return this.sortAsc ? -1 : 1;
    //   return 0;
    // });

    return filteredRows.slice(this.offset, this.offset + this.max);
  }

  @computedFrom('sortableColumn', 'dashboards', 'filter')
  get filteredRows() {
    let filteredRows = this.dashboards;
    
    if (this.filter) {
      filteredRows = filteredRows.filter(
        r => r.content && r.content.title && r.content.title.toLowerCase().includes(this.filter)
      );
    }

    return filteredRows;
  }


  sort(name) {
    if (this.sortableColumn === name) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortableColumn = name;
      this.sortAsc = true;
    }
    
    return;
  }

  nextPage() {
    const offset = this.offset + this.max;
    const dashboardLength = this.filteredRows.length;

    if (offset >= dashboardLength) {
      this.offset = dashboardLength - (dashboardLength % this.max);
    } else {
      this.offset = offset;
    }
  }

  prevPage() {
    if (this.offset < 10) {
      this.offset = 0;
      return;
    }

    this.offset -= this.max;
  }

  @computedFrom('offset', 'filteredRows')
  get hasNextPage() {
    return (this.offset + this.max) < this.filteredRows.length;
  }

  @computedFrom('offset')
  get hasPrevPage() {
    return this.offset > 0;
  }

  @computedFrom('offset', 'max', 'filteredRows')
  get currentPageSize() {
    return Math.min(this.filteredRows.length, (this.offset + this.max))
  }
}