const { CookieStorage } = require('./CookieStorage');
const { CookieManager } = require('./CookieManager');
const { SignedCookieManager } = require('./SignedCookieManager');

class AdvancedCookie extends CookieManager {
  constructor(req, res) {
    const cookies = new CookieStorage(req, res);

    super(cookies);

    this.signed = new SignedCookieManager(cookies);
  }
}

module.exports = { AdvancedCookie };
