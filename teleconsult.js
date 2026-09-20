// RuralCare Teleconsultation Room & e-Prescription View (Module D)
// Team VisionX - SIH 2026

window.TeleconsultView = {
  inCall: false,
  isAudioOnly: true,
  micMuted: false,
  camOff: false,
  messages: [
    { sender: 'Dr. Arvind Sharma', text: 'Namaste Ramesh ji. I can see your previous fasting glucose reading of 126 mg/dL. How are your symptoms today?', time: '07:31 PM' },
    { sender: 'You', text: 'Namaste Doctor Sahab. The mild fever is gone, but I had slight dizziness in the afternoon after farm work.', time: '07:32 PM' }
  ],
  generatedRx: null,

  render() {
    const s = window.Store.getState();
    const doctors = s.doctors || [];

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('video', 'icon-md text-teal')} Teleconsultation & Digital OPD</h2>
            <p class="text-muted">High-definition audio/video consult with automatic low-bandwidth 2G optimization.</p>
          </div>
          <div>
            <span class="badge ${this.isAudioOnly ? 'badge-amber' : 'badge-emerald'}">
              ${this.isAudioOnly ? 'Low-Bandwidth Audio Mode Active' : 'HD Video Active'}
            </span>
          </div>
        </div>

        <!-- Consultation Main Workspace -->
        <div class="dash-grid-2col mb-4">
          <!-- Video / Audio Call Screen -->
          <div class="card teleconsult-screen-card">
            <div class="card-header bg-slate-900 text-white flex-between">
              <div class="flex-align">
                <span class="live-dot-pulse"></span>
                <span>${this.inCall ? 'Live Call: Dr. Arvind Sharma (PHC Rampur)' : 'Teleconsult Room (Waiting Room)'}</span>
              </div>
              <span class="badge badge-outline-white">${this.isAudioOnly ? 'Voice Only (12 kbps)' : 'Video (320p Adaptive)'}</span>
            </div>

            <div class="card-body p-0 bg-slate-950 text-white teleconsult-feed-area">
              ${this.inCall ? `
                <div class="call-feed-container">
                  <!-- Main Doctor Video / Audio Representation -->
                  <div class="main-video-feed">
                    ${this.isAudioOnly ? `
                      <div class="audio-only-avatar">
                        <div class="pulsing-audio-ring">
                          ${Icons.get('user', 'icon-xl text-teal')}
                        </div>
                        <h3>Dr. Arvind Sharma</h3>
                        <p class="text-emerald text-sm">● Audio Connected • Ultra-low 2G packet compression active</p>
                      </div>
                    ` : `
                      <div class="simulated-doctor-video">
                        <div class="doc-badge-overlay">Dr. Arvind Sharma (MBBS, MD)</div>
                        <!-- Canvas / SVG Animated Wave -->
                        <div class="video-placeholder-scene">
                          <div class="doc-mock-avatar">👨‍⚕️</div>
                          <div class="audio-wave-bars">
                            <span class="wave-bar"></span>
                            <span class="wave-bar"></span>
                            <span class="wave-bar"></span>
                            <span class="wave-bar"></span>
                          </div>
                        </div>
                      </div>
                    `}
                  </div>

                  <!-- Patient Picture-in-Picture -->
                  <div class="pip-patient-box">
                    <div class="pip-label">You (Ramesh)</div>
                    <div class="pip-content">${this.camOff || this.isAudioOnly ? '🎤 Audio' : '👤 Video'}</div>
                  </div>
                </div>

                <!-- Live In-Call Controls -->
                <div class="call-controls-bar">
                  <button class="call-btn ${this.micMuted ? 'btn-danger' : 'btn-control'}" onclick="TeleconsultView.toggleMic()">
                    ${Icons.get('mic', 'icon-md')}
                    <span>${this.micMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  <button class="call-btn ${this.isAudioOnly ? 'btn-active-toggle' : 'btn-control'}" onclick="TeleconsultView.toggleBandwidth()">
                    ${Icons.get('wifi', 'icon-md')}
                    <span>${this.isAudioOnly ? 'Switch to Video' : 'Audio-Only Mode'}</span>
                  </button>

                  <button class="call-btn btn-control" onclick="TeleconsultView.shareReportPrompt()">
                    ${Icons.get('fileText', 'icon-md')}
                    <span>Share Report</span>
                  </button>

                  <button class="call-btn btn-danger" onclick="TeleconsultView.endCall()">
                    ${Icons.get('phone', 'icon-md')}
                    <span>End Consultation</span>
                  </button>
                </div>
              ` : `
                <!-- Waiting Room Interface -->
                <div class="waiting-room-hero">
                  <div class="waiting-clock">${Icons.get('clock', 'icon-xl text-amber')}</div>
                  <h3>Waiting Room: Dr. Arvind Sharma</h3>
                  <p class="text-muted text-sm" style="max-width: 400px; margin: 0.5rem auto 1.5rem;">
                    You are in the queue. The doctor will admit you into the private encrypted consultation room momentarily.
                  </p>
                  <div class="waiting-token-pill">Your Turn: Token #1 (Next to be admitted)</div>
                  
                  <div class="waiting-actions mt-3">
                    <button class="btn btn-primary btn-lg" onclick="TeleconsultView.startCall()">
                      ${Icons.get('video', 'icon-md')}
                      <span>Connect Now (Start Teleconsult)</span>
                    </button>
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- Chat & Diagnostic Reports Sidebar -->
          <div class="card teleconsult-chat-card">
            <div class="card-header bg-surface flex-between">
              <h3>Consultation Chat & Reports</h3>
              <span class="text-xs text-muted">End-to-End Encrypted</span>
            </div>
            <div class="card-body p-3 chat-body-wrap" id="teleconsult-chat-stream">
              ${this.messages.map(m => `
                <div class="chat-bubble ${m.sender === 'You' ? 'bubble-patient' : 'bubble-doc'}">
                  <div class="chat-sender">${m.sender} <span class="chat-time">${m.time}</span></div>
                  <div class="chat-text">${m.text}</div>
                </div>
              `).join('')}
            </div>
            <div class="card-footer p-2">
              <form class="chat-input-form" onsubmit="TeleconsultView.sendChat(event)">
                <input type="text" id="teleconsult-chat-input" class="form-control" placeholder="Type message or ask doctor..." required />
                <button type="submit" class="btn btn-primary btn-sm">Send</button>
              </form>
            </div>
          </div>
        </div>

        <!-- e-Prescription Generation Box (Generated at consultation conclusion) -->
        <div class="card mb-4" id="rx-output-container">
          <div class="card-header flex-between bg-emerald-light">
            <div class="flex-align">
              ${Icons.get('fileText', 'icon-md text-emerald')}
              <h3 class="text-emerald mb-0">Official Digital e-Prescription (ABDM / Telemedicine Guidelines 2026)</h3>
            </div>
            <button class="btn btn-sm btn-outline" onclick="window.print()">
              ${Icons.get('download', 'icon-xs')}
              <span>Print / Download PDF</span>
            </button>
          </div>
          <div class="card-body" id="rx-printable-content">
            <div class="rx-header-grid">
              <div class="rx-clinic">
                <h3>PHC Rampur - Telemedicine OPD</h3>
                <p class="text-sm text-muted">Primary Health Centre, Raigarh District, Chhattisgarh</p>
                <p class="text-xs text-muted">Govt. of India Telemedicine Practice Compliant</p>
              </div>
              <div class="rx-meta text-right">
                <p><strong>Date:</strong> 20 September 2026</p>
                <p><strong>Rx Ref:</strong> RC-RX-2026-8910</p>
              </div>
            </div>

            <div class="rx-patient-bar my-3 p-2 bg-surface rounded flex-between">
              <div><strong>Patient:</strong> Ramesh Kumar (38 / M)</div>
              <div><strong>ABHA ID:</strong> 14-8921-4402-9912</div>
              <div><strong>Consultant:</strong> Dr. Arvind Sharma (MCI-2015-88392)</div>
            </div>

            <div class="rx-medicines-list">
              <h4>Rx (Prescribed Medications):</h4>
              <table class="data-table mt-2">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Dosage & Frequency</th>
                    <th>Duration</th>
                    <th>Special Advice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Tab. Metformin 500mg</strong></td>
                    <td>1 tab twice daily (Morning + Night)</td>
                    <td>30 Days</td>
                    <td>After breakfast & dinner. Maintain low sugar diet.</td>
                  </tr>
                  <tr>
                    <td><strong>Tab. Multivitamin & Zinc</strong></td>
                    <td>1 tab once daily (Afternoon)</td>
                    <td>15 Days</td>
                    <td>Drink plenty of water during daytime farm work.</td>
                  </tr>
                  <tr>
                    <td><strong>ORS (Oral Rehydration Salts)</strong></td>
                    <td>1 sachet in 1L boiled water as needed</td>
                    <td>SOS</td>
                    <td>Take if feeling fatigued under sun.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="rx-footer-grid mt-4 pt-3 border-top flex-between">
              <div>
                <p class="text-xs text-muted">Digital Signature Verified via ABDM Provider Registry</p>
                <p class="text-xs text-teal"><strong>✓ Dr. Arvind Sharma, MBBS, MD</strong></p>
              </div>
              <div class="rx-qr-code text-center">
                <div style="background:#f1f5f9; padding:6px; border:1px solid #cbd5e1; display:inline-block; font-family:monospace; font-size:10px;">
                  [ABDM-QR:RC8910]
                </div>
                <div class="text-xs text-muted">Scan to Verify</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Teleconsult Doctors Directory -->
        <div class="card">
          <div class="card-header">
            <h3>Specialist Teleconsultation Panel Availability</h3>
          </div>
          <div class="card-body">
            <div class="doc-specialty-grid">
              ${doctors.map(d => `
                <div class="doc-card-mini">
                  <div class="doc-status-indicator ${d.available ? 'online' : 'offline'}"></div>
                  <h4>${d.name}</h4>
                  <p class="text-teal text-sm font-medium">${d.specialty}</p>
                  <p class="text-xs text-muted">${d.facility} • ${d.experience} Exp</p>
                  <div class="mt-2">
                    <button class="btn btn-xs ${d.available ? 'btn-primary' : 'btn-outline'}" onclick="TeleconsultView.requestDoctor('${d.name}')">
                      ${d.available ? 'Join Waiting Room' : 'Leave Message'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  startCall() {
    this.inCall = true;
    window.Router.render();
    if (window.VoiceAssistant) {
      window.VoiceAssistant.speak('Consultation connected with Doctor Arvind Sharma.');
    }
  },

  endCall() {
    this.inCall = false;
    window.Router.render();
    alert('Teleconsultation ended. Your digital e-prescription is ready below.');
    const rxEl = document.getElementById('rx-output-container');
    if (rxEl) rxEl.scrollIntoView({ behavior: 'smooth' });
  },

  toggleMic() {
    this.micMuted = !this.micMuted;
    window.Router.render();
  },

  toggleBandwidth() {
    this.isAudioOnly = !this.isAudioOnly;
    window.Router.render();
  },

  sendChat(e) {
    e.preventDefault();
    const input = document.getElementById('teleconsult-chat-input');
    if (!input || !input.value.trim()) return;

    this.messages.push({
      sender: 'You',
      text: input.value.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    input.value = '';
    window.Router.render();

    // Auto mock reply from doctor after 1.5s
    setTimeout(() => {
      this.messages.push({
        sender: 'Dr. Arvind Sharma',
        text: 'Noted. Keep taking the prescribed Metformin regularly and stay well hydrated. I have issued your e-prescription.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      window.Router.render();
    }, 1200);
  },

  shareReportPrompt() {
    const reportName = prompt('Enter report title to share with doctor (e.g., Blood Sugar Test or ECG):', 'Fasting Blood Sugar 126 mg/dL');
    if (reportName) {
      this.messages.push({
        sender: 'You',
        text: `📎 Shared Diagnostic Report: "${reportName}" (FHIR Observation Attached)`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      window.Router.render();
    }
  },

  requestDoctor(name) {
    alert(`Connected to waiting room for ${name}.`);
    this.startCall();
  }
};
