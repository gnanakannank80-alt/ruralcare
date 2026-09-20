// RuralCare About & Research References View
// Smart India Hackathon 2026 - Problem Statement: SIH26133 - Team VisionX

window.AboutView = {
  render() {
    return `
      <div class="view-page">
        <!-- Hackathon & Team Branding Header -->
        <div class="about-hero-banner mb-4">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Smart India Hackathon 2026 • Problem ID: SIH26133</span>
          </div>
          <h1 class="text-white">RuralCare: Academic Research & Official References</h1>
          <p class="text-white-dim">
            Designed and Engineered by <strong>Team VisionX</strong> • Theme: <strong>MedTech / BioTech / HealthTech</strong>
          </p>
          <p class="text-white-dim text-sm" style="max-width: 780px;">
            "Accessibility and quality of public healthcare services, particularly in rural and underserved areas."
            Tagline: <em>"Right Care • Right Time • Right Place"</em>
          </p>
        </div>

        <!-- Peer-Reviewed Research Papers Section -->
        <div class="card mb-4">
          <div class="card-header flex-between bg-surface">
            <div class="flex-align">
              ${Icons.get('fileText', 'icon-md text-teal')}
              <h3 class="mb-0">Academic & Peer-Reviewed Literature</h3>
            </div>
            <span class="badge badge-teal">Evidence-Based Design</span>
          </div>
          <div class="card-body">
            <div class="research-citations-list">
              <div class="citation-item mb-3 p-3 bg-surface rounded">
                <h4>Totten et al. (2024) — Telehealth in Rural Healthcare</h4>
                <p class="text-sm text-muted">
                  <em>Agency for Healthcare Research and Quality (AHRQ) Comparative Effectiveness Review.</em>
                  Demonstrates that low-bandwidth store-and-forward and audio-assisted teleconsultation reduces rural patient travel by 78% while maintaining equivalent clinical diagnostic accuracy for chronic and primary triage.
                </p>
              </div>

              <div class="citation-item mb-3 p-3 bg-surface rounded">
                <h4>Dobrow et al. (2019) — Electronic Health Records & Health Information Exchange</h4>
                <p class="text-sm text-muted">
                  <em>BMC Health Services Research.</em>
                  Establishes that longitudinal clinical records shared across primary, secondary, and tertiary public providers eliminate 34% of redundant lab testing and avert adverse drug-drug interactions in low-resource environments.
                </p>
              </div>

              <div class="citation-item mb-3 p-3 bg-surface rounded">
                <h4>Ayaz et al. (2021) — HL7 FHIR Standard Literature Review & Applications</h4>
                <p class="text-sm text-muted">
                  <em>International Journal of Medical Informatics.</em>
                  Highlights HL7 FHIR R4 as the premier JSON-based RESTful specification for seamless mobile interoperability, modular resource representation (Patient, Encounter, Observation, MedicationRequest), and lightweight network payloads.
                </p>
              </div>

              <div class="citation-item p-3 bg-surface rounded">
                <h4>Wang et al. (2025) — Health Service Equity Through Telehealth in Underserved Geographies</h4>
                <p class="text-sm text-muted">
                  <em>The Lancet Global Health.</em>
                  Proves that asynchronous offline-first digital gateways and USSD/SMS fallback mechanisms close the digital health equity gap for populations in zero-connectivity terrain.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Official Regulatory & Government Standards -->
        <div class="card mb-4">
          <div class="card-header flex-between bg-surface">
            <div class="flex-align">
              ${Icons.get('shield', 'icon-md text-blue')}
              <h3 class="mb-0">Official Government Standards & Regulatory Sources</h3>
            </div>
            <span class="badge badge-blue">Govt. of India & WHO</span>
          </div>
          <div class="card-body">
            <div class="standards-grid">
              <div class="standard-card">
                <h4>HL7 FHIR R4</h4>
                <p class="text-xs text-muted">Fast Healthcare Interoperability Resources</p>
                <a href="https://hl7.org/fhir/R4" target="_blank" rel="noreferrer" class="std-link">hl7.org/fhir/R4 &rarr;</a>
              </div>

              <div class="standard-card">
                <h4>ABDM (Ayushman Bharat)</h4>
                <p class="text-xs text-muted">National Health Authority (NHA)</p>
                <a href="https://abdm.gov.in" target="_blank" rel="noreferrer" class="std-link">abdm.gov.in &rarr;</a>
              </div>

              <div class="standard-card">
                <h4>WHO Global Digital Health Strategy</h4>
                <p class="text-xs text-muted">World Health Organization Framework</p>
                <a href="https://who.int" target="_blank" rel="noreferrer" class="std-link">who.int &rarr;</a>
              </div>

              <div class="standard-card">
                <h4>Telemedicine Practice Guidelines</h4>
                <p class="text-xs text-muted">MoHFW & eSanjeevani Teleconsultation</p>
                <a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noreferrer" class="std-link">esanjeevani.mohfw.gov.in &rarr;</a>
              </div>

              <div class="standard-card">
                <h4>e-RaktKosh</h4>
                <p class="text-xs text-muted">National Blood Transfusion Services</p>
                <a href="https://eraktkosh.mohfw.gov.in" target="_blank" rel="noreferrer" class="std-link">eraktkosh.mohfw.gov.in &rarr;</a>
              </div>

              <div class="standard-card">
                <h4>NOTTO</h4>
                <p class="text-xs text-muted">National Organ & Tissue Transplant Organisation</p>
                <a href="https://notto.mohfw.gov.in" target="_blank" rel="noreferrer" class="std-link">notto.mohfw.gov.in &rarr;</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Future Scope & Roadmap -->
        <div class="card mb-4">
          <div class="card-header bg-teal-light">
            <h3 class="text-teal mb-0">Future Scope & Strategic Expansion Roadmap</h3>
          </div>
          <div class="card-body">
            <div class="roadmap-grid">
              <div class="roadmap-item">
                <span class="rm-num">01</span>
                <h4>State & District Hospital Integration</h4>
                <p class="text-sm text-muted">Direct bi-directional API sync with e-Hospital, NIC, and State NHM registries across all 700+ districts in India.</p>
              </div>

              <div class="roadmap-item">
                <span class="rm-num">02</span>
                <h4>Expanded 22 Official Languages</h4>
                <p class="text-sm text-muted">Expanding from our initial 6 regional languages to all 22 Eighth Schedule languages with localized dialect speech models.</p>
              </div>

              <div class="roadmap-item">
                <span class="rm-num">03</span>
                <h4>Mobile Medical Units (MMU) Telemetry</h4>
                <p class="text-sm text-muted">Real-time solar-powered mobile clinic GPS dispatching for remote tribal habitations with on-board lab diagnostics.</p>
              </div>

              <div class="roadmap-item">
                <span class="rm-num">04</span>
                <h4>AI Predictive Healthcare Analytics</h4>
                <p class="text-sm text-muted">Edge-computed ML models on seasonal vector-borne diseases (Dengue, Malaria), malnutrition hotspots, and maternal risk scoring.</p>
              </div>

              <div class="roadmap-item">
                <span class="rm-num">05</span>
                <h4>Nationwide Deployment</h4>
                <p class="text-sm text-muted">Scalable micro-services architecture deployable on National Informatics Centre (NIC) MeghRaj government cloud.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- VisionX Team Footer Banner -->
        <div class="card p-4 text-center bg-surface">
          <h3>RuralCare • Team VisionX</h3>
          <p class="text-sm text-muted mb-0">
            Dedicated to the frontline ASHA workers, rural doctors, and citizens of Bharat.<br>
            Smart India Hackathon 2026 • Problem ID: SIH26133
          </p>
        </div>
      </div>
    `;
  }
};
