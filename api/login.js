const { DataBase } = require('../core/DataBase');
const {
  nicknameRule,
  checkNickname,
  passwordRule,
  checkPassword
} = require('../validator');

module.exports = {
  'POST': async (client) => {
    try {
      const { nickname, password } = JSON.parse((await client.getBody()).toString());

      if (!checkNickname(nickname)) {
        client.send.status(400).message(nicknameRule).end();
        return;
      }

      if (!checkPassword(password)) {
        client.send.status(400).message(passwordRule).end();
        return;
      }

      const result = await DataBase.query(
        'SELECT id, nickname FROM users WHERE nickname = $1 AND password = $2',
        [nickname, password]
      );

      if (result.rowCount === 1) {
        await client.session.start();

        client.session.set('id', result.rows[0].id);
        client.session.set('nickname', result.rows[0].nickname);

        client.cookie.set('nickname', result.rows[0].nickname);

        client.send.status(200).message('You have seccessfully logged in').end();
      } else {
        client.send.status(400).message('Invalid nickname or password').end();
      }

    } catch (ex) {
      client.send.status(500).end();
      console.error(ex);
    }
  }
};
