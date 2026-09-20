// RuralCare Referral Tracking View (Module F)
// Inter-facility Referral Pipeline: PHC -> CHC -> District Hospital
// Team VisionX - SIH 2026

window.ReferralsView = {
  render() {
    const s = window.Store.getState();
    const referrals = s.referrals || [];
    const u = s.currentUser;
    const canCreate = u.role === 'doctor' || u.role === 'asha';

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('repeat', 'icon-md text-blue')} Inter-Facility Referral Tracking</h2>
            <p class="text-muted">Structured patient escalation pipeline across PHC Rampur, CHC Bilaspur & District Hospital.</p>
          </div>
          <div>
            ${canCreate ? `
              <button class="btn btn-primary" onclick="ReferralsView.toggleCreateModal(true)">
                ${Icons.get('plusCircle', 'icon-sm')}
                <span>Create New Referral</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Referral Pipeline Summary Cards -->
        <div class="referrals-stream mb-4">
          ${referrals.map(ref => `
            <div class="card referral-card mb-3">
              <div class="card-header flex-between ${ref.urgency === 'Critical' ? 'bg-red-light' : 'bg-surface'}">
                <div class="flex-align">
                  <span class="badge ${ref.urgency === 'Critical' ? 'badge-red' : 'badge-amber'}">${ref.urgency}</span>
                  <h3 class="mb-0 ml-2">${ref.patientName} (${ref.abhaId})</h3>
                </div>
                <span class="text-sm text-muted">Created: ${ref.createdDate}</span>
              </div>

              <div class="card-body">
                <div class="referral-route-row mb-3">
                  <div class="route-point">
                    <span class="pt-tag">Referring Facility</span>
                    <strong>${ref.fromFacility}</strong>
                    <small class="d-block text-muted">${ref.referringDoctor}</small>
                  </div>
                  <div class="route-arrow">➔</div>
                  <div class="route-point">
                    <span class="pt-tag">Destination Facility</span>
                    <strong>${ref.toFacility}</strong>
                    <small class="d-block text-teal">${ref.specialtyRequired}</small>
                  </div>
                </div>

                <div class="referral-clinical-box mb-3 p-3 bg-surface rounded">
                  <strong>Clinical Case Summary:</strong>
                  <p class="text-sm mt-1 mb-0">${ref.clinicalSummary}</p>
                </div>

                <!-- 5-Step Referral Progression Bar -->
                <div class="referral-stepper">
                  <div class="ref-step ${ref.statusIndex >= 0 ? 'done' : ''}">
                    <div class="st-dot">✓</div>
                    <span>Created</span>
                  </div>
                  <div class="ref-step ${ref.statusIndex >= 1 ? 'done' : ''}">
                    <div class="st-dot">${ref.statusIndex >= 1 ? '✓' : '2'}</div>
                    <span>Accepted</span>
                  </div>
                  <div class="ref-step ${ref.statusIndex >= 2 ? 'done' : ''}">
                    <div class="st-dot">${ref.statusIndex >= 2 ? '✓' : '3'}</div>
                    <span>Patient Reached</span>
                  </div>
                  <div class="ref-step ${ref.statusIndex >= 3 ? 'done' : ''}">
                    <div class="st-dot">${ref.statusIndex >= 3 ? '✓' : '4'}</div>
                    <span>Treated</span>
                  </div>
                  <div class="ref-step ${ref.statusIndex >= 4 ? 'done' : ''}">
                    <div class="st-dot">${ref.statusIndex >= 4 ? '✓' : '5'}</div>
                    <span>Feedback Loop</span>
                  </div>
                </div>

                ${ref.delayAlert ? `
                  <div class="delay-alert-box mt-3">
                    ${Icons.get('alertTriangle', 'icon-sm text-red')}
                    <span><strong>Delay Warning:</strong> Patient transit window exceeded 48 hours. ASHA notification dispatched.</span>
                  </div>
                ` : ''}

                <!-- Role-Based Action Row -->
                <div class="ref-actions-row mt-3 pt-2 border-top flex-between">
                  <div class="text-xs text-muted">FHIR ReferralRequest Resource Linked</div>
                  <div class="btn-group-sm">
                    <button class="btn btn-xs btn-outline" onclick="ReferralsView.advanceStatus('${ref.id}')">
                      Update Stage &rarr;
                    </button>
                    <button class="btn btn-xs btn-outline text-amber" onclick="ReferralsView.toggleDelayAlert('${ref.id}')">
                      Toggle Delay Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Create Referral Modal -->
        <div id="create-referral-modal" class="modal-overlay hidden">
          <div class="modal-card">
            <div class="modal-header flex-between">
              <h3>Create Inter-Facility Referral</h3>
              <button class="modal-close" onclick="ReferralsView.toggleCreateModal(false)">&times;</button>
            </div>
            <div class="modal-body">
              <form id="new-ref-form" onsubmit="ReferralsView.handleCreateReferral(event)">
                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Patient Name *</label>
                    <input type="text" id="ref-pat-name" class="form-control" value="Sita Bai" required />
                  </div>
                  <div class="form-group">
                    <label>ABHA ID *</label>
                    <input type="text" id="ref-pat-abha" class="form-control" value="14-4411-9988-2233" required />
                  </div>
                </div>

                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Origin Facility *</label>
                    <select id="ref-origin" class="form-control">
                      <option value="PHC Rampur">PHC Rampur</option>
                      <option value="CHC Bilaspur">CHC Bilaspur</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Destination Facility *</label>
                    <select id="ref-dest" class="form-control">
                      <option value="District Hospital Raigarh">District Hospital Raigarh</option>
                      <option value="CHC Bilaspur">CHC Bilaspur</option>
                      <option value="AIIMS Raipur">AIIMS Raipur (Tertiary)</option>
                    </select>
                  </div>
                </div>

                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Specialty Required *</label>
                    <input type="text" id="ref-specialty" class="form-control" value="Cardiology & Echo Assessment" required />
                  </div>
                  <div class="form-group">
                    <label>Urgency Level *</label>
                    <select id="ref-urgency" class="form-control">
                      <option value="High Priority">High Priority</option>
                      <option value="Critical">Critical (Immediate Transfer)</option>
                      <option value="Routine">Routine Elective</option>
                    </select>
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label>Clinical Summary & Provisional Diagnosis *</label>
                  <textarea id="ref-notes" class="form-control" rows="3" required>Suspected acute coronary syndrome with uncontrolled hypertension. Needs urgent cardiologist consultation and echocardiography.</textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">Issue Referral & Transmit Record</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleCreateModal(show) {
    const el = document.getElementById('create-referral-modal');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  async handleCreateReferral(e) {
    e.preventDefault();
    const s = window.Store.getState();
    const payload = {
      patientName: document.getElementById('ref-pat-name').value,
      abhaId: document.getElementById('ref-pat-abha').value,
      fromFacility: document.getElementById('ref-origin').value,
      toFacility: document.getElementById('ref-dest').value,
      specialtyRequired: document.getElementById('ref-specialty').value,
      urgency: document.getElementById('ref-urgency').value,
      clinicalSummary: document.getElementById('ref-notes').value,
      referringDoctor: s.currentUser.role === 'doctor' ? s.currentUser.name : 'Dr. Arvind Sharma'
    };

    if (!navigator.onLine && window.IDBQueue) {
      await window.IDBQueue.enqueue('create_referral', payload, `Referral: ${payload.patientName}`);
      alert('Offline mode: Referral saved locally. Will be transmitted to receiving hospital upon reconnection!');
    } else {
      window.Store.addReferral(payload);
      alert(`Referral created and transmitted to ${payload.toFacility}.`);
    }

    this.toggleCreateModal(false);
    window.Router.render();
  },

  advanceStatus(id) {
    const s = window.Store.getState();
    const ref = s.referrals.find(r => r.id === id);
    if (!ref) return;

    ref.statusIndex = (ref.statusIndex + 1) % 5;
    const stages = ['Created', 'Accepted', 'Patient reached', 'Treated', 'Feedback'];
    ref.status = stages[ref.statusIndex];
    window.Store.saveState();
    window.Router.render();
  },

  toggleDelayAlert(id) {
    const s = window.Store.getState();
    const ref = s.referrals.find(r => r.id === id);
    if (ref) {
      ref.delayAlert = !ref.delayAlert;
      window.Store.saveState();
      window.Router.render();
    }
  }
};
