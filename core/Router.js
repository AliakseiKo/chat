class Router {
  constructor(...routeArray) {
    this.routes = new Map();
    this.regexpRoutes = new Map();

    routeArray.forEach((routes) => {
      for (const [ route, methods ] of Object.entries(routes)) {
        if (route.includes(':')) {
          this.addTemplate(route, methods);
        } else {
          this.add(route, methods);
        }
      }
    });
  }

  route(client) {
    client.url = new URL(client.req.url, `http://${client.req.headers.host}`);
    client.pathname = decodeURI(client.url.pathname);

    let methods = this.routes.get(client.pathname);

    if (!methods) {
      for (let [ regexp, _methods ] of this.regexpRoutes) {
        const result = client.pathname.match(regexp);
        if (result !== null) {
          client.params = new Map(Object.entries(result.groups));
          methods = _methods;
          break;
        }
      }
    }

    const defaultRoute = this.routes.get('*');

    const handler = methods?.[client.req.method]
      ?? methods?.['*']
      ?? defaultRoute?.[client.req.method]
      ?? defaultRoute['*'];

    handler(client);
  }

  add(uri, methods) {
    this.routes.set(uri, methods);
  }

  addTemplate(template, methods) {
    const regexp = new RegExp(`^${template.replace(/:([^/]+)/g, '(?<$1>[^/]+)')}$`);
    this.regexpRoutes.set(regexp, methods);
  }

  addRegexp(regexp, methods) {
    this.regexpRoutes.set(regexp, methods);
  }
}

module.exports = { Router };
