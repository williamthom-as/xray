import { bindable, bindingMode } from 'aurelia-framework';

export class ValidatableField {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable errors;
    @bindable label;
    @bindable name;
    @bindable placeholder = '';
    @bindable type = 'type';
    @bindable helpText;
}