module.exports = {
  'GET': async (client) => {
    await client.session.start();

    await client.session.destroy();

    client.send.status(200).end();
  }
};
