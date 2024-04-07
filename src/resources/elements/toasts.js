import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ToastMessage} from './toast-message';
import _ from 'lodash';

const TIME_TO_LIVE_MS = 5000;

@inject(EventAggregator)
export class Toasts {
  toasts = [];
  removers = {};
  _nextId = 0;

  constructor(ea) {
    this.ea = ea;
    this.addToast = this.addToast.bind(this);
  }

  attached() {
    this.subscribers = [
      this.ea.subscribe(ToastMessage, this.addToast)
    ]
  }

  detached() {
    _.each(this.subscribers, s => s.dispose());
  }

  nextId() {
    this._nextId += 1;
    return this._nextId;
  }

  addToast(toast) {
    const {title, message, level} = toast;
    const id = this.nextId();
    
    this.toasts.push({id, title, message, level});

    if (level !== 'danger') {
      this.setFutureRemove(id)
    }

    setTimeout(() => {
      const toastEl = document.getElementById(`toast-${id}`);
      const progressEl = document.getElementById(`progress-${id}`);
  
      toastEl.classList.add('active');

      if (progressEl) {
        progressEl.classList.add('active');
      }
    }, 25);
  }

  removeToast(id) {
    const idx = _.findIndex(this.toasts, {id});
    if (idx >= 0) {

      const toastEl = document.getElementById(`toast-${id}`);
      if (toastEl) {
        toastEl.classList.remove('active');
      }

      setTimeout(() => {
        this.toasts.splice(idx, 1);
        delete this.removers[id]
      }, 500);
    }
  }

  stopFutureRemove(id) {
    if (this.removers[id]) {
      clearTimeout(this.removers[id]);
      delete this.removers[id]
    }
  }

  setFutureRemove(id) {
    if (this.removers[id]) return;

    this.removers[id] = setTimeout(() => {
      this.removeToast(id);
    }, TIME_TO_LIVE_MS);
  }

}