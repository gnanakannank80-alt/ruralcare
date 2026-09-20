// RuralCare Innovation Module J2: NOTTO Organ Donation & Donor Card
// National Organ & Tissue Transplant Organisation Guidelines
// Team VisionX - SIH 2026

window.OrganView = {
  render() {
    const s = window.Store.getState();
    const pledges = s.organDonations || [];
    const activePledge = pledges[0] || null;

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('gift', 'icon-md text-emerald')} NOTTO Organ Donation Pledge & Digital Donor Card</h2>
            <p class="text-muted">Pledge the gift of life. Aligned with NOTTO (Ministry of Health & Family Welfare, Govt of India).</p>
          </div>
          <div>
            <button class="btn btn-emerald" onclick="OrganView.togglePledgeModal(true)">
              ${Icons.get('plusCircle', 'icon-sm')}
              <span>Register New Organ Pledge</span>
            </button>
          </div>
        </div>

        <!-- NOTTO Official Digital Donor Card (Printable / Downloadable) -->
        ${activePledge ? `
          <div class="card mb-4">
            <div class="card-header flex-between bg-emerald-light">
              <div class="flex-align">
                ${Icons.get('shield', 'icon-sm text-emerald')}
                <h3 class="text-emerald mb-0">Official Government NOTTO Organ Donor Card</h3>
              </div>
              <button class="btn btn-sm btn-outline" onclick="window.print()">
                ${Icons.get('download', 'icon-xs')}
                <span>Download / Print Card</span>
              </button>
            </div>
            <div class="card-body">
              <div class="donor-card-container" id="notto-card-print">
                <div class="donor-card-front">
                  <div class="dcard-header flex-between">
                    <div>
                      <div class="dcard-title">ORGAN DONOR CARD</div>
                      <div class="dcard-sub">NOTTO • Govt. of India (notto.mohfw.gov.in)</div>
                    </div>
                    <div class="dcard-logo">🇮🇳</div>
                  </div>

                  <div class="dcard-body flex-between mt-3">
                    <div>
                      <h3 class="dcard-name">${activePledge.donorName}</h3>
                      <div class="dcard-number">PLEDGE NO: <strong>${activePledge.pledgeNumber}</strong></div>
                      <div class="dcard-abha">ABHA: ${activePledge.abhaId}</div>
                      <div class="dcard-organs mt-2">
                        <strong>Organs Pledged:</strong>
                        <div class="organ-badges mt-1">
                          ${activePledge.organsPledged.map(o => `<span class="badge badge-emerald">${o}</span>`).join(' ')}
                        </div>
                      </div>
                    </div>
                    <div class="dcard-qr text-center">
                      <div class="mock-qr-square">
                        <small>NOTTO-QR</small>
                      </div>
                      <span class="dcard-active-pill">ACTIVE PLEDGE</span>
                    </div>
                  </div>

                  <div class="dcard-footer flex-between mt-3 pt-2 border-top">
                    <small>Emergency Contact: <strong>${activePledge.emergencyContactName} (${activePledge.emergencyContactPhone})</strong></small>
                    <small>Date: ${activePledge.pledgeDate}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="dash-grid-2col mb-4">
          <!-- NOTTO Awareness & Myth Busters -->
          <div class="card">
            <div class="card-header">
              <h3>Rural Awareness & Facts (NOTTO Guidelines)</h3>
            </div>
            <div class="card-body">
              <div class="faq-accordion">
                <div class="faq-item mb-3">
                  <strong class="text-teal">Q: Does organ donation affect traditional funeral rituals?</strong>
                  <p class="text-sm text-muted mt-1">
                    No. Organs are retrieved with highest surgical dignity and respect by government certified retrieval surgeons. No physical disfigurement occurs.
                  </p>
                </div>
                <div class="faq-item mb-3">
                  <strong class="text-teal">Q: Who can donate organs after life?</strong>
                  <p class="text-sm text-muted mt-1">
                    Anyone from infant to 80+ years can pledge corneas, kidneys, heart valves, and tissues. There are no caste, gender, or religion bars.
                  </p>
                </div>
                <div class="faq-item">
                  <strong class="text-teal">Q: Why is family notification vital?</strong>
                  <p class="text-sm text-muted mt-1">
                    In India, family consent at hospital is legally mandatory (THOTA Act 1994). RuralCare auto-sends an educational SMS to your designated next-of-kin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hospital Transplant Coordinator View -->
          <div class="card">
            <div class="card-header flex-between">
              <h3>Hospital Transplant Coordinator Registry</h3>
              <span class="badge badge-teal">Raigarh District</span>
            </div>
            <div class="card-body">
              <p class="text-sm text-muted">
                Hospital coordinators at District Hospital Raigarh and AIIMS Raipur receive verified notifications for organ matching when brain death is identified.
              </p>
              <div class="coordinator-box p-3 bg-surface rounded">
                <h4>District Coordinator: Dr. Maya Sen</h4>
                <p class="text-xs text-muted mb-1">State Organ & Tissue Transplant Organization (SOTTO)</p>
                <p class="text-sm font-mono mb-2">Helpline: 1800-11-4770 (National 24/7)</p>
                <button class="btn btn-xs btn-outline" onclick="alert('Notification sent to District Transplant Coordinator!')">
                  Send Coordinator Notice
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pledge Registration Modal -->
        <div id="pledge-modal" class="modal-overlay hidden">
          <div class="modal-card">
            <div class="modal-header flex-between">
              <h3>Register Organ & Tissue Donation Pledge</h3>
              <button class="modal-close" onclick="OrganView.togglePledgeModal(false)">&times;</button>
            </div>
            <div class="modal-body">
              <form id="pledge-reg-form" onsubmit="OrganView.handlePledgeSubmit(event)">
                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Donor Full Name *</label>
                    <input type="text" id="plg-name" class="form-control" value="${s.currentUser.name}" required />
                  </div>
                  <div class="form-group">
                    <label>ABHA ID *</label>
                    <input type="text" id="plg-abha" class="form-control" value="${s.currentUser.abhaId || '14-8921-4402-9912'}" required />
                  </div>
                </div>

                <div class="form-group mb-2">
                  <label><strong>Select Organs / Tissues to Pledge:</strong></label>
                  <div class="grid-2col mt-1">
                    <label><input type="checkbox" name="pledged_organ" value="Cornea (Eyes)" checked> Corneas (Eyes)</label>
                    <label><input type="checkbox" name="pledged_organ" value="Kidneys" checked> Kidneys</label>
                    <label><input type="checkbox" name="pledged_organ" value="Liver" checked> Liver</label>
                    <label><input type="checkbox" name="pledged_organ" value="Heart Valves" checked> Heart Valves</label>
                    <label><input type="checkbox" name="pledged_organ" value="Lungs"> Lungs</label>
                    <label><input type="checkbox" name="pledged_organ" value="Skin / Tissues"> Skin / Tissues</label>
                  </div>
                </div>

                <div class="grid-2col mb-3">
                  <div class="form-group">
                    <label>Next-of-Kin (Family Member) Name *</label>
                    <input type="text" id="plg-kin-name" class="form-control" value="Geeta Kumar (Spouse)" required />
                  </div>
                  <div class="form-group">
                    <label>Next-of-Kin Mobile (for Notification) *</label>
                    <input type="tel" id="plg-kin-phone" class="form-control" value="+91 98765 43211" required />
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label class="toggle-label text-sm">
                    <input type="checkbox" required checked>
                    <span>I solemnly pledge my organs upon medical certification of brain stem death in accordance with NOTTO and the Transplantation of Human Organs Act.</span>
                  </label>
                </div>

                <button type="submit" class="btn btn-emerald btn-block btn-lg">Submit NOTTO Pledge & Generate Card</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  togglePledgeModal(show) {
    const el = document.getElementById('pledge-modal');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  handlePledgeSubmit(e) {
    e.preventDefault();
    const checked = Array.from(document.querySelectorAll('input[name="pledged_organ"]:checked')).map(c => c.value);
    const donorName = document.getElementById('plg-name').value;
    const abhaId = document.getElementById('plg-abha').value;
    const emergencyContactName = document.getElementById('plg-kin-name').value;
    const emergencyContactPhone = document.getElementById('plg-kin-phone').value;

    const newPledge = {
      donorName,
      abhaId,
      organsPledged: checked.length > 0 ? checked : ['Corneas (Eyes)', 'Kidneys'],
      emergencyContactName,
      emergencyContactPhone
    };

    window.Store.registerOrganPledge(newPledge);
    this.togglePledgeModal(false);
    window.Router.render();
    alert(`Congratulations ${donorName}! Your NOTTO pledge has been registered and family notification SMS sent to ${emergencyContactPhone}.`);
  }
};
