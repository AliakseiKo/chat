const { FileStorage: Storage } = require('./FileStorage');

const { tokenGenerator } = require('../utils');

const SESSION_ID_LENGTH = 64;

class Session extends Map {
  constructor(cookie) {
    super();

    this._cookie = cookie;

    this.id = this._cookie.get('ssid');

    this.virtual = true;

    this.started = false;
  }

  async start() {
    if (this.started) return;

    this.started = true;

    if (this.id) {
      await this._restore();
    } else {
      this._create();
    }
  }

  async destroy() {
    if (!this.started) return;

    if (this.virtual) {
      super.clear();
    } else {
      await Storage.delete(this.id);
    }

    this._cookie.delete('ssid');
  }

  async _restore() {
    const sessionData = await Storage.get(this.id);

    if (typeof sessionData === 'undefined') {
      this._create();
      return;
    }

    this.virtual = false;

    Object.entries(sessionData).forEach(([ key, value ]) => {
      super.set(key, value);
    });
  }

  _create() {
    this.virtual = true;
  }

  async write() {
    await (() => new Promise((res) => setTimeout(res, 2000)))();

    if (!this.started) return;

    if (super.size < 1) {
      if (!this.virtual) await Storage.delete(this.id);

      return;
    }

    if (this.virtual) {
      while (await Storage.has(this.id = tokenGenerator(SESSION_ID_LENGTH)));
      this.virtual = false;
    }

    const sessionData = Object.fromEntries(super.entries());
    await Storage.set(this.id, sessionData);

    this._cookie.set('ssid', this.id, { httponly: true });
  }

  set(key, value) {
    if (!this.started) throw new Error('session is not started');
    return super.set(key, value);
  }

  get(key) {
    if (!this.started) throw new Error('session is not started');
    return super.get(key);
  }

  has(key) {
    if (!this.started) throw new Error('session is not started');
    return super.has(key);
  }

  delete(key) {
    if (!this.started) throw new Error('session is not started');
    return super.delete(key);
  }

  clear() {
    if (!this.started) throw new Error('session is not started');
    return super.clear();
  }

  entries() {
    if (!this.started) throw new Error('session is not started');
    return super.entries();
  }

  keys() {
    if (!this.started) throw new Error('session is not started');
    return super.keys();
  }

  values() {
    if (!this.started) throw new Error('session is not started');
    return super.values();
  }

  get size() {
    if (!this.started) throw new Error('session is not started');
    return super.size;
  }

  set size(value) {
    if (!this.started) throw new Error('session is not started');
    super.size = value;
  }
}

module.exports = { Session };
