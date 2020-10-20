const fs = require('fs');
const EventEmitter = require('events');
const mime = require('mime');

class Sender extends EventEmitter {
  constructor (req, res) {
    super();

    this.req = req;
    this.res = res;
  }

  end(body) {
    this.emit('beforesend');
    this.res.end(body);
  }

  status(statusCode) {
    this.res.statusCode = statusCode;
    return this;
  }

  message(statusMessage) {
    this.res.statusMessage = statusMessage;
    return this;
  }

  text(text) {
    this.res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    this.end(text);
  }

  html(html) {
    this.res.setHeader('Content-Type', 'text/html;charset=utf-8');
    this.end(html);
  }

  json(json) {
    this.res.setHeader('Content-Type', 'application/json;charset=utf-8');
    if (typeof json !== 'string') json = JSON.stringify(json);
    this.end(json);
  }

  redirect(status, location) {
    this.res.setHeader('Location', location);
    if (status > 399 || status < 300) throw new Error('status code must be in the range 300-399');
    this.status(status).end();
  }

  file(filePath, { root } = {}, errorHandler = undefined) {

    if (filePath.includes('\0')) {
      this.status(400);
      this.res.end();
      return;
    }

    if (root && !filePath.startsWith(root)) {
      this.status(403);
      this.res.end();
      return;
    }

    const file = fs.createReadStream(filePath);

    file
      .on('open', () => {
        this.emit('beforesend');

        const type = mime.getType(file.path);
        this.res.setHeader('Content-Type', `${type};charset=utf-8`);
      })
      .on('error', (error) => {
        let code = 404;

        switch (error.code) {
          case 'ENOENT':
          case 'EISDIR':
            code = 404;
            break;
          default:
            console.error(error).end();

            code = 500;
        }

        if (errorHandler) errorHandler(error);
        else this.status(code).end();
      })
      .pipe(this.res)
      .on('close', () => file.destroy());
  }
}

module.exports = { Sender };
