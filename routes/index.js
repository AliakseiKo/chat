const path = require('path');

const config = require('../config');
const { Chat } = require('../chat');

const chat = new Chat();

module.exports = {
  '/test': {
    'GET': async (client) => {
      // client.cookie.set('name', 'Aliaksei');
      // client.cookie.set('age', 22);
      // client.cookie.clear();

      // client.cookie.set('password', '12345');

      // await client.session.start();
      // client.session.set('name', 'asd');

      const result = {
        cookie: Object.fromEntries(client.cookie.entries()),
        // session: Object.fromEntries(client.session.entries())
      }

      client.send.html('<pre>' + JSON.stringify(result, null, 2) + '</pre>');
    }
  },

  '/chat': {
    'GET': (client) => {
      client.send.file(path.join(__dirname, '../views/chat.html'));
    }
  },

  '/api/subscribe': {
    'GET': (client) => {
      chat.subscribe(client);
    }
  },

  '/api/publish': {
    'POST': async (client) => {
      const buffers = [];
      let bufferSize = 0;
      let body;

      try {
        for await (const chunk of client.req) {
          if (bufferSize > 1024) {
            client.send.status(413).message('Your message is too big for my little chat');
            return;
          }

          bufferSize += chunk.length;
          buffers.push(chunk);
        }

        body = JSON.parse(Buffer.concat(buffers).toString());
      } catch (error) {
        client.send.status(400).end();
        return;
      }

      chat.publish(body);
      client.send.status(200).end();
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
              client.send.file(path.join(config.views, 'error.html'));
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
