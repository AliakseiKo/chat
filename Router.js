const routes = require('./routes');

class Router {
  constructor() {
    this.simpleRoutes = {};
    this.templateRoutes = [];

    for (const [ route, methods ] of Object.entries(routes)) {
      if (~route.indexOf(':')) {
        const template = '^' + route.replace(/:([^/]+)/g, '(?<$1>[^/?#]+)') + '$';
        this.templateRoutes.push({ template, methods });
      } else {
        this.simpleRoutes[route] = methods;
      }
    }
  }

  route(client) {
    client.url = new URL(client.req.url, `http://${client.req.headers.host}`);
    client.pathname = decodeURI(client.url.pathname);

    let methods;

    if (!(methods = this.simpleRoutes[client.pathname])) {
      methods = this.simpleRoutes['*'];

      for (let i = 0; i < this.templateRoutes.length; ++i) {
        const result = client.pathname.match(new RegExp(this.templateRoutes[i].template));
        if (result !== null) {
          client.params = Object.assign({}, result.groups);
          methods = this.templateRoutes[i].methods;
          break;
        }
      }
    }

    (methods[client.req.method] ?? methods['*'])(client);
  }

  // route(client) {
  //   client.url = new URL(client.req.url, `http://${client.req.headers.host}`);
  //   client.pathname = decodeURI(client.url.pathname);
  //   const handler = routes[client.pathname]?.[client.req.method]
  //     ?? routes[client.pathname]?.['*']
  //     ?? routes['*'][client.req.method]
  //     ?? routes['*']['*'];

  //   handler(client);
  // }
}

module.exports = { Router };
