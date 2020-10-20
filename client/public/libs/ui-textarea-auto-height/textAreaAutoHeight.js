window.TextAreaAutoHeight = (() => {

  // init styles ->
  const scroll_hidden_class = 'GVBuqHsTkUwQlzgG___scroll_hidden';

  const style = document.createElement('style');

  style.textContent = `.${scroll_hidden_class}{scrollbar-width:none;-ms-overflow-style:none}.${scroll_hidden_class}::-webkit-scrollbar{width:0}`;

  document.head.append(style);
  // <- init styles

  class EventEmitter {
    constructor() {
      this._handlers = Object.create(null);
    }

    on(type, handler) {
      (this._handlers[type] = this._handlers[type] ?? new Set()).add(handler);
      return this;
    }

    off(type, handler) {
      this._handlers[type]?.delete(handler);
      return this;
    }

    emit(type, ...data) {
      this._handlers[type]?.forEach((handler) => handler.call(this, ...data));
      return this;
    }
  }

  class TextAreaAutoHeight extends EventEmitter {
    constructor(element, minRows = 1, maxRows = 10) {
      super();

      this.element = element;

      this.minRows = minRows;
      this.maxRows = maxRows;

      const computedStyle = window.getComputedStyle(this.element);
      this._boxSizingBB = (computedStyle.boxSizing === 'border-box');
      this._paddings = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
      this._borders = this.element.offsetHeight - this.element.clientHeight;
      this._lineHeight = (this.element.clientHeight - this._paddings) / this.element.rows;

      this.update = this.update.bind(this);

      this.update();
      this.start();
    }

    start() {
      this.element.addEventListener('input', this.update);
    }

    stop() {
      this.element.removeEventListener('input', this.update);
    }

    update() {
      this.element.classList.add(scroll_hidden_class);
      let rows = this._calcRows();

      if (this.element.scrollHeight !== this.element.clientHeight) {
        if (rows > this.maxRows) this.element.classList.remove(scroll_hidden_class);
        else this._setClientHeight(this.element.scrollHeight);
      } else {
        while (
          this.element.scrollHeight === this.element.clientHeight
          && (rows = this._calcRows()) > this.minRows
        ) {
          this._setClientHeight(this.element.clientHeight - this._lineHeight);
        }
        this._setClientHeight(this.element.scrollHeight);
      }

      this.emit('update');
    }

    _calcRows() {
      return (this.element.scrollHeight - this._paddings) / this._lineHeight;
    }

    _setClientHeight(clientHeight) {
      this.element.style.height = (this._boxSizingBB)
        ? clientHeight + this._borders + 'px'
        : clientHeight - this._paddings + 'px';
    }
  }

  return TextAreaAutoHeight;
})();
