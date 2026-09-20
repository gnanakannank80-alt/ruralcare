// RuralCare Role-Based Login & Mock OTP Verification View
// Team VisionX - SIH 2026

window.LoginView = {
  selectedRole: 'patient',
  otpSent: false,

  render() {
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    return `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header text-center">
            <div class="login-logo-circle">
              ${Icons.get('shield', 'icon-xl text-teal')}
            </div>
            <h2>RuralCare Secure Login</h2>
            <p class="text-muted">OTP Authentication • ABHA & Role Integrated Access</p>
          </div>

          <!-- Role Selection Tabs -->
          <div class="role-selector-tabs">
            <button class="role-tab ${this.selectedRole === 'patient' ? 'active' : ''}" onclick="LoginView.setRole('patient')">
              ${Icons.get('user', 'icon-sm')}
              <span>Patient</span>
            </button>
            <button class="role-tab ${this.selectedRole === 'asha' ? 'active' : ''}" onclick="LoginView.setRole('asha')">
              ${Icons.get('users', 'icon-sm')}
              <span>ASHA / ANM</span>
            </button>
            <button class="role-tab ${this.selectedRole === 'doctor' ? 'active' : ''}" onclick="LoginView.setRole('doctor')">
              ${Icons.get('activity', 'icon-sm')}
              <span>Doctor</span>
            </button>
            <button class="role-tab ${this.selectedRole === 'admin' ? 'active' : ''}" onclick="LoginView.setRole('admin')">
              ${Icons.get('shield', 'icon-sm')}
              <span>Admin</span>
            </button>
          </div>

          <!-- 1-Click Quick Demo Login Pill -->
          <div class="quick-demo-box">
            <span class="demo-badge">Hackathon Demo Mode</span>
            <p class="demo-text">Switch role instantly with 1-click test credentials:</p>
            <div class="demo-btn-group">
              <button class="btn btn-sm btn-outline" onclick="LoginView.instantLogin('patient')">Ramesh (Patient)</button>
              <button class="btn btn-sm btn-outline" onclick="LoginView.instantLogin('asha')">Sunita (ASHA)</button>
              <button class="btn btn-sm btn-outline" onclick="LoginView.instantLogin('doctor')">Dr. Arvind (Doctor)</button>
              <button class="btn btn-sm btn-outline" onclick="LoginView.instantLogin('admin')">Rajesh (Admin)</button>
            </div>
          </div>

          <!-- Login Form -->
          <form id="login-form" onsubmit="LoginView.handleSubmit(event)">
            <div class="form-group">
              <label for="login-phone">Mobile Number</label>
              <div class="input-with-prefix">
                <span class="input-prefix">+91</span>
                <input 
                  type="tel" 
                  id="login-phone" 
                  name="phone" 
                  class="form-control" 
                  placeholder="98765 43210" 
                  pattern="[0-9]{10}" 
                  maxlength="10"
                  value="${this.getSamplePhone()}"
                  required 
                />
              </div>
              <small class="form-hint">Enter registered 10-digit mobile number</small>
            </div>

            <div id="otp-section" class="${this.otpSent ? '' : 'hidden'}">
              <div class="otp-alert-box">
                ${Icons.get('checkCircle', 'icon-sm text-emerald')}
                <span>Mock OTP generated: <strong>123456</strong> (Valid for 10 min)</span>
              </div>

              <div class="form-group">
                <label for="login-otp">Enter 6-digit Verification Code (OTP)</label>
                <input 
                  type="text" 
                  id="login-otp" 
                  class="form-control text-center otp-input" 
                  placeholder="123456" 
                  maxlength="6"
                  value="123456"
                />
              </div>
            </div>

            <div class="form-actions" style="margin-top: 1.5rem;">
              ${!this.otpSent ? `
                <button type="button" class="btn btn-primary btn-block btn-lg" onclick="LoginView.sendOTP()">
                  ${Icons.get('smartphone', 'icon-md')}
                  <span>Send Verification Code (OTP)</span>
                </button>
              ` : `
                <button type="submit" class="btn btn-emerald btn-block btn-lg">
                  ${Icons.get('checkCircle', 'icon-md')}
                  <span>Verify OTP & Enter Dashboard</span>
                </button>
              `}
            </div>
          </form>

          <div class="login-footer text-center">
            <p class="text-muted text-sm">
              ${Icons.get('shield', 'icon-xs')} Secure & ABHA compliant public healthcare access.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  getSamplePhone() {
    const phones = {
      patient: '9876543210',
      asha: '9812345678',
      doctor: '9425088991',
      admin: '9411122334'
    };
    return phones[this.selectedRole] || '9876543210';
  },

  setRole(role) {
    this.selectedRole = role;
    this.otpSent = false;
    window.Router.render();
  },

  sendOTP() {
    this.otpSent = true;
    window.Router.render();
    if (window.VoiceAssistant) {
      window.VoiceAssistant.speak('Verification code sent. Use test code 1 2 3 4 5 6.');
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const otpInput = document.getElementById('login-otp');
    const otp = otpInput ? otpInput.value.trim() : '123456';

    if (otp === '123456' || otp.length === 6) {
      this.instantLogin(this.selectedRole);
    } else {
      alert('Invalid OTP code. Please use 123456 for the demo.');
    }
  },

  instantLogin(role) {
    window.Store.switchRole(role);
    const targetMap = {
      patient: '#/dashboard-patient',
      asha: '#/dashboard-asha',
      doctor: '#/dashboard-doctor',
      admin: '#/dashboard-admin'
    };
    window.location.hash = targetMap[role] || '#/';
  }
};
