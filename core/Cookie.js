class Cookie extends Map {
  constructor(req, res) {
    super();

    this._req = req;
    this._res = res;

    this.buffer = new Map();

    this._parse();
  }

  set(key, value, {
    expires = 'Mon, 01 Jan 2120 00:00:00 GMT',
    maxAge,
    domain,
    path,
    secure,
    httpOnly,
    sameSite
  } = {}) {
    let cookie = key + '=' + value;

    if (typeof expires === 'number') expires = new Date(expires);
    if (expires instanceof Date) expires = expires.toUTCString();

    if (typeof expires !== 'undefined') cookie += '; Expires=' + expires;
    if (typeof maxAge !== 'undefined') cookie += '; Max-Age=' + maxAge;
    if (typeof domain !== 'undefined') cookie += '; Domain=' + domain;
    if (typeof path !== 'undefined') cookie += '; Path=' + path;
    if (secure === true) cookie += '; Secure';
    if (httpOnly === true) cookie += '; HttpOnly';
    if (typeof sameSite !== 'undefined') cookie += '; SameSite=' + sameSite;

    this.buffer.set(key, cookie);
    super.set(key, value);
  }

  delete(key, { domain, path } = {}) {
    let cookie = key + '=deleted; Max-Age=0';

    if (typeof domain !== 'undefined') cookie += '; Domain=' + domain;
    if (typeof path !== 'undefined') cookie += '; Path=' + path;

    this.buffer.set(key, cookie);
    super.delete(key);
  }

  clear() {
    super.forEach((value, key) => this.delete(key));
  }

  write() {
    if (this.buffer.size < 1) return;

    this._res.setHeader('Set-Cookie', [ ...this.buffer.values() ]);
    this.buffer.clear();
  }

  _parse() {
    const cookie = this._req.headers.cookie;
    if (!cookie) return;

    cookie.split('; ').forEach((cookie) => {
      let [ key, value ] = cookie.split('=');

      super.set(key, value);
    });
  }
}

module.exports = { Cookie };
