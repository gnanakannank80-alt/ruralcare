// RuralCare Health Camps & Village Outreach View (Module K)
// Team VisionX - SIH 2026

window.CampsView = {
  render() {
    const s = window.Store.getState();
    const camps = s.healthCamps || [];

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('tent', 'icon-md text-purple')} Rural Health Camps & Village Screenings</h2>
            <p class="text-muted">Targeted mobile outreach, diagnostic camps, and preventive health mobilization.</p>
          </div>
          <div>
            <button class="btn btn-purple" onclick="CampsView.broadcastCampAlert()">
              ${Icons.get('bell', 'icon-sm')}
              <span>Broadcast Village Alert (SMS)</span>
            </button>
          </div>
        </div>

        <!-- Camp Participation Statistics -->
        <div class="stats-row-4 mb-4">
          <div class="stat-card">
            <div class="stat-val text-purple">2</div>
            <div class="stat-lbl">Upcoming Village Camps</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-teal">240</div>
            <div class="stat-lbl">Pre-Registered Villagers</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-emerald">88%</div>
            <div class="stat-lbl">Avg. Attendance Turnout</div>
          </div>
          <div class="stat-card">
            <div class="stat-val text-blue">6</div>
            <div class="stat-lbl">Covered Gram Panchayats</div>
          </div>
        </div>

        <!-- Upcoming Health Camps Grid -->
        <div class="camps-grid mb-4">
          ${camps.map(camp => `
            <div class="card camp-card">
              <div class="card-header bg-purple-light flex-between">
                <div>
                  <span class="badge badge-purple">${camp.status}</span>
                  <span class="text-xs text-muted ml-2">${camp.date} • ${camp.time}</span>
                </div>
                <span class="badge badge-outline">${camp.registeredPatients} / ${camp.maxCapacity} Registered</span>
              </div>
              <div class="card-body">
                <h3 class="camp-title">${camp.title}</h3>
                <p class="text-sm mb-1"><strong>Venue:</strong> ${camp.village}</p>
                <p class="text-sm mb-2"><strong>Organized by:</strong> ${camp.organizer}</p>
                <p class="text-xs text-muted"><strong>Target Villages:</strong> ${camp.targetVillages.join(', ')}</p>

                <div class="camp-services-chips my-3">
                  ${camp.services.map(srv => `
                    <span class="service-chip">${srv}</span>
                  `).join('')}
                </div>

                <div class="camp-card-actions flex-between pt-2 border-top">
                  <button class="btn btn-sm btn-outline" onclick="CampsView.viewAttendance('${camp.id}', '${camp.title}')">
                    Track Attendance
                  </button>
                  <button class="btn btn-sm btn-purple" onclick="CampsView.registerForCamp('${camp.id}', '${camp.title}')">
                    ${Icons.get('plusCircle', 'icon-xs')} Register for Free Camp
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  registerForCamp(campId, campTitle) {
    const s = window.Store.getState();
    const camp = s.healthCamps.find(c => c.id === campId);
    if (camp) {
      camp.registeredPatients += 1;
      s.notifications.unshift({
        id: 'nt_' + Date.now(),
        title: 'Camp Registration Confirmed',
        message: `Registered for "${campTitle}" on ${camp.date} at ${camp.village}. Token slot confirmed.`,
        time: 'Just now',
        read: false,
        type: 'camp'
      });
      window.Store.saveState();
      window.Router.render();
      alert(`Success! You have been registered for ${campTitle}. A reminder SMS will be sent 24 hours prior to the camp.`);
    }
  },

  viewAttendance(campId, campTitle) {
    const s = window.Store.getState();
    const camp = s.healthCamps.find(c => c.id === campId);
    if (camp) {
      alert(`Camp Attendance Telemetry for "${campTitle}":\nRegistered: ${camp.registeredPatients}\nChecked In: ${Math.round(camp.registeredPatients * 0.72)}\nCataracts / Surgeries Screened: 18`);
    }
  },

  broadcastCampAlert() {
    const s = window.Store.getState();
    const msg = {
      from: 'RuralCare-CAMP',
      text: 'Public Notice: Free Eye Screening & Eyeglasses Camp at Rampur Panchayat Hall on 28 Sep 9 AM. Free consultations for elders & children.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    s.ussdMessages.unshift(msg);
    s.notifications.unshift({
      id: 'nt_' + Date.now(),
      title: 'Camp Broadcast Transmitted',
      message: msg.text,
      time: 'Just now',
      read: false,
      type: 'camp'
    });
    window.Store.saveState();
    alert('Public Broadcast SMS sent to all registered mobile devices in Rampur, Kotra, and Chicholi panchayats!');
    window.Router.render();
  }
};
