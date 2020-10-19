module.exports = {
  'GET': async (client) => {
    await client.session.start();

    const result = {
      cookie: Object.fromEntries(client.cookie.entries()),
      session: Object.fromEntries(client.session.entries())
    }

    client.send.html('<pre>' + JSON.stringify(result, null, 2) + '</pre>');
  }
};
