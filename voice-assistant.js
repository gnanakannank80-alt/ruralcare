// RuralCare Voice Assistant (Web Speech API + SpeechSynthesis)
// Low-Literacy Voice Navigation & Voice Form Dictation
// Team VisionX - SIH 2026

class VoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    this.initRecognition();
  }

  initRecognition() {
    if (!this.supported) {
      console.warn('[RuralCare Voice] Web Speech Recognition not supported in this browser.');
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateVoiceIndicator(true, 'Listening... Please speak your command or form input.');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('[RuralCare Voice] Heard:', transcript);
      this.handleVoiceCommand(transcript);
    };

    this.recognition.onerror = (event) => {
      console.warn('[RuralCare Voice] Recognition error:', event.error);
      this.isListening = false;
      this.updateVoiceIndicator(false, `Voice input stopped: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateVoiceIndicator(false);
    };
  }

  getLangCode() {
    const map = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      mr: 'mr-IN'
    };
    const current = window.i18n ? window.i18n.currentLang : 'en';
    return map[current] || 'en-IN';
  }

  toggleListening() {
    if (!this.supported) {
      alert('Voice recognition is not supported in this browser. Please use Chrome, Edge, or a modern mobile browser.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.lang = this.getLangCode();
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('[RuralCare Voice] Start error:', e);
      }
    }
  }

  handleVoiceCommand(transcript) {
    const lower = transcript.toLowerCase();
    const modalText = document.getElementById('voice-transcript');
    if (modalText) {
      modalText.textContent = `"${transcript}"`;
    }

    // Check if an input field currently has focus; if so, populate it
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      activeEl.value = (activeEl.value ? activeEl.value + ' ' : '') + transcript;
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      this.speak(`Typed: ${transcript}`);
      return;
    }

    // Voice Navigation Command Router
    if (lower.includes('emergency') || lower.includes('sos') || lower.includes('urgent') || lower.includes('खतरा') || lower.includes('ஆபத்து')) {
      this.speak('Opening Emergency Priority assessment.');
      window.location.hash = '#/emergency';
    } else if (lower.includes('ambulance') || lower.includes('एम्बुलेंस') || lower.includes('ஆம்புலன்ஸ்')) {
      this.speak('Opening Ambulance live tracking.');
      window.location.hash = '#/ambulance';
    } else if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('अपॉइंटमेंट') || lower.includes('மருத்துவர்')) {
      this.speak('Opening Doctor appointments.');
      window.location.hash = '#/appointments';
    } else if (lower.includes('medicine') || lower.includes('pharmacy') || lower.includes('दवा') || lower.includes('மருந்து')) {
      this.speak('Opening Medicine tracking and inventory.');
      window.location.hash = '#/medicines';
    } else if (lower.includes('record') || lower.includes('abha') || lower.includes('रिकॉर्ड') || lower.includes('பதிவு')) {
      this.speak('Opening your Digital Health Records.');
      window.location.hash = '#/records';
    } else if (lower.includes('teleconsult') || lower.includes('video call') || lower.includes('परामर्श')) {
      this.speak('Opening Teleconsultation room.');
      window.location.hash = '#/teleconsult';
    } else if (lower.includes('blood') || lower.includes('रक्त') || lower.includes('இரத்தம்')) {
      this.speak('Opening Blood Bank and Donor matching.');
      window.location.hash = '#/blood';
    } else if (lower.includes('camp') || lower.includes('शिविर') || lower.includes('முகாம்')) {
      this.speak('Opening Health Camps.');
      window.location.hash = '#/camps';
    } else if (lower.includes('referral') || lower.includes('रेफरल')) {
      this.speak('Opening Referral tracking.');
      window.location.hash = '#/referrals';
    } else if (lower.includes('follow') || lower.includes('anc') || lower.includes('बच्चा')) {
      this.speak('Opening Maternal and Child Health follow-ups.');
      window.location.hash = '#/followups';
    } else if (lower.includes('ussd') || lower.includes('sms') || lower.includes('phone') || lower.includes('फोन')) {
      this.speak('Opening Basic Feature Phone Simulator.');
      window.location.hash = '#/ussd-sms';
    } else if (lower.includes('home') || lower.includes('घर') || lower.includes('मुख्य')) {
      this.speak('Returning to home dashboard.');
      window.location.hash = '#/';
    } else if (lower.includes('read') || lower.includes('बोल') || lower.includes('सुनाओ')) {
      this.readActiveScreen();
    } else {
      this.speak(`Voice command recognized: ${transcript}`);
    }
  }

  speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLangCode();
    utterance.rate = 0.95; // Slightly slower for clear rural understanding
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateSpeakerIndicator(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateSpeakerIndicator(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateSpeakerIndicator(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.updateSpeakerIndicator(false);
    }
  }

  readActiveScreen() {
    if (this.isSpeaking) {
      this.stopSpeaking();
      return;
    }

    const appMain = document.getElementById('app');
    if (!appMain) return;

    // Collect readable text from headings, cards, and summaries
    const headings = Array.from(appMain.querySelectorAll('h1, h2, h3, .speech-readable, p'))
      .slice(0, 6)
      .map(el => el.textContent.trim())
      .filter(t => t.length > 2)
      .join('. ');

    const intro = window.i18n ? window.i18n.t('read_screen') : 'Reading screen content: ';
    const textToSpeak = `${intro}. ${headings || 'Welcome to RuralCare. Right Care, Right Time, Right Place.'}`;
    this.speak(textToSpeak);
  }

  updateVoiceIndicator(isListening, statusText = '') {
    const micBtn = document.getElementById('mic-toggle-btn');
    const modal = document.getElementById('voice-modal');
    const statusEl = document.getElementById('voice-status-text');

    if (micBtn) {
      if (isListening) {
        micBtn.classList.add('mic-active');
      } else {
        micBtn.classList.remove('mic-active');
      }
    }

    if (statusEl && statusText) {
      statusEl.textContent = statusText;
    }

    if (modal) {
      if (isListening) {
        modal.classList.remove('hidden');
      } else {
        setTimeout(() => modal.classList.add('hidden'), 2200);
      }
    }
  }

  updateSpeakerIndicator(isSpeaking) {
    const speakerBtn = document.getElementById('speaker-toggle-btn');
    if (speakerBtn) {
      if (isSpeaking) {
        speakerBtn.classList.add('speaker-active');
      } else {
        speakerBtn.classList.remove('speaker-active');
      }
    }
  }
}

window.VoiceAssistant = new VoiceAssistant();
