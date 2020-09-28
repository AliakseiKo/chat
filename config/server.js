const path = require('path');
const {
  port = 1234
} = require('smargparser')();

module.exports = {
  port,
  public: path.resolve('./public'),
  views: path.resolve('./views'),
  routes: path.resolve('./routes'),
  charset: 'utf-8'
};
