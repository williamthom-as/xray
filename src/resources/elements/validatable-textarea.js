import { bindable, bindingMode } from 'aurelia-framework';

export class ValidatableTextarea {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable errors;
    @bindable label;
    @bindable name;
    @bindable placeholder = '';
    @bindable helpText;
}