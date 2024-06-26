import {bindable, bindingMode, observable} from 'aurelia-framework';

export class TableForm {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) data;
  @observable contents = null;

  contentsChanged(newContents, oldContents) {
    console.log(newContents, oldContents);

    if (newContents) {
      const lines = newContents.split('\n');

      this.data.columns = lines[0].split('\t');
      this.data.rows = lines.slice(1).map(line => line.split('\t'));
    }
  }

  bind() {
    if (!this.data.columns) {
      this.data.columns = [];
    } else {
      
    }

    if (!this.data.rows) {
      this.data.rows = [];
    }

    this.contents = this.data.columns.join('\t') + '\n' + this.data.rows.map(row => row.join('\t')).join('\n');
  }
}