const fs = require('fs');
const path = require('path');
const mime = require('mime');
const http = require('http');

const config = require('./config');

const { Cookie } = require('./Cookie');
const { Session } = require('inspector');

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.params = null; // come from Router
    this.cookie = new Cookie(req, res);
  }

  send(code, message, content) {
    this.res.statusCode = code;

    if (typeof message === 'string') this.res.statusMessage = message;

    if (content === undefined) {
      this.res.end();
    } else if (typeof content === 'string') {
      this.res.setHeader('Content-type', 'text/html; charset=utf-8');
      this.res.end(message);
    } else {
      this.res.setHeader('Content-type', 'application/json; charset=utf-8');
      this.res.end(JSON.stringify(message));
    }
  }

  sendError(code, message = http.STATUS_CODES[code]) {
    this.res.statusCode = code;

    this.sendFile('./views/error.html', () => {
      this.res.setHeader('Content-type', 'text/plain; charser=utf-8');
      this.res.end(message);
    });
  }

  sendFile(filePath, errorHandler) {
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

    const root = config.server.public;

    filePath = path.join(root, filePath);

    if (!filePath.startsWith(root)) {
      this.sendError(404);
      return;
    }

    this.sendFile(filePath);
  }
}

module.exports = { Client };
