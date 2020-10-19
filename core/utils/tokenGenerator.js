const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function tokenGenerator(length) {
  const buffer = new Array(length);

  for (let i = 0; i < length; ++i) {
    buffer[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  return buffer.join('');
}

module.exports = { tokenGenerator };
