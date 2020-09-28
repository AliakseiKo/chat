class Chat {
  constructor() {
    this.clients = new Set();

    setInterval(() => {
      console.log(this.clients.size,);
      // for (const client of this.clients.values()) {
      //   console.log(client.req.connection.remoteAddress);
      // }
    }, 2000);
  }

  subscribe(client) {
    this.clients.add(client);

    client.res.on('close', () => {
      this.clients.delete(client);
    });
  }

  publish(message) {
    this.clients.forEach((client) => {
      client.send(200, message);
    });
    this.clients.clear();
  }
}

module.exports = { Chat };
