// RuralCare State Store & FHIR R4 Mock Engine
// Smart India Hackathon 2026 - VisionX

const STORE_KEY = 'ruralcare_state_v1';

const defaultState = {
  currentUser: {
    role: 'patient',
    id: 'usr_pat_01',
    name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    abhaId: '14-8921-4402-9912',
    village: 'Rampur',
    age: 38,
    gender: 'Male',
    bloodGroup: 'B+'
  },

  rolesProfiles: {
    patient: {
      role: 'patient',
      id: 'usr_pat_01',
      name: 'Ramesh Kumar',
      phone: '+91 98765 43210',
      abhaId: '14-8921-4402-9912',
      village: 'Rampur',
      age: 38,
      gender: 'Male',
      bloodGroup: 'B+'
    },
    asha: {
      role: 'asha',
      id: 'usr_asha_01',
      name: 'Sunita Devi',
      phone: '+91 98123 45678',
      designation: 'Senior ASHA Facilitator',
      assignedCenter: 'Sub-Center Rampur (PHC Rampur)',
      coveredPopulation: 1420,
      activePregnancies: 18,
      infantsTracked: 34
    },
    doctor: {
      role: 'doctor',
      id: 'usr_doc_01',
      name: 'Dr. Arvind Sharma',
      phone: '+91 94250 88991',
      qualification: 'MBBS, MD (General Medicine)',
      specialty: 'General Medicine',
      facility: 'PHC Rampur',
      regNo: 'MCI-2015-88392'
    },
    admin: {
      role: 'admin',
      id: 'usr_adm_01',
      name: 'Rajesh Verma',
      phone: '+91 94111 22334',
      designation: 'District Health Officer (DHO)',
      district: 'Raigarh District',
      state: 'Chhattisgarh'
    }
  },

  facilities: [
    { id: 'fac_phc_rampur', name: 'PHC Rampur', type: 'Primary Health Centre', distance: '1.2 km', beds: 6, doctorOnDuty: 'Dr. Arvind Sharma', phone: '+91 7762 234101', lat: 21.8974, lng: 83.3950 },
    { id: 'fac_chc_bilaspur', name: 'CHC Bilaspur', type: 'Community Health Centre', distance: '14.5 km', beds: 30, doctorOnDuty: 'Dr. Neha Patel', phone: '+91 7762 238202', lat: 21.9120, lng: 83.4210 },
    { id: 'fac_dh_raigarh', name: 'District Hospital Raigarh', type: 'District Hospital', distance: '28.0 km', beds: 250, doctorOnDuty: 'Dr. S. K. Gupta', phone: '+91 7762 240000', lat: 21.8900, lng: 83.3800 }
  ],

  departments: [
    'General Medicine',
    'Obstetrics & Gynecology (Maternal)',
    'Pediatrics (Child Health)',
    'Orthopedics',
    'Cardiology',
    'Ophthalmology (Eye Care)'
  ],

  doctors: [
    { id: 'doc_1', name: 'Dr. Arvind Sharma', specialty: 'General Medicine', facility: 'PHC Rampur', available: true, experience: '12 yrs', rating: 4.8 },
    { id: 'doc_2', name: 'Dr. Ananya Roy', specialty: 'Obstetrics & Gynecology (Maternal)', facility: 'CHC Bilaspur', available: true, experience: '9 yrs', rating: 4.9 },
    { id: 'doc_3', name: 'Dr. Rajesh Deshmukh', specialty: 'Pediatrics (Child Health)', facility: 'District Hospital Raigarh', available: false, experience: '15 yrs', rating: 4.7 },
    { id: 'doc_4', name: 'Dr. Neha Patel', specialty: 'General Medicine', facility: 'CHC Bilaspur', available: true, experience: '7 yrs', rating: 4.6 },
    { id: 'doc_5', name: 'Dr. S. K. Gupta', specialty: 'Cardiology', facility: 'District Hospital Raigarh', available: true, experience: '20 yrs', rating: 4.9 }
  ],

  appointments: [
    {
      id: 'apt_101',
      tokenNumber: 'A-12',
      patientName: 'Ramesh Kumar',
      abhaId: '14-8921-4402-9912',
      facility: 'PHC Rampur',
      department: 'General Medicine',
      doctor: 'Dr. Arvind Sharma',
      date: '2026-09-22',
      slot: '10:30 AM - 11:00 AM',
      status: 'Confirmed',
      queueStatus: 'In Queue',
      currentToken: 'A-09',
      estimatedWaitMin: 25,
      bookedBy: 'Self',
      createdAt: '2026-09-20 09:15 AM'
    },
    {
      id: 'apt_102',
      tokenNumber: 'B-04',
      patientName: 'Pooja Devi',
      abhaId: '14-7712-3391-4421',
      facility: 'CHC Bilaspur',
      department: 'Obstetrics & Gynecology (Maternal)',
      doctor: 'Dr. Ananya Roy',
      date: '2026-09-23',
      slot: '11:00 AM - 11:30 AM',
      status: 'Confirmed',
      queueStatus: 'Scheduled',
      currentToken: '-',
      estimatedWaitMin: 45,
      bookedBy: 'ASHA Sunita Devi',
      createdAt: '2026-09-19 02:40 PM'
    }
  ],

  emergencyIncidents: [
    {
      id: 'emg_901',
      patientName: 'Mohan Lal',
      phone: '+91 99887 66554',
      age: 52,
      village: 'Rampur Tola 2',
      symptoms: ['Severe chest tightness', 'Cold sweating', 'Shortness of breath'],
      severity: 'Critical',
      priorityRank: 1,
      assignedFacility: 'PHC Rampur -> Prep for District Hospital',
      status: 'Ambulance Dispatched',
      timestamp: '2026-09-20 18:45:00',
      vitals: { bp: '160/100', pulse: '112 bpm', spO2: '91%' }
    }
  ],

  ambulanceTrip: {
    active: true,
    requestId: 'AMB-REQ-2026-042',
    patientName: 'Ramesh Kumar',
    pickupLocation: 'Village Rampur, Near Panchayat Bhawan',
    destination: 'PHC Rampur Emergency Ward',
    driverName: 'Rameshwar Singh',
    driverPhone: '+91 98231 10808',
    vehicleNo: 'CG-13-EMG-0108 (Basic Life Support)',
    etaMinutes: 7,
    status: 'On the way', // Requested -> Assigned -> On the way -> Arrived -> Reached hospital
    statusIndex: 2,
    driverLat: 21.8998,
    driverLng: 83.3882,
    patientLat: 21.8974,
    patientLng: 83.3950
  },

  teleconsultSessions: [
    {
      id: 'tc_501',
      doctor: 'Dr. Arvind Sharma',
      specialty: 'General Medicine',
      patient: 'Ramesh Kumar',
      status: 'Waiting Room',
      scheduledTime: 'Today, 07:30 PM',
      lowBandwidthMode: true,
      lastPrescription: null
    }
  ],

  // HL7 FHIR R4 Conforming Health Record Data Model
  fhirRecords: {
    patient: {
      resourceType: 'Patient',
      id: 'fhir-pat-ramesh-kumar',
      identifier: [
        { system: 'https://abdm.gov.in/abha', value: '14-8921-4402-9912' },
        { system: 'https://uidai.gov.in', value: 'XXXXXXXX4912' }
      ],
      name: [{ use: 'official', family: 'Kumar', given: ['Ramesh'] }],
      gender: 'male',
      birthDate: '1988-04-12',
      address: [{ city: 'Rampur', district: 'Raigarh', state: 'Chhattisgarh', postalCode: '496001', country: 'IND' }]
    },
    encounters: [
      {
        resourceType: 'Encounter',
        id: 'enc_2026_01',
        status: 'finished',
        class: { code: 'AMB', display: 'ambulatory' },
        serviceType: { text: 'General OPD Follow-up' },
        period: { start: '2026-08-15', end: '2026-08-15' },
        serviceProvider: { display: 'PHC Rampur' },
        reasonCode: [{ text: 'Type 2 Diabetes Mellitus review & mild seasonal fever' }]
      },
      {
        resourceType: 'Encounter',
        id: 'enc_2026_02',
        status: 'finished',
        class: { code: 'EMER', display: 'emergency' },
        serviceType: { text: 'Acute Gastroenteritis' },
        period: { start: '2026-06-04', end: '2026-06-05' },
        serviceProvider: { display: 'CHC Bilaspur' },
        reasonCode: [{ text: 'Dehydration treated with IV fluids & ORS' }]
      }
    ],
    observations: [
      {
        resourceType: 'Observation',
        id: 'obs_01',
        status: 'final',
        code: { text: 'Fasting Blood Sugar (FBS)' },
        valueQuantity: { value: 126, unit: 'mg/dL' },
        referenceRange: [{ low: { value: 70 }, high: { value: 100 } }],
        effectiveDateTime: '2026-08-15'
      },
      {
        resourceType: 'Observation',
        id: 'obs_02',
        status: 'final',
        code: { text: 'Blood Pressure' },
        valueString: '128/84 mmHg',
        effectiveDateTime: '2026-08-15'
      },
      {
        resourceType: 'Observation',
        id: 'obs_03',
        status: 'final',
        code: { text: 'Hemoglobin (Hb)' },
        valueQuantity: { value: 13.4, unit: 'g/dL' },
        referenceRange: [{ low: { value: 13.0 }, high: { value: 17.0 } }],
        effectiveDateTime: '2026-08-15'
      }
    ],
    medicationRequests: [
      {
        resourceType: 'MedicationRequest',
        id: 'med_req_01',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: { text: 'Metformin 500mg' },
        dosageInstruction: [{ text: '1 tablet twice daily after meals (Morning, Night)', timing: { frequency: 2 } }],
        authoredOn: '2026-08-15',
        requester: { display: 'Dr. Arvind Sharma' },
        remainingRefills: 2
      },
      {
        resourceType: 'MedicationRequest',
        id: 'med_req_02',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: { text: 'Paracetamol 650mg' },
        dosageInstruction: [{ text: '1 tablet SOS for fever or headache', timing: { frequency: 1 } }],
        authoredOn: '2026-08-15',
        requester: { display: 'Dr. Arvind Sharma' },
        remainingRefills: 0
      }
    ],
    allergies: ['Penicillin (mild rash)', 'Dust/Pollen seasonal'],
    vaccinations: [
      { vaccine: 'COVID-19 Covishield (Dose 1 & 2)', date: '2021-07-10', place: 'PHC Rampur' },
      { vaccine: 'COVID-19 Precaution Dose', date: '2022-04-14', place: 'PHC Rampur' },
      { vaccine: 'Tetanus Toxoid (TT Booster)', date: '2025-01-10', place: 'Sub-Center Rampur' }
    ],
    consentSharing: true
  },

  referrals: [
    {
      id: 'ref_301',
      patientName: 'Ramesh Kumar',
      abhaId: '14-8921-4402-9912',
      fromFacility: 'PHC Rampur',
      referringDoctor: 'Dr. Arvind Sharma',
      toFacility: 'District Hospital Raigarh',
      specialtyRequired: 'Cardiology Specialist',
      clinicalSummary: 'Recurrent exertional chest discomfort, suspected CAD, ECG showing T-wave flattening.',
      urgency: 'High Priority',
      status: 'Accepted', // Created -> Accepted -> Patient reached -> Treated -> Feedback
      statusIndex: 1,
      createdDate: '2026-09-18',
      acceptedDate: '2026-09-19',
      delayAlert: false
    },
    {
      id: 'ref_302',
      patientName: 'Kavita Bai',
      abhaId: '14-5511-2244-8801',
      fromFacility: 'PHC Rampur',
      referringDoctor: 'Dr. Arvind Sharma',
      toFacility: 'CHC Bilaspur',
      specialtyRequired: 'Maternal High Risk (ANC)',
      clinicalSummary: 'Severe anemia in 32nd week of pregnancy (Hb 6.8 g/dL), needs IV Iron sucrose or transfusion.',
      urgency: 'Critical',
      status: 'Treated',
      statusIndex: 3,
      createdDate: '2026-09-10',
      acceptedDate: '2026-09-10',
      delayAlert: false
    }
  ],

  medicinesInventory: [
    { id: 'm1', name: 'Paracetamol 500mg', type: 'Tablet', facility: 'PHC Rampur', stock: 1200, unit: 'tabs', minThreshold: 300, status: 'In Stock' },
    { id: 'm2', name: 'Amoxicillin 500mg', type: 'Capsule', facility: 'PHC Rampur', stock: 45, unit: 'caps', minThreshold: 100, status: 'Low Stock' },
    { id: 'm3', name: 'Metformin 500mg', type: 'Tablet', facility: 'PHC Rampur', stock: 850, unit: 'tabs', minThreshold: 200, status: 'In Stock' },
    { id: 'm4', name: 'ORS Packets (WHO Formula)', type: 'Sachet', facility: 'PHC Rampur', stock: 320, unit: 'pkts', minThreshold: 150, status: 'In Stock' },
    { id: 'm5', name: 'Iron & Folic Acid (IFA Red)', type: 'Tablet', facility: 'PHC Rampur', stock: 0, unit: 'tabs', minThreshold: 500, status: 'Out of Stock' },
    { id: 'm6', name: 'Albendazole 400mg', type: 'Chewable', facility: 'PHC Rampur', stock: 600, unit: 'tabs', minThreshold: 150, status: 'In Stock' },
    { id: 'm7', name: 'Amlodipine 5mg', type: 'Tablet', facility: 'PHC Rampur', stock: 540, unit: 'tabs', minThreshold: 150, status: 'In Stock' },
    { id: 'm8', name: 'Ciprofloxacin Eye Drops', type: 'Drops', facility: 'PHC Rampur', stock: 12, unit: 'bottles', minThreshold: 25, status: 'Low Stock' }
  ],

  followups: [
    {
      id: 'fu_701',
      patientName: 'Ramesh Kumar',
      category: 'Chronic - Diabetes Review',
      dueDate: '2026-09-25',
      assignedTo: 'ASHA Sunita Devi',
      status: 'Pending',
      notes: 'Check fasting glucose and ensure daily morning dosage of Metformin.'
    },
    {
      id: 'fu_702',
      patientName: 'Pooja Devi (W/o Santosh)',
      category: 'ANC Visit 3 (28-32 Weeks)',
      dueDate: '2026-09-23',
      assignedTo: 'ASHA Sunita Devi',
      status: 'Scheduled',
      notes: 'Blood pressure check, abdominal examination, IFA tablet distribution.'
    },
    {
      id: 'fu_703',
      patientName: 'Baby of Geeta (Age 9 Mo)',
      category: 'Immunization (Measles-Rubella 1)',
      dueDate: '2026-09-26',
      assignedTo: 'ASHA Sunita Devi',
      status: 'Pending',
      notes: 'Administer MR 1st dose + Vitamin A syrup 1st dose.'
    }
  ],

  mchPrograms: {
    ancMilestones: [
      { visit: 'ANC 1 (Within 12 weeks)', timeline: 'Registered at 8 weeks', status: 'Completed' },
      { visit: 'ANC 2 (14 - 26 weeks)', timeline: 'Completed at 20 weeks', status: 'Completed' },
      { visit: 'ANC 3 (28 - 34 weeks)', timeline: 'Scheduled for this week', status: 'Upcoming' },
      { visit: 'ANC 4 (36 weeks to term)', timeline: 'Pending', status: 'Pending' }
    ],
    immunizationSchedule: [
      { stage: 'At Birth', vaccines: 'BCG, OPV-0, Hepatitis B-Birth dose', status: 'Administered' },
      { stage: '6 Weeks', vaccines: 'Pentavalent-1, Rotavirus-1, fIPV-1, PCV-1', status: 'Administered' },
      { stage: '10 Weeks', vaccines: 'Pentavalent-2, Rotavirus-2', status: 'Administered' },
      { stage: '14 Weeks', vaccines: 'Pentavalent-3, Rotavirus-3, fIPV-2, PCV-2', status: 'Administered' },
      { stage: '9-12 Months', vaccines: 'Measles-Rubella (MR-1), JE-1, PCV Booster', status: 'Due Soon' }
    ]
  },

  bloodBank: {
    stock: [
      { group: 'A+', units: 14, status: 'Available' },
      { group: 'A-', units: 3, status: 'Low' },
      { group: 'B+', units: 22, status: 'Available' },
      { group: 'B-', units: 4, status: 'Low' },
      { group: 'O+', units: 31, status: 'Available' },
      { group: 'O-', units: 2, status: 'Critical' },
      { group: 'AB+', units: 9, status: 'Available' },
      { group: 'AB-', units: 1, status: 'Critical' }
    ],
    donors: [
      { id: 'bd_1', name: 'Vikram Patel', group: 'O+', phone: '+91 98210 11223', distance: '2.4 km', village: 'Rampur', available: true, lastDonation: '2026-05-10' },
      { id: 'bd_2', name: 'Mahesh Sharma', group: 'B+', phone: '+91 98450 33445', distance: '4.1 km', village: 'Bilaspur Outskirts', available: true, lastDonation: '2026-03-12' },
      { id: 'bd_3', name: 'Sanjay Yadav', group: 'A+', phone: '+91 97120 55667', distance: '5.8 km', village: 'Rampur Tola', available: true, lastDonation: '2026-06-01' },
      { id: 'bd_4', name: 'Deepak Sahu', group: 'O-', phone: '+91 99001 77889', distance: '8.2 km', village: 'Raigarh Rural', available: true, lastDonation: '2026-02-18' }
    ],
    requests: [
      { id: 'breq_1', patientName: 'Smt. Shanti Bai', bloodGroup: 'O-', unitsNeeded: 2, hospital: 'District Hospital Raigarh', urgency: 'Emergency', status: 'Matching Donors' }
    ]
  },

  organDonations: [
    {
      id: 'org_001',
      pledgeNumber: 'NOTTO-2026-IN-98210',
      donorName: 'Ramesh Kumar',
      abhaId: '14-8921-4402-9912',
      organsPledged: ['Cornea (Eyes)', 'Kidneys', 'Heart Valves'],
      emergencyContactName: 'Geeta Kumar (Spouse)',
      emergencyContactPhone: '+91 98765 43211',
      pledgeDate: '2026-07-14',
      status: 'Active Pledge Registered'
    }
  ],

  emergencyFund: {
    campaigns: [
      {
        id: 'fund_01',
        title: 'Urgent Heart Valve Replacement for Baby Aarav (Age 3)',
        beneficiary: 'Aarav (S/o Devendra, Small Farmer, Rampur)',
        hospital: 'AIIMS Raipur / District Hospital Raigarh',
        targetAmount: 180000,
        raisedAmount: 142500,
        verifiedDoctor: 'Dr. Arvind Sharma (PHC Rampur)',
        medicalProofVerified: true,
        daysLeft: 6,
        description: 'Diagnosed with Congenital Heart Defect with severe pulmonary stenosis. Urgent intervention needed within 2 weeks.',
        donorsCount: 124
      },
      {
        id: 'fund_02',
        title: 'Emergency Trauma Surgery Support for Laborer Shankar',
        beneficiary: 'Shankar Lal (Age 42, Sole Breadwinner)',
        hospital: 'District Hospital Trauma Ward',
        targetAmount: 65000,
        raisedAmount: 51200,
        verifiedDoctor: 'Dr. S. K. Gupta (District Hospital)',
        medicalProofVerified: true,
        daysLeft: 3,
        description: 'Compound fracture of femur and internal bleeding following farm equipment accident.',
        donorsCount: 68
      }
    ],
    transactions: [
      { id: 'txn_91', donorName: 'Anonymous Supporter', amount: 2500, date: 'Today, 02:15 PM', campaignId: 'fund_01' },
      { id: 'txn_90', donorName: 'Rampur Youth Club', amount: 11000, date: 'Yesterday', campaignId: 'fund_01' },
      { id: 'txn_89', donorName: 'Dr. Arvind Sharma', amount: 5000, date: '2 days ago', campaignId: 'fund_02' }
    ]
  },

  healthCamps: [
    {
      id: 'cmp_101',
      title: 'Free Rural Eye Screening & Cataract Identification Camp',
      date: '2026-09-28',
      time: '09:00 AM - 04:00 PM',
      village: 'Rampur Panchayat Community Hall',
      organizer: 'National Blindness Control Programme & Team VisionX',
      targetVillages: ['Rampur', 'Kotra', 'Chicholi'],
      services: ['Visual Acuity Testing', 'Free Eyeglasses Distribution', 'Cataract Surgery Referrals'],
      registeredPatients: 142,
      maxCapacity: 250,
      status: 'Upcoming'
    },
    {
      id: 'cmp_102',
      title: 'Maternal Nutrition & High-Risk Pregnancy Screening Day',
      date: '2026-10-05',
      time: '10:00 AM - 03:00 PM',
      village: 'Bilaspur CHC Main Lawn',
      organizer: 'ICDS & National Health Mission (NHM)',
      targetVillages: ['Bilaspur Sub-Districts'],
      services: ['Ultrasound Sonography', 'Hb & Blood Sugar Testing', 'Nutrition Kits by ASHA'],
      registeredPatients: 98,
      maxCapacity: 150,
      status: 'Upcoming'
    }
  ],

  notifications: [
    {
      id: 'nt_1',
      title: 'Appointment Confirmed',
      message: 'Token A-12 generated for Dr. Arvind Sharma at PHC Rampur on 22 Sep.',
      time: '10 min ago',
      read: false,
      type: 'appointment'
    },
    {
      id: 'nt_2',
      title: 'Medicine Refill Reminder',
      message: 'Metformin 500mg supply has 4 days remaining. PHC pharmacy stock is available.',
      time: '1 hour ago',
      read: false,
      type: 'medicine'
    },
    {
      id: 'nt_3',
      title: 'Emergency Alert Broadcast',
      message: 'Ambulance CG-13-EMG-0108 dispatched towards Rampur Tola. ETA 7 mins.',
      time: '2 hours ago',
      read: true,
      type: 'emergency'
    },
    {
      id: 'nt_4',
      title: 'Upcoming Health Camp',
      message: 'Free Eye Screening Camp at Rampur Panchayat on 28th September. Tap to register.',
      time: 'Yesterday',
      read: true,
      type: 'camp'
    }
  ],

  ussdMessages: [
    { from: 'RuralCare-USSD', text: 'Welcome to RuralCare *123#. Reply: 1 Appt, 2 SOS, 3 Meds, 4 Followup, 5 Blood, 6 Lang', time: '18:50' },
    { from: 'RuralCare-SMS', text: 'Alert: Your Token A-12 is 3 numbers away at PHC Rampur. Est wait: 15 mins.', time: '18:45' }
  ]
};

