// RuralCare Innovation Module J3: Crowdfunding Emergency Medical Fund
// Transparent Community & Micro-Philanthropy for Impoverished Patients
// Team VisionX - SIH 2026

window.FundView = {
  render() {
    const s = window.Store.getState();
    const fund = s.emergencyFund;
    const campaigns = fund.campaigns || [];
    const txns = fund.transactions || [];

    return `
      <div class="view-page">
        <div class="view-header flex-between">
          <div>
            <h2>${Icons.get('dollarSign', 'icon-md text-teal')} Rural Emergency Medical Aid Fund</h2>
            <p class="text-muted">Transparent micro-crowdfunding verified by public health doctors for critical surgeries.</p>
          </div>
          <div>
            <button class="btn btn-primary" onclick="FundView.toggleCreateModal(true)">
              ${Icons.get('plusCircle', 'icon-sm')}
              <span>Request Medical Aid</span>
            </button>
          </div>
        </div>

        <!-- Active Aid Campaigns Grid -->
        <div class="campaigns-grid mb-4">
          ${campaigns.map(c => {
            const pct = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));
            return `
              <div class="card campaign-card">
                <div class="card-header bg-surface flex-between">
                  <span class="badge badge-emerald">✓ Verified by ${c.verifiedDoctor}</span>
                  <span class="text-xs text-muted">${c.daysLeft} days remaining</span>
                </div>
                <div class="card-body">
                  <h3 class="camp-title">${c.title}</h3>
                  <div class="camp-beneficiary">
                    <strong>Beneficiary:</strong> ${c.beneficiary} • <strong>Hospital:</strong> ${c.hospital}
                  </div>
                  <p class="text-sm text-muted mt-2">${c.description}</p>

                  <div class="progress-bar-container my-3">
                    <div class="progress-track">
                      <div class="progress-fill" style="width: ${pct}%"></div>
                    </div>
                    <div class="progress-labels flex-between mt-1 text-sm">
                      <strong>₹${c.raisedAmount.toLocaleString()} Raised (${pct}%)</strong>
                      <span class="text-muted">Goal: ₹${c.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div class="camp-actions flex-between pt-2 border-top">
                    <span class="text-xs text-muted">${c.donorsCount} Generous Donors</span>
                    <button class="btn btn-emerald btn-sm" onclick="FundView.promptDonate('${c.id}', '${c.title}')">
                      ${Icons.get('heart', 'icon-xs')} Donate via UPI / Card
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Transparent Public Transaction Ledger -->
        <div class="card mb-4">
          <div class="card-header flex-between">
            <div class="flex-align">
              ${Icons.get('shield', 'icon-sm text-teal')}
              <h3 class="mb-0">100% Transparent Community Contribution Ledger</h3>
            </div>
            <span class="badge badge-teal">Zero-Deduction Policy</span>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Donor Name</th>
                    <th>Amount Contributed</th>
                    <th>Date & Time</th>
                    <th>Campaign</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  ${txns.map(t => `
                    <tr>
                      <td class="font-mono text-xs">${t.id}</td>
                      <td><strong>${t.donorName}</strong></td>
                      <td class="text-emerald font-bold font-mono">₹${t.amount.toLocaleString()}</td>
                      <td>${t.date}</td>
                      <td>${t.campaignId === 'fund_01' ? 'Baby Aarav Surgery' : 'Shankar Lal Trauma'}</td>
                      <td><span class="badge badge-outline">UPI / RuPay</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Create Aid Campaign Modal -->
        <div id="create-fund-modal" class="modal-overlay hidden">
          <div class="modal-card">
            <div class="modal-header flex-between">
              <h3>Create Emergency Medical Aid Campaign</h3>
              <button class="modal-close" onclick="FundView.toggleCreateModal(false)">&times;</button>
            </div>
            <div class="modal-body">
              <form id="new-fund-form" onsubmit="FundView.handleCreateCampaign(event)">
                <div class="form-group mb-2">
                  <label>Campaign Title *</label>
                  <input type="text" id="fund-title" class="form-control" placeholder="e.g. Urgent Pediatric Surgery Aid" required />
                </div>

                <div class="grid-2col mb-2">
                  <div class="form-group">
                    <label>Patient / Beneficiary Full Name *</label>
                    <input type="text" id="fund-ben" class="form-control" value="${s.currentUser.name}" required />
                  </div>
                  <div class="form-group">
                    <label>Target Funding Goal (₹) *</label>
                    <input type="number" id="fund-target" class="form-control" value="75000" min="5000" required />
                  </div>
                </div>

                <div class="form-group mb-2">
                  <label>Treating Public Hospital *</label>
                  <input type="text" id="fund-hosp" class="form-control" value="District Hospital Raigarh / AIIMS" required />
                </div>

                <div class="form-group mb-2">
                  <label>Medical Diagnosis & Surgeon Recommendation *</label>
                  <textarea id="fund-desc" class="form-control" rows="3" required placeholder="Explain surgical necessity, doctor diagnosis, and socio-economic situation..."></textarea>
                </div>

                <div class="form-group mb-3">
                  <label>Upload Hospital Estimate & Diagnostic Proof (Mock Upload) *</label>
                  <input type="file" class="form-control" />
                  <small class="text-muted">Requires verification by PHC Medical Officer or DHO before fund release.</small>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg">Submit Campaign for Doctor Verification</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  toggleCreateModal(show) {
    const el = document.getElementById('create-fund-modal');
    if (el) {
      if (show) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  },

  handleCreateCampaign(e) {
    e.preventDefault();
    const title = document.getElementById('fund-title').value;
    const beneficiary = document.getElementById('fund-ben').value;
    const targetAmount = parseInt(document.getElementById('fund-target').value, 10);
    const hospital = document.getElementById('fund-hosp').value;
    const description = document.getElementById('fund-desc').value;

    const newCamp = {
      id: 'fund_' + Date.now(),
      title,
      beneficiary,
      hospital,
      targetAmount,
      raisedAmount: 0,
      verifiedDoctor: 'Dr. Arvind Sharma (Verified)',
      medicalProofVerified: true,
      daysLeft: 14,
      description,
      donorsCount: 0
    };

    const s = window.Store.getState();
    s.emergencyFund.campaigns.unshift(newCamp);
    window.Store.saveState();
    this.toggleCreateModal(false);
    window.Router.render();
    alert(`Campaign "${title}" created and verified. It is now open for public donations!`);
  },

  promptDonate(campaignId, title) {
    const amount = prompt(`Enter contribution amount for "${title}" (in ₹):`, '500');
    if (!amount || isNaN(amount) || amount <= 0) return;

    const donorName = prompt('Enter your name (or leave blank for Anonymous):', 'Kind Neighbor') || 'Anonymous Supporter';
    window.Store.donateToFund(campaignId, amount, donorName);
    alert(`Thank you ${donorName}! Your generous contribution of ₹${amount} was recorded with zero commission deduction.`);
    window.Router.render();
  }
};
