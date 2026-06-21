// LILY NAILS aca va la logica del panel va
// Login con Firebase Auth + subir fotos a Storage gratuito no comprao JAJAJ 
// Aca guardamos datos en Firestore + listar los seños, orale?.

const auth = firebase.auth();

const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

//  Manejo de sesion sensilliiito mijo, asi con pura fomula de excel JAJA (a ver si cachaste el chiste)
auth.onAuthStateChanged((user) => {
  if (user) {
    loginScreen.hidden = true;
    adminPanel.hidden = false;
    loadAdminDesigns();
  } else {
    loginScreen.hidden = false;
    adminPanel.hidden = true;
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  loginError.hidden = true;

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    loginError.textContent = 'Correo o contraseña incorrectos. Intenta de nuevo.';
    loginError.hidden = false;
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  auth.signOut();
});

//Categoria >>> mostrar campo nuevo si elige mi ama a "crear categoría"
const categorySelect = document.getElementById('design-category');
const categoryNewInput = document.getElementById('design-category-new');

categorySelect.addEventListener('change', () => {
  if (categorySelect.value === '__new__') {
    categoryNewInput.hidden = false;
    categoryNewInput.required = true;
    categoryNewInput.focus();
  } else {
    categoryNewInput.hidden = true;
    categoryNewInput.required = false;
  }
});

// Preview de imagen pa elegir archivo
const imageInput = document.getElementById('image-input');
const uploadDropEmpty = document.getElementById('upload-drop-empty');
const uploadPreview = document.getElementById('upload-preview');
let selectedFile = null;

imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;
  selectedFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadPreview.src = e.target.result;
    uploadPreview.hidden = false;
    uploadDropEmpty.hidden = true;
  };
  reader.readAsDataURL(file);
});

// Aca Publicar nuevo diseño
const uploadForm = document.getElementById('upload-form');
const publishBtn = document.getElementById('publish-btn');
const uploadStatus = document.getElementById('upload-status');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedFile) {
    showStatus('Por favor selecciona una foto primero.', 'error');
    return;
  }

  const name = document.getElementById('design-name').value.trim();
  const price = document.getElementById('design-price').value;
  const description = document.getElementById('design-desc').value.trim();
  let category = categorySelect.value;
  if (category === '__new__') {
    category = categoryNewInput.value.trim();
  }

  if (!name || !price || !category) {
    showStatus('Llena todos los campos obligatorios.', 'error');
    return;
  }

  publishBtn.disabled = true;
  showStatus('Subiendo foto…', 'loading');

  try {
    // Subir imagen a Cloudinary (no use firebase porque ahora se paga, antes no :<)
    const imageUrl = await uploadToCloudinary(selectedFile);

    // Guardar datos en Firestore
    await db.collection('designs').add({
      name,
      price: Number(price),
      category,
      description,
      imageUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showStatus('¡Publicado! Ya aparece en tu catálogo ✨', 'success');
    uploadForm.reset();
    uploadPreview.hidden = true;
    uploadDropEmpty.hidden = false;
    categoryNewInput.hidden = true;
    selectedFile = null;
  } catch (err) {
    console.error(err);
    showStatus('Algo salió mal al publicar. Intenta de nuevo.', 'error');
  } finally {
    publishBtn.disabled = false;
  }
});

// Sube una imagen a Cloudinary y devuelve la URL publishh
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

function showStatus(msg, type) {
  uploadStatus.textContent = msg;
  uploadStatus.hidden = false;
  uploadStatus.className = `upload-status ${type === 'loading' ? '' : type}`;
}

// Listar diseños existentes en el panel orignal o existente cmo querras
const adminGrid = document.getElementById('admin-grid');
const adminEmpty = document.getElementById('admin-empty');

function loadAdminDesigns() {
  db.collection('designs')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      adminGrid.innerHTML = '';
      if (snapshot.empty) {
        adminEmpty.hidden = false;
        return;
      }
      adminEmpty.hidden = true;

      snapshot.forEach((doc) => {
        const d = doc.data();
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
          <button class="admin-item-delete" data-id="${doc.id}" aria-label="Eliminar">
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div class="admin-item-img"><img src="${d.imageUrl}" alt="${d.name}"></div>
          <div class="admin-item-body">
            <p class="admin-item-name">${d.name}</p>
            <p class="admin-item-price">Q${d.price}</p>
          </div>
        `;
        adminGrid.appendChild(item);
      });

      document.querySelectorAll('.admin-item-delete').forEach(btn => {
        btn.addEventListener('click', () => openConfirmDelete(btn.dataset.id));
      });
    });
}

// Eliminar diseño (con confirmacioon claro)
const confirmOverlay = document.getElementById('confirm-overlay');
let pendingDeleteId = null;

function openConfirmDelete(id) {
  pendingDeleteId = id;
  confirmOverlay.classList.add('is-open');
}

document.getElementById('confirm-cancel').addEventListener('click', () => {
  confirmOverlay.classList.remove('is-open');
  pendingDeleteId = null;
});

document.getElementById('confirm-delete').addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  try {
    await db.collection('designs').doc(pendingDeleteId).delete();
  } catch (err) {
    console.error('Error eliminando:', err);
  }
  confirmOverlay.classList.remove('is-open');
  pendingDeleteId = null;
});
