const http = require('http');

const config = require('./config');

const { Client } = require('./Client');
const { Router } = require('./Router');

const router = new Router();

http.createServer((req, res) => {
  const client = new Client(req, res);
  router.route(client);
}).listen(config.server.port, () => {
  console.log(`Server is running: http://127.0.0.1:${config.server.port}`);
});
