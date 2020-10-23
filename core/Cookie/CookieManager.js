const { SlaveCookie } = require('./SlaveCookie');

class CookieManager {
  constructor(cookies) {
    this.storage = cookies;

    this.name = this.constructor.name;

    this.#claim();
  }

  set(key, value, options = {}) {
    options.expires ??= 'Mon, 01 Jan 2120 00:00:00 GMT';
    options.path ??= '/';

    const cookie = new SlaveCookie(this.name, key, value, options, true);

    this.storage.set(key, cookie);
  }

  get(key) {
    const cookie = this._getCookie(key);

    if (typeof cookie === 'undefined') return;

    return cookie.value;
  }

  has(key) {
    const cookie = this._getCookie(key);

    if (typeof cookie === 'undefined') return false;

    return true;
  }

  delete(key, options) {
    options.maxAge = 0;
    options.path ??= '/';

    const cookie = new SlaveCookie('deleted', key, 'deleted', options, true);

    this.storage.set(key, cookie);
  }

  clear() {
    this.storage.forEach((value, key) => this._delete(key));
  }

  entries() {
    const result = [];

    for (const [ , { owner, key, value } ] of this.storage) {
      if (owner === this.name) result.push([key, value]);
    }

    return result;
  }

  keys() {
    const result = [];

    for (const [ , { owner, key } ] of this.storage) {
      if (owner === this.name) result.push(key);
    }

    return result;
  }

  values() {
    const result = [];

    for (const [ , { owner, value } ] of this.storage) {
      if (owner === this.name) result.push(value);
    }

    return result;
  }

  forEach(handler) {
    for (const [ , { owner, key, value } ] of this.storage) {
      if (owner === this.name) handler(value, key, this);
    }
  }

  write() {
    this.storage.write();
  }

  _getCookie(key) {
    const cookie = this.storage.get(key);

    if (typeof cookie !== 'undefined' && cookie.owner === this.name) return cookie;
  }

  #claim() {
    this.storage.forEach((cookie) => {
      if (this._claim(cookie)) cookie.owner = this.name;
    });
  }

  _claim(cookie) {
    if (cookie.owner === '') return true;
    return false;
  }
}

module.exports = { CookieManager };
