import {inject, TaskQueue} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ToastMessage} from '../resources/elements/toast-message';

@inject(EventAggregator, TaskQueue)
export class AppService {
  constructor(ea, taskQueue) {
    this.ea = ea;
    this.taskQueue = taskQueue
  };

  showInfo(title, message) {
    this.taskQueue.queueTask(() => {
      this.ea.publish(new ToastMessage(title, message, "info"))
    });
  }

  showError(title, message) {
    this.taskQueue.queueTask(() => {
      this.ea.publish(new ToastMessage(title, message, "danger"))
    });
  }
}