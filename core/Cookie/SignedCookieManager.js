const crypto = require('crypto');

const config = require('../../config');
const { toBase64url } = require('../utils');

const { CookieManager } = require('./CookieManager');

class SignedCookieManager extends CookieManager {
  set(key, value, options) {
    const signature = toBase64url(crypto
      .createHmac('sha256', Buffer.from(config.sessionSignKey, 'hex'))
      .update(value, 'utf8')
      .digest('base64')
    );

    super.set(key, value + '.' + signature, options);
  }

  _claim(cookie) {
    const index = cookie.value.lastIndexOf('.');

    if (index === -1) return false;

    const value = cookie.value.slice(0, index);
    const signature = cookie.value.slice(index + 1);

    const _signature = toBase64url(crypto
      .createHmac('sha256', Buffer.from(config.sessionSignKey, 'hex'))
      .update(value, 'utf8')
      .digest('base64')
    );

    if (signature === _signature) return true;

    return false;
  }
}

module.exports = { SignedCookieManager };
