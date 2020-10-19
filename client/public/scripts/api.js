const API = (() => {
  return class API {
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
