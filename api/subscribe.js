const { chat } = require('../chat');

module.exports = {
  'GET': (client) => {
    chat.subscribe(client);
  }
};
