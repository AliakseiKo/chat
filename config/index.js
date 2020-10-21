const path = require('path');

const {
  port = 1234
} = require('smargparser')(); // My library. You can replace with minimist.

module.exports = {
  server: {
    port
  },
  database: {},

  api: path.join(__dirname, '../api'),
  routes: path.join(__dirname, '../routes'),
  views: path.join(__dirname, '../views'),
  public: path.join(__dirname, '../client/public'),

  sessionStorage: path.join(__dirname, '../session_storage')
}
