const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const config = require('./config');

const chat = require('./chat');

http.createServer((request, response) => {
  const requestUrl = url.parse(request.url, true);

  switch (requestUrl.pathname) {
    case '/':
      sendFileSafely('/chat.html', response);
      break;
    case '/subscribe':
      getReqBody(request).then((result) => {
        try {
          const { id } = JSON.parse(result);
          chat.subscribe(response, id);
        } catch (error) {
          response.statusCode = 400;
          response.end();
        }
      });
      break;
    case '/publish':
      const buffers = new Buffers();

      request.on('data', (chunk) => {
        if (buffers.length > 1e4) {
          response.statusCode = 413;
          response.end('Your message is too big for my little chat');
        } else {
          buffers.push(chunk);
        }
      }).on('end', () => {
        const body = buffers.concat().toString();
        const { message } = JSON.parse(body);
        try {
          chat.publish(message);
        } catch(error) {
          response.statusCode = 400;
          response.end();
        }
      });
    // let body = '';

      // request.on('readable', () => {
      //   if (body.length > 1e4) {
      //     response.statusCode = 413;
      //     response.end('Your message is too big for my little chat');
      //   } else {
      //     const buff = request.read();
      //     if (buff !== null) body += buff;
      //   }
      //   console.log(body);
      // }).on('end', () => {
      //   if (validateJSON(body)) {
      //     chat.publish(body);
      //     response.end();
      //   } else {
      //     response.statusCode = 400;
      //     response.end();
      //   }
      // });
      break;
    default:
      if (request.method === 'GET') {
        if (checkAccess()) {
          sendFileSafely(requestUrl.pathname, response);
        }
      }
      break;
  }

}).listen(config.server.port, () => {
  console.log(`server has been started: http://127.0.0.1:${config.server.port}`);
});

function checkAccess() {
  return true;
}

function sendFileSafely(filePath, response) {
  try {
    filePath = decodeURIComponent(filePath);
  } catch (error) {
    sendError(response, 400);
    return;
  }

  if (~filePath.indexOf('\0')) {
    sendError(response, 400);
    return;
  }

  const root = (path.extname(filePath) === '.html')
    ? config.server.views : config.server.public;

  filePath = path.join(root, filePath);

  if (filePath.indexOf(root) !== 0) {
    sendError(response, 404);
    return;
  }

  const file = new fs.createReadStream(filePath);
  sendFile(file, response);
}

function sendFile(file, response) {
  file.pipe(response);

  file.on('error', (error) => {
    if (error.code === 'ENOENT') {
      sendError(response, 404);
    } else {
      console.error(error);
      sendError(response, 500);
    }
  }).on('open', () => {
    const mimeType = mime.getType(file.path);
    response.setHeader('Content-type', `${mimeType}; charser=${config.server.charset}`);
  });

  response.on('close', () => {
    file.destroy();
  });
}

function sendError(response, code) {
  const file = fs.createReadStream(path.join(__dirname, './views/error.html'));
  response.statusCode = code;
  sendFile(file, response);
}

async function getReqBody(request, charset = config.server.charset) {
  return new Promise((resolve, reject) => {
    const buffers = new Buffers();

    request.on('error', (error) => {
      console.error(error);
      reject(error);
    }).on('data', (chunk) => {
      buffers.push(chunk);
    }).on('end', () => {
      resolve(buffers.concat().toString(charset));
    });
  });
}

class Buffers {
  constructor () {
    this.buffers = [];
    this.length = 0;
  }

  push(buffer) {
    this.buffers.push(buffer);
    this.length += buffer.length;
  }

  concat() {
    return Buffer.concat(this.buffers);
  }
}
