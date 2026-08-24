// Так-2-Так — голосове введення + озвучення тексту

window.Tak2TakVoice = {
  recognition: null,
  listening: false,

  start(target) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("На цьому пристрої голосове введення не підтримується.");
      return;
    }

    if (this.listening) {
      this.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang || "uk-UA";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      this.listening = true;
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      if (target) {
        const field =
          typeof target === "string"
            ? document.querySelector(target)
            : target;

        if (field) {
          field.value = field.value
            ? field.value + " " + text
            : text;

          field.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }
      }
    };

    recognition.onend = () => {
      this.listening = false;
    };

    recognition.onerror = () => {
      this.listening = false;
    };

    this.recognition = recognition;
    recognition.start();
  },

  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.listening = false;
  },

  speak(text) {
    if (!("speechSynthesis" in window)) {
      alert("Озвучення тексту не підтримується.");
      return;
    }

    speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(text);
    message.lang = document.documentElement.lang || "uk-UA";
    speechSynthesis.speak(message);
  }
};
