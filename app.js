// RuralCare Main Application Controller & Global Event Bindings
// Team VisionX - Smart India Hackathon 2026 (SIH26133)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('[RuralCare App] Service Worker registered with scope:', reg.scope))
      .catch((err) => console.warn('[RuralCare App] Service Worker registration failed:', err));
  }

  // 2. Initialize Language Switcher Dropdown
  const langSelect = document.getElementById('global-lang-select');
  if (langSelect && window.i18n) {
    langSelect.value = window.i18n.currentLang;
    langSelect.addEventListener('change', (e) => {
      window.i18n.setLanguage(e.target.value);
      window.Router.render();
    });
  }

  // 3. Online / Offline Connectivity Listeners
  const updateNetworkStatus = () => {
    const isOnline = navigator.onLine;
    const badge = document.getElementById('connection-status-pill');
    const banner = document.getElementById('offline-notice-banner');

    if (badge) {
      if (isOnline) {
        badge.className = 'status-pill online';
        badge.innerHTML = `<span class="pill-dot"></span><span>Online</span>`;
      } else {
        badge.className = 'status-pill offline';
        badge.innerHTML = `<span class="pill-dot"></span><span>Offline (IDB Active)</span>`;
      }
    }

    if (banner) {
      if (isOnline) {
        banner.classList.add('hidden');
      } else {
        banner.classList.remove('hidden');
      }
    }
  };

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

  // 4. Update Pending Offline Sync Badge
  window.addEventListener('offlineQueueChanged', (e) => {
    const count = e.detail.count;
    const syncBadge = document.getElementById('offline-queue-badge');
    if (syncBadge) {
      if (count > 0) {
        syncBadge.textContent = `${count} Pending`;
        syncBadge.classList.remove('hidden');
      } else {
        syncBadge.classList.add('hidden');
      }
    }
  });

  // 5. Notification Center Drawer Toggle
  const notifBtn = document.getElementById('notif-bell-btn');
  const notifDrawer = document.getElementById('notification-drawer');
  const closeNotifBtn = document.getElementById('close-notif-drawer');

  if (notifBtn && notifDrawer) {
    notifBtn.addEventListener('click', () => {
      renderNotificationsList();
      notifDrawer.classList.toggle('open');
      if (window.Store) window.Store.markAllNotificationsRead();
      updateNotifCounter();
    });
  }

  if (closeNotifBtn && notifDrawer) {
    closeNotifBtn.addEventListener('click', () => {
      notifDrawer.classList.remove('open');
    });
  }

  const renderNotificationsList = () => {
    const listEl = document.getElementById('drawer-notifications-list');
    if (!listEl || !window.Store) return;

    const s = window.Store.getState();
    const notifs = s.notifications || [];

    if (notifs.length === 0) {
      listEl.innerHTML = `<p class="text-muted text-center p-3">No new notifications.</p>`;
      return;
    }

    listEl.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.read ? 'read' : 'unread'}">
        <div class="notif-title flex-between">
          <strong>${n.title}</strong>
          <small class="text-muted">${n.time}</small>
        </div>
        <p class="notif-msg text-sm">${n.message}</p>
      </div>
    `).join('');
  };

  const updateNotifCounter = () => {
    const badge = document.getElementById('notif-count-badge');
    if (!badge || !window.Store) return;
    const s = window.Store.getState();
    const unread = (s.notifications || []).filter(n => !n.read).length;
    if (unread > 0) {
      badge.textContent = unread;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  };

  window.addEventListener('stateChanged', () => {
    updateNotifCounter();
    updateUserProfileBadge();
  });

  // 6. User Profile & Role Switcher
  const profileBtn = document.getElementById('profile-menu-btn');
  const profileModal = document.getElementById('role-switch-modal');
  const closeProfileModal = document.getElementById('close-role-modal');

  if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', () => {
      profileModal.classList.remove('hidden');
    });
  }

  if (closeProfileModal && profileModal) {
    closeProfileModal.addEventListener('click', () => {
      profileModal.classList.add('hidden');
    });
  }

  const updateUserProfileBadge = () => {
    const avatarEl = document.getElementById('top-bar-user-name');
    const roleEl = document.getElementById('top-bar-user-role');
    if (avatarEl && window.Store) {
      const u = window.Store.getState().currentUser;
      avatarEl.textContent = u.name.split(' ')[0];
      if (roleEl) roleEl.textContent = u.role.toUpperCase();
    }
  };
  updateUserProfileBadge();

  // 7. Global Voice Assistant Buttons
  const micBtn = document.getElementById('mic-toggle-btn');
  if (micBtn && window.VoiceAssistant) {
    micBtn.addEventListener('click', () => {
      window.VoiceAssistant.toggleListening();
    });
  }

  const speakerBtn = document.getElementById('speaker-toggle-btn');
  if (speakerBtn && window.VoiceAssistant) {
    speakerBtn.addEventListener('click', () => {
      window.VoiceAssistant.readActiveScreen();
    });
  }

  // 8. Global SOS Floating Action Trigger
  const globalSosBtn = document.getElementById('global-sos-btn');
  if (globalSosBtn) {
    globalSosBtn.addEventListener('click', () => {
      window.location.hash = '#/emergency';
    });
  }

  // 9. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('top-nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show-mobile');
    });
    // Auto-close when clicking any link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('show-mobile');
      });
    });
  }

  // 10. Start SPA Router
  if (window.Router) {
    window.Router.init();
  }
  updateNotifCounter();
});

// Global Helper to switch role from anywhere
window.quickSwitchRole = function(role) {
  if (window.Store) {
    window.Store.switchRole(role);
    const modal = document.getElementById('role-switch-modal');
    if (modal) modal.classList.add('hidden');
    const targetMap = {
      patient: '#/dashboard-patient',
      asha: '#/dashboard-asha',
      doctor: '#/dashboard-doctor',
      admin: '#/dashboard-admin'
    };
    window.location.hash = targetMap[role] || '#/';
  }
};
