const { Sender } = require('./Sender');
const { Cookie } = require('./Cookie');
const { Session } = require('./Session');

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.params = null; // come from Router

    this.send = new Sender(req, res);
    this.cookie = new Cookie(req, res);
    this.session = new Session(this.cookie);

    this.send.on('beforesend', () => {
      this.cookie.send();
      this.session.write();
    });
  }

  async getBody() {
    const buffer = [];
    let bufferSize = 0;

    for await (let chunk of this.req) {
      bufferSize += chunk.length;
      buffer.push(chunk);
    }

    return Buffer.concat(buffer);
  }
}

module.exports = { Client };
