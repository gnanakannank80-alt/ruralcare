// RuralCare Offline Access & Sync Queue Center (Module I)
// Team VisionX - SIH 2026

window.OfflineView = {
  queueItems: [],

  async render() {
    this.queueItems = window.IDBQueue ? await window.IDBQueue.getQueue() : [];
    const isOnline = navigator.onLine;
    const lastSync = window.IDBQueue ? window.IDBQueue.lastSyncTime : 'Just now';

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('wifiOff', 'icon-md text-teal')} Offline Resilience & Data Synchronization Center</h2>
            <p class="text-muted">IndexedDB transaction ledger, conflict-free local queuing, and background auto-sync.</p>
          </div>
          <div class="header-action-group">
            <button class="btn ${isOnline ? 'btn-emerald' : 'btn-amber'}" onclick="OfflineView.triggerSync()">
              ${Icons.get('sync', 'icon-sm')}
              <span>Sync All Queued Data Now</span>
            </button>
          </div>
        </div>

        <!-- Network Simulation Control Pill for Hackathon Judges -->
        <div class="card mb-4 bg-surface border-teal">
          <div class="card-body flex-between">
            <div class="flex-align">
              <div class="status-indicator-dot ${isOnline ? 'online' : 'offline'}"></div>
              <div>
                <strong>Current Browser Connection: ${isOnline ? 'ONLINE (Cloud Connected)' : 'OFFLINE (Local IndexedDB Active)'}</strong>
                <p class="text-xs text-muted mb-0">Last successful synchronization with district health server: <strong>${lastSync}</strong></p>
              </div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline" onclick="OfflineView.simulateOfflineAction()">
                + Enqueue Demo Offline Action
              </button>
            </div>
          </div>
        </div>

        <!-- Core Offline Capabilities Matrix -->
        <div class="card mb-4">
          <div class="card-header">
            <h3>Offline-Ready Core Clinical Modules</h3>
          </div>
          <div class="card-body">
            <div class="offline-modules-grid">
              <div class="offline-feature-pill">
                <span class="feat-icon text-teal">${Icons.get('calendar', 'icon-sm')}</span>
                <div>
                  <strong>Smart Appointments</strong>
                  <div class="text-xs text-muted">Offline booking stored in IndexedDB queue</div>
                </div>
                <span class="badge badge-emerald">Cached 100%</span>
              </div>

              <div class="offline-feature-pill">
                <span class="feat-icon text-red">${Icons.get('sos', 'icon-sm')}</span>
                <div>
                  <strong>Emergency SOS Triage</strong>
                  <div class="text-xs text-muted">Immediate local assessment & high priority queue</div>
                </div>
                <span class="badge badge-emerald">Cached 100%</span>
              </div>

              <div class="offline-feature-pill">
                <span class="feat-icon text-teal">${Icons.get('fileText', 'icon-sm')}</span>
                <div>
                  <strong>ABHA Health Records</strong>
                  <div class="text-xs text-muted">Offline local copy of prescriptions & encounters</div>
                </div>
                <span class="badge badge-emerald">Cached 100%</span>
              </div>

              <div class="offline-feature-pill">
                <span class="feat-icon text-blue">${Icons.get('pill', 'icon-sm')}</span>
                <div>
                  <strong>Medicine Inventory</strong>
                  <div class="text-xs text-muted">Dosage timetables & stock snapshot saved</div>
                </div>
                <span class="badge badge-emerald">Cached 100%</span>
              </div>

              <div class="offline-feature-pill">
                <span class="feat-icon text-emerald">${Icons.get('users', 'icon-sm')}</span>
                <div>
                  <strong>Maternal & Child Health</strong>
                  <div class="text-xs text-muted">ASHA immunization and ANC checklists</div>
                </div>
                <span class="badge badge-emerald">Cached 100%</span>
              </div>

              <div class="offline-feature-pill">
                <span class="feat-icon text-purple">${Icons.get('smartphone', 'icon-sm')}</span>
                <div>
                  <strong>USSD / SMS Feature Phone</strong>
                  <div class="text-xs text-muted">Zero-internet GSM fallback via *123#</div>
                </div>
                <span class="badge badge-emerald">Available 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Offline Transactions Table -->
        <div class="card">
          <div class="card-header flex-between">
            <div class="flex-align">
              ${Icons.get('sync', 'icon-sm text-amber')}
              <h3 class="mb-0">IndexedDB Action Queue (${this.queueItems.length} Pending Actions)</h3>
            </div>
            ${this.queueItems.length > 0 ? `
              <button class="btn btn-xs btn-outline text-red" onclick="OfflineView.clearAllQueue()">Clear Queue</button>
            ` : ''}
          </div>
          <div class="card-body">
            ${this.queueItems.length === 0 ? `
              <div class="empty-queue-message text-center p-4">
                <div class="mb-2">${Icons.get('checkCircle', 'icon-xl text-emerald')}</div>
                <h4>All Local Changes Synchronized!</h4>
                <p class="text-muted text-sm">There are no pending offline mutations in the browser IndexedDB queue.</p>
              </div>
            ` : `
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Action ID</th>
                      <th>Type & Summary</th>
                      <th>Logged At</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.queueItems.map(item => `
                      <tr>
                        <td>#${item.id}</td>
                        <td>
                          <strong>${item.title || item.actionType}</strong><br>
                          <small class="text-muted font-mono">${JSON.stringify(item.payload).substring(0, 50)}...</small>
                        </td>
                        <td>${item.displayTime}</td>
                        <td><span class="badge badge-amber">${item.status}</span></td>
                        <td>
                          <button class="btn btn-xs btn-outline text-red" onclick="OfflineView.removeItem(${item.id})">
                            Discard
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  async triggerSync() {
    if (window.IDBQueue) {
      await window.IDBQueue.syncAll();
      alert('Manual synchronization completed. All queued operations processed.');
      window.Router.render();
    }
  },

  async removeItem(id) {
    if (window.IDBQueue) {
      await window.IDBQueue.remove(id);
      window.Router.render();
    }
  },

  async clearAllQueue() {
    if (confirm('Clear all pending offline mutations?')) {
      if (window.IDBQueue) {
        await window.IDBQueue.clearQueue();
        window.Router.render();
      }
    }
  },

  async simulateOfflineAction() {
    if (window.IDBQueue) {
      await window.IDBQueue.enqueue('book_appointment', {
        patientName: 'Kishore Patel',
        facility: 'PHC Rampur',
        department: 'General Medicine',
        doctor: 'Dr. Arvind Sharma',
        date: '2026-09-24',
        slot: '09:30 AM - 10:00 AM'
      }, 'Demo Offline OPD Booking');
      window.Router.render();
      alert('Demo offline appointment enqueued into IndexedDB! Check the table below or click "Sync All Queued Data Now" to commit it.');
    }
  }
};
