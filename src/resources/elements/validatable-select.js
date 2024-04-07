import { bindable, bindingMode } from 'aurelia-framework';

export class ValidatableSelect {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable values;
    @bindable optionValue;
    @bindable optionKey;
    @bindable errors;
    @bindable label;

}