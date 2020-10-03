const fs = require('fs');
const mime = require('mime');
const EventEmitter = require('events');

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
    this.res.statusCode = statusMessage;
    return this;
  }

  text(text) {
    this.res.setHeader('Content-type', 'text/plain; charset=utf-8');
    this.end(text);
  }

  html(html) {
    this.res.setHeader('Content-type', 'text/html; charset=utf-8');
    this.end(html);
  }

  json(json) {
    this.res.setHeader('Content-type', 'application/json; charset=utf-8');
    this.end(JSON.stringify(json));
  }

  file(filePath, { root } = {}, errorHandler = undefined) {
    this.emit('beforesend');

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
        const type = mime.getType(file.path);
        this.res.setHeader('Content-type', `${type}; charser=utf-8`);
      })
      .on('error', (error) => {
        if (errorHandler) {
          errorHandler(error);
          return;
        }

        switch (error.code) {
          case 'ENOENT':
          case 'EISDIR':
            this.status(404);
            break;
          default:
            console.error(error);
            this.status(500);
        }
        this.res.end();
      })
      .pipe(this.res)
      .on('close', () => file.destroy());
  }
}

module.exports = { Sender };
