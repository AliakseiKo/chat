class Cookie {
  constructor(key, value, options = {}) {
    let { expires, maxAge, domain, path, secure, httpOnly, sameSite } = options;

    this.key = key;
    this.value = value;
    this.expires = expires;
    this.maxAge = maxAge;
    this.domain = domain;
    this.path = path;
    this.secure = secure;
    this.httpOnly = httpOnly;
    this.sameSite = sameSite;
  }

  toString() {
    let cookie = this.key + '=' + this.value;

    let expires = this.expires;

    if (typeof expires === 'number') expires = new Date(expires);
    if (expires instanceof Date) expires = expires.toUTCString();

    if (typeof expires !== 'undefined') cookie += '; Expires=' + expires;
    if (typeof this.maxAge !== 'undefined') cookie += '; Max-Age=' + this.maxAge;
    if (typeof this.domain !== 'undefined') cookie += '; Domain=' + this.domain;
    if (typeof this.path !== 'undefined') cookie += '; Path=' + this.path;
    if (this.secure === true) cookie += '; Secure';
    if (this.httpOnly === true) cookie += '; HttpOnly';
    if (typeof this.sameSite !== 'undefined') cookie += '; SameSite=' + samesite;

    return cookie;
  }
}

module.exports = { Cookie };
