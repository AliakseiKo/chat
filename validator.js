const nicknameRule = 'Username must be at least 3 letters long, and starts with a letter. It can contain numbers and underscore character _';
function checkNickname(nickname) {
  return /^[a-zA-Zа-яА-Я][a-zA-Zа-яА-Я0-9]{2,}$/u.test(nickname);
}

const passwordRule = 'Password length must not be less than 5 characters and contains at least one special chatacter like _ - = @ !';
function checkPassword(password) {
  return password.length > 4 && password.match(/[^a-zA-Z0-9]/g) !== null;
}

module.exports = {
  nicknameRule,
  checkNickname,
  passwordRule,
  checkPassword
};
