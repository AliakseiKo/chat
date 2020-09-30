const routes = require('../routes');

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

    let methods = this.simpleRoutes[client.pathname];

    if (!methods) {
      for (let i = 0; i < this.templateRoutes.length; ++i) {
        const result = client.pathname.match(new RegExp(this.templateRoutes[i].template));
        if (result) {
          client.params = new Map(Object.entries(result.groups));
          methods = this.templateRoutes[i].methods;
          break;
        }
      }
    }

    const handler = methods?.[client.req.method]
      ?? methods?.['*']
      ?? this.simpleRoutes?.['*']?.[client.req.method]
      ?? this.simpleRoutes?.['*']?.['*'];

    handler(client);
  }
}

module.exports = { Router };
