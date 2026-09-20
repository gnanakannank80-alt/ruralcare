// RuralCare Firebase Configuration & Mock Fallback Layer
// Smart India Hackathon 2026 - Problem Statement: SIH26133
// Team: VisionX

/**
 * =========================================================================
 * FIREBASE CREDENTIALS PLACEHOLDER
 * =========================================================================
 * Replace the values below with your Firebase Web project credentials:
 * Console: https://console.firebase.google.com/
 *
 * NOTE: The app includes an automatic fallback! If placeholder values
 * remain intact, RuralCare seamlessly operates using local storage
 * and offline IndexedDB queues without throwing errors.
 * =========================================================================
 */
const firebaseConfig = {
  apiKey: "AIzaSyYOUR_RURALCARE_FIREBASE_API_KEY_PLACEHOLDER",
  authDomain: "ruralcare-sih2026-visionx.firebaseapp.com",
  projectId: "ruralcare-sih2026-visionx",
  storageBucket: "ruralcare-sih2026-visionx.appspot.com",
  messagingSenderId: "109823472394",
  appId: "1:109823472394:web:8f3c7b209e8a71d2e5b4a1",
  measurementId: "G-RURALCARE26"
};

class FirebaseService {
  constructor(config) {
    this.config = config;
    this.isConfigured = this.checkIfConfigured();
    this.init();
  }

  checkIfConfigured() {
    return (
      this.config.apiKey &&
      !this.config.apiKey.includes("YOUR_RURALCARE_FIREBASE_API_KEY")
    );
  }

  init() {
    if (this.isConfigured && typeof window.firebase !== 'undefined') {
      try {
        window.firebase.initializeApp(this.config);
        this.auth = window.firebase.auth();
        this.db = window.firebase.firestore();
        console.log('[RuralCare Firebase] Live Firebase SDK initialized successfully.');
      } catch (err) {
        console.warn('[RuralCare Firebase] Error initializing live Firebase, falling back to mock mode:', err);
        this.isConfigured = false;
      }
    } else {
      console.log('[RuralCare Firebase] Operating in Mock Data & Local Fallback mode (Default for SIH Demo).');
    }
  }

  // Auth: Mock OTP or Live Firebase Phone Auth
  async sendOTP(phoneNumber) {
    console.log(`[RuralCare Auth] Sending mock OTP for phone: ${phoneNumber}`);
    // Deterministic mock OTP for demonstration: 123456 or last 4 digits
    return {
      success: true,
      verificationId: 'mock-verification-id-' + Date.now(),
      demoOtp: '123456',
      message: 'Mock OTP sent successfully: 123456'
    };
  }

  async verifyOTP(verificationId, otpCode, role, profileData) {
    if (otpCode === '123456' || otpCode.length === 6) {
      const user = {
        uid: 'user_' + Math.random().toString(36).substr(2, 9),
        phone: profileData.phone || '+91 98765 43210',
        name: profileData.name || 'Ramesh Kumar',
        role: role || 'patient',
        abhaId: profileData.abhaId || '14-8921-4402-9912',
        village: profileData.village || 'Rampur'
      };
      return { success: true, user };
    }
    return { success: false, error: 'Invalid verification code. Use 123456 for demo.' };
  }

  // Cloud Messaging Mock: Broadcast simulated push alerts
  sendPushAlert(topic, payload) {
    console.log(`[RuralCare FCM Mock] Push notification broadcast [${topic}]:`, payload);
    if (window.Store && typeof window.Store.addNotification === 'function') {
      window.Store.addNotification({
        title: payload.title,
        message: payload.body,
        type: payload.type || 'info',
        time: 'Just now'
      });
    }
  }
}

window.FirebaseService = new FirebaseService(firebaseConfig);
