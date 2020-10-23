const { Cookie } = require('./Cookie');

class SlaveCookie extends Cookie {
  constructor(owner, key, value, options = {}, send = false) {
    super(key, value, options);

    this.owner = owner;

    this.send = send;
  }
}

module.exports = { SlaveCookie };
