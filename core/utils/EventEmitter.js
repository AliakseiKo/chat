class EventEmitter {
  constructor() {
    this._handlers = Object.create(null);
  }

  on(type, handler) {
    (this._handlers[type] ??= new Set()).add(handler);
    return this;
  }

  off(type, handler) {
    this._handlers[type]?.delete(handler);
    return this;
  }

  async emit(type, ...data) {
    if (this._handlers[type]) {
      for (const handler of this._handlers[type]) {
        await handler.call(this, ...data);
      }
    }

    return this;
  }
}

module.exports = { EventEmitter };
