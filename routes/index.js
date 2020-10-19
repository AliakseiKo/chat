const path = require('path');

const config = require('../config');

const views = {
  '/': 'chat.html',
  '/registration': 'registration.html',
  '/login': 'login.html'
};

const routes = {
  '*': {
    'GET': (client) => {
      client.send.file(
        path.join(config.public, client.pathname),
        { root: config.public },
        (error) => {
          client.send.status(404);

          const ext = path.extname(client.pathname);

          switch (ext) {
            case '':
            case '.html':
              client.send.html('<h1>Error 404</h1>');
              break;
            default:
              client.send.end();
          }
        }
      );
    },
    '*': (client) => {
      client.send.status(404).end();
    }
  },
};

for (const [ key, value ] of Object.entries(views)) {
  routes[key] = {
    'GET': (client) => {
      client.send.file(path.join(config.views, value));
    }
  };
}

module.exports = routes;
