import {bindable, inlineView} from 'aurelia-framework';
import Chart from 'chart.js/auto'

@inlineView(`
  <template>
    <div style="position: relative; min-height: 16rem;">
      <canvas ref="canvas"></canvas>
    </div>
  </template>
`)
export class DataChart {
  @bindable labels;
  @bindable data;
  @bindable chartType;
  @bindable options;
  
  attached() {
    this.updateChart();
    this.resizeHandler = this.resizeHandler.bind(this);
    
    window.addEventListener('resize', this.resizeHandler, { once: true });
  }

  detached() {
    this.destroyChart();

    window.removeEventListener('resize', this.resizeHandler);
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  updateChart() {
    this.destroyChart();
    
    console.log(this.options);

    this.chart = new Chart(this.canvas, {
      type: this.chartType || "line",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.options?.chartTitle || "No title",
            data: this.data
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    window.dispatchEvent(new Event('resize'));
  }

  recordsChanged() {
    if (this.chart) {
      this.updateChart();
    }
  }

  chartOptions() {}

  resizeHandler() {
    this.updateChart();
  }
}