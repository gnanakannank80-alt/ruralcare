// RuralCare Emergency Priority & Triage View (Module B)
// Team VisionX - SIH 2026

window.EmergencyView = {
  render() {
    const s = window.Store.getState();
    const incidents = s.emergencyIncidents || [];

    return `
      <div class="view-page emergency-page">
        <!-- Emergency Alert Banner -->
        <div class="emergency-hero-banner">
          <div class="emg-hero-content">
            <div class="emg-pulse-ring">${Icons.get('sos', 'icon-xl')}</div>
            <div>
              <h1 class="text-white">Emergency Priority Assessment & SOS</h1>
              <p class="text-white-dim">
                Immediate algorithmic clinical triage for rural accidents, cardiac crises, snakebites, and maternal distress.
              </p>
            </div>
          </div>
          <div class="emg-quick-call">
            <a href="tel:108" class="btn btn-white-emergency btn-lg">
              ${Icons.get('phone', 'icon-md text-red')}
              <span>Dial 108 (National Ambulance)</span>
            </a>
          </div>
        </div>

        <!-- Triage Assessment Form -->
        <div class="card mb-4">
          <div class="card-header bg-red-light flex-between">
            <div class="flex-align">
              ${Icons.get('alertTriangle', 'icon-md text-red')}
              <h3 class="text-red mb-0">Rapid Clinical Triage & Queue Escalation</h3>
            </div>
            <span class="badge badge-red">Red Flag Assessment</span>
          </div>
          <div class="card-body">
            <p class="text-muted">
              Select all symptoms observed. RuralCare's triage algorithm computes severity index, escalates the patient to Priority Rank #1, and transmits real-time telemetry to the nearest PHC and District Hospital.
            </p>

            <form id="emergency-triage-form" onsubmit="EmergencyView.handleTriageSubmit(event)">
              <div class="grid-2col mb-3">
                <div class="form-group">
                  <label>Patient Full Name *</label>
                  <input type="text" id="emg-patient-name" class="form-control" value="${s.currentUser.name}" required />
                </div>
                <div class="form-group">
                  <label>Contact Phone Number *</label>
                  <input type="tel" id="emg-phone" class="form-control" value="${s.currentUser.phone}" required />
                </div>
              </div>

              <div class="grid-2col mb-3">
                <div class="form-group">
                  <label>Patient Age & Gender *</label>
                  <div class="grid-2col" style="gap: 8px;">
                    <input type="number" id="emg-age" class="form-control" placeholder="Age" value="45" required />
                    <select id="emg-gender" class="form-control">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label>Current Village / Landmark Location *</label>
                  <input type="text" id="emg-location" class="form-control" value="Village Rampur, Near Main Peepal Tree" required />
                </div>
              </div>

              <!-- Symptom Red Flags Checklist -->
              <div class="form-group mb-3">
                <label><strong>Check All Observed Critical Symptoms:</strong></label>
                <div class="symptom-checklist-grid mt-2">
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Severe Chest Pain / Heart Squeeze" data-weight="3" onchange="EmergencyView.recalculateSeverity()">
                    <span>Severe Chest Pain / Pressure</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Severe Breathlessness / Choking" data-weight="3" onchange="EmergencyView.recalculateSeverity()">
                    <span>Severe Breathlessness / Gasping</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Active Heavy Bleeding / Deep Trauma" data-weight="3" onchange="EmergencyView.recalculateSeverity()">
                    <span>Heavy Bleeding / Fracture / Head Injury</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Unconsciousness / Collapse / Seizures" data-weight="3" onchange="EmergencyView.recalculateSeverity()">
                    <span>Unconsciousness / Fits / Fainting</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Snakebite / Scorpion / Toxic Ingestion" data-weight="3" onchange="EmergencyView.recalculateSeverity()">
                    <span>Snakebite / Poisoning Suspected</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Active Labor Pains / Obstetric Distress" data-weight="2" onchange="EmergencyView.recalculateSeverity()">
                    <span>Active Labor Pains / Pregnancy Bleeding</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="High Fever with Rigid Neck / Stupor" data-weight="2" onchange="EmergencyView.recalculateSeverity()">
                    <span>High Fever with Confusion / Rigid Neck</span>
                  </label>
                  <label class="symptom-item-card">
                    <input type="checkbox" name="symptom" value="Severe Abdominal Pain / Continuous Vomiting" data-weight="1" onchange="EmergencyView.recalculateSeverity()">
                    <span>Severe Acute Abdominal Pain</span>
                  </label>
                </div>
              </div>

              <!-- Computed Priority Meter -->
              <div class="priority-meter-box mb-4" id="priority-result-box">
                <div class="meter-header">
                  <span class="lbl">Automated Triage Assessment:</span>
                  <span class="priority-badge-lg badge-normal" id="computed-priority-badge">NORMAL PRIORITY</span>
                </div>
                <div class="recommended-hospital" id="nearest-hospital-recommendation">
                  <strong>Nearest Recommended Center:</strong> PHC Rampur Emergency Stabilizing Room (1.2 km away)
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-emergency btn-lg btn-block">
                  ${Icons.get('sos', 'icon-md')}
                  <span>Submit Triage & Push to Top of Emergency Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Recent Emergency Incidents & Response Registry -->
        <div class="card">
          <div class="card-header flex-between">
            <h3>Recent Triage Incidents & Hospital Dispatch Log</h3>
            <a href="#/ambulance" class="btn-link">View Live Ambulance Fleet Map &rarr;</a>
          </div>
          <div class="card-body">
            <div class="incidents-list">
              ${incidents.map(inc => `
                <div class="incident-item ${inc.severity === 'Critical' ? 'border-critical' : ''}">
                  <div class="incident-header flex-between">
                    <div>
                      <span class="badge ${inc.severity === 'Critical' ? 'badge-red' : 'badge-amber'}">
                        ${inc.severity} Priority
                      </span>
                      <strong class="ml-2">${inc.patientName} (${inc.age} yrs)</strong>
                      <span class="text-muted ml-2">• ${inc.phone}</span>
                    </div>
                    <span class="text-sm text-muted">${inc.timestamp}</span>
                  </div>
                  <div class="incident-body mt-2">
                    <p class="text-sm"><strong>Reported Symptoms:</strong> ${Array.isArray(inc.symptoms) ? inc.symptoms.join(', ') : inc.symptoms}</p>
                    <p class="text-sm"><strong>Routed Facility:</strong> ${inc.assignedFacility || 'PHC Rampur'}</p>
                    <p class="text-sm text-emerald"><strong>Status:</strong> ${inc.status}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  recalculateSeverity() {
    const checked = Array.from(document.querySelectorAll('input[name="symptom"]:checked'));
    let totalScore = 0;
    checked.forEach(cb => {
      totalScore += parseInt(cb.getAttribute('data-weight') || '1', 10);
    });

    const badge = document.getElementById('computed-priority-badge');
    const rec = document.getElementById('nearest-hospital-recommendation');
    if (!badge || !rec) return;

    if (totalScore >= 3) {
      badge.textContent = 'CRITICAL (Priority Rank 1 - Immediate Resuscitation)';
      badge.className = 'priority-badge-lg badge-red';
      rec.innerHTML = '<strong>Highest Recommendation:</strong> Direct Ambulance Transfer &rarr; CHC Bilaspur / District Hospital ICU. Alert Transmitted.';
    } else if (totalScore >= 2) {
      badge.textContent = 'HIGH PRIORITY (Priority Rank 2 - Urgent Attention)';
      badge.className = 'priority-badge-lg badge-amber';
      rec.innerHTML = '<strong>Recommendation:</strong> Fast-Track Bed at PHC Rampur. Doctor Notified.';
    } else {
      badge.textContent = 'NORMAL PRIORITY (Routine OPD Consultation)';
      badge.className = 'priority-badge-lg badge-normal';
      rec.innerHTML = '<strong>Recommendation:</strong> General OPD Consultation at PHC Rampur.';
    }
  },

  async handleTriageSubmit(e) {
    e.preventDefault();
    const checked = Array.from(document.querySelectorAll('input[name="symptom"]:checked'));
    const symptoms = checked.map(c => c.value);

    let totalScore = 0;
    checked.forEach(cb => {
      totalScore += parseInt(cb.getAttribute('data-weight') || '1', 10);
    });

    const severity = totalScore >= 3 ? 'Critical' : (totalScore >= 2 ? 'High' : 'Normal');
    const patientName = document.getElementById('emg-patient-name').value;
    const phone = document.getElementById('emg-phone').value;
    const age = document.getElementById('emg-age').value;
    const location = document.getElementById('emg-location').value;

    const payload = {
      patientName,
      phone,
      age,
      location,
      symptoms: symptoms.length > 0 ? symptoms : ['General Acute Malaise'],
      severity,
      assignedFacility: severity === 'Critical' ? 'District Hospital Raigarh (Trauma Ward)' : 'PHC Rampur (Emergency Bed 1)',
      vitals: { bp: '135/90', pulse: '98 bpm', spO2: '96%' }
    };

    if (!navigator.onLine && window.IDBQueue) {
      await window.IDBQueue.enqueue('emergency_triage', payload, `Emergency Triage: ${patientName}`);
      alert('Offline Mode: Triage saved locally and queued for immediate transmission upon network sync!');
    } else {
      window.Store.addEmergency(payload);
      if (window.VoiceAssistant) {
        window.VoiceAssistant.speak(`Emergency triage submitted with ${severity} severity. Hospital alert and ambulance dispatch triggered.`);
      }
      alert(`EMERGENCY ALERT BROADCASTED!\nSeverity: ${severity}\nAssigned: ${payload.assignedFacility}\nAmbulance dispatched to ${location}.`);
    }

    // Auto-navigate to ambulance tracking screen
    window.location.hash = '#/ambulance';
  }
};
