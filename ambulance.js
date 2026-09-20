// RuralCare Ambulance Tracking & GPS Dispatch View (Module C)
// Team VisionX - SIH 2026

window.AmbulanceView = {
  mapInstance: null,
  driverMarker: null,
  patientMarker: null,
  simInterval: null,

  render() {
    const s = window.Store.getState();
    const amb = s.ambulanceTrip;

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('ambulance', 'icon-md text-red')} Live GPS Ambulance Tracking</h2>
            <p class="text-muted">Real-time telemetry, driver coordinates, and emergency transit timeline.</p>
          </div>
          <div>
            <button class="btn btn-outline" onclick="AmbulanceView.detectPatientGPS()">
              ${Icons.get('mapPin', 'icon-sm text-teal')}
              <span>Auto-Detect My GPS</span>
            </button>
          </div>
        </div>

        <!-- 5-Stage Emergency Transit Timeline -->
        <div class="card mb-4 p-3">
          <div class="ambulance-timeline">
            <div class="timeline-step ${amb.statusIndex >= 0 ? 'completed' : ''}">
              <div class="step-circle">${amb.statusIndex > 0 ? '✓' : '1'}</div>
              <div class="step-label">Requested</div>
            </div>
            <div class="timeline-step ${amb.statusIndex >= 1 ? 'completed' : ''}">
              <div class="step-circle">${amb.statusIndex > 1 ? '✓' : '2'}</div>
              <div class="step-label">Assigned</div>
            </div>
            <div class="timeline-step ${amb.statusIndex >= 2 ? 'active' : ''}">
              <div class="step-circle">3</div>
              <div class="step-label">On the Way</div>
            </div>
            <div class="timeline-step ${amb.statusIndex >= 3 ? 'completed' : ''}">
              <div class="step-circle">4</div>
              <div class="step-label">Arrived at Patient</div>
            </div>
            <div class="timeline-step ${amb.statusIndex >= 4 ? 'completed' : ''}">
              <div class="step-circle">5</div>
              <div class="step-label">Reached Hospital</div>
            </div>
          </div>
        </div>

        <!-- Main Tracking Grid -->
        <div class="dash-grid-2col mb-4">
          <!-- Leaflet Live Map Card -->
          <div class="card">
            <div class="card-header flex-between">
              <div class="flex-align">
                <span class="live-dot-pulse"></span>
                <h3 class="mb-0">Live Road Tracking Map</h3>
              </div>
              <span class="badge badge-red">GPS Sat-Link Active</span>
            </div>
            <div class="card-body p-0">
              <div id="ambulance-leaflet-map" style="height: 380px; width: 100%; border-radius: 0 0 12px 12px; background: #e2e8f0; position: relative;">
                <!-- Map will mount here -->
              </div>
            </div>
          </div>

          <!-- Driver & Vehicle Details Card -->
          <div class="card">
            <div class="card-header bg-surface flex-between">
              <h3>Vehicle & Crew Details</h3>
              <span class="badge badge-emerald">BLS Ambulance 108</span>
            </div>
            <div class="card-body">
              <div class="driver-info-box mb-3">
                <div class="driver-avatar-circle">
                  ${Icons.get('user', 'icon-lg text-teal')}
                </div>
                <div class="driver-creds">
                  <h4>${amb.driverName}</h4>
                  <p class="text-sm text-muted">Emergency Medical Technician (EMT Level 2)</p>
                  <p class="text-sm font-mono"><strong>${amb.vehicleNo}</strong></p>
                </div>
              </div>

              <div class="eta-hero-box mb-3">
                <div class="eta-val" id="amb-eta-display">${amb.etaMinutes} mins</div>
                <div class="eta-desc">Estimated Arrival at Rampur Village</div>
              </div>

              <div class="contact-driver-actions mb-3">
                <a href="tel:${amb.driverPhone}" class="btn btn-emerald btn-block btn-lg">
                  ${Icons.get('phone', 'icon-md')}
                  <span>Call Ambulance Crew (${amb.driverPhone})</span>
                </a>
              </div>

              <div class="dispatch-notes bg-surface p-3 rounded">
                <p class="text-sm mb-1"><strong>Pickup Location:</strong> ${amb.pickupLocation}</p>
                <p class="text-sm mb-1"><strong>Designated Hospital:</strong> ${amb.destination}</p>
                <p class="text-xs text-muted">Oxygen Cylinder & Basic Life Support (BLS) equipment verified on board.</p>
              </div>

              <!-- Simulation Control Buttons for Demo -->
              <div class="demo-controls-box mt-3 pt-2 border-top">
                <small class="text-muted d-block mb-1">Hackathon Simulation Controls:</small>
                <div class="btn-group-sm">
                  <button class="btn btn-xs btn-outline" onclick="AmbulanceView.advanceStage()">Advance Trip Stage</button>
                  <button class="btn btn-xs btn-outline" onclick="AmbulanceView.resetTrip()">Reset Trip Simulation</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  initMap() {
    const s = window.Store.getState();
    const amb = s.ambulanceTrip;
    const mapEl = document.getElementById('ambulance-leaflet-map');
    if (!mapEl) return;

    // Check if Leaflet is available in window.L
    if (typeof window.L !== 'undefined') {
      try {
        if (this.mapInstance) {
          this.mapInstance.remove();
        }

        this.mapInstance = L.map('ambulance-leaflet-map').setView([amb.driverLat, amb.driverLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.mapInstance);

        // Ambulance custom icon or red circle marker
        const ambIcon = L.divIcon({
          className: 'custom-amb-pin',
          html: `<div style="background:#dc2626; color:white; border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(220,38,38,0.7); font-size:16px;">🚑</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        // Patient pin
        const patIcon = L.divIcon({
          className: 'custom-pat-pin',
          html: `<div style="background:#0d9488; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px rgba(13,148,136,0.6); font-size:14px;">📍</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        this.driverMarker = L.marker([amb.driverLat, amb.driverLng], { icon: ambIcon })
          .addTo(this.mapInstance)
          .bindPopup(`<b>Ambulance 108</b><br>${amb.vehicleNo}`);

        this.patientMarker = L.marker([amb.patientLat, amb.patientLng], { icon: patIcon })
          .addTo(this.mapInstance)
          .bindPopup(`<b>Patient Location</b><br>${amb.pickupLocation}`);

        // Draw connecting route line
        const latlngs = [
          [amb.driverLat, amb.driverLng],
          [21.8986, 83.3916],
          [amb.patientLat, amb.patientLng]
        ];
        L.polyline(latlngs, { color: '#dc2626', weight: 4, dashArray: '6, 6' }).addTo(this.mapInstance);

        this.startMovingSimulation();
        return;
      } catch (err) {
        console.warn('[AmbulanceView] Leaflet map initialization warning:', err);
      }
    }

    // Offline / Fallback SVG Map Renderer
    mapEl.innerHTML = `
      <div style="width:100%; height:100%; background: #e0f2fe; display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 20px; position:relative; overflow:hidden;">
        <svg width="100%" height="100%" viewBox="0 0 500 300" style="position:absolute; top:0; left:0;">
          <!-- Stylized road -->
          <path d="M 50 150 Q 200 80, 450 180" fill="none" stroke="#94a3b8" stroke-width="18" stroke-linecap="round"/>
          <path d="M 50 150 Q 200 80, 450 180" fill="none" stroke="#f8fafc" stroke-width="2" stroke-dasharray="8 8"/>
          <!-- Hospital Node -->
          <circle cx="50" cy="150" r="20" fill="#0d9488" />
          <text x="50" y="155" fill="white" font-size="12" font-weight="bold" text-anchor="middle">PHC</text>
          <!-- Moving Ambulance Circle -->
          <circle id="fallback-amb" cx="220" cy="120" r="16" fill="#dc2626">
            <animate attributeName="cx" values="100;380;100" dur="15s" repeatCount="indefinite" />
            <animate attributeName="cy" values="140;160;140" dur="15s" repeatCount="indefinite" />
          </circle>
          <text x="220" y="125" fill="white" font-size="12" text-anchor="middle">🚑</text>
          <!-- Patient House -->
          <circle cx="450" cy="180" r="20" fill="#0284c7" />
          <text x="450" y="185" fill="white" font-size="12" font-weight="bold" text-anchor="middle">You</text>
        </svg>
        <div style="position:relative; z-index:2; background:rgba(255,255,255,0.92); padding:10px 16px; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1); text-align:center;">
          <strong class="text-teal">Offline High-Contrast Route Radar</strong><br>
          <small class="text-muted">Live vehicle coordinates: 21.8998° N, 83.3882° E • Moving smoothly toward Rampur</small>
        </div>
      </div>
    `;
  },

  startMovingSimulation() {
    if (this.simInterval) clearInterval(this.simInterval);

    let step = 0;
    this.simInterval = setInterval(() => {
      step++;
      const s = window.Store.getState();
      const amb = s.ambulanceTrip;
      if (!this.driverMarker) return;

      // Incremental movement toward patient
      const latDiff = (amb.patientLat - 21.8998) * (step / 50);
      const lngDiff = (amb.patientLng - 83.3882) * (step / 50);
      const curLat = 21.8998 + latDiff;
      const curLng = 83.3882 + lngDiff;

      this.driverMarker.setLatLng([curLat, curLng]);

      const etaEl = document.getElementById('amb-eta-display');
      if (etaEl && amb.etaMinutes > 1 && step % 10 === 0) {
        amb.etaMinutes = Math.max(1, amb.etaMinutes - 1);
        etaEl.textContent = `${amb.etaMinutes} mins`;
      }

      if (step >= 50) {
        clearInterval(this.simInterval);
      }
    }, 1200);
  },

  detectPatientGPS() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          alert(`GPS Auto-Location Acquired:\nLatitude: ${lat.toFixed(4)}\nLongitude: ${lng.toFixed(4)}\nAccuracy: ±${pos.coords.accuracy.toFixed(1)}m`);
          if (this.mapInstance && this.patientMarker) {
            this.patientMarker.setLatLng([lat, lng]);
            this.mapInstance.setView([lat, lng], 14);
          }
        },
        (err) => {
          alert('GPS detection unavailable or denied. Using default Rampur Village Panchayat coordinates.');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  },

  advanceStage() {
    const s = window.Store.getState();
    const amb = s.ambulanceTrip;
    amb.statusIndex = (amb.statusIndex + 1) % 5;
    const stages = ['Requested', 'Assigned', 'On the way', 'Arrived', 'Reached hospital'];
    amb.status = stages[amb.statusIndex];
    amb.etaMinutes = Math.max(0, amb.etaMinutes - 2);
    window.Store.saveState();
    window.Router.render();
  },

  resetTrip() {
    const s = window.Store.getState();
    s.ambulanceTrip.statusIndex = 2;
    s.ambulanceTrip.status = 'On the way';
    s.ambulanceTrip.etaMinutes = 7;
    window.Store.saveState();
    window.Router.render();
  }
};
