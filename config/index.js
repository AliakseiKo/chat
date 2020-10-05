const path = require('path');

const {
  port = 1234
} = require('smargparser')(); // My library. You can replace with minimist.

module.exports = {
  server: {
    port
  },
  database: {},

  routes: path.join(__dirname, '../routes'),
  views: path.join(__dirname, '../views'),
  public: path.join(__dirname, '../client/public')
}
