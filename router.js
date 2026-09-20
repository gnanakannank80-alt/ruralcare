// RuralCare Single Page Application Hash Router
// Team VisionX - SIH 2026

class Router {
  constructor() {
    this.routes = {
      '': window.LandingView,
      '/': window.LandingView,
      '/login': window.LoginView,
      '/dashboard-patient': { render: () => window.DashboardsView.renderPatient() },
      '/dashboard-asha': { render: () => window.DashboardsView.renderAsha() },
      '/dashboard-doctor': { render: () => window.DashboardsView.renderDoctor() },
      '/dashboard-admin': { render: () => window.DashboardsView.renderAdmin() },
      '/appointments': window.AppointmentsView,
      '/emergency': window.EmergencyView,
      '/ambulance': window.AmbulanceView,
      '/teleconsult': window.TeleconsultView,
      '/records': window.RecordsView,
      '/referrals': window.ReferralsView,
      '/medicines': window.MedicinesView,
      '/followups': window.FollowupsView,
      '/offline': window.OfflineView,
      '/blood': window.BloodView,
      '/organ': window.OrganView,
      '/fund': window.FundView,
      '/camps': window.CampsView,
      '/analytics': window.AnalyticsView,
      '/ussd-sms': window.UssdView,
      '/about': window.AboutView
    };

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  getCurrentPath() {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '');
  }

  async handleRoute() {
    let path = this.getCurrentPath();
    if (!path.startsWith('/')) path = '/' + path;

    const view = this.routes[path] || window.LandingView;
    const appEl = document.getElementById('app');
    if (!appEl) return;

    // Render view HTML
    if (typeof view.render === 'function') {
      const content = await view.render();
      appEl.innerHTML = content;
    }

    // Post-render lifecycle hooks
    if (path === '/ambulance' && window.AmbulanceView && typeof window.AmbulanceView.initMap === 'function') {
      setTimeout(() => window.AmbulanceView.initMap(), 100);
    } else if (path === '/analytics' && window.AnalyticsView && typeof window.AnalyticsView.initChart === 'function') {
      setTimeout(() => window.AnalyticsView.initChart(), 100);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav links
    this.updateActiveNav(path);

    // Apply i18n
    if (window.i18n) {
      window.i18n.applyTranslations(appEl);
    }

    // Dispatch routed event
    window.dispatchEvent(new CustomEvent('routed', { detail: { path } }));
  }

  updateActiveNav(path) {
    document.querySelectorAll('.nav-link, .dock-item').forEach((el) => {
      const href = el.getAttribute('href') || '';
      const cleanHref = href.replace(/^#/, '');
      if (cleanHref === path || (path === '/' && cleanHref === '')) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  render() {
    this.handleRoute();
  }
}

window.Router = new Router();
