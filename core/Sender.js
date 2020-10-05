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
        this.res.setHeader('Content-type', `${type}; charser=utf-8`);
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
