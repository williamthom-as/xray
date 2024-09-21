import {inject,computedFrom} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog-lite';

@inject(DialogService, 'AppService')
export class App {
  scheme = 'auto';

  constructor(dialogService, appService) {
    this.dialogService = dialogService;
    this.appService = appService;
  }

  bind() {
    const scheme = localStorage.getItem('color_scheme');

    if (scheme) {
      this.changeScheme(scheme);
    }
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = "XRay";
    config.options.pushState = true;
    config.options.root = '/';

    config.mapUnknownRoutes('not-found.html');
    config.map([{
      route: ['', 'home'],
      moduleId: './routes/home/index',
      name: 'home',
      title: 'Home',
      nav: true,
      settings: {
        icon: 'fas fa-home',
        description: 'Get started here'
      }
    },{
      route: 'dashboards',
      moduleId: './routes/dashboard/index',
      name: 'dashboards',
      title: 'Dashboards',
      nav: true,
      settings: {
        icon: 'fas fa-image',
        description: 'View dashboards'
      }
    },{
      route: 'dashboard/viewer/:id',
      moduleId: './routes/dashboard/viewer',
      name: 'dashboard-viewer',
      title: 'View Dashboard',
      nav: false,
      settings: {
        description: 'View dashboard',
        highlight: 'dashboards'
      }
    },{
      route: 'dashboard/builder/:id',
      moduleId: './routes/builder/index',
      name: 'dashboard-builder',
      title: 'Dashboard Builder',
      nav: false,
      settings: {
        icon: 'fas fa-image',
        description: 'Build dashboards',
        highlight: 'dashboards'
      }
    },{
      route: 'settings',
      moduleId: './routes/settings/index',
      name: 'settings',
      title: 'Settings',
      nav: true,
      settings: {
        icon: 'fas fa-wrench',
        description: 'Change your settings'
      }
    }]);
  }

  navigateMenu(routeHref) {
    this.opened = null;
    this.router.navigate(routeHref, {});
  }

  @computedFrom('router', 'router.currentInstruction')
  get highlight() {
      return _.get(this.router, 'currentInstruction.config.settings.highlight');
  }

  changeScheme(scheme) {
    this.scheme = scheme;

    localStorage.setItem('color_scheme', scheme);
    document.firstElementChild.setAttribute('color-scheme', scheme);
  }
}
