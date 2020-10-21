const fs = require('fs/promises');
const path = require('path');

const config = require('../../config');

const ROOT = config.sessionStorage;

class FileStorage {
  static async set(key, value) {
    const filePath = path.join(ROOT, key);
    if (!filePath.startsWith(ROOT) || filePath.includes('\0')) return;

    await fs.writeFile(filePath, JSON.stringify(value));
  }

  static async get(key) {
    const filePath = path.join(ROOT, key);
    if (!filePath.startsWith(ROOT) || filePath.includes('\0')) return;

    try {
      const file = await fs.readFile(filePath, { encoding: 'utf-8' });
      return JSON.parse(file);
    } catch (ex) {
      if (ex.code !== 'ENOENT') console.error(ex);
      return undefined;
    }
  }

  static async has(key) {
    const filePath = path.join(ROOT, key);
    if (!filePath.startsWith(ROOT) || filePath.includes('\0')) return;

    try {
      await fs.stat(filePath);
      return true;
    } catch (ex) {
      return false;
    }
  }

  static async delete(key) {
    const filePath = path.join(ROOT, key);
    if (!filePath.startsWith(ROOT) || filePath.includes('\0')) return;

    try {
      await fs.unlink(filePath);
    } catch (ex) {
      if (ex.code !== 'ENOENT') console.error(ex);
    }
  }
}

module.exports = { FileStorage };
