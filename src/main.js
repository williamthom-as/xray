import { AppService } from "./services/app-service";
import { AjaxService } from "./services/ajax-service";
import { LocalStorageService } from "./services/local-storage-service";
import { GithubService } from "./services/github-service";

import Validation from 'bcx-validation';

export function configure(aurelia) {
  aurelia.use.standardConfiguration();
  aurelia.use.feature('resources');
  if (process.env.NODE_ENV === 'production') {
    aurelia.use.developmentLogging('warn');
  } else {
    aurelia.use.developmentLogging('info');
    aurelia.use.plugin('aurelia-testing');
  }
  
  aurelia.use.plugin('aurelia-dialog-lite', {
    host: document.body,
    overlayClassName: 'dialog-lite-overlay',
    escDismiss: true,
    overlayDismiss: false
  });

  aurelia.use.plugin('aurelia-combo');

  // Service registry
  aurelia.use.singleton('AppService', AppService);
  aurelia.use.singleton('AjaxService', AjaxService);
  aurelia.use.singleton('LocalStorageService', LocalStorageService);
  aurelia.use.singleton('GithubService', GithubService);

  aurelia.use.transient('Validation', Validation);

  aurelia.start().then(() => aurelia.setRoot());
}
