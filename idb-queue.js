// RuralCare IndexedDB Offline Action Queue & Auto-Sync Engine
// Smart India Hackathon 2026 - VisionX

const DB_NAME = 'RuralCareOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'action_queue';

class IDBQueue {
  constructor() {
    this.db = null;
    this.isSyncing = false;
    this.lastSyncTime = localStorage.getItem('ruralcare_last_sync') || 'Just now';
    this.init();
    this.bindNetworkEvents();
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('actionType', 'actionType', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.notifyQueueChanged();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[RuralCare IDB] Database error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  bindNetworkEvents() {
    window.addEventListener('online', () => {
      console.log('[RuralCare Network] Back online! Initiating auto-sync of queued actions...');
      this.syncAll();
    });

    window.addEventListener('offline', () => {
      console.log('[RuralCare Network] Operating in Offline mode.');
      this.notifyQueueChanged();
    });
  }

  async enqueue(actionType, payload, title = 'Action') {
    if (!this.db) {
      await this.init();
    }

    const item = {
      actionType,
      payload,
      title,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString(),
      status: 'pending_sync'
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(item);

      req.onsuccess = (e) => {
        item.id = e.target.result;
        console.log(`[RuralCare IDB] Enqueued offline action #${item.id} (${actionType})`);
        this.notifyQueueChanged();
        resolve(item);
      };

      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getQueue() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = (e) => resolve(e.target.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getPendingCount() {
    const queue = await this.getQueue();
    return queue.length;
  }

  async remove(id) {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => {
        this.notifyQueueChanged();
        resolve();
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async clearQueue() {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => {
        this.notifyQueueChanged();
        resolve();
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async syncAll() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    window.dispatchEvent(new CustomEvent('syncStatusChanged', { detail: { syncing: true } }));

    const queue = await this.getQueue();
    console.log(`[RuralCare Sync] Starting synchronization of ${queue.length} item(s)...`);

    for (const item of queue) {
      try {
        // Execute the action into the centralized store if not already committed
        if (item.actionType === 'book_appointment' && window.Store) {
          window.Store.addAppointment(item.payload);
        } else if (item.actionType === 'emergency_triage' && window.Store) {
          window.Store.addEmergency(item.payload);
        } else if (item.actionType === 'create_referral' && window.Store) {
          window.Store.addReferral(item.payload);
        } else if (item.actionType === 'request_restock' && window.Store) {
          window.Store.requestMedicineRestock(item.payload.medId, item.payload.units);
        } else if (item.actionType === 'add_observation' && window.Store) {
          window.Store.addClinicalObservation(item.payload);
        } else if (item.actionType === 'register_donor' && window.Store) {
          window.Store.registerBloodDonor(item.payload);
        }

        // Remove from IndexedDB once synced
        await this.remove(item.id);
      } catch (err) {
        console.error('[RuralCare Sync] Failed to sync item:', item, err);
      }
    }

    this.isSyncing = false;
    this.lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    localStorage.setItem('ruralcare_last_sync', this.lastSyncTime);

    if (window.Store) {
      window.Store.addNotification({
        title: 'Offline Sync Completed',
        message: `Successfully synchronized queued actions with the cloud registry.`,
        type: 'info',
        time: 'Just now'
      });
    }

    window.dispatchEvent(new CustomEvent('syncStatusChanged', {
      detail: { syncing: false, count: 0, lastSync: this.lastSyncTime }
    }));
    this.notifyQueueChanged();
  }

  async notifyQueueChanged() {
    const count = await this.getPendingCount();
    window.dispatchEvent(new CustomEvent('offlineQueueChanged', {
      detail: {
        count,
        isOnline: navigator.onLine,
        lastSync: this.lastSyncTime
      }
    }));
  }
}

window.IDBQueue = new IDBQueue();
