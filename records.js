// RuralCare Digital Health Records View (Module E)
// HL7 FHIR R4 & ABHA Integrated Longitudinal Health Record
// Team VisionX - SIH 2026

window.RecordsView = {
  activeTab: 'timeline',

  render() {
    const s = window.Store.getState();
    const u = s.currentUser;
    const isDoctorOrAsha = u.role === 'doctor' || u.role === 'asha';
    const fhir = s.fhirRecords;

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('fileText', 'icon-md text-teal')} Digital Health Records (EHR / ABHA)</h2>
            <p class="text-muted">HL7 FHIR R4 standard longitudinal clinical profile across PHC, CHC & District levels.</p>
          </div>
          <div class="header-action-group">
            <button class="btn btn-outline" onclick="RecordsView.exportFHIR()">
              ${Icons.get('download', 'icon-sm')}
              <span>Export FHIR R4 (JSON)</span>
            </button>
            ${isDoctorOrAsha ? `
              <button class="btn btn-primary" onclick="RecordsView.toggleAddRecordModal(true)">
                ${Icons.get('plusCircle', 'icon-sm')}
                <span>Add Clinical Entry</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- ABHA Health ID Card -->
        <div class="card abha-id-card-wrapper mb-4">
          <div class="abha-id-card">
            <div class="abha-card-header flex-between">
              <div class="flex-align">
                <div class="gov-emblem">🇮🇳</div>
                <div>
                  <h4 class="mb-0">Ayushman Bharat Digital Mission (ABDM)</h4>
                  <small>National Health Authority • Ministry of Health & Family Welfare</small>
                </div>
              </div>
              <span class="abha-chip-badge">ABHA VERIFIED</span>
            </div>

            <div class="abha-card-body flex-between mt-3">
              <div class="abha-user-info">
                <h2 class="user-fullname">${fhir.patient.name[0].given.join(' ')} ${fhir.patient.name[0].family}</h2>
                <div class="abha-number-highlight">${fhir.patient.identifier[0].value}</div>
                <div class="abha-meta-grid">
                  <div><strong>DOB:</strong> ${fhir.patient.birthDate} (${u.age || 38} Y / ${u.gender || 'M'})</div>
                  <div><strong>Blood Group:</strong> ${u.bloodGroup || 'B+'}</div>
                  <div><strong>Village:</strong> ${fhir.patient.address[0].city}, ${fhir.patient.address[0].district}</div>
                  <div><strong>Mobile:</strong> ${u.phone}</div>
                </div>
              </div>

              <div class="abha-qr-holder text-center">
                <div class="abha-mock-qr">
                  <div class="qr-pattern"></div>
                  <small>ABHA-QR</small>
                </div>
                <div class="consent-switch-wrapper mt-2">
                  <label class="consent-pill">
                    <input type="checkbox" id="consent-toggle" ${fhir.consentSharing ? 'checked' : ''} onchange="RecordsView.toggleConsent(this.checked)">
                    <span>Consent Sharing Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Record Sub-Navigation Tabs -->
        <div class="record-tabs-bar mb-3">
          <button class="record-tab ${this.activeTab === 'timeline' ? 'active' : ''}" onclick="RecordsView.setTab('timeline')">
            ${Icons.get('clock', 'icon-xs')} Clinical Timeline & Encounters
          </button>
          <button class="record-tab ${this.activeTab === 'labs' ? 'active' : ''}" onclick="RecordsView.setTab('labs')">
            ${Icons.get('activity', 'icon-xs')} Lab Observations & Vitals
          </button>
          <button class="record-tab ${this.activeTab === 'meds' ? 'active' : ''}" onclick="RecordsView.setTab('meds')">
            ${Icons.get('pill', 'icon-xs')} Active Prescriptions (Rx)
          </button>
          <button class="record-tab ${this.activeTab === 'vaccines' ? 'active' : ''}" onclick="RecordsView.setTab('vaccines')">
            ${Icons.get('shield', 'icon-xs')} Vaccinations & Allergies
          </button>
        </div>

        <!-- Tab 1: Clinical Timeline (FHIR Encounter) -->
        ${this.activeTab === 'timeline' ? `
          <div class="card mb-4">
            <div class="card-header flex-between">
              <h3>Encounter History (FHIR Resource: Encounter)</h3>
              <span class="text-xs text-muted">Aggregated across all connected public facilities</span>
            </div>
            <div class="card-body">
              <div class="fhir-timeline">
                ${fhir.encounters.map(enc => `
                  <div class="timeline-event-card">
                    <div class="event-marker"></div>
                    <div class="event-content">
                      <div class="event-header flex-between">
                        <h4>${enc.serviceType.text}</h4>
                        <span class="badge ${enc.class.code === 'EMER' ? 'badge-red' : 'badge-teal'}">${enc.class.display.toUpperCase()}</span>
                      </div>
                      <p class="text-sm"><strong>Provider:</strong> ${enc.serviceProvider.display} | <strong>Date:</strong> ${enc.period.start}</p>
                      <p class="text-sm text-muted"><strong>Clinical Diagnosis & Notes:</strong> ${enc.reasonCode[0].text}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 2: Observations & Vitals (FHIR Observation) -->
        ${this.activeTab === 'labs' ? `
          <div class="card mb-4">
            <div class="card-header flex-between">
              <h3>Diagnostic Observations (FHIR Resource: Observation)</h3>
              <span class="text-xs text-muted">Laboratory and vital telemetry readings</span>
            </div>
            <div class="card-body">
              <div class="observations-grid">
                ${fhir.observations.map(obs => `
                  <div class="observation-card">
                    <div class="obs-title">${obs.code.text}</div>
                    <div class="obs-val">${obs.valueQuantity ? `${obs.valueQuantity.value} ${obs.valueQuantity.unit}` : obs.valueString}</div>
                    <div class="obs-meta">
                      <span>Date: ${obs.effectiveDateTime}</span>
                      ${obs.referenceRange ? `<span class="text-muted">Normal: ${obs.referenceRange[0].low.value} - 100</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Prescriptions (FHIR MedicationRequest) -->
        ${this.activeTab === 'meds' ? `
          <div class="card mb-4">
            <div class="card-header flex-between">
              <h3>Active Prescriptions (FHIR Resource: MedicationRequest)</h3>
              <a href="#/medicines" class="btn-link">Check PHC Stock &rarr;</a>
            </div>
            <div class="card-body">
              <div class="med-requests-list">
                ${fhir.medicationRequests.map(med => `
                  <div class="med-req-item">
                    <div class="med-req-header flex-between">
                      <h4>${med.medicationCodeableConcept.text}</h4>
                      <span class="badge badge-emerald">${med.status}</span>
                    </div>
                    <p class="text-sm"><strong>Instruction:</strong> ${med.dosageInstruction[0].text}</p>
                    <p class="text-xs text-muted">Prescribed by: ${med.requester.display} on ${med.authoredOn} | Remaining Refills: ${med.remainingRefills}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 4: Vaccinations & Allergies -->
        ${this.activeTab === 'vaccines' ? `
          <div class="dash-grid-2col mb-4">
            <div class="card">
              <div class="card-header">
                <h3>Immunization Records</h3>
              </div>
              <div class="card-body">
                <ul class="clean-list">
                  ${fhir.vaccinations.map(v => `
                    <li class="clean-list-item flex-between">
                      <div>
                        <strong>${v.vaccine}</strong>
                        <div class="text-xs text-muted">${v.place}</div>
                      </div>
                      <span class="badge badge-outline">${v.date}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Documented Allergies & Sensitivities</h3>
              </div>
              <div class="card-body">
                <div class="allergies-box">
                  ${fhir.allergies.map(a => `
                    <div class="allergy-tag">
                      ${Icons.get('alertTriangle', 'icon-xs text-red')}
                      <span>${a}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Add Clinical Entry Modal (Doctor / ASHA) -->
        <div id="add-entry-modal" class="modal-overlay hidden">
          <div class="modal-card">
            <div class="modal-header flex-between">
              <h3>Add Clinical Observation or Diagnosis</h3>
              <button class="modal-close" onclick="RecordsView.toggleAddRecordModal(false)">&times;</button>
            </div>
            <div class="modal-body">
              <form id="add-obs-form" onsubmit="RecordsView.handleAddObservation(event)">
                <div class="form-group mb-2">
                  <label>Clinical Metric / Test Name *</label>
                  <input type="text" id="new-obs-name" class="form-control" placeholder="e.g. Random Blood Sugar, Hemoglobin, BP" required />
                </div>
                <div class="form-group mb-2">
                  <label>Result Value & Unit *</label>
                  <input type="text" id="new-obs-val" class="form-control" placeholder="e.g. 110 mg/dL or 120/80 mmHg" required />
                </div>
                <div class="form-actions mt-3">
                  <button type="submit" class="btn btn-primary btn-block">Save to ABHA Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    window.Router.render();
  },

  toggleConsent(checked) {
    const s = window.Store.getState();
    s.fhirRecords.consentSharing = checked;
    window.Store.saveState();
    alert(`Consent preference updated: Health record sharing is now ${checked ? 'ACTIVE' : 'RESTRICTED'}.`);
  },

  toggleAddRecordModal(show) {
    const el = document.getElementById('add-entry-modal');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  handleAddObservation(e) {
    e.preventDefault();
    const name = document.getElementById('new-obs-name').value;
    const val = document.getElementById('new-obs-val').value;

    const newObs = {
      code: { text: name },
      valueString: val
    };

    window.Store.addClinicalObservation(newObs);
    this.toggleAddRecordModal(false);
    this.setTab('labs');
    alert(`Clinical observation "${name}" recorded successfully.`);
  },

  exportFHIR() {
    const s = window.Store.getState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(s.fhirRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RuralCare_ABHA_${s.fhirRecords.patient.id}_FHIR.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
