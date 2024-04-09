import moment from 'moment';

export class DateTimeValueConverter {
  toView(value) {
    return moment(value).format('YYYY-MM-DD HH:mm');
  }
}
