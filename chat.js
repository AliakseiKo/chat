const clients = new Map();

function subscribe(response, id) {
  clients.set(response, id);
  console.log(id);

  response.on('close', () => {
    clients.delete(response);
  });
}

function publish(message) {
  clients.forEach((id, response) => {
    response.setHeader('Content-type', 'application/json');
    response.end(message);
    console.log(`message: ${message} has been sent to ${id}`);
  });

  clients.clear();
}

setInterval(() => {
  console.log(clients.size, Array.from(clients.values()));
}, 2000);

module.exports = { subscribe, publish };
