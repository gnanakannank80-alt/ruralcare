// RuralCare Medicine Tracking & Pharmacy Inventory View (Module G)
// Team VisionX - SIH 2026

window.MedicinesView = {
  render() {
    const s = window.Store.getState();
    const meds = s.medicinesInventory || [];
    const prescriptions = s.fhirRecords.medicationRequests || [];
    const isAdminOrDoctor = s.currentUser.role === 'admin' || s.currentUser.role === 'doctor';

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('pill', 'icon-md text-teal')} Medicine Tracking & PHC Pharmacy Inventory</h2>
            <p class="text-muted">Real-time stock transparency across primary health centers and personalized dosage timers.</p>
          </div>
          <div>
            <button class="btn btn-outline" onclick="MedicinesView.triggerRefillSMS()">
              ${Icons.get('bell', 'icon-sm text-teal')}
              <span>Simulate Refill SMS</span>
            </button>
          </div>
        </div>

        <!-- Personal Dosage Reminder Schedule (Patient View) -->
        <div class="card mb-4">
          <div class="card-header bg-teal-light flex-between">
            <div class="flex-align">
              ${Icons.get('clock', 'icon-md text-teal')}
              <h3 class="text-teal mb-0">Daily Dosage Timetable for Active Prescriptions</h3>
            </div>
            <span class="badge badge-teal">Today's Schedule</span>
          </div>
          <div class="card-body">
            <div class="dosage-schedule-grid">
              <!-- Morning Slot -->
              <div class="dosage-slot-card">
                <div class="slot-header bg-surface">
                  <span class="slot-time">🌅 Morning (08:00 AM)</span>
                  <small class="text-muted">After Breakfast</small>
                </div>
                <div class="slot-meds">
                  <div class="med-dose-pill">
                    <strong>Metformin 500mg</strong>
                    <span class="text-xs text-muted">1 Tab with warm water</span>
                  </div>
                </div>
              </div>

              <!-- Afternoon Slot -->
              <div class="dosage-slot-card">
                <div class="slot-header bg-surface">
                  <span class="slot-time">☀️ Afternoon (01:30 PM)</span>
                  <small class="text-muted">After Lunch</small>
                </div>
                <div class="slot-meds">
                  <div class="med-dose-pill">
                    <strong>Multivitamin & Zinc</strong>
                    <span class="text-xs text-muted">1 Tab after meal</span>
                  </div>
                </div>
              </div>

              <!-- Night Slot -->
              <div class="dosage-slot-card">
                <div class="slot-header bg-surface">
                  <span class="slot-time">🌙 Night (08:30 PM)</span>
                  <small class="text-muted">After Dinner</small>
                </div>
                <div class="slot-meds">
                  <div class="med-dose-pill">
                    <strong>Metformin 500mg</strong>
                    <span class="text-xs text-muted">1 Tab before sleeping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-Time PHC Pharmacy Inventory Table -->
        <div class="card mb-4">
          <div class="card-header flex-between">
            <div class="flex-align">
              ${Icons.get('shield', 'icon-sm text-teal')}
              <h3 class="mb-0">PHC Rampur Pharmacy Stock Telemetry</h3>
            </div>
            <span class="text-xs text-muted">Auto-refreshed with central warehouse</span>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Medicine Name & Dosage</th>
                    <th>Form</th>
                    <th>Facility</th>
                    <th>Available Stock</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${meds.map(m => `
                    <tr>
                      <td><strong>${m.name}</strong></td>
                      <td><span class="badge badge-outline">${m.type}</span></td>
                      <td>${m.facility}</td>
                      <td>
                        <span class="font-mono font-bold ${m.stock === 0 ? 'text-red' : (m.stock <= m.minThreshold ? 'text-amber' : 'text-emerald')}">
                          ${m.stock} ${m.unit}
                        </span>
                      </td>
                      <td>
                        <span class="badge ${m.status === 'Out of Stock' ? 'badge-red' : (m.status === 'Low Stock' ? 'badge-amber' : 'badge-emerald')}">
                          ${m.status}
                        </span>
                        ${m.restockRequested ? `<div class="text-xs text-teal mt-1">✓ Restock Logged (${m.requestedUnits} units)</div>` : ''}
                      </td>
                      <td>
                        ${m.status === 'Out of Stock' ? `
                          <button class="btn btn-xs btn-emergency" onclick="MedicinesView.suggestAlternative('${m.name}')">
                            Find Nearest Alt
                          </button>
                          <button class="btn btn-xs btn-outline mt-1" onclick="MedicinesView.promptRestock('${m.id}', '${m.name}')">
                            Request Restock
                          </button>
                        ` : (m.status === 'Low Stock' ? `
                          <button class="btn btn-xs btn-amber" onclick="MedicinesView.promptRestock('${m.id}', '${m.name}')">
                            Refill Trigger
                          </button>
                        ` : `
                          <button class="btn btn-xs btn-outline" onclick="MedicinesView.reserveMed('${m.name}')">
                            Reserve for OPD
                          </button>
                        `)}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Out of Stock Prevention & Guidance Section -->
        <div class="card">
          <div class="card-header">
            <h3>Nearby Public Facilities Stock Lookup</h3>
          </div>
          <div class="card-body">
            <p class="text-sm text-muted">If your local PHC is temporarily out of essential medicines like Iron & Folic Acid or Antibiotics, the closest available stock is located below:</p>
            <div class="stock-locator-grid">
              <div class="locator-item">
                <span class="loc-name">CHC Bilaspur Pharmacy (14 km away)</span>
                <span class="loc-status text-emerald">Iron Folic Acid: 2,400 Tabs Available</span>
              </div>
              <div class="locator-item">
                <span class="loc-name">District Hospital Raigarh (28 km away)</span>
                <span class="loc-status text-emerald">Full Inventory Available (24/7 Dispensary)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async promptRestock(medId, medName) {
    const qty = prompt(`Enter restock batch size for ${medName}:`, '500');
    if (!qty) return;

    if (!navigator.onLine && window.IDBQueue) {
      await window.IDBQueue.enqueue('request_restock', { medId, units: qty }, `Restock ${medName}`);
      alert(`Offline mode: Restock requisition for ${qty} units of ${medName} queued locally!`);
    } else {
      window.Store.requestMedicineRestock(medId, qty);
      alert(`Requisition for ${qty} units of ${medName} dispatched to District Central Medical Stores.`);
    }
    window.Router.render();
  },

  suggestAlternative(name) {
    if (name.includes('Iron')) {
      alert(`Stock Alternative Available:\nIron & Folic Acid Tablets are stocked in CHC Bilaspur (14.5 km away) and with ASHA Worker Sunita Devi in Rampur for pregnant mothers.`);
    } else {
      alert(`Nearest stock for ${name} is available at CHC Bilaspur 24/7 pharmacy counter.`);
    }
  },

  reserveMed(name) {
    alert(`1 unit of ${name} tagged for pickup at PHC Rampur Dispensary under ABHA token.`);
  },

  triggerRefillSMS() {
    const s = window.Store.getState();
    const sms = {
      from: 'RuralCare-SMS',
      text: 'Refill Reminder: Your Metformin 500mg prescription expires in 3 days. PHC Rampur has 850 tabs in stock. Visit between 9 AM - 2 PM.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    s.ussdMessages.unshift(sms);
    s.notifications.unshift({
      id: 'nt_' + Date.now(),
      title: 'Medicine Refill Alert',
      message: sms.text,
      time: 'Just now',
      read: false,
      type: 'medicine'
    });
    window.Store.saveState();
    alert(`Simulated Refill SMS sent to your phone number (+91 98765 43210)! View it on the SMS/USSD Gateway screen.`);
    window.Router.render();
  }
};
