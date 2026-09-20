// RuralCare Smart Appointments & Live Queue View (Module A)
// Team VisionX - SIH 2026

window.AppointmentsView = {
  render() {
    const s = window.Store.getState();
    const currentUser = s.currentUser;
    const isAsha = currentUser.role === 'asha';
    const appointments = s.appointments || [];

    return `
      <div class="view-page">
        <!-- Module Header -->
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('calendar', 'icon-md text-teal')} Smart Appointments & Live Queue</h2>
            <p class="text-muted">Zero-queue appointments, smart token estimation, and ASHA proxy booking.</p>
          </div>
          <div>
            <button class="btn btn-primary" onclick="AppointmentsView.scrollToBooking()">
              ${Icons.get('plusCircle', 'icon-sm')}
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        <!-- Live Queue Status Board -->
        <div class="card mb-4">
          <div class="card-header flex-between bg-teal-light">
            <div class="flex-align">
              <span class="live-dot-pulse"></span>
              <h3 class="text-teal mb-0">Today's Live Queue Telemetry (PHC Rampur - OPD 1)</h3>
            </div>
            <span class="badge badge-teal">Live OPD Counter</span>
          </div>
          <div class="card-body">
            <div class="live-token-banner">
              <div class="token-hero">
                <span class="lbl">Now Serving Inside</span>
                <div class="big-token-display">A-09</div>
                <span class="text-sm text-muted">Dr. Arvind Sharma (General OPD)</span>
              </div>
              <div class="token-meta-box">
                <div class="meta-item">
                  <span class="meta-label">Next Up:</span>
                  <span class="meta-val">A-10, A-11</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Avg. Consultation Time:</span>
                  <span class="meta-val">7.5 mins / patient</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">SMS Alert Threshold:</span>
                  <span class="meta-val text-emerald">Active (Alerts sent at 3-ahead)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Existing Appointments List -->
        <div class="card mb-4">
          <div class="card-header">
            <h3>Your Scheduled Appointments</h3>
          </div>
          <div class="card-body">
            ${appointments.length === 0 ? `
              <p class="text-muted">No appointments found. Book one below.</p>
            ` : `
              <div class="appointments-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Patient Details</th>
                      <th>Facility & Dept</th>
                      <th>Doctor</th>
                      <th>Date & Slot</th>
                      <th>Queue Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${appointments.map(apt => `
                      <tr>
                        <td>
                          <div class="token-pill">${apt.tokenNumber}</div>
                        </td>
                        <td>
                          <strong>${apt.patientName}</strong><br>
                          <small class="text-muted">${apt.abhaId || 'ABHA: Verified'}</small>
                          ${apt.bookedBy && apt.bookedBy.includes('ASHA') ? `<br><span class="badge badge-xs badge-amber">Booked by ASHA</span>` : ''}
                        </td>
                        <td>
                          <strong>${apt.facility}</strong><br>
                          <small class="text-muted">${apt.department}</small>
                        </td>
                        <td>${apt.doctor}</td>
                        <td>
                          <strong>${apt.date}</strong><br>
                          <small class="text-muted">${apt.slot}</small>
                        </td>
                        <td>
                          <span class="badge ${apt.status === 'Cancelled' ? 'badge-red' : 'badge-emerald'}">
                            ${apt.queueStatus || apt.status}
                          </span>
                          ${apt.status !== 'Cancelled' ? `
                            <div class="text-xs text-muted" style="margin-top: 4px;">
                              Serving: ${apt.currentToken} (Wait: ~${apt.estimatedWaitMin}m)
                            </div>
                          ` : ''}
                        </td>
                        <td>
                          ${apt.status !== 'Cancelled' ? `
                            <button class="btn btn-xs btn-outline text-red" onclick="AppointmentsView.cancelApt('${apt.id}')">
                              Cancel
                            </button>
                            <button class="btn btn-xs btn-outline" onclick="AppointmentsView.alertReschedule()">
                              Reschedule
                            </button>
                          ` : `<span class="text-muted text-xs">Cancelled</span>`}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- New Appointment Booking Form -->
        <div class="card" id="booking-form-card">
          <div class="card-header flex-between">
            <h3>${Icons.get('plusCircle', 'icon-sm text-teal')} Book New Consultation</h3>
            <span class="text-sm text-muted">Online & Offline Queue Supported</span>
          </div>
          <div class="card-body">
            <!-- ASHA Proxy Booking Mode Banner -->
            ${isAsha ? `
              <div class="asha-proxy-banner mb-3">
                ${Icons.get('users', 'icon-md text-emerald')}
                <div>
                  <strong>ASHA Facilitator Booking Mode:</strong>
                  <span>You are booking on behalf of a rural family in your village roster.</span>
                </div>
              </div>
            ` : `
              <div class="proxy-toggle-row mb-3">
                <label class="toggle-label">
                  <input type="checkbox" id="toggle-proxy-booking" onchange="AppointmentsView.toggleProxyFields(this.checked)">
                  <span>Book on behalf of another patient (Elderly parent, child, or neighbor)</span>
                </label>
              </div>
            `}

            <form id="appointment-form" onsubmit="AppointmentsView.handleBookAppointment(event)">
              <!-- Proxy Patient Input Details -->
              <div id="proxy-details-box" class="${isAsha ? '' : 'hidden'} mb-3 p-3 bg-surface rounded">
                <div class="grid-2col">
                  <div class="form-group">
                    <label>Beneficiary / Patient Name *</label>
                    <input type="text" id="apt-proxy-name" class="form-control" placeholder="e.g. Geeta Bai" value="${isAsha ? 'Devendra Patel' : ''}">
                  </div>
                  <div class="form-group">
                    <label>Patient ABHA ID / Mobile Number *</label>
                    <input type="text" id="apt-proxy-abha" class="form-control" placeholder="14-XXXX-XXXX-XXXX" value="${isAsha ? '14-3312-9901-2244' : ''}">
                  </div>
                </div>
              </div>

              <div class="grid-2col">
                <!-- Facility Selection -->
                <div class="form-group">
                  <label for="apt-facility">Select Public Healthcare Facility *</label>
                  <select id="apt-facility" class="form-control" onchange="AppointmentsView.updateDoctorsList()" required>
                    ${s.facilities.map(f => `
                      <option value="${f.name}">${f.name} (${f.type} - ${f.distance})</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Department Selection -->
                <div class="form-group">
                  <label for="apt-dept">Department / Specialty *</label>
                  <select id="apt-dept" class="form-control" onchange="AppointmentsView.updateDoctorsList()" required>
                    ${s.departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="grid-3col">
                <!-- Doctor Selection -->
                <div class="form-group">
                  <label for="apt-doctor">Available Doctor *</label>
                  <select id="apt-doctor" class="form-control" required>
                    ${s.doctors.map(d => `
                      <option value="${d.name}">${d.name} (${d.specialty} • ${d.facility})</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Date Selection -->
                <div class="form-group">
                  <label for="apt-date">Appointment Date *</label>
                  <input type="date" id="apt-date" class="form-control" value="2026-09-23" required />
                </div>

                <!-- Slot Selection -->
                <div class="form-group">
                  <label for="apt-slot">Time Slot *</label>
                  <select id="apt-slot" class="form-control" required>
                    <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                    <option value="10:30 AM - 11:00 AM" selected>10:30 AM - 11:00 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                    <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              <div class="form-actions mt-3">
                <button type="submit" class="btn btn-primary btn-lg">
                  ${Icons.get('checkCircle', 'icon-md')}
                  <span>Generate Token & Confirm Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  scrollToBooking() {
    const el = document.getElementById('booking-form-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },

  toggleProxyFields(show) {
    const box = document.getElementById('proxy-details-box');
    if (box) {
      if (show) box.classList.remove('hidden');
      else box.classList.add('hidden');
    }
  },

  updateDoctorsList() {
    const facSelect = document.getElementById('apt-facility');
    const docSelect = document.getElementById('apt-doctor');
    if (!facSelect || !docSelect) return;

    const s = window.Store.getState();
    const facName = facSelect.value;
    const matchingDocs = s.doctors.filter(d => d.facility === facName || true);

    docSelect.innerHTML = matchingDocs.map(d => `
      <option value="${d.name}">${d.name} (${d.specialty} • ${d.facility})</option>
    `).join('');
  },

  async handleBookAppointment(e) {
    e.preventDefault();
    const s = window.Store.getState();
    const isAsha = s.currentUser.role === 'asha';
    const isProxy = isAsha || (document.getElementById('toggle-proxy-booking') && document.getElementById('toggle-proxy-booking').checked);

    const proxyName = document.getElementById('apt-proxy-name') ? document.getElementById('apt-proxy-name').value.trim() : '';
    const proxyAbha = document.getElementById('apt-proxy-abha') ? document.getElementById('apt-proxy-abha').value.trim() : '';

    const patientName = isProxy && proxyName ? proxyName : s.currentUser.name;
    const abhaId = isProxy && proxyAbha ? proxyAbha : s.currentUser.abhaId;

    const appointmentPayload = {
      patientName,
      abhaId,
      facility: document.getElementById('apt-facility').value,
      department: document.getElementById('apt-dept').value,
      doctor: document.getElementById('apt-doctor').value,
      date: document.getElementById('apt-date').value,
      slot: document.getElementById('apt-slot').value,
      bookedBy: isAsha ? `ASHA ${s.currentUser.name}` : (isProxy ? 'Caregiver Proxy' : 'Self')
    };

    if (!navigator.onLine && window.IDBQueue) {
      await window.IDBQueue.enqueue('book_appointment', appointmentPayload, `Book ${appointmentPayload.doctor}`);
      alert('Offline mode: Appointment saved to local queue. It will synchronize automatically when connection is restored!');
    } else {
      window.Store.addAppointment(appointmentPayload);
      if (window.VoiceAssistant) {
        window.VoiceAssistant.speak(`Appointment successfully confirmed with ${appointmentPayload.doctor}. Your token has been generated.`);
      }
      alert(`Success! Appointment confirmed. Live Token generated.`);
    }

    window.Router.render();
  },

  cancelApt(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      window.Store.cancelAppointment(id);
      window.Router.render();
    }
  },

  alertReschedule() {
    alert('Please pick a new date or slot in the booking form below to reschedule your appointment.');
    this.scrollToBooking();
  }
};
