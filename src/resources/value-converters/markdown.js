import marked from 'marked';
import DOMPurify from 'dompurify';

export class MarkdownValueConverter {

  toView(value) {
    const dirty = marked.parse(value.toString() || '');

    return DOMPurify.sanitize(dirty);
  }
}