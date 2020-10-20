const path = require('path');

const config = require('../config');

const routes = {
  '/': {
    'GET': async (client) => {
      await client.session.start();

      if (client.session.has('id')) {
        client.send.file(path.join(config.views, 'chat.html'));
      } else {
        client.send.redirect(307, '/login');
      }
    }
  },

  '/registration': {
    'GET': async (client) => {
      await client.session.start();

      if (client.session.has('id')) {
        client.send.redirect(307, '/');
      } else {
        client.send.file(path.join(config.views, 'registration.html'));
      }
    }
  },

  '/login': {
    'GET': async (client) => {
      await client.session.start();

      if (client.session.has('id')) {
        client.send.redirect(307, '/');
      } else {
        client.send.file(path.join(config.views, 'login.html'));
      }
    }
  },

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

module.exports = routes;
