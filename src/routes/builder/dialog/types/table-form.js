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
}