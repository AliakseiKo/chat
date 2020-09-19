const config = require('./config');

const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-type', 'text/plain');
  res.end('Hello World!');
});

// server.on('request', (req, res) => {
//   console.log(req.url, req.headers);
//   res.setHeader
//   res.end('Hello world!');
// });

server.listen(config.server.port, () => {
  console.log(`server has been started: http://127.0.0.1:${config.server.port}`);
});
