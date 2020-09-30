const COOKIE_EXPIRES = "Mon, 01 Jan 2120 00:00:00 GMT";
const COOKIE_DELETE = "=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0";

class Cookie extends Map {
  constructor(req, res) {
    super();

    this._req = req;
    this._res = res;

    this._prepared = [];

    this._parse();
  }

  set(key, value, { expires = COOKIE_EXPIRES, maxAge, domain, path = '/', secure, httponly, samesite } = {}) {
    let cookie = key + '=' + value;

    if (typeof expires === 'number') expires = new Date(expires);
    if (expires instanceof Date) expires = expires.toUTCString();

    if (expires) cookie += '; Expires=' + expires;
    if (typeof maxAge === 'number') cookie += '; Max-Age=' + maxAge;
    if (domain) cookie += '; Domain=' + domain;
    if (path) cookie += '; Path=' + path;
    if (secure) cookie += '; Secure';
    if (httponly) cookie += '; HttpOnly';
    if (samesite) cookie += '; SameSite=' + samesite;

    this._prepared.push(cookie);
    super.set(key, value);
  }

  delete(key) {
    this._prepared.push(key + COOKIE_DELETE);
    super.delete(key);
  }

  clear() {
    Array.from(super.keys()).forEach((key) => this.delete(key));
  }

  send() {
    if (!this._prepared.length) return;

    this._res.setHeader('Set-Cookie', this._prepared);
    this._prepared = [];
  }

  _parse() {
    const cookie = this._req.headers.cookie;
    if (!cookie) return;

    cookie.split(';').forEach((cookie) => {
      const [ key, value = '' ] = cookie.split('=');
      super.set(key.trim(), value.trim());
    });
  }
}

module.exports = { Cookie };