class Store {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[Store] Local storage read error, resetting to default:', e);
    }
    this.saveState(defaultState);
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState(stateToSave) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(stateToSave || this.state));
    } catch (e) {
      console.error('[Store] Local storage save error:', e);
    }
  }

  getState() {
    return this.state;
  }

  update(mutationFn) {
    mutationFn(this.state);
    this.saveState();
    window.dispatchEvent(new CustomEvent('stateChanged', { detail: { state: this.state } }));
  }

  // Role Management
  switchRole(roleName) {
    if (this.state.rolesProfiles[roleName]) {
      this.update((s) => {
        s.currentUser = { ...s.rolesProfiles[roleName] };
      });
      return true;
    }
    return false;
  }

  // Appointments
  addAppointment(appointment) {
    const newApt = {
      id: 'apt_' + Date.now(),
      tokenNumber: 'T-' + Math.floor(10 + Math.random() * 90),
      currentToken: 'T-04',
      estimatedWaitMin: 20,
      status: 'Confirmed',
      queueStatus: 'In Queue',
      createdAt: new Date().toLocaleString(),
      ...appointment
    };
    this.update((s) => {
      s.appointments.unshift(newApt);
      s.notifications.unshift({
        id: 'nt_' + Date.now(),
        title: 'New Appointment Booked',
        message: `Booked token ${newApt.tokenNumber} for ${newApt.patientName} with ${newApt.doctor}.`,
        time: 'Just now',
        read: false,
        type: 'appointment'
      });
    });
    return newApt;
  }

  cancelAppointment(id) {
    this.update((s) => {
      const apt = s.appointments.find((a) => a.id === id);
      if (apt) {
        apt.status = 'Cancelled';
        apt.queueStatus = 'Cancelled';
      }
    });
  }

  // Emergency Triage
  addEmergency(emergencyData) {
    const incident = {
      id: 'emg_' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Dispatched & Hospital Notified',
      priorityRank: emergencyData.severity === 'Critical' ? 1 : (emergencyData.severity === 'High' ? 2 : 3),
      ...emergencyData
    };
    this.update((s) => {
      s.emergencyIncidents.unshift(incident);
      s.ambulanceTrip.active = true;
      s.ambulanceTrip.etaMinutes = incident.priorityRank === 1 ? 5 : 12;
      s.ambulanceTrip.status = 'Assigned';
      s.notifications.unshift({
        id: 'nt_' + Date.now(),
        title: 'Emergency SOS Alert',
        message: `High priority triage recorded for ${incident.patientName}. Hospital alert dispatched!`,
        time: 'Just now',
        read: false,
        type: 'emergency'
      });
    });
    return incident;
  }

  // Health Records
  addClinicalObservation(obs) {
    const newObs = {
      resourceType: 'Observation',
      id: 'obs_' + Date.now(),
      status: 'final',
      effectiveDateTime: new Date().toISOString().split('T')[0],
      ...obs
    };
    this.update((s) => {
      s.fhirRecords.observations.unshift(newObs);
    });
    return newObs;
  }

  addMedicationRequest(med) {
    const newMed = {
      resourceType: 'MedicationRequest',
      id: 'med_req_' + Date.now(),
      status: 'active',
      intent: 'order',
      authoredOn: new Date().toISOString().split('T')[0],
      requester: { display: this.state.currentUser.name },
      remainingRefills: 2,
      ...med
    };
    this.update((s) => {
      s.fhirRecords.medicationRequests.unshift(newMed);
    });
    return newMed;
  }

  // Referrals
  addReferral(ref) {
    const newRef = {
      id: 'ref_' + Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Created',
      statusIndex: 0,
      delayAlert: false,
      ...ref
    };
    this.update((s) => {
      s.referrals.unshift(newRef);
    });
    return newRef;
  }

  // Medicines Restock Request
  requestMedicineRestock(medId, requestedUnits) {
    this.update((s) => {
      const med = s.medicinesInventory.find((m) => m.id === medId);
      if (med) {
        med.restockRequested = true;
        med.requestedUnits = requestedUnits;
      }
      s.notifications.unshift({
        id: 'nt_' + Date.now(),
        title: 'Restock Request Submitted',
        message: `Restock request of ${requestedUnits} units logged for ${med ? med.name : 'medicine'}.`,
        time: 'Just now',
        read: false,
        type: 'medicine'
      });
    });
  }

  // Blood Donor Actions
  registerBloodDonor(donor) {
    const newDonor = {
      id: 'bd_' + Date.now(),
      available: true,
      lastDonation: 'None / First Time',
      distance: '1.5 km',
      ...donor
    };
    this.update((s) => {
      s.bloodBank.donors.unshift(newDonor);
    });
    return newDonor;
  }

  requestBlood(request) {
    const newReq = {
      id: 'breq_' + Date.now(),
      status: 'Matching Donors',
      createdAt: new Date().toLocaleString(),
      ...request
    };
    this.update((s) => {
      s.bloodBank.requests.unshift(newReq);
      s.notifications.unshift({
        id: 'nt_' + Date.now(),
        title: 'Urgent Blood Requirement',
        message: `Blood request for ${newReq.bloodGroup} (${newReq.unitsNeeded} units) at ${newReq.hospital}.`,
        time: 'Just now',
        read: false,
        type: 'emergency'
      });
    });
    return newReq;
  }

  // Organ Pledge
  registerOrganPledge(pledge) {
    const newPledge = {
      id: 'org_' + Date.now(),
      pledgeNumber: 'NOTTO-2026-IN-' + Math.floor(10000 + Math.random() * 90000),
      pledgeDate: new Date().toISOString().split('T')[0],
      status: 'Active Pledge Registered',
      ...pledge
    };
    this.update((s) => {
      s.organDonations.unshift(newPledge);
    });
    return newPledge;
  }

  // Emergency Fund
  donateToFund(campaignId, amount, donorName) {
    this.update((s) => {
      const camp = s.emergencyFund.campaigns.find((c) => c.id === campaignId);
      if (camp) {
        camp.raisedAmount += Number(amount);
        camp.donorsCount += 1;
      }
      s.emergencyFund.transactions.unshift({
        id: 'txn_' + Date.now(),
        donorName: donorName || 'Kind RuralCare Supporter',
        amount: Number(amount),
        date: 'Just now',
        campaignId
      });
    });
  }

  // Notifications
  addNotification(notif) {
    this.update((s) => {
      s.notifications.unshift({
        id: 'nt_' + Date.now(),
        read: false,
        ...notif
      });
    });
  }

  markAllNotificationsRead() {
    this.update((s) => {
      s.notifications.forEach((n) => { n.read = true; });
    });
  }
}

window.Store = new Store();
