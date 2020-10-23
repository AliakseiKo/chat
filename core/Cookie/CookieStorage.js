const { SlaveCookie } = require('./SlaveCookie');

class CookieStorage extends Map {
  constructor(req, res) {
    super();

    this._req = req;
    this._res = res;

    this.#parse();
  }

  write() {
    if (super.size < 1) return;

    const cookies = [];

    super.forEach((cookie) => {
      if (!cookie.send) return;

      cookies.push(cookie.toString());

      cookie.send = false;
    });

    this._res.setHeader('Set-Cookie', cookies);
  }

  #parse() {
    const cookies = this._req.headers.cookie;
    if (typeof cookies !== 'string') return;

    cookies.split('; ').forEach((rawCookie) => {
      let [ key, value ] = rawCookie.split('=');

      const cookie = new SlaveCookie('', key, value);

      super.set(key, cookie);
    });
  }
}

module.exports = { CookieStorage };
