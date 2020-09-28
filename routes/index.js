const { Chat } = require('../chat');

const chat = new Chat();

module.exports = {
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
          if (bufferSize > 1e4) {
            client.send(413, 'Your message is too big for my little chat');
          }

          bufferSize += chunk.length;
          buffers.push(chunk);
        }

        body = JSON.parse(Buffer.concat(buffers).toString());
      } catch (error) {
        client.send(400, false);
      }

      chat.publish(body);
      client.send(200, false);
    }
  },

  '*': {
    'GET': (client) => {
      client.sendFileSafely(client.pathname);
    },
    '*': (client) => {
      client.send(404, false);
    }
  },
};
