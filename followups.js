// RuralCare Follow-ups & Maternal/Child Health (MCH) View (Module H)
// Preventive Healthcare & ASHA Village Roster
// Team VisionX - SIH 2026

window.FollowupsView = {
  activeTab: 'all',

  render() {
    const s = window.Store.getState();
    const followups = s.followups || [];
    const mch = s.mchPrograms;
    const isAsha = s.currentUser.role === 'asha';

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('repeat', 'icon-md text-teal')} Clinical Follow-ups & Maternal-Child Care (MCH)</h2>
            <p class="text-muted">Proactive preventive health, home-visit checklists, and National Immunization tracking.</p>
          </div>
          <div>
            <button class="btn btn-primary" onclick="FollowupsView.addFollowupPrompt()">
              ${Icons.get('plusCircle', 'icon-sm')}
              <span>Schedule Follow-up</span>
            </button>
          </div>
        </div>

        <!-- Maternal & Child Health (ANC/PNC & Immunization) Section -->
        <div class="card mb-4">
          <div class="card-header bg-emerald-light flex-between">
            <div class="flex-align">
              ${Icons.get('heart', 'icon-md text-emerald')}
              <h3 class="text-emerald mb-0">Maternal & Child Health Care (RMNCH+A Standards)</h3>
            </div>
            <span class="badge badge-emerald">ANC/PNC & National Immunization</span>
          </div>
          <div class="card-body">
            <div class="dash-grid-2col">
              <!-- Antenatal & Postnatal Care (ANC / PNC) Milestones -->
              <div class="mch-column">
                <h4 class="mb-2 text-teal">Antenatal Care (ANC) Visits Schedule</h4>
                <div class="anc-milestone-list">
                  ${mch.ancMilestones.map(m => `
                    <div class="milestone-item flex-between">
                      <div>
                        <strong>${m.visit}</strong>
                        <div class="text-xs text-muted">${m.timeline}</div>
                      </div>
                      <span class="badge ${m.status === 'Completed' ? 'badge-emerald' : 'badge-amber'}">${m.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Universal Immunization Schedule -->
              <div class="mch-column">
                <h4 class="mb-2 text-blue">Universal Infant Immunization Schedule</h4>
                <div class="immunization-schedule-list">
                  ${mch.immunizationSchedule.map(imm => `
                    <div class="milestone-item flex-between">
                      <div>
                        <strong>${imm.stage}</strong>
                        <div class="text-xs text-muted">${imm.vaccines}</div>
                      </div>
                      <span class="badge ${imm.status === 'Administered' ? 'badge-emerald' : 'badge-teal'}">${imm.status}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Follow-up Patient Task List -->
        <div class="card mb-4">
          <div class="card-header flex-between">
            <h3>Scheduled Follow-ups & ASHA Home-Visit Tasks</h3>
            <span class="text-xs text-muted">Auto-generated from clinical discharges & OPD advice</span>
          </div>
          <div class="card-body">
            <div class="followup-items-wrap">
              ${followups.map(fu => `
                <div class="followup-card-item ${fu.status === 'Completed' ? 'status-done' : ''}">
                  <div class="fu-main-info flex-between">
                    <div>
                      <h4 class="mb-1">${fu.patientName}</h4>
                      <span class="badge badge-outline">${fu.category}</span>
                      <span class="text-xs text-muted ml-2">Assigned ASHA: <strong>${fu.assignedTo}</strong></span>
                    </div>
                    <div class="text-right">
                      <span class="badge ${fu.status === 'Completed' ? 'badge-emerald' : 'badge-amber'}">${fu.status}</span>
                      <div class="text-xs text-muted mt-1">Due: ${fu.dueDate}</div>
                    </div>
                  </div>

                  <div class="fu-notes mt-2 p-2 bg-surface rounded text-sm">
                    <strong>Checkup Instructions:</strong> ${fu.notes}
                  </div>

                  <div class="fu-actions-row mt-3 flex-between">
                    <div class="btn-group-sm">
                      <button class="btn btn-xs ${fu.status === 'Completed' ? 'btn-outline' : 'btn-emerald'}" onclick="FollowupsView.markStatus('${fu.id}', 'Completed')">
                        ✓ Mark Completed
                      </button>
                      <button class="btn btn-xs btn-outline text-amber" onclick="FollowupsView.markStatus('${fu.id}', 'Missed')">
                        ⚠ Mark Missed
                      </button>
                      <button class="btn btn-xs btn-outline" onclick="FollowupsView.sendSMSAlert('${fu.patientName}', '${fu.category}')">
                        ${Icons.get('smartphone', 'icon-xs')} Send SMS Reminder
                      </button>
                    </div>
                    <small class="text-muted">ABHA Sync Active</small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  markStatus(id, newStatus) {
    const s = window.Store.getState();
    const fu = s.followups.find(f => f.id === id);
    if (fu) {
      fu.status = newStatus;
      window.Store.saveState();
      window.Router.render();
    }
  },

  sendSMSAlert(name, category) {
    const s = window.Store.getState();
    const msg = {
      from: 'RuralCare-MCH',
      text: `Reminder for ${name}: Your scheduled ${category} checkup with ASHA Sunita Devi is due this week. Please be available at home.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    s.ussdMessages.unshift(msg);
    s.notifications.unshift({
      id: 'nt_' + Date.now(),
      title: 'Follow-up SMS Sent',
      message: msg.text,
      time: 'Just now',
      read: false,
      type: 'followup'
    });
    window.Store.saveState();
    alert(`SMS reminder transmitted to ${name}! View it on the SMS/USSD Gateway screen.`);
    window.Router.render();
  },

  addFollowupPrompt() {
    const patName = prompt('Enter Patient Name for Follow-up:', 'Ramesh Kumar');
    if (!patName) return;
    const cat = prompt('Enter Category (e.g. Hypertension Checkup, ANC Checkup, Post-OPD):', 'Hypertension & BP Check');
    const date = prompt('Enter Due Date (YYYY-MM-DD):', '2026-09-30');

    const newFu = {
      id: 'fu_' + Date.now(),
      patientName: patName,
      category: cat,
      dueDate: date || '2026-09-30',
      assignedTo: 'ASHA Sunita Devi',
      status: 'Scheduled',
      notes: 'Routine village home checkup and vitals assessment.'
    };

    const s = window.Store.getState();
    s.followups.unshift(newFu);
    window.Store.saveState();
    window.Router.render();
    alert(`Follow-up scheduled for ${patName}.`);
  }
};
