const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    lang: 'en',
    shift: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key'
    );

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    this.elements.main.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with class .use-virtual-keyboard
    document.querySelectorAll('.use-virtual-keyboard').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(
          element.value,
          (currentValue) => {
            element.value = currentValue;
          },
          () => {
            element.blur();
          }
        );
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    // prettier-ignore
    const keyLayout = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
      'done', 'voice', 'lang', 'space', 'left', 'right'
    ];

    // Creates HTML for an icon
    const createIconHTML = (iconName) => {
      return `<i class="material-icons">${iconName}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak =
        ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');
          keyElement.addEventListener('click', (e) => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent('oninput');
          });
          break;

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable'
          );
          keyElement.innerHTML = createIconHTML('keyboard_capslock');
          keyElement.addEventListener('click', (e) => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.capsLock
            );
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');
          keyElement.addEventListener('click', (e) => {
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_up');
          keyElement.addEventListener('click', (e) => {
            // TODO:
            console.log(e);
          });
          break;

        case 'done':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('keyboard_hide');
          keyElement.addEventListener('click', (e) => {
            this.close();
            this._triggerEvent('onclose');
          });
          break;

        case 'voice':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('keyboard_voice');
          keyElement.addEventListener('click', (e) => {
            // TODO:
            console.log(e);
          });
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this.properties.lang;
          keyElement.addEventListener('click', (e) => {
            // TODO:
            console.log(e);
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.addEventListener('click', (e) => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });
          break;

        case 'left':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('arrow_back');
          keyElement.addEventListener('click', (e) => {
            // TODO:
            console.log(e);
          });
          break;

        case 'right':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('arrow_forward');
          keyElement.addEventListener('click', (e) => {
            // TODO:
            console.log(e);
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', (e) => {
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            this._triggerEvent('oninput');
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    // TODO:
  },

  _toggleLang() {
    this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';

    // TODO:
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.elements.main.classList.add('keyboard--hidden');
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
