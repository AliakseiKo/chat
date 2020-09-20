const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const config = require('./config');

const chat = require('./chat');

http.createServer((request, response) => {
  const reqUrl = url.parse(request.url, true);

  switch (reqUrl.pathname) {
    case '/':
      sendFileSafely('/chat.html', response);
      break;
    case '/subscribe':
      getRequestBody(request).then((result) => {
        try {
          const id = JSON.parse(result).id;
          chat.subscribe(response, id);
        } catch (error) {
          request.statusCode = 400;
          request.end();
        }
      });
      break;
    case '/publish':
      let body = '';

      request.on('readable', () => {

        if (body.length > 1e4) {
          response.statusCode = 413;
          response.end('Your message is too big for my little chat');
        } else {
          const buff = request.read();
          if (buff !== null) body += buff;
        }
      });

      request.on('end', () => {
        if (validateJSON(body)) {
          chat.publish(body);
          response.end();
        } else {
          response.statusCode = 400;
          response.end();
        }
      });
      break;
    default:
      if (request.method === 'GET') {
        if (checkAccess()) {
          sendFileSafely(reqUrl.pathname, response);
        }
      }
      break;
  }

}).listen(config.server.port, () => {
  console.log(`server has been started: http://127.0.0.1:${config.server.port}`);
});

function validateJSON(string) {
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
}

function checkAccess() {
  return true;
}

function sendFileSafely(filePath, response) {
  try {
    filePath = decodeURIComponent(filePath);
  } catch (error) {
    sendError(response, 400, http.STATUS_CODES[400]);
    return;
  }

  if (~filePath.indexOf('\0')) {
    sendError(response, 400, http.STATUS_CODES[400]);
    return;
  }

  const root = (path.extname(filePath) === '.html')
    ? config.server.views : config.server.public;

  filePath = path.join(root, filePath);


  if (filePath.indexOf(root) !== 0) {
    sendError(response, 404, 'no such file or directory');
    return;
  }

  const file = new fs.createReadStream(filePath);

  sendFile(file, response);
}

function sendFile(file, response) {
  file.pipe(response);

  file.on('open', () => {
    console.log(file.path);
    const mimeType = mime.getType(file.path);
    response.setHeader('Content-type', `${mimeType}; charser=${config.server.charset}`);
  });

  file.on('error', (error) => {
    if (error.code === 'ENOENT') {
      sendError(response, 404);
    } else {
      console.error(error);
      sendError(response, 500);
    }
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

async function getRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('readable', () => {
      const buffer = request.read();
      if (buffer !== null) body += buffer;
    });

    request.on('end', () => {
      resolve(body);
    });
  });
}
