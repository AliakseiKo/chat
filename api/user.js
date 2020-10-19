const { DataBase } = require('../core/DataBase');
const {
  nicknameRule,
  checkNickname
} = require('../validator');

module.exports = {
  'GET': async (client) => {
    const nickname = client.url.searchParams.get('nickname');

    if (nickname === null) {
      client.send.status(400).end();
      return;
    }

    if (!checkNickname(nickname)) {
      client.send.status(400).message(nicknameRule).end();
      return;
    }

    try {
      const result = await checkUserExistence(nickname);
      client.send.status(200).json(result);
    } catch (ex) {
      client.send.status(400).end();
      console.error(ex);
    }
  }
};

async function checkUserExistence(nickname) {
  return !!(await DataBase.query('SELECT id FROM users WHERE nickname = $1', [nickname])).rowCount;
}
