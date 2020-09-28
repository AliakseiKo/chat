(() => {
  const statusMessage = document.querySelector('.status-message');

  const chat_messageInput = document.querySelector('.chat_message-input');
  const chat_messageList = document.querySelector('.chat_message-list');
  const chat_messageForm = document.querySelector('.chat_message-form');
  // const chat_messageSubmit = document.querySelector('.chat_message-submit');

  chat_messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      chat_messageForm.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  textAreaAutoHeight(chat_messageInput, 1, 10);

  chat_messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(chat_messageForm);
    if (!data.get('message')) {
      showStatusMessage('введите сообщение');
      return;
    }

    chat_messageInput.value = '';
    chat_messageInput.dispatchEvent(new InputEvent('input'));

    const jsonData = JSON.stringify(Object.fromEntries(data.entries()));

    sendMessage('/api/publish', jsonData);
  });

  subscribe();

  function subscribe() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/subscribe');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.send();
    showStatusMessage('[subscribe] log: subscribing...');

    xhr.addEventListener('load', () => {
      if (xhr.status !== 200) {
        showStatusMessage(`[subscribe] error ${xhr.status}: ${xhr.statusText}`);
      } else if (xhr.response === null) {
        showStatusMessage(`[subscribe] error: unexpected response data. Expected: ${xhr.responseType}`);
      } else {
        showStatusMessage('[subscribe] log: message came');
        showMessage(xhr.response.message);
      }

      subscribe();
    });

    xhr.addEventListener('error', () => setTimeout(subscribe, 500));
    xhr.addEventListener('abort', () => setTimeout(subscribe, 500));
  }

  function sendMessage(url, data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
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

  function showMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    chat_messageList.append(li);
    chat_messageList.scrollTop = chat_messageList.scrollHeight;
  }

  function showStatusMessage(message) {
    statusMessage.textContent += message + '\n';
  }
})();
