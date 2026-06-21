// ============================================================
// CONFIGURACIÓN DE FIREBASE — Lily Nails
// ============================================================
// IMPORTANTE: Aquí pegas las llaves que te da Firebase cuando
// creas tu proyecto. Yo te voy a guiar paso a paso para
// sacarlas. Por ahora son placeholders (no funcionan todavía).
//
// NO BORRES nada de la estructura, solo reemplaza los valores
// entre comillas "" que dicen TU_xxx_AQUI.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBJVkYi9OUt7PxR9D12RdGqYXdlYjM91yY",
  authDomain: "lily-nails-222d1.firebaseapp.com",
  projectId: "lily-nails-222d1",
  storageBucket: "lily-nails-222d1.firebasestorage.app",
  messagingSenderId: "530160084839",
  appId: "1:530160084839:web:ed695393c342acfdb3f1c2"
};

// Número de WhatsApp del negocio (con código de país, sin "+", sin espacios)
const WHATSAPP_NUMBER = "50247008811";

// ============================================================
// CONFIGURACIÓN DE CLOUDINARY — para guardar las fotos (gratis,
// sin necesidad de tarjeta de crédito)
// ============================================================
const CLOUDINARY_CLOUD_NAME = "dqxmqkbzm";
const CLOUDINARY_UPLOAD_PRESET = "ml_default2";

// Inicializa Firebase (no tocar)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
