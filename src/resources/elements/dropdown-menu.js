import {inject, bindable} from 'aurelia-framework';

@inject(Element)
export class DropdownMenu {
  @bindable buttonTitle = "Dropdown"

  opened = false;

  constructor(element) {
    this.element = element;
    this.clickCheck = this.checkCloseableClick.bind(this);
  }

  attached() {
    document.addEventListener('click', this.clickCheck);
  }

  detached() {
    document.removeEventListener('click', this.clickCheck);
    this.opened = false;
  }

  checkCloseableClick(e) {
    if (this.dropdown === e.target || this.dropdown.contains(e.target)) {
      // noop
    } else if (!this.element.contains(e.target)) {
      this.opened = false;
    }
  }

}