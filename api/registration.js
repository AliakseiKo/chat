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
      if (typeof nickname !== 'string' || typeof password !== 'string') {
        client.send.status(400).end();
        return;
      }

      if (!checkNickname(nickname)) {
        client.send.status(400).message(nicknameRule).end();
        return;
      }

      if (!checkPassword(password)) {
        client.send.status(400).message(passwordRule).end();
        return;
      }

      const result = await DataBase.query(
        'INSERT INTO users (nickname, password) VALUES ($1, $2) RETURNING id',
        [ nickname, password ]
      );

      const id = result.rows[0].id;

      await client.session.start();

      client.session.set('id', id);
      client.session.set('nickname', nickname);

      client.cookie.set('nickname', nickname);

      client.send.status(200).message('Account has been created').end();
    } catch (ex) {
      if (ex.message.startsWith('duplicate')) {
        client.send.status(400).message('A user with the same name already exists').end();
        return;
      }

      client.send.status(500).end();
    }
  }
};
