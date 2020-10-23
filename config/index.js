const crypto = require('crypto');

const path = require('path');

const {
  port = 1234
} = require('smargparser')(); // My library. You can replace with minimist.

module.exports = {
  server: {
    port
  },

  database: {
    host: '127.0.0.1',
    port: '5432',
    database: 'chat',
    user: 'chat',
    password: '12345'
  },

  api: path.join(__dirname, '../api'),
  routes: path.join(__dirname, '../routes'),
  views: path.join(__dirname, '../views'),
  public: path.join(__dirname, '../client/public'),

  sessionStoragePath: path.join(__dirname, '../session_storage'),

  // Для подписи я использую HMAC, sha256 у которого входной блок 512 бит, так что ключ 512 битный :)
  sessionSignKey: '1b0c7557ff9a9d9386386cb2ace34ceab9b73eaac94a612c7efb14fbe8a524753eaf8f7db635addd3e2dde8f831314cd5d12261126959d2f4198ae6330827517'
}
