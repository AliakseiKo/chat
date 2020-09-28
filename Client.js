const fs = require('fs');
const path = require('path');
const mime = require('mime');
const http = require('http');

const config = require('./config');

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  send(code, message = http.STATUS_CODES[code]) {
    this.res.statusCode = code;

    if (message === false) {
      this.res.end();
    } else if (typeof message === 'string') {
      this.res.setHeader('Content-type', 'text/plain; charset=utf-8');
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
    file.pipe(this.res);

    file.on('open', () => {
      const mimeType = mime.getType(file.path);
      this.res.setHeader('Content-type', `${mimeType}; charser=utf-8`);
    }).on('error', (error) => {
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
    });

    this.res.on('close', () => {
      file.destroy();
    });
  }

  sendFileSafely(filePath) {
    if (~filePath.indexOf('\0')) {
      this.sendError(400);
      return;
    }

    const root = config.server.public;

    filePath = path.join(root, filePath);

    if (filePath.indexOf(root) !== 0) {
      this.sendError(404);
      return;
    }

    this.sendFile(filePath);
  }
}

module.exports = { Client };
