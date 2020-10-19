const { chat } = require('../chat');

module.exports = {
  'POST': async (client) => {
    const buffers = [];
    let bufferSize = 0;
    let body;

    try {
      for await (const chunk of client.req) {
        bufferSize += chunk.length;
        buffers.push(chunk);

        if (bufferSize > 1024) {
          client.send.status(413).message('Your message is too big');
          return;
        }
      }

      body = JSON.parse(Buffer.concat(buffers).toString());
    } catch (error) {
      client.send.status(400).end();
      return;
    }

    chat.publish(body);
    client.send.status(200).end();
  }
};
