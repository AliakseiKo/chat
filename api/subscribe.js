const { chat } = require('../chat');

module.exports = {
  'GET': async (client) => {
    await client.session.start();

    if (client.session.has('id')) {
      chat.subscribe(client);
    } else {
      client.send.status(401).end();
    }
  }
};
