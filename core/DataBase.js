const { Pool } = require('pg');

const config = require('../config');

class DataBase {
  static pool = null;

  static async open() {
    if (self.pool === null) self.pool = new Pool(config.database);
  }

  static async close() {
    self.pool.end();
  }

  static async query(text, params) {
    return await self.pool.query(text, params);
  }
}

const self = DataBase;

module.exports = { DataBase };
