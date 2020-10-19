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

  publish(message) {
    this.clients.forEach((client) => {
      client.send.json(message);
    });
    this.clients.clear();
  }
}

module.exports = { chat: new Chat() };
