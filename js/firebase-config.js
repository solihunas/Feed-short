// =============================================
//  FIREBASE CONFIG
//  Isi dengan konfigurasi dari Firebase Console
//  Cara dapat config:
//  1. Buka https://console.firebase.google.com
//  2. Buat project baru → "FeedShort"
//  3. Tambah Web App → salin firebaseConfig di bawah
// =============================================

const FIREBASE_CONFIG = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "GANTI_DENGAN_AUTH_DOMAIN_ANDA",
  projectId: "GANTI_DENGAN_PROJECT_ID_ANDA",
  storageBucket: "GANTI_DENGAN_STORAGE_BUCKET_ANDA",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID_ANDA",
  appId: "GANTI_DENGAN_APP_ID_ANDA"
};

// Mode demo: true = gunakan data lokal (FEED_DATA dari data.js)
// Ubah ke false setelah Firebase dikonfigurasi
const DEMO_MODE = true;
