class Cookie extends Map {
  constructor(req, res) {
    super();

    this._req = req;
    this._res = res;

    this._prepared = new Set();

    this._parse();
  }

  set(key, value, {
    expires = 'Mon, 01 Jan 2120 00:00:00 GMT',
    maxAge,
    domain,
    path = '/',
    secure,
    httponly,
    samesite
  } = {}) {
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

    this._prepared.add(cookie);
    super.set(key, value);
  }

  delete(key, path = '/') {
    let cookie = key + '=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0';
    if (path) cookie += '; Path=' + path;

    this._prepared.add(cookie);
    super.delete(key);
  }

  clear() {
    super.forEach((value, key) => this.delete(key));
  }

  send() {
    if (this._prepared.length < 1) return;

    this._res.setHeader('Set-Cookie', [ ...this._prepared ]);
    this._prepared.clear();
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
