(() => {
  const id = document.querySelector('.id');
  id.textContent = Math.floor(Math.random() * 1e3);

  // const chat_messageSubmit = document.querySelector('.chat_message-submit');
  const chat_messageInput = document.querySelector('.chat_message-input');
  const chat_messageForm = document.querySelector('.chat_message-form');
  const chat_messageList = document.querySelector('.chat_message-list');

  chat_messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(chat_messageForm);
    if (!data.get('message')) {
      console.log('введите сообщение');
      return;
    }

    chat_messageInput.value = '';

    const jsonData = JSON.stringify(Object.fromEntries(data.entries()));

    sendMessage('/publish', jsonData);
  });

  subscribe();

  function subscribe() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/subscribe');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.send(JSON.stringify({ id: id.textContent }));

    xhr.addEventListener('load', () => {
      if (xhr.status !== 200) {
        showError(`error ${xhr.status}: ${xhr.statusText}`);
      } else {
        if (xhr.response === null) {
          showError(`error: unexpected response date. Expexted: ${xhr.responseType}`);
        } else {
          showMessage(xhr.response.message);
        }
      }

      subscribe();
    });

    xhr.addEventListener('error', () => console.log(1) && setTimeout(subscribe, 500));
    xhr.addEventListener('abort', () => console.log(2) && setTimeout(subscribe, 500));
  }

  function sendMessage(url, data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

    xhr.addEventListener('load', () => {
      if (xhr.status !== 200) {
        showError(`error ${xhr.status}: ${xhr.statusText}`);
      }
    });

    xhr.addEventListener('error', () => {
      showError('request sending error');
    });

  }

  function showMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    chat_messageList.append(li);
  }

  function showError(errorMessage) {
    alert(errorMessage);
  }
})();
