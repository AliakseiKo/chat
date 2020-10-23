const fs = require('fs');
const { EventEmitter } = require('./utils');
const mime = require('mime');

class Sender extends EventEmitter {
  constructor (res) {
    super();

    this._res = res;
  }

  async end(body) {
    await this.emit('beforesend');
    this._res.end(body);
  }

  status(statusCode) {
    this._res.statusCode = statusCode;
    return this;
  }

  message(statusMessage) {
    this._res.statusMessage = statusMessage;
    return this;
  }

  text(text) {
    this._res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    this.end(text);
  }

  html(html) {
    this._res.setHeader('Content-Type', 'text/html;charset=utf-8');
    this.end(html);
  }

  json(json) {
    this._res.setHeader('Content-Type', 'application/json;charset=utf-8');
    if (typeof json !== 'string') json = JSON.stringify(json);
    this.end(json);
  }

  redirect(status, location) {
    this._res.setHeader('Location', location);
    if (status > 399 || status < 300) throw new Error('status code must be in the range 300-399');
    this.status(status).end();
  }

  async file(filePath, { root } = {}, errorHandler = undefined) {

    if (filePath.includes('\0')) {
      this.status(400);
      this._res.end();
      return;
    }

    if (root && !filePath.startsWith(root)) {
      this.status(403);
      this._res.end();
      return;
    }

    const file = fs.createReadStream(filePath);

    file.on('open', async () => {
      await this.emit('beforesend');

      const type = mime.getType(file.path);
      this._res.setHeader('Content-Type', `${type};charset=utf-8`);

      file.pipe(this._res).on('close', () => file.destroy());
    }).on('error', (error) => {
      let code = 500;

      switch (error.code) {
        case 'ENOENT':
        case 'EISDIR':
          code = 404;
          break;
        default:
          console.error(error);
      }

      if (errorHandler) errorHandler(error);
      else this.status(code).end();
    });
  }
}

module.exports = { Sender };
