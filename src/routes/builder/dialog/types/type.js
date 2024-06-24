import {inject, bindable, bindingMode} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class Type {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) type;
  @bindable seed;

  constructor(ea) {
    this.ea = ea;
  };

  get typeOptions() {
    return [
        { id: "markdown", label: "Markdown" },
        { id: "table", label: "Table" },
        { id: "bar-chart", label: "Bar Chart" },
        { id: "pie-chart", label: "Pie Chart" },
    ]
  }

  typeChanged(o,v) {
    if (v !== null && o !== v) {
      this.ea.publish(this.seed + "-remove", {o,v})
    }
  }

}