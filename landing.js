// RuralCare Landing Page View
// Smart India Hackathon 2026 - Problem Statement: SIH26133 - Team VisionX

window.LandingView = {
  render() {
    const s = window.Store.getState();
    const t = (k) => window.i18n ? window.i18n.t(k) : k;

    return `
      <div class="landing-page">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Smart India Hackathon 2026 • Problem ID: SIH26133</span>
          </div>
          <h1 class="hero-title">
            <span class="brand-highlight">RuralCare</span>
          </h1>
          <p class="hero-tagline">${t('app_tagline')}</p>
          <p class="hero-desc">
            An ultra-resilient, offline-first digital healthcare lifeline empowering 800+ million rural citizens, 
            ASHA front-line workers, and primary health centers (PHC/CHC) with equitable, instant, and high-quality care.
          </p>

          <div class="hero-actions">
            <a href="#/emergency" class="btn btn-emergency btn-lg">
              ${Icons.get('sos', 'icon-lg')}
              <span>${t('sos_button')}</span>
            </a>
            <a href="#/appointments" class="btn btn-primary btn-lg">
              ${Icons.get('calendar', 'icon-lg')}
              <span>${t('book_appointment')}</span>
            </a>
            <a href="#/ussd-sms" class="btn btn-outline btn-lg">
              ${Icons.get('smartphone', 'icon-lg')}
              <span>${t('feature_phone_screen')}</span>
            </a>
          </div>

          <!-- Role Quick Access Cards -->
          <div class="role-grid">
            <div class="role-card" onclick="window.Store.switchRole('patient'); window.location.hash='#/dashboard-patient'">
              <div class="role-icon bg-teal-light">${Icons.get('user', 'icon-lg text-teal')}</div>
              <h3>Patient Portal</h3>
              <p>Appointments, queue token, medicine reminders, and ABHA health card.</p>
              <span class="role-link">Enter as Ramesh Kumar &rarr;</span>
            </div>

            <div class="role-card" onclick="window.Store.switchRole('asha'); window.location.hash='#/dashboard-asha'">
              <div class="role-icon bg-emerald-light">${Icons.get('users', 'icon-lg text-emerald')}</div>
              <h3>ASHA / ANM Worker</h3>
              <p>Village roster, home-visit checklists, maternal care (ANC/PNC), offline sync.</p>
              <span class="role-link">Enter as Sunita Devi &rarr;</span>
            </div>

            <div class="role-card" onclick="window.Store.switchRole('doctor'); window.location.hash='#/dashboard-doctor'">
              <div class="role-icon bg-blue-light">${Icons.get('activity', 'icon-lg text-blue')}</div>
              <h3>Doctor Portal</h3>
              <p>OPD consultation queue, teleconsultation, emergency alerts, e-prescriptions.</p>
              <span class="role-link">Enter as Dr. Arvind Sharma &rarr;</span>
            </div>

            <div class="role-card" onclick="window.Store.switchRole('admin'); window.location.hash='#/dashboard-admin'">
              <div class="role-icon bg-purple-light">${Icons.get('shield', 'icon-lg text-purple')}</div>
              <h3>Health Administrator</h3>
              <p>PHC/CHC facility beds, fleet GPS, blood & medicine inventory, public health data.</p>
              <span class="role-link">Enter as Rajesh Verma (DHO) &rarr;</span>
            </div>
          </div>
        </section>

        <!-- Problem to Solution Mapping Section -->
        <section class="section problem-solution-section">
          <div class="section-header text-center">
            <span class="section-subtitle">Bridging the Healthcare Divide</span>
            <h2 class="section-title">Rural Challenges &rarr; RuralCare Innovations</h2>
            <p class="section-desc">Every bottleneck in public rural healthcare mapped directly to an automated, equitable solution.</p>
          </div>

          <div class="problem-solution-grid">
            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 1</span>
                <h4>Emergency Delays</h4>
                <p>Critical cases wait in general OPD lines, causing preventable mortality.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Emergency Priority Triage</h4>
                <p>Smart triage tool assesses severity, ranks Critical cases to Top #1, alerts hospital.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 2</span>
                <h4>Long Distance to Care</h4>
                <p>Patients travel 30+ km on foot or tractor for minor checkups or simple queries.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Teleconsultation Room</h4>
                <p>Low-bandwidth audio/video consult with PHC/District specialists & digital e-Rx.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 3</span>
                <h4>Specialist Shortage</h4>
                <p>Rural PHCs lack cardiologists, gynecologists, and pediatric specialists.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Connected Referrals & Camps</h4>
                <p>Digital PHC &rarr; CHC &rarr; District referral pipeline with timely escalation alerts.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 4</span>
                <h4>Poor 2G/3G Connectivity</h4>
                <p>Cloud-only portals fail completely in remote tribal and hilly village terrain.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Offline IndexedDB + USSD</h4>
                <p>Full offline PWA functionality, local action queue, and *123# basic phone gateway.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 5</span>
                <h4>Fragmented Paper Slips</h4>
                <p>Lost OPD slips, undocumented allergies, repeat testing, zero medical continuity.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>FHIR R4 Digital Records</h4>
                <p>ABHA-compliant longitudinal records, encounters, observations, and consent sharing.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 6</span>
                <h4>Uncertain Ambulance ETA</h4>
                <p>Families wait blindly without knowing if an ambulance is actually arriving.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Live GPS Ambulance Tracker</h4>
                <p>Real-time vehicle map tracking, driver phone, exact ETA, and 5-stage status timeline.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 7</span>
                <h4>Exhausting OPD Waiting</h4>
                <p>Hours spent sitting in crowded hallways with ill children and elderly elders.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Smart Queue & Token System</h4>
                <p>Live token number, estimated wait time, and SMS alert when turn is 3 numbers away.</p>
              </div>
            </div>

            <div class="ps-card">
              <div class="ps-problem">
                <span class="ps-tag red">Problem 8</span>
                <h4>Unannounced Medicine Gaps</h4>
                <p>Villagers walk miles only to find prescribed drugs out of stock at the PHC.</p>
              </div>
              <div class="ps-arrow">&rarr;</div>
              <div class="ps-solution">
                <span class="ps-tag green">Solution</span>
                <h4>Real-time Pharmacy Stock</h4>
                <p>Live inventory view at nearby PHCs, restock triggers, and alternative suggestions.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Why It Works Section -->
        <section class="section why-it-works-section bg-surface">
          <div class="section-header text-center">
            <span class="section-subtitle">Architectural Excellence</span>
            <h2 class="section-title">Why RuralCare Succeeds in Real Rural Environments</h2>
          </div>

          <div class="pillars-grid">
            <div class="pillar-card">
              <div class="pillar-num">01</div>
              <h4>Ultra-Low Cost</h4>
              <p>Zero expensive server licenses. Pure web standards running on sub-\$50 Android phones and feature phones.</p>
            </div>
            <div class="pillar-card">
              <div class="pillar-num">02</div>
              <h4>Web & Mobile First</h4>
              <p>No mandatory App Store downloads. Instant Progressive Web App accessible via browser link or QR code.</p>
            </div>
            <div class="pillar-card">
              <div class="pillar-num">03</div>
              <h4>Uses Existing Infrastructure</h4>
              <p>Operates alongside National Health Mission, PHC/CHC network, 108 ambulance dispatch, and ASHA cadres.</p>
            </div>
            <div class="pillar-card">
              <div class="pillar-num">04</div>
              <h4>Horizontal Scalability</h4>
              <p>Decentralized client-side queues prevent central server choke points during rural epidemic surges.</p>
            </div>
            <div class="pillar-card">
              <div class="pillar-num">05</div>
              <h4>Government Compatible</h4>
              <p>Built directly on ABDM (Ayushman Bharat Digital Mission) and HL7 FHIR R4 interoperability standards.</p>
            </div>
          </div>
        </section>

        <!-- Innovation Modules Highlights -->
        <section class="section innovation-section">
          <div class="section-header text-center">
            <span class="section-subtitle">Pioneering Value Additions</span>
            <h2 class="section-title">RuralCare Innovation Suite</h2>
            <p class="section-desc">Beyond clinical appointments: empowering rural health resilience.</p>
          </div>

          <div class="innovations-grid">
            <div class="innov-card" onclick="window.location.hash='#/blood'">
              <div class="innov-icon text-red">${Icons.get('droplet', 'icon-xl')}</div>
              <h3>1. Smart Blood Donation</h3>
              <p>Hyperlocal donor matching within 10 km radius & e-RaktKosh live stock transparency.</p>
              <span class="innov-action">View Blood Bank &rarr;</span>
            </div>

            <div class="innov-card" onclick="window.location.hash='#/organ'">
              <div class="innov-icon text-emerald">${Icons.get('gift', 'icon-xl')}</div>
              <h3>2. NOTTO Organ Pledge</h3>
              <p>Rural organ pledge registry, downloadable bilingual donor card, and hospital coordinator alerts.</p>
              <span class="innov-action">Register Pledge &rarr;</span>
            </div>

            <div class="innov-card" onclick="window.location.hash='#/fund'">
              <div class="innov-icon text-teal">${Icons.get('dollarSign', 'icon-xl')}</div>
              <h3>3. Emergency Medical Fund</h3>
              <p>Transparent crowdfunding for impoverished patients with verified doctor diagnoses and live ledger.</p>
              <span class="innov-action">Explore Campaigns &rarr;</span>
            </div>
          </div>
        </section>

        <!-- Projected Impact Teaser -->
        <section class="section impact-teaser text-center">
          <h2>Proven & Projected Impact for SIH 2026</h2>
          <div class="impact-stats-row">
            <div class="stat-box">
              <div class="stat-val text-teal">62%</div>
              <div class="stat-lbl">Reduction in OPD Waiting Time</div>
            </div>
            <div class="stat-box">
              <div class="stat-val text-red">8.5 min</div>
              <div class="stat-lbl">Average Ambulance Triage Time</div>
            </div>
            <div class="stat-box">
              <div class="stat-val text-emerald">100%</div>
              <div class="stat-lbl">Offline Availability for Critical Features</div>
            </div>
            <div class="stat-box">
              <div class="stat-val text-blue">6+</div>
              <div class="stat-lbl">Indian Regional Languages Supported</div>
            </div>
          </div>
          <div style="margin-top: 2rem;">
            <a href="#/analytics" class="btn btn-outline btn-lg">
              ${Icons.get('barChart', 'icon-md')}
              <span>View Detailed Impact & Analytics Dashboard</span>
            </a>
          </div>
        </section>
      </div>
    `;
  }
};
