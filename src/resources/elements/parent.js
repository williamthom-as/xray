import { bindable } from 'aurelia-framework';

export class Parent {
    @bindable struct;
    @bindable key;

    @bindable expanded = true;
}