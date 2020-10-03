const fs = require('fs');
const path = require('path');
const mime = require('mime');
const http = require('http');
const EventEmitter = require('events');

const config = require('../config');

const { Cookie } = require('./Cookie');
const { Session } = require('./Session');

class Client extends EventEmitter {
  constructor(req, res) {
    super();

    this.req = req;
    this.res = res;
    this.params = null; // come from Router
    this.cookie = new Cookie(req, res);
    this.session = new Session(this.cookie);

    this.on('beforesend', () => {
      this.cookie.send();
      this.session.write();
    });
  }

  send(code, message, content) {
    this.emit('beforesend');

    this.res.statusCode = code;

    if (typeof message === 'string') this.res.statusMessage = message;

    if (content === undefined) {
      this.res.end();
    } else if (typeof content === 'string') {
      this.res.setHeader('Content-type', 'text/html; charset=utf-8');
      this.res.end(content);
    } else {
      this.res.setHeader('Content-type', 'application/json; charset=utf-8');
      this.res.end(JSON.stringify(content));
    }
  }

  sendError(code, message = http.STATUS_CODES[code]) {
    this.res.statusCode = code;

    this.sendFile(path.join(config.views, 'error.html'), () => {
      this.res.setHeader('Content-type', 'text/plain; charser=utf-8');
      this.res.end(message);
    });
  }

  sendFile(filePath, errorHandler) {
    this.emit('beforesend');

    filePath = path.resolve(filePath);
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
            this.sendError(404);
            break;
          default:
            console.error(error);
            this.sendError(500);
            break;
        }
      })
      .pipe(this.res)
      .on('close', () => file.destroy());
  }

  sendFileSafely(filePath) {
    if (filePath.includes('\0')) {
      this.sendError(400);
      return;
    }

    const publicRoot = config.public;

    filePath = path.join(publicRoot, filePath);

    if (!filePath.startsWith(publicRoot)) {
      this.sendError(404);
      return;
    }

    this.sendFile(filePath);
  }
}

module.exports = { Client };
