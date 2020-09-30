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

      client.send(200, true, '<pre>' + JSON.stringify(result, null, 2) + '</pre>');
    }
  },

  '/chat': {
    'GET': (client) => {
      client.sendFile('./views/chat.html');
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
            client.send(413, 'Your message is too big for my little chat');
            return;
          }

          bufferSize += chunk.length;
          buffers.push(chunk);
        }

        body = JSON.parse(Buffer.concat(buffers).toString());
      } catch (error) {
        client.send(400);
        return;
      }

      chat.publish(body);
      client.send(200);
    }
  },

  '*': {
    'GET': (client) => {
      client.sendFileSafely(client.pathname);
    },
    '*': (client) => {
      client.send(404);
    }
  },
};
