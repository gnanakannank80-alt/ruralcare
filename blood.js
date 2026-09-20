// RuralCare Innovation Module J1: Smart Blood Donation & e-RaktKosh Registry
// Team VisionX - SIH 2026

window.BloodView = {
  render() {
    const s = window.Store.getState();
    const bank = s.bloodBank;

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('droplet', 'icon-md text-red')} Hyperlocal Blood Donation & e-RaktKosh Stock</h2>
            <p class="text-muted">Real-time donor proximity matching within 10 km radius and district blood bank transparency.</p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-emergency" onclick="BloodView.toggleRequestModal(true)">
              ${Icons.get('plusCircle', 'icon-sm')}
              <span>Emergency Blood Request</span>
            </button>
            <button class="btn btn-primary" onclick="BloodView.toggleDonorModal(true)">
              ${Icons.get('heart', 'icon-sm')}
              <span>Register as Volunteer Donor</span>
            </button>
          </div>
        </div>

        <!-- e-RaktKosh Blood Inventory Snapshot (Ministry of Health Guidelines) -->
        <div class="card mb-4">
          <div class="card-header bg-red-light flex-between">
            <div class="flex-align">
              ${Icons.get('shield', 'icon-sm text-red')}
              <h3 class="text-red mb-0">District Blood Bank Real-Time Inventory (e-RaktKosh Aligned)</h3>
            </div>
            <span class="badge badge-red">Live Units</span>
          </div>
          <div class="card-body">
            <div class="blood-bank-grid">
              ${bank.stock.map(b => `
                <div class="blood-group-card ${b.status === 'Critical' ? 'border-critical' : ''}">
                  <div class="bg-type">${b.group}</div>
                  <div class="bg-units">${b.units} <span class="text-xs">Units</span></div>
                  <span class="badge ${b.status === 'Critical' ? 'badge-red' : (b.status === 'Low' ? 'badge-amber' : 'badge-emerald')}">
                    ${b.status}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="dash-grid-2col mb-4">
          <!-- Active Blood Requests & Donor Matching -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>Active Blood Requisitions</h3>
              <span class="badge badge-amber">Urgent Matching</span>
            </div>
            <div class="card-body">
              ${bank.requests.length === 0 ? `
                <p class="text-muted">No pending blood requisitions.</p>
              ` : `
                <div class="requests-list">
                  ${bank.requests.map(req => `
                    <div class="blood-req-item p-3 border rounded mb-2">
                      <div class="flex-between">
                        <div>
                          <strong class="text-red">${req.bloodGroup} Needed (${req.unitsNeeded} Units)</strong>
                          <h4 class="mb-1">${req.patientName}</h4>
                          <p class="text-xs text-muted mb-0">${req.hospital} • Urgency: <strong>${req.urgency}</strong></p>
                        </div>
                        <span class="badge badge-red">${req.status}</span>
                      </div>
                      <div class="mt-2 pt-2 border-top flex-between">
                        <small class="text-teal">3 Eligible Donors within 5km</small>
                        <button class="btn btn-xs btn-emerald" onclick="BloodView.acceptRequest('${req.id}')">
                          Notify Nearby Donors
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>

          <!-- Hyperlocal Available Donors -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>Volunteer Rural Donors Nearby (&lt;10 km)</h3>
              <span class="text-xs text-muted">GPS Distance Ranked</span>
            </div>
            <div class="card-body">
              <div class="donor-cards-list">
                ${bank.donors.map(d => `
                  <div class="donor-row flex-between">
                    <div class="flex-align">
                      <div class="donor-blood-pill">${d.group}</div>
                      <div>
                        <strong>${d.name}</strong>
                        <div class="text-xs text-muted">${d.village} • <strong>${d.distance} away</strong></div>
                      </div>
                    </div>
                    <div>
                      <a href="tel:${d.phone}" class="btn btn-xs btn-outline">
                        ${Icons.get('phone', 'icon-xs')} Call
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Register Volunteer Donor Modal -->
        <div id="register-donor-modal" class="modal-overlay hidden">
          <div class="modal-card">
            <div class="modal-header flex-between">
              <h3>Register as Voluntary Blood Donor</h3>
              <button class="modal-close" onclick="BloodView.toggleDonorModal(false)">&times;</button>
            </div>
            <div class="modal-body">
              <form id="donor-reg-form" onsubmit="BloodView.handleRegisterDonor(event)">
                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" id="donor-name" class="form-control" value="${s.currentUser.name}" required />
                  </div>
                  <div class="form-group">
                    <label>Blood Group *</label>
                    <select id="donor-group" class="form-control">
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" id="donor-phone" class="form-control" value="${s.currentUser.phone}" required />
                  </div>
                  <div class="form-group">
                    <label>Village Name *</label>
                    <input type="text" id="donor-village" class="form-control" value="${s.currentUser.village || 'Rampur'}" required />
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label>Approximate Date of Last Donation (or Never)</label>
                  <input type="text" id="donor-last" class="form-control" placeholder="e.g. 3 months ago or First Time" value="First Time Donor" />
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">Complete Donor Registration</button>
              </form>
            </div>
          </div>
        </div>

        <!-- Emergency Blood Request Modal -->
        <div id="request-blood-modal" class="modal-overlay hidden">
          <div class="modal-card">
            <div class="modal-header flex-between">
              <h3>Submit Emergency Blood Request</h3>
              <button class="modal-close" onclick="BloodView.toggleRequestModal(false)">&times;</button>
            </div>
            <div class="modal-body">
              <form id="blood-req-form" onsubmit="BloodView.handleRequestBlood(event)">
                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Patient Name *</label>
                    <input type="text" id="breq-pat-name" class="form-control" required placeholder="Patient full name" />
                  </div>
                  <div class="form-group">
                    <label>Required Blood Group *</label>
                    <select id="breq-group" class="form-control">
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Units Required *</label>
                    <input type="number" id="breq-units" class="form-control" min="1" max="10" value="2" required />
                  </div>
                  <div class="form-group">
                    <label>Hospital / Blood Bank *</label>
                    <input type="text" id="breq-hospital" class="form-control" value="District Hospital Raigarh" required />
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label>Urgency Level *</label>
                  <select id="breq-urgency" class="form-control">
                    <option value="Emergency (Immediate Surgery)">Emergency (Immediate Surgery)</option>
                    <option value="High (Within 6 Hours)">High (Within 6 Hours)</option>
                    <option value="Elective">Elective / Scheduled</option>
                  </select>
                </div>

                <button type="submit" class="btn btn-emergency btn-block btn-lg">Broadcast Request to Nearby Donors</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleDonorModal(show) {
    const el = document.getElementById('register-donor-modal');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  toggleRequestModal(show) {
    const el = document.getElementById('request-blood-modal');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  handleRegisterDonor(e) {
    e.preventDefault();
    const donor = {
      name: document.getElementById('donor-name').value,
      group: document.getElementById('donor-group').value,
      phone: document.getElementById('donor-phone').value,
      village: document.getElementById('donor-village').value,
      lastDonation: document.getElementById('donor-last').value
    };

    window.Store.registerBloodDonor(donor);
    this.toggleDonorModal(false);
    window.Router.render();
    alert(`Thank you ${donor.name}! You are registered in the rural blood donor network.`);
  },

  handleRequestBlood(e) {
    e.preventDefault();
    const req = {
      patientName: document.getElementById('breq-pat-name').value,
      bloodGroup: document.getElementById('breq-group').value,
      unitsNeeded: document.getElementById('breq-units').value,
      hospital: document.getElementById('breq-hospital').value,
      urgency: document.getElementById('breq-urgency').value
    };

    window.Store.requestBlood(req);
    this.toggleRequestModal(false);
    window.Router.render();
    alert(`Blood requirement for ${req.bloodGroup} broadcasted to nearby volunteer donors.`);
  },

  acceptRequest(id) {
    alert('Push alert broadcasted via SMS and App to 3 verified donors within 5 km!');
  }
};
