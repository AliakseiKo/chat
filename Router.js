const routes = require('./routes');

class Router {
  constructor() {

  }

  route(client) {
    client.url = new URL(client.req.url, `http://${client.req.headers.host}`);
    client.pathname = decodeURI(client.url.pathname);
    const handler = routes[client.pathname]?.[client.req.method]
      ?? routes[client.pathname]?.['*']
      ?? routes['*'][client.req.method]
      ?? routes['*']['*'];

    handler(client);
  }
}

module.exports = { Router };
