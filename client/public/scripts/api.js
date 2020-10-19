const API = (() => {
  return class API {
    static async checkUserExistance(nickname) {
      const response = await fetch(`/api/user/exist?nickname=${nickname}`);

      return await response.json();
    }

    static async registration(nickname, password) {
      const requestBody = JSON.stringify({ nickname, password });

      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: requestBody
      });

      return response;
    }

    static async login(nickname, password) {
      const requestBody = JSON.stringify({ nickname, password });

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: requestBody
      });

      return response;
    }

    static async publish(message) {
      const requestBody = JSON.stringify({ message });

      const response = fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: requestBody
      });

      return response;
    }

    static async subscribe() {
      const response = await fetch('/api/subscribe');

      return response;
    }
  }
})();
