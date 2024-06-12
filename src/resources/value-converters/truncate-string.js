export class TruncateStringValueConverter {
  toView(value, length = 200) {
    if (typeof value === 'string' && value.length > length) {
      return `${value.substring(0, length)}...`;
    }
    return value;
  }
}