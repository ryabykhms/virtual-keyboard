const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    sounds: null,
    current: null,
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
    position: 0,
    voice: false,
    sound: true,
  },

  // prettier-ignore
  keyLayout: {
    en: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?',
      'done', 'voice', 'sound', 'lang', 'space', 'left', 'right'
    ],
    ru: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', '.', '?',
      'done', 'voice', 'sound', 'lang', 'space', 'left', 'right'
    ],
  },

  sounds: {
    en: {
      shift: 'shift.wav',
      caps: 'caps.wav',
      backspace: 'backspace.wav',
      enter: 'enter.wav',
      space: 'space.wav',
      sounds: 'sounds.wav',
      lang: 'lang.wav',
      default: 'default.wav',
    },

    ru: {
      shift: 'shift.wav',
      caps: 'caps.wav',
      backspace: 'backspace.wav',
      enter: 'enter.wav',
      space: 'space.wav',
      sounds: 'sounds.wav',
      lang: 'lang.wav',
      default: 'default.wav',
    },
  },

  _initSounds() {
    this.elements.sounds = {
      ru: {},
      en: {},
    };
    this.elements.sounds.ru = {
      shift: this._initSoundElement('shift', 'ru'),
      caps: this._initSoundElement('caps', 'ru'),
      backspace: this._initSoundElement('backspace', 'ru'),
      enter: this._initSoundElement('enter', 'ru'),
      space: this._initSoundElement('space', 'ru'),
      sounds: this._initSoundElement('sounds', 'ru'),
      lang: this._initSoundElement('lang', 'ru'),
      default: this._initSoundElement('default', 'ru'),
    };

    this.elements.sounds.en = {
      shift: this._initSoundElement('shift', 'en'),
      caps: this._initSoundElement('caps', 'en'),
      backspace: this._initSoundElement('backspace', 'en'),
      enter: this._initSoundElement('enter', 'en'),
      space: this._initSoundElement('space', 'en'),
      sounds: this._initSoundElement('sounds', 'en'),
      lang: this._initSoundElement('lang', 'en'),
      default: this._initSoundElement('default', 'en'),
    };
  },

  _initSoundElement(btn, lang) {
    const element = document.createElement('audio');
    element.src = this._soundSrc(this.sounds[lang][btn], lang);
    return element;
  },

  _soundSrc(name, lang) {
    return `./assets/sounds/${lang}/${name}`;
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    this._initSounds();

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
    for (let sound in this.elements.sounds) {
      this.elements.main.appendChild(this.elements.sounds[sound].shift);
    }
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with class .use-virtual-keyboard
    document.querySelectorAll('.use-virtual-keyboard').forEach((element) => {
      element.addEventListener('focus', (e) => {
        this.elements.current = element;
        this.open(
          element.value,
          (currentValue) => {
            element.value = currentValue;
            element.focus();
            if (this.properties.shift) {
              this._toggleShift();
              this.elements.keys.forEach((key) => {
                if (key.classList.contains('keyboard__key--active-once')) {
                  key.classList.remove('keyboard__key--active-once');
                }
              });
            }
            this.properties.position++;
            element.selectionStart = element.selectionEnd = this.properties.position;
          },
          () => {
            element.blur();
          }
        );
      });
      element.addEventListener('click', (e) => {
        this.properties.position = e.target.selectionStart;
      });
    });

    document.addEventListener('keydown', (e) => {
      this._handlePhysicalKeyboard(e);
    });

    document.addEventListener('keyup', (e) => {
      this._handlePhysicalKeyboard(e);
      this.properties.value = e.target.value;
      this.properties.position = e.target.selectionStart;
    });
  },

  // TODO:
  // - handle change keyboard language
  // - handle shift
  // - handle caps
  _handlePhysicalKeyboard(e) {
    let symbol;

    if (e.key !== undefined) {
      symbol = e.key;
    } else if (e.keyIdentifier !== undefined) {
      symbol = String.fromCharCode(e.keyIdentifier);
    } else if (e.keyCode !== undefined) {
      symbol = String.fromCharCode(e.keyCode);
    }

    let key = symbol.toLowerCase();
    key = key === 'capslock' ? 'caps' : key;
    key = key === ' ' ? 'space' : key;
    let keyIndex = this.keyLayout[this.properties.lang].indexOf(key);
    if (keyIndex !== -1) {
      if (e.type === 'keydown') {
        this.elements.keys[keyIndex].classList.add(
          'keyboard__key--active-once'
        );
      } else if (e.type === 'keyup') {
        this.elements.keys[keyIndex].classList.remove(
          'keyboard__key--active-once'
        );
      }
    }
  },

  // Creates HTML for an icon
  _createIconHtml(iconName) {
    return `<i class="material-icons">${iconName}</i>`;
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = this.keyLayout;

    keyLayout[this.properties.lang].forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak =
        ['backspace', 'p', 'enter', '?', 'ъ'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('backspace');
          keyElement.addEventListener('click', (e) => {
            let { lang, value, position } = this.properties;
            if (position > 0) {
              this.properties.value = `${value.substring(
                0,
                position === 0 ? 0 : position - 1
              )}${value.substring(position, value.length)}`;
              this.properties.position = position <= 0 ? 0 : position - 2;
            }

            this._playSound(this.elements.sounds[lang].backspace);
            this._triggerEvent('oninput');
          });
          break;

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable'
          );
          keyElement.innerHTML = this._createIconHtml('keyboard_capslock');
          keyElement.addEventListener('click', (e) => {
            this._toggleCapsLock();
            const { lang, capsLock } = this.properties;
            keyElement.classList.toggle('keyboard__key--active', capsLock);
            this._playSound(this.elements.sounds[lang].caps);
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('keyboard_return');
          keyElement.addEventListener('click', (e) => {
            this._changeValueByPosition('\n');
            this._triggerEvent('oninput');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].enter);
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('keyboard_arrow_up');
          keyElement.addEventListener('click', (e) => {
            this._toggleShift();
            const { lang, shift } = this.properties;
            keyElement.classList.toggle('keyboard__key--active-once', shift);
            this._playSound(this.elements.sounds[lang].shift);
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHtml('keyboard_hide');
          keyElement.addEventListener('click', (e) => {
            this.close();
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
            this._triggerEvent('onclose');
          });
          break;

        case 'voice':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHtml('keyboard_voice');
          window.SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          try {
            const { lang } = this.properties;
            const recognition = new SpeechRecognition();
            recognition.interimResults = true;
            recognition.lang = lang === 'en' ? 'en-US' : 'ru-RU';
            keyElement.addEventListener('click', (e) => {
              const { lang } = this.properties;
              this._playSound(this.elements.sounds[lang].enter);
              this._toggleVoice();
              const { voice } = this.properties;
              if (voice) {
                recognition.stop();
                recognition.start();
              } else {
                recognition.stop();
              }
              recognition.addEventListener('result', (e) => {
                const transcript = Array.from(e.results)
                  .map((result) => result[0])
                  .map((result) => result.transcript)
                  .join('');

                if (e.results[0].isFinal) {
                  this._changeValueByPosition(transcript + ' ');
                  this.properties.position += transcript.length;
                  this._triggerEvent('oninput');
                }
              });
              recognition.addEventListener('end', (e) => {
                const { voice } = this.properties;
                if (voice) {
                  recognition.stop();
                  recognition.start();
                } else {
                  recognition.stop();
                }
              });
            });
          } catch (e) {
            console.log("Browser doesn't support Speech Recognition");
          }
          break;

        case 'sound':
          const sound = this.properties.sound;
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = sound
            ? this._createIconHtml('volume_off')
            : this._createIconHtml('volume_up');
          keyElement.addEventListener('click', (e) => {
            this._toggleSound();
            const sound = this.properties.sound;
            keyElement.innerHTML = sound
              ? this._createIconHtml('volume_off')
              : this._createIconHtml('volume_up');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].sounds);
          });
          break;

        case 'lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this.properties.lang;
          keyElement.addEventListener('click', (e) => {
            this._toggleLang();
            keyElement.innerHTML = this.properties.lang;
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].lang);
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = this._createIconHtml('space_bar');
          keyElement.addEventListener('click', (e) => {
            this._changeValueByPosition(' ');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].space);
            this._triggerEvent('oninput');
          });
          break;

        case 'left':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('arrow_back');
          keyElement.addEventListener('click', (e) => {
            const pos = this.properties.position - 1;
            this.properties.position = pos >= 0 ? pos : 0;
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
            this._changePosition();
          });
          break;

        case 'right':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = this._createIconHtml('arrow_forward');
          keyElement.addEventListener('click', (e) => {
            const pos = this.properties.position + 1;
            const length = this.properties.value.length;
            this.properties.position = pos < length ? pos : length;
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
            this._changePosition();
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', (e) => {
            this._changeValueByPosition(keyElement.textContent);
            this._triggerEvent('oninput');
            const { lang } = this.properties;
            this._playSound(this.elements.sounds[lang].default);
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

  _changeValueByPosition(text) {
    const { position, value } = this.properties;
    const length = value.length;
    const keyVal = this._toggleCase(text);
    this.properties.value = `${value.slice(0, position)}${keyVal}${value.slice(
      position,
      length
    )}`;
  },

  _playSound(audioElement) {
    if (this.properties.sound) {
      audioElement.currentTime = 0;
      audioElement.play();
    }
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
        key.textContent = this._toggleCase(key.textContent);
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        switch (key.textContent) {
          case ',':
            key.textContent = ';';
            break;
          case '.':
            key.textContent = ':';
            break;
          case '?':
            key.textContent = '!';
            break;
          case ';':
            key.textContent = ',';
            break;
          case ':':
            key.textContent = '.';
            break;
          case '!':
            key.textContent = '?';
            break;
          default:
            key.textContent = this._toggleCase(key.textContent);
            break;
        }
      }
    }
  },

  _changePosition() {
    const position = this.properties.position;
    this.elements.current.selectionStart = this.elements.current.selectionEnd = position;
  },

  _toggleVoice() {
    this.properties.voice = !this.properties.voice;
    const { lang, voice } = this.properties;
    const index = this.keyLayout[lang].indexOf('voice');
    if (index !== -1) {
      if (voice) {
        this.elements.keys[index].innerHTML = this._createIconHtml('mic_off');

        this.elements.keys[index].classList.add('keyboard__key--active-once');
      } else {
        this.elements.keys[index].innerHTML = this._createIconHtml(
          'keyboard_voice'
        );
        this.elements.keys[index].classList.remove(
          'keyboard__key--active-once'
        );
      }
    }
  },

  _toggleSound() {
    this.properties.sound = !this.properties.sound;
  },

  _toggleLang() {
    this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';
    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key'
    );
  },

  _toggleCase(key) {
    return this._isUpperCase() ? key.toUpperCase() : key.toLowerCase();
  },

  _isUpperCase() {
    return (
      (this.properties.shift && !this.properties.capsLock) ||
      (!this.properties.shift && this.properties.capsLock)
    );
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
