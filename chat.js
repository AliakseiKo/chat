const clients = new Map();

function subscribe(res, id) {
  clients.set(res, id);
  // console.log(id);

  res.on('close', () => {
    clients.delete(res);
  });
}

function publish(message) {
  clients.forEach((id, res) => {
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify({ message }));
    // console.log(`message: ${message} has been sent to ${id}`);
  });

  clients.clear();
}

// setInterval(() => {
//   console.log(clients.size, Array.from(clients.values()));
// }, 2000);

module.exports = { subscribe, publish };
