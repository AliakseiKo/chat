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
    const messageJSON = JSON.stringify({ message });

    this.clients.forEach((client) => {
      client.res.writeHead(200, { 'Content-type': 'application/json' });
      client.res.end(messageJSON);
    });

    this.clients.clear();
  }
}

module.exports = { Chat };
