import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';
import JSONCrush from 'jsoncrush';

@inject(DialogController, 'AppService')
export class ShareDashboardDialog {

  encoded = null;

  constructor(controller, appService) {
    this.controller = controller;
    this.app = appService;
  }

  activate(model) {
    this.hostAddr = window.location.origin;
    this.dashboard = model.dashboard;

    if (this.dashboard.gistId) {
      this.urlString = `${this.hostAddr}/dashboard/viewer/remote?gistId=${this.dashboard.gistId}`;
    } else {
      const jsonStr = JSON.stringify(this.dashboard.content);
      const encoded = btoa(jsonStr);
      this.urlString = `${this.hostAddr}/dashboard/viewer/remote?encoded=${encoded}`;
    }
  }

  attached() {
    const jsonStr = JSON.stringify(this.dashboard.content);

    this.createJSONCrushURL(jsonStr)
      .then((jsonCrushStr) => {
        this.jsonCrushStr = jsonCrushStr;
      })
      .catch((e) => {
        console.err(e)
      })
  }

  createJSONCrushURL(jsonStr) {
    return new Promise((resolve) => {
      const jsoncrush = encodeURIComponent(JSONCrush.crush(jsonStr));
      
      resolve(
        `${this.hostAddr}/dashboard/viewer/remote?jsoncrush=${jsoncrush}`
      );
    });
  }

  copy() {
    navigator.clipboard.writeText(this.urlString)
      .then(() => {
        this.app.showInfo("Copied!", "URL has been copied to your clipboard");
      })
      .catch(err => {
        this.app.showError("Error", "Failed to copy to clipboard. Please manually select text.");
      });
  }

  downloadTemplate() {
    let title = "dashbard_template"
    if (this.dashboard.content) {
      title = this.dashboard.content.title.toLowerCase().replace(/ /g, '_')
    }

    const dashboardJSON = JSON.stringify(this.dashboard.content)
    const blob = new Blob([dashboardJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = Object.assign(
      document.createElement('a'), 
      { style: { display: 'none' }, href: url, download: `${title}.json` }
    );

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

}