class Chat {
  constructor() {
    this.clients = new Set();
  }

  subscribe(client) {
    this.clients.add(client);

    client.res.on('close', () => {
      this.clients.delete(client);
    });
  }

  async publish(text, date, nickname, id) {
    let cache;
    const data = JSON.stringify({ text, date, nickname });

    for (const client of this.clients) {
      await client.session.start();

      if (client.session.get('id') === id) {
        cache = client;
      } else {
        client.send.json(data);
      }
    }

    this.clients.clear();

    this.clients.add(cache);
  }
}

module.exports = { chat: new Chat() };
