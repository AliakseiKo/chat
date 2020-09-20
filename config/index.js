const path = require('path');

module.exports = {
  server: {
    port: 1337,
    public: path.resolve('./public'),
    views: path.resolve('./views'),
    charset: 'utf-8'
  }
};
