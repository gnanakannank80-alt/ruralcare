// RuralCare Role-Specific Dashboards (Patient, ASHA, Doctor, Admin)
// Smart India Hackathon 2026 - VisionX

window.DashboardsView = {
  renderPatient() {
    const s = window.Store.getState();
    const u = s.currentUser;
    const apt = s.appointments[0] || null;
    const meds = s.fhirRecords.medicationRequests || [];
    const followups = s.followups.filter(f => f.patientName.includes('Ramesh')) || [];

    return `
      <div class="dashboard-page">
        <!-- Patient Header Banner -->
        <div class="dash-welcome-banner patient-banner">
          <div class="welcome-text">
            <h2>Namaste, ${u.name} 👋</h2>
            <p>Village: <strong>${u.village || 'Rampur'}</strong> | ABHA ID: <strong>${u.abhaId || '14-8921-4402-9912'}</strong></p>
          </div>
          <div class="welcome-actions">
            <a href="#/emergency" class="btn btn-emergency btn-pulse">
              ${Icons.get('sos', 'icon-md')}
              <span>Emergency SOS</span>
            </a>
          </div>
        </div>

        <!-- Live Queue Status Hero Card -->
        ${apt && apt.status !== 'Cancelled' ? `
          <div class="queue-status-card">
            <div class="queue-header">
              <div class="q-facility">
                <span class="q-badge">Active Queue</span>
                <h3>${apt.facility} • ${apt.department}</h3>
                <p>Consulting with: <strong>${apt.doctor}</strong></p>
              </div>
              <div class="q-token-box">
                <span class="q-lbl">Your Token</span>
                <div class="q-token-num">${apt.tokenNumber}</div>
              </div>
            </div>

            <div class="queue-progress-bar-row">
              <div class="q-stat">
                <span class="lbl">Now Serving:</span>
                <span class="val text-emerald">${apt.currentToken || 'A-09'}</span>
              </div>
              <div class="q-stat">
                <span class="lbl">Est. Wait:</span>
                <span class="val text-amber">${apt.estimatedWaitMin || 25} mins</span>
              </div>
              <div class="q-stat">
                <span class="lbl">Queue Alert:</span>
                <span class="val text-teal">3 patients ahead</span>
              </div>
            </div>

            <div class="queue-card-actions">
              <a href="#/appointments" class="btn btn-sm btn-outline">Manage Booking</a>
              <button class="btn btn-sm btn-outline text-red" onclick="window.Store.cancelAppointment('${apt.id}'); window.Router.render();">Cancel</button>
            </div>
          </div>
        ` : `
          <div class="card empty-dash-card">
            <div class="empty-icon">${Icons.get('calendar', 'icon-lg text-muted')}</div>
            <h4>No Active Appointments Today</h4>
            <p>Need to see a doctor or specialist at Rampur PHC / Bilaspur CHC?</p>
            <a href="#/appointments" class="btn btn-primary btn-sm">Book Smart Appointment</a>
          </div>
        `}

        <div class="dash-grid-2col">
          <!-- Medicines Due Today -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('pill', 'icon-sm text-teal')} Today's Medicine Reminders</h3>
              <a href="#/medicines" class="btn-link">View Pharmacy</a>
            </div>
            <div class="card-body">
              <div class="med-reminder-list">
                ${meds.map(m => `
                  <div class="med-item-row">
                    <div class="med-status-check">
                      <input type="checkbox" id="check-${m.id}" />
                    </div>
                    <div class="med-info">
                      <h4>${m.medicationCodeableConcept.text}</h4>
                      <p>${m.dosageInstruction[0].text}</p>
                    </div>
                    <span class="badge badge-teal">Due</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Pending Follow-ups & Checkups -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('repeat', 'icon-sm text-blue')} Upcoming Follow-ups</h3>
              <a href="#/followups" class="btn-link">View All</a>
            </div>
            <div class="card-body">
              ${followups.length ? followups.map(f => `
                <div class="followup-item-row">
                  <div class="fu-left">
                    <h4>${f.category}</h4>
                    <p class="text-sm text-muted">Assigned: ${f.assignedTo} | Due: ${f.dueDate}</p>
                  </div>
                  <span class="badge badge-amber">${f.status}</span>
                </div>
              `).join('') : '<p class="text-muted">No pending follow-ups this week.</p>'}
            </div>
          </div>
        </div>

        <!-- Quick Access Shortcuts -->
        <div class="quick-shortcuts-section">
          <h3>Quick Health Services</h3>
          <div class="shortcuts-grid">
            <a href="#/records" class="shortcut-card">
              ${Icons.get('fileText', 'icon-md text-teal')}
              <span>My ABHA Records</span>
            </a>
            <a href="#/teleconsult" class="shortcut-card">
              ${Icons.get('video', 'icon-md text-blue')}
              <span>Teleconsultation</span>
            </a>
            <a href="#/ambulance" class="shortcut-card">
              ${Icons.get('ambulance', 'icon-md text-red')}
              <span>Track Ambulance</span>
            </a>
            <a href="#/blood" class="shortcut-card">
              ${Icons.get('droplet', 'icon-md text-red')}
              <span>Blood Requests</span>
            </a>
            <a href="#/camps" class="shortcut-card">
              ${Icons.get('tent', 'icon-md text-purple')}
              <span>Village Health Camps</span>
            </a>
            <a href="#/ussd-sms" class="shortcut-card">
              ${Icons.get('smartphone', 'icon-md text-emerald')}
              <span>Feature Phone (*123#)</span>
            </a>
          </div>
        </div>
      </div>
    `;
  },

  renderAsha() {
    const s = window.Store.getState();
    const u = s.rolesProfiles.asha;
    const pendingFu = s.followups || [];

    return `
      <div class="dashboard-page">
        <!-- ASHA Welcome Banner -->
        <div class="dash-welcome-banner asha-banner">
          <div class="welcome-text">
            <h2>Welcome, ${u.name} (ASHA Facilitator)</h2>
            <p>${u.assignedCenter} • Tracked Population: <strong>${u.coveredPopulation}</strong></p>
          </div>
          <div class="welcome-actions">
            <a href="#/offline" class="btn btn-outline-white">
              ${Icons.get('sync', 'icon-sm')}
              <span>Offline Queue Sync</span>
            </a>
            <a href="#/appointments" class="btn btn-emerald">
              ${Icons.get('plusCircle', 'icon-sm')}
              <span>Book For Villager</span>
            </a>
          </div>
        </div>

        <!-- ASHA KPI Counters -->
        <div class="stats-row-4">
          <div class="stat-card">
            <div class="stat-val text-teal">18</div>
            <div class="stat-lbl">Active Pregnancies (ANC)</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-emerald">34</div>
            <div class="stat-lbl">Infants Immunized</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-amber">5</div>
            <div class="stat-lbl">Home Visits Today</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-red">2</div>
            <div class="stat-lbl">High-Risk Referrals</div>
          </div>
        </div>

        <!-- ASHA Worklists Grid -->
        <div class="dash-grid-2col">
          <!-- Today's Home Visit Checklist -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('users', 'icon-sm text-teal')} Today's Scheduled Home Visits</h3>
              <a href="#/followups" class="btn-link">MCH Tracker</a>
            </div>
            <div class="card-body">
              <div class="checklist-items">
                ${pendingFu.map((f, i) => `
                  <div class="check-item-row">
                    <input type="checkbox" id="visit-chk-${i}" />
                    <div class="chk-details">
                      <h4>${f.patientName}</h4>
                      <p class="text-sm"><strong>${f.category}</strong> - ${f.notes}</p>
                    </div>
                    <span class="badge badge-outline">${f.dueDate}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Quick Patient Registration & Referral Shortcut -->
          <div class="card">
            <div class="card-header">
              <h3>${Icons.get('user', 'icon-sm text-blue')} Quick Field Actions</h3>
            </div>
            <div class="card-body">
              <div class="asha-actions-grid">
                <a href="#/appointments" class="action-tile">
                  <div class="tile-icon bg-teal-light">${Icons.get('calendar', 'icon-md text-teal')}</div>
                  <h4>Book PHC Slot</h4>
                  <p>Book doctor appointment on behalf of village patient.</p>
                </a>
                <a href="#/referrals" class="action-tile">
                  <div class="tile-icon bg-blue-light">${Icons.get('repeat', 'icon-md text-blue')}</div>
                  <h4>Escalate Referral</h4>
                  <p>Send patient from Rampur PHC to Bilaspur CHC.</p>
                </a>
                <a href="#/emergency" class="action-tile">
                  <div class="tile-icon bg-red-light">${Icons.get('sos', 'icon-md text-red')}</div>
                  <h4>SOS Triage Alert</h4>
                  <p>Report emergency vitals for priority doctor review.</p>
                </a>
                <a href="#/camps" class="action-tile">
                  <div class="tile-icon bg-purple-light">${Icons.get('tent', 'icon-md text-purple')}</div>
                  <h4>Camp Mobilization</h4>
                  <p>Register village families for upcoming free camps.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderDoctor() {
    const s = window.Store.getState();
    const u = s.rolesProfiles.doctor;
    const apts = s.appointments || [];
    const emergencies = s.emergencyIncidents || [];
    const referrals = s.referrals || [];

    return `
      <div class="dashboard-page">
        <!-- Doctor Header -->
        <div class="dash-welcome-banner doc-banner">
          <div class="welcome-text">
            <h2>${u.name} (${u.specialty})</h2>
            <p>${u.facility} • OPD Session: <strong>Active</strong> • Reg: ${u.regNo}</p>
          </div>
          <div class="welcome-actions">
            <a href="#/teleconsult" class="btn btn-blue">
              ${Icons.get('video', 'icon-sm')}
              <span>Teleconsult Queue (1)</span>
            </a>
            <a href="#/records" class="btn btn-outline-white">
              ${Icons.get('fileText', 'icon-sm')}
              <span>Patient Records</span>
            </a>
          </div>
        </div>

        <!-- Emergency Banner Alert if Critical -->
        ${emergencies.length ? `
          <div class="doc-emergency-alert">
            <div class="alert-icon-pulse">${Icons.get('sos', 'icon-md text-white')}</div>
            <div class="alert-details">
              <h4>CRITICAL EMERGENCY INCOMING: ${emergencies[0].patientName} (Age ${emergencies[0].age})</h4>
              <p>Symptoms: ${emergencies[0].symptoms.join(', ')} | Status: ${emergencies[0].status} | BP: ${emergencies[0].vitals.bp}, SpO2: ${emergencies[0].vitals.spO2}</p>
            </div>
            <a href="#/emergency" class="btn btn-sm btn-emergency">View Triage Room</a>
          </div>
        ` : ''}

        <!-- Doctor Worklists Grid -->
        <div class="dash-grid-2col">
          <!-- Today's OPD Appointments & Live Tokens -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('calendar', 'icon-sm text-teal')} Today's OPD Patient Queue</h3>
              <span class="badge badge-emerald">Live OPD</span>
            </div>
            <div class="card-body">
              <div class="opd-queue-table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Patient Name</th>
                      <th>Slot</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${apts.map(a => `
                      <tr>
                        <td><strong>${a.tokenNumber}</strong></td>
                        <td>${a.patientName} <br><small class="text-muted">${a.abhaId}</small></td>
                        <td>${a.slot}</td>
                        <td><span class="badge badge-teal">${a.status}</span></td>
                        <td>
                          <a href="#/records" class="btn btn-xs btn-outline">History</a>
                          <a href="#/teleconsult" class="btn btn-xs btn-primary">Consult</a>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Inward Referrals & Specialist Queue -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('repeat', 'icon-sm text-blue')} Referrals Inbox</h3>
              <a href="#/referrals" class="btn-link">View Tracking</a>
            </div>
            <div class="card-body">
              ${referrals.map(r => `
                <div class="referral-summary-card">
                  <div class="ref-top">
                    <h4>${r.patientName} (${r.urgency})</h4>
                    <span class="badge badge-amber">${r.status}</span>
                  </div>
                  <p class="text-sm">From: <strong>${r.fromFacility}</strong> &rarr; To: <strong>${r.toFacility}</strong></p>
                  <p class="text-sm text-muted">${r.clinicalSummary}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAdmin() {
    const s = window.Store.getState();
    const u = s.rolesProfiles.admin;

    return `
      <div class="dashboard-page">
        <!-- Admin Banner -->
        <div class="dash-welcome-banner admin-banner">
          <div class="welcome-text">
            <h2>${u.name} (District Health Officer)</h2>
            <p>${u.district} • ${u.state} Health Command Center</p>
          </div>
          <div class="welcome-actions">
            <a href="#/analytics" class="btn btn-purple">
              ${Icons.get('barChart', 'icon-sm')}
              <span>Impact & KPIs</span>
            </a>
            <a href="#/medicines" class="btn btn-outline-white">
              ${Icons.get('pill', 'icon-sm')}
              <span>Drug Inventory</span>
            </a>
          </div>
        </div>

        <!-- Hospital Preparedness & Readiness Metrics -->
        <div class="section-title-sm">Hospital Preparedness & Facility Readiness</div>
        <div class="stats-row-4">
          <div class="stat-card">
            <div class="stat-val text-teal">286 / 310</div>
            <div class="stat-lbl">District Beds Occupied (92%)</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-emerald">12 / 14</div>
            <div class="stat-lbl">On-Duty Medical Officers</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-blue">8</div>
            <div class="stat-lbl">108 Ambulances Active</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-red">3</div>
            <div class="stat-lbl">Medicines Below Critical Stock</div>
          </div>
        </div>

        <!-- Facilities Status Overview -->
        <div class="dash-grid-2col">
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('shield', 'icon-sm text-teal')} Health Facilities Network</h3>
              <span class="text-sm text-muted">Real-time telemetry</span>
            </div>
            <div class="card-body">
              <div class="facility-list">
                ${s.facilities.map(f => `
                  <div class="facility-item-row">
                    <div class="fac-details">
                      <h4>${f.name} <small class="text-muted">(${f.type})</small></h4>
                      <p class="text-sm">Doctor: ${f.doctorOnDuty} | Beds: ${f.beds} | Contact: ${f.phone}</p>
                    </div>
                    <span class="badge badge-emerald">Operational</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Blood Bank & Stock Monitoring -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>${Icons.get('droplet', 'icon-sm text-red')} e-RaktKosh Blood Stock Snapshot</h3>
              <a href="#/blood" class="btn-link">Full Registry</a>
            </div>
            <div class="card-body">
              <div class="blood-grid-chips">
                ${s.bloodBank.stock.map(b => `
                  <div class="blood-chip ${b.status === 'Critical' ? 'critical' : (b.status === 'Low' ? 'low' : '')}">
                    <span class="b-grp">${b.group}</span>
                    <span class="b-units">${b.units} Units</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
