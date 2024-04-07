import {bindable, inlineView} from "aurelia-framework";

@inlineView(
  `<template>
      <pre>
        <code ref="el" class="language-ruby small"></code>
      </pre>
    </template>`
)
export class PrismCode {
  @bindable code;

  attached() {
    this.updateHighlight();
  }

  updateHighlight() {
    this.el.innerHTML = this.code;
    Prism.highlightElement(this.el);
  }

  codeChanged() {
    if (this.el) {
      this.updateHighlight();
    }
  }
}