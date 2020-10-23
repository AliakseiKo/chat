const { Sender } = require('./Sender');
const { AdvancedCookie, SimpleCookie } = require('./Cookie');
const { Session } = require('./Session');

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.params = null; // come from Router

    this.send = new Sender(req, res);
    this.cookie = new AdvancedCookie(req, res);
    this.session = new Session(this.cookie);

    this.send.on('beforesend', async () => {
      await this.session.write();
      this.cookie.write();
    });
  }

  async getBody() {
    const buffer = [];

    for await (let chunk of this.req) {
      buffer.push(chunk);
    }

    return Buffer.concat(buffer);
  }
}

module.exports = { Client };
