// CONFIGURACION DE FIREBASE — Lily Nails
// IMPORTANTE PAPA: Aqui en las 26 y 27 pegas las llaves que te da Firebase si estas dandole el mantenimiento recordate

const firebaseConfig = {
  apiKey: "AIzaSyBJVkYi9OUt7PxR9D12RdGqYXdlYjM91yY",
  authDomain: "lily-nails-222d1.firebaseapp.com",
  projectId: "lily-nails-222d1",
  storageBucket: "lily-nails-222d1.firebasestorage.app",
  messagingSenderId: "530160084839",
  appId: "1:530160084839:web:ed695393c342acfdb3f1c2"
};

// Whats
const WHATSAPP_NUMBER = "50247008811";

// Aca el claudinari para las fotos gratis (no no las del xxx)
const CLOUDINARY_CLOUD_NAME = "dqxmqkbzm";
const CLOUDINARY_UPLOAD_PRESET = "ml_default2";

// Inicializa Firebase (no vayas a tocar)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
