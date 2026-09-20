// RuralCare Impact & Analytics View (Admin / Hackathon Impact Dashboard)
// Smart India Hackathon 2026 - Problem Statement: SIH26133 - Team VisionX

window.AnalyticsView = {
  chartInstance: null,

  render() {
    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('barChart', 'icon-md text-teal')} Healthcare Impact & Quantitative Analytics</h2>
            <p class="text-muted">Transformational improvements in accessibility, wait times, and rural survival rates.</p>
          </div>
          <div>
            <span class="badge badge-purple" style="font-size: 0.85rem; padding: 6px 12px;">
              📌 Note: Projected Impact Metrics (SIH 2026 Evaluation)
            </span>
          </div>
        </div>

        <!-- Comparative Before vs After Chart.js Section -->
        <div class="card mb-4">
          <div class="card-header flex-between">
            <div>
              <h3 class="mb-0">Before vs. After RuralCare Implementation (Index 0 - 100)</h3>
              <small class="text-muted">Waiting time: lower is better; Response, availability, participation, specialist access: higher is better</small>
            </div>
            <span class="badge badge-teal">Field Evaluation Model</span>
          </div>
          <div class="card-body">
            <div style="position: relative; height: 350px; width: 100%;">
              <canvas id="impact-bar-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- The 11 Required Impact Cards -->
        <div class="section-title-sm mb-3">Core Impact Pillars & Public Health Outcomes</div>
        <div class="impact-cards-grid mb-4">
          <!-- Card 1 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-teal-light">${Icons.get('clock', 'icon-md text-teal')}</div>
            <h4>1. Reduced Waiting Time</h4>
            <div class="impact-metric text-teal">80 &rarr; 30 (62% reduction)</div>
            <p>Smart queuing with live token alerts frees rural villagers from whole-day OPD waits.</p>
          </div>

          <!-- Card 2 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-red-light">${Icons.get('sos', 'icon-md text-red')}</div>
            <h4>2. Faster Emergency Care</h4>
            <div class="impact-metric text-red">40 &rarr; 90 (125% improvement)</div>
            <p>Rapid clinical triage escalates life-threatening cases to priority #1 with live hospital alerts.</p>
          </div>

          <!-- Card 3 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-blue-light">${Icons.get('video', 'icon-md text-blue')}</div>
            <h4>3. Better Specialist Access</h4>
            <div class="impact-metric text-blue">30 &rarr; 80 (166% improvement)</div>
            <p>Teleconsultation links rural PHCs with district cardiologists, gynecologists & pediatricians.</p>
          </div>

          <!-- Card 4 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-red-light">${Icons.get('droplet', 'icon-md text-red')}</div>
            <h4>4. Improved Blood Availability</h4>
            <div class="impact-metric text-red">35 &rarr; 85 (142% improvement)</div>
            <p>Hyperlocal donor matching within 10km radius prevents critical maternal/trauma mortality.</p>
          </div>

          <!-- Card 5 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-purple-light">${Icons.get('tent', 'icon-md text-purple')}</div>
            <h4>5. Increased Health Camp Participation</h4>
            <div class="impact-metric text-purple">20 &rarr; 75 (275% improvement)</div>
            <p>Targeted Gram Panchayat SMS broadcasts boost rural screening attendance and preventive care.</p>
          </div>

          <!-- Card 6 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-teal-light">${Icons.get('fileText', 'icon-md text-teal')}</div>
            <h4>6. Digital Health Records</h4>
            <div class="impact-metric text-teal">100% ABHA Aligned</div>
            <p>Unified longitudinal FHIR R4 records eliminate lost paper slips and duplicate diagnostics.</p>
          </div>

          <!-- Card 7 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-emerald-light">${Icons.get('repeat', 'icon-md text-emerald')}</div>
            <h4>7. Better Preventive Care</h4>
            <div class="impact-metric text-emerald">94% Schedule Adherence</div>
            <p>Automated maternal ANC/PNC tracking and universal infant immunization alerts for ASHA workers.</p>
          </div>

          <!-- Card 8 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-blue-light">${Icons.get('shield', 'icon-md text-blue')}</div>
            <h4>8. Better Rural Healthcare Access</h4>
            <div class="impact-metric text-blue">Equitable Coverage</div>
            <p>Multilingual interface in 6 Indian languages with voice dictation for low-literacy citizens.</p>
          </div>

          <!-- Card 9 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-emerald-light">${Icons.get('activity', 'icon-md text-emerald')}</div>
            <h4>9. Improved Public Health Outcomes</h4>
            <div class="impact-metric text-emerald">Measurable Longevity</div>
            <p>Early identification of hypertension, diabetes, and high-risk pregnancies saves lives.</p>
          </div>

          <!-- Card 10 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-purple-light">${Icons.get('shield', 'icon-md text-purple')}</div>
            <h4>10. Better Hospital Preparedness</h4>
            <div class="impact-metric text-purple">Real-Time Bed Telemetry</div>
            <p>Administrators track beds, ambulance fleet, oxygen, and pharmacy stock across the district.</p>
          </div>

          <!-- Card 11 -->
          <div class="impact-card">
            <div class="impact-icon-circle bg-teal-light">${Icons.get('wifiOff', 'icon-md text-teal')}</div>
            <h4>11. Healthcare Access Even in Low-Network Areas</h4>
            <div class="impact-metric text-teal">PWA Offline + USSD</div>
            <p>Full functionality on 2G/offline via IndexedDB queue and basic phone *123# USSD dialer.</p>
          </div>
        </div>
      </div>
    `;
  },

  initChart() {
    const canvas = document.getElementById('impact-bar-chart');
    if (!canvas) return;

    // Check if Chart.js is loaded
    if (typeof window.Chart !== 'undefined') {
      try {
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        const ctx = canvas.getContext('2d');
        this.chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'Waiting Time (Lower is Better)',
              'Emergency Response',
              'Blood Availability',
              'Camp Participation',
              'Specialist Access'
            ],
            datasets: [
              {
                label: 'Before RuralCare (Traditional Rural System)',
                data: [80, 40, 35, 20, 30],
                backgroundColor: 'rgba(148, 163, 184, 0.7)',
                borderColor: 'rgb(100, 116, 139)',
                borderWidth: 1,
                borderRadius: 6
              },
              {
                label: 'After RuralCare (Projected Impact)',
                data: [30, 90, 85, 75, 80],
                backgroundColor: [
                  'rgba(13, 148, 136, 0.85)',
                  'rgba(220, 38, 38, 0.85)',
                  'rgba(239, 68, 68, 0.85)',
                  'rgba(168, 85, 247, 0.85)',
                  'rgba(2, 132, 199, 0.85)'
                ],
                borderWidth: 1,
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Public Health Index Score (0 - 100)'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  afterLabel: (ctx) => {
                    if (ctx.dataIndex === 0) {
                      return 'Note: Waiting time reduction from 80 to 30 represents a 62.5% time saving!';
                    }
                  }
                }
              }
            }
          }
        });
        return;
      } catch (err) {
        console.warn('[AnalyticsView] Chart.js render warning, falling back to SVG chart:', err);
      }
    }

    // Fallback Canvas/SVG Renderer if Chart.js is offline
    const parent = canvas.parentElement;
    parent.innerHTML = `
      <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:center;">
        <svg viewBox="0 0 700 280" width="100%" height="100%">
          <!-- Baseline Axis -->
          <line x1="50" y1="230" x2="680" y2="230" stroke="#cbd5e1" stroke-width="2"/>
          
          <!-- Bars 1: Waiting Time (80 -> 30) -->
          <text x="110" y="250" text-anchor="middle" font-size="11" fill="#475569">Waiting Time</text>
          <rect x="75" y="70" width="30" height="160" fill="#94a3b8" rx="4"/>
          <text x="90" y="62" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">80</text>
          <rect x="115" y="170" width="30" height="60" fill="#0d9488" rx="4"/>
          <text x="130" y="162" text-anchor="middle" font-size="11" font-weight="bold" fill="#0d9488">30</text>

          <!-- Bars 2: Emergency Response (40 -> 90) -->
          <text x="235" y="250" text-anchor="middle" font-size="11" fill="#475569">Emergency Response</text>
          <rect x="200" y="150" width="30" height="80" fill="#94a3b8" rx="4"/>
          <text x="215" y="142" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">40</text>
          <rect x="240" y="50" width="30" height="180" fill="#dc2626" rx="4"/>
          <text x="255" y="42" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626">90</text>

          <!-- Bars 3: Blood Availability (35 -> 85) -->
          <text x="360" y="250" text-anchor="middle" font-size="11" fill="#475569">Blood Avail.</text>
          <rect x="325" y="160" width="30" height="70" fill="#94a3b8" rx="4"/>
          <text x="340" y="152" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">35</text>
          <rect x="365" y="60" width="30" height="170" fill="#ef4444" rx="4"/>
          <text x="380" y="52" text-anchor="middle" font-size="11" font-weight="bold" fill="#ef4444">85</text>

          <!-- Bars 4: Camp Participation (20 -> 75) -->
          <text x="485" y="250" text-anchor="middle" font-size="11" fill="#475569">Camp Partic.</text>
          <rect x="450" y="190" width="30" height="40" fill="#94a3b8" rx="4"/>
          <text x="465" y="182" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">20</text>
          <rect x="490" y="80" width="30" height="150" fill="#a855f7" rx="4"/>
          <text x="505" y="72" text-anchor="middle" font-size="11" font-weight="bold" fill="#a855f7">75</text>

          <!-- Bars 5: Specialist Access (30 -> 80) -->
          <text x="610" y="250" text-anchor="middle" font-size="11" fill="#475569">Specialist Access</text>
          <rect x="575" y="170" width="30" height="60" fill="#94a3b8" rx="4"/>
          <text x="590" y="162" text-anchor="middle" font-size="11" font-weight="bold" fill="#64748b">30</text>
          <rect x="615" y="70" width="30" height="160" fill="#0284c7" rx="4"/>
          <text x="630" y="62" text-anchor="middle" font-size="11" font-weight="bold" fill="#0284c7">80</text>
        </svg>
      </div>
    `;
  }
};
