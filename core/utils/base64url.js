function toBase64url(base64) {
  return base64.replace(/[+/=]/g, (match) => {
    switch (match) {
      case '+': return '-';
      case '/': return '_';
      case '=': return '';
    }
  });
}

function fromBase64url(base64url) {
  return base64url.replace(/[-_]/g, (match) => {
    switch (match) {
      case '-': return '+';
      case '_': return '/';
    }
  }).padEnd(base64url.length * 3 % 4, '=');
}

module.exports = { toBase64url, fromBase64url };
