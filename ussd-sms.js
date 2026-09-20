// RuralCare SMS & USSD Feature-Phone Gateway Simulator
// Zero-Internet GSM Telephony Interface for Rural Accessibility
// Team VisionX - SIH 2026

window.UssdView = {
  dialInput: '*123#',
  screenText: 'RURALCARE GSM\nReady. Dial *123# for health services.',
  sessionState: 'idle', // idle, root_menu, book_prompt, emg_prompt, med_prompt, fu_prompt, blood_prompt, lang_prompt
  replyInput: '',

  render() {
    const s = window.Store.getState();
    const smsInbox = s.ussdMessages || [];

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('smartphone', 'icon-md text-emerald')} SMS & USSD Feature-Phone Gateway (*123#)</h2>
            <p class="text-muted">Simulated 2G GSM feature-phone interface mirroring key healthcare actions without internet.</p>
          </div>
          <div>
            <span class="badge badge-emerald">GSM / 2G USSD Gateway Active</span>
          </div>
        </div>

        <div class="dash-grid-2col mb-4">
          <!-- Feature Phone Mockup -->
          <div class="card p-4 flex-center" style="background: #1e293b;">
            <div class="feature-phone-casing">
              <!-- Phone Earpiece Speaker -->
              <div class="phone-speaker-slit"></div>

              <!-- Green Monochrome LCD Screen -->
              <div class="phone-screen">
                <div class="screen-status-bar">
                  <span>📶 BSNL 2G</span>
                  <span>🔋 85%</span>
                </div>
                <div class="screen-body-text" id="phone-screen-display">
                  ${this.formatScreenText(this.screenText)}
                </div>
                <div class="screen-input-line">
                  <span class="prompt-sym">&gt;</span>
                  <input type="text" id="ussd-phone-input" class="screen-hidden-input" value="${this.replyInput}" placeholder="Type reply..." oninput="UssdView.onInputChange(this.value)" />
                </div>
              </div>

              <!-- Keypad Navigation & Action Keys -->
              <div class="phone-softkeys-row">
                <button class="phone-key softkey" onclick="UssdView.pressSend()">SEND / OK</button>
                <button class="phone-key nav-center" onclick="UssdView.pressDial()">CALL</button>
                <button class="phone-key softkey" onclick="UssdView.pressClear()">CLEAR</button>
              </div>

              <!-- Numeric Keypad Grid (1 - 9, *, 0, #) -->
              <div class="phone-numeric-grid">
                <button class="phone-key" onclick="UssdView.pressKey('1')">1 <small>.,-</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('2')">2 <small>ABC</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('3')">3 <small>DEF</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('4')">4 <small>GHI</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('5')">5 <small>JKL</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('6')">6 <small>MNO</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('7')">7 <small>PQRS</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('8')">8 <small>TUV</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('9')">9 <small>WXYZ</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('*')">* <small>+</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('0')">0 <small>␣</small></button>
                <button class="phone-key" onclick="UssdView.pressKey('#')"># <small>⌗</small></button>
              </div>
            </div>
          </div>

          <!-- Simulated SMS Inbox Card -->
          <div class="card">
            <div class="card-header flex-between bg-surface">
              <div class="flex-align">
                ${Icons.get('smartphone', 'icon-sm text-teal')}
                <h3 class="mb-0">Simulated SMS Inbox (+91 98765 43210)</h3>
              </div>
              <span class="badge badge-teal">${smsInbox.length} Messages</span>
            </div>
            <div class="card-body">
              <p class="text-xs text-muted mb-3">All USSD interactions and queue tokens automatically trigger real-time simulated SMS notifications here:</p>
              <div class="sms-inbox-stream">
                ${smsInbox.map(sms => `
                  <div class="sms-card mb-2 p-3 bg-surface rounded border">
                    <div class="sms-header flex-between mb-1">
                      <strong class="text-teal">${sms.from}</strong>
                      <span class="text-xs text-muted">${sms.time}</span>
                    </div>
                    <div class="sms-body text-sm">${sms.text}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  formatScreenText(txt) {
    return txt.replace(/\n/g, '<br>');
  },

  pressKey(k) {
    this.replyInput += k;
    const inp = document.getElementById('ussd-phone-input');
    if (inp) inp.value = this.replyInput;
  },

  onInputChange(val) {
    this.replyInput = val;
  },

  pressClear() {
    this.replyInput = '';
    const inp = document.getElementById('ussd-phone-input');
    if (inp) inp.value = '';
    if (this.sessionState !== 'idle') {
      this.sessionState = 'idle';
      this.screenText = 'RURALCARE GSM\nReady. Dial *123# for health services.';
      const disp = document.getElementById('phone-screen-display');
      if (disp) disp.innerHTML = this.formatScreenText(this.screenText);
    }
  },

  pressDial() {
    if (this.replyInput.trim() === '*123#' || this.replyInput.trim() === '') {
      this.openRootMenu();
    } else {
      this.pressSend();
    }
  },

  openRootMenu() {
    this.sessionState = 'root_menu';
    this.replyInput = '';
    this.screenText = `RURALCARE *123#\n1 Book Appointment\n2 Emergency / SOS\n3 Medicine Stock\n4 Follow-up Status\n5 Blood Request\n6 Switch Language`;
    const disp = document.getElementById('phone-screen-display');
    const inp = document.getElementById('ussd-phone-input');
    if (disp) disp.innerHTML = this.formatScreenText(this.screenText);
    if (inp) inp.value = '';
  },

  pressSend() {
    const input = this.replyInput.trim();
    const disp = document.getElementById('phone-screen-display');
    const inp = document.getElementById('ussd-phone-input');
    const s = window.Store.getState();

    if (input === '*123#') {
      this.openRootMenu();
      return;
    }

    if (this.sessionState === 'root_menu') {
      if (input === '1') {
        // Book Appointment
        const token = 'T-' + Math.floor(10 + Math.random() * 89);
        this.screenText = `[BOOKING CONFIRMED]\nToken: ${token} at PHC Rampur.\nDoctor: Dr. Arvind Sharma\nDate: Tomorrow 10:30 AM\nPress 0 for Menu.`;
        s.ussdMessages.unshift({
          from: 'RuralCare-USSD',
          text: `Booking Confirmed via USSD *123#. Token ${token} generated for PHC Rampur OPD.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else if (input === '2') {
        // Emergency
        this.screenText = `[EMERGENCY SOS ALERT]\nAmbulance dispatched to Rampur Village!\nVehicle: CG-13-EMG-0108\nDriver: 9823110808\nETA: 7 mins.\nPress 0 for Menu.`;
        s.ussdMessages.unshift({
          from: 'RuralCare-SOS',
          text: `EMERGENCY SOS ACTIVATED via USSD! Ambulance 108 dispatched towards Rampur Panchayat. Driver: 98231 10808.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else if (input === '3') {
        // Medicine
        this.screenText = `[PHC RAMPUR PHARMACY]\nParacetamol: In Stock (1200)\nMetformin 500mg: In Stock (850)\nIFA Tabs: Out of Stock\nPress 0 for Menu.`;
      } else if (input === '4') {
        // Followup
        this.screenText = `[YOUR FOLLOW-UP]\nNext Visit: 25 Sep\nAssigned: ASHA Sunita Devi\nTask: Fasting Sugar & BP\nPress 0 for Menu.`;
      } else if (input === '5') {
        // Blood
        this.screenText = `[BLOOD BANK RAIGARH]\nO+: 31 Units\nB+: 22 Units\nA+: 14 Units\nO-: 2 Units (Low)\nPress 0 for Menu.`;
      } else if (input === '6') {
        // Language
        this.screenText = `[SELECT LANGUAGE]\n1 English\n2 हिन्दी (Hindi)\n3 தமிழ் (Tamil)\n4 తెలుగు (Telugu)`;
      } else if (input === '0') {
        this.openRootMenu();
        return;
      } else {
        this.screenText = `Invalid option "${input}".\nDial *123# to return.`;
      }
    } else {
      this.openRootMenu();
    }

    this.replyInput = '';
    if (disp) disp.innerHTML = this.formatScreenText(this.screenText);
    if (inp) inp.value = '';
    window.Store.saveState();
    window.Router.render();
  }
};
