import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog-lite';

@inject(DialogController)
export class ObjectViewerDialog {

  opened = 'json';
  title = 'Object Viewer';
  object = null;
  json = null;

  constructor(controller) {
    this.controller = controller;
  }

  activate(model) {
    this.title = model.title;

    if (model.object) {
      this.object = model.object;
      this.json = JSON.stringify(model.object, null, 2);
    }
  }

  downloadTemplate() {
    const json = JSON.stringify(this.object.content, null, 2);
    const title = this.title.toLowerCase().replace(/ /g, '_')
    const blob = new Blob([json], { type: 'application/json' });
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