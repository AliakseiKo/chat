const api = {
  '/user/exist': require('./user'),

  '/registration': require('./registration'),

  '/subscribe': require('./subscribe'),

  '/publish': require('./publish'),

  '/test': require('./test'),
};

const routes = {};

for (const [ key, value ] of Object.entries(api)) {
  routes[`/api${key}`] = value;
}

module.exports = routes;
