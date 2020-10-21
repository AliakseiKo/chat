const { FileStorage: Storage } = require('./FileStorage');

const { tokenGenerator } = require('../utils');

const SESSION_ID_LENGTH = 64;

class Session extends Map {
  constructor(cookie) {
    super();

    this._cookie = cookie;

    this.id = this._cookie.get('ssid');
    this.started = false;
  }

  async start() {
    if (this.started) return;

    this.started = true;

    if (this.id) {
      await this._restore();
    } else {
      await this._create();
    }
  }

  async destroy() {
    if (!this.started) return;

    this._cookie.delete('ssid');

    await Storage.delete(this.id);
  }

  async _restore() {
    const sessionData = await Storage.get(this.id);

    if (typeof sessionData === 'undefined') {
      await Storage.delete(this.id);
      await this._create();
      return;
    }

    Object.entries(sessionData).forEach(([ key, value ]) => {
      super.set(key, value);
    });
  }

  async _create() {
    while (await Storage.has(this.id = tokenGenerator(SESSION_ID_LENGTH)));
    await Storage.set(this.id, {});
    this._cookie.set('ssid', this.id, { httponly: true });
  }

  async write() {
    if (!this.started) return;

    const sessionData = Object.fromEntries(super.entries());
    await Storage.set(this.id, sessionData);
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
