import {bindable} from 'aurelia-framework'

export class Panel {
  @bindable expanded = true;
  @bindable maxHeight = null;

  @bindable actionOneFunction = null;
  @bindable actionOneIcon = null;

  @bindable actionTwoFunction = null;
  @bindable actionTwoIcon = null;

  @bindable actionThreeFunction = null;
  @bindable actionThreeIcon = null;

  panelCss() {
    if (this.maxHeight) {
      return `max-height: ${this.maxHeight}rem;`;
    }
  }
}