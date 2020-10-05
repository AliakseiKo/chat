const statusMessage = document.querySelector('.status-message');
const chat_messageInput = document.querySelector('.chat_message-input');
const chat_messageList = document.querySelector('.chat_message-list');
const chat_messageForm = document.querySelector('.chat_message-form');
// const chat_messageSubmit = document.querySelector('.chat_message-submit');

function showMessage(message) {
  const li = document.createElement('li');
  li.textContent = message;
  chat_messageList.append(li);
  chat_messageList.scrollTop = chat_messageList.scrollHeight;
}

function showStatusMessage(message) {
  statusMessage.textContent += message + '\n';
}

const Chat = (() => {
  class Chat {
    static subscribe() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/subscribe');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'json';
      xhr.send();
      showStatusMessage('[subscribe] log: subscribed. Waiting...');

      xhr.addEventListener('load', () => {
        if (xhr.status !== 200) {
          showStatusMessage(`[subscribe] error ${xhr.status}: ${xhr.statusText}`);
        } else if (xhr.response === null) {
          showStatusMessage(`[subscribe] error: unexpected response data. Expected: ${xhr.responseType}`);
        } else {
          showStatusMessage('[subscribe] log: message came');
          showMessage(xhr.response.message);
        }

        this.subscribe();
      });

      xhr.addEventListener('error', () => setTimeout(this.subscribe.bind(this), 500));
      xhr.addEventListener('abort', () => setTimeout(this.subscribe.bind(this), 500));
    }

    static sendMessage(message) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/publish');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(message));
      showStatusMessage('[sendMessage] log: sending a message...');

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          showStatusMessage('[sendMessage] log: message sent');
        } else {
          showStatusMessage(`[sendMessage] error: ${xhr.status}: ${xhr.statusText}`);
        }
      });

      xhr.addEventListener('error', () => {
        showStatusMessage('request sending error');
      });
    }
  }

  return Chat;
})();

(() => {

  textAreaAutoHeight(chat_messageInput, 1, 10);

  Chat.subscribe();

  chat_messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      chat_messageForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  chat_messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(chat_messageForm);
    if (!data.get('message')) {
      showStatusMessage('введите сообщение');
      return;
    }

    chat_messageInput.value = '';
    chat_messageInput.dispatchEvent(new InputEvent('input'));

    Chat.sendMessage(Object.fromEntries(data.entries()));
    // Chat.sendMessage('/api/publish', jsonData);
  });
})();
