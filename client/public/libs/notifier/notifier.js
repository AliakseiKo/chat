window.Notifier = (() => {
  return class Notifier {
    constructor(element, {
      baseClass = 'notification-item',
      showClass = 'notification-item_show',
      types = {
        error: 'notification-item_error',
        success: 'notification-item_success'
      },
      insertToTop = true
    } = {}) {
      this._list = element;
      this._baseClass = baseClass;
      this._showClass = showClass;
      this.types = types;
      this._insertToTop = insertToTop;

      this._notifications = new Map();
    }

    show(message, type) {
      const notification = this._createNotification(message, type);

      if (this._insertToTop) this._list.prepend(notification);
      else this._list.append(notification);

      void notification.offsetHeight;
      notification.classList.add(this._showClass);

      const timeoutId = setTimeout(() => {
        this.hide(notification);
      }, 2000 + message.length * 50);

      notification.addEventListener('mouseover', () => {

        const timeoutId = this._notifications.get(notification);
        clearTimeout(timeoutId);

        notification.addEventListener('mouseout', () => {

          const timeoutId = setTimeout(() => this.hide(notification), 2000);
          this._notifications.set(notification, timeoutId);

        }, { once: true });

      });

      this._notifications.set(notification, timeoutId);
    }

    hide(notification) {
      const timeoutId = this._notifications.get(notification);
      if (timeoutId === undefined) return;

      clearTimeout(timeoutId);

      this._notifications.delete(notification);
      notification.classList.remove(this._showClass);
      notification.addEventListener('transitionend', () => notification.remove());
    }

    _createNotification(message, type = null) {
      const notification = document.createElement('li');
      notification.textContent = message;
      if (type) notification.classList.add(this._baseClass, type);
      else notification.classList.add(this._baseClass);

      return notification;
    }
  }
})();
