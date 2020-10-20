const { chat } = require('../chat');

module.exports = {
  'POST': async (client) => {
    await client.session.start();

    const id = client.session.get('id');
    const nickname = client.session.get('nickname');

    if (!id) {
      client.send.status(401).end();
      return;
    }

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

    const date = new Date().toISOString();
    chat.publish(body.text, date, nickname, id);

    if (body.text === 'error') client.send.status(400);

    client.send.json({ date });
  }
};
