// LEE LOS DISEÑOS DEL FIRE

const grid = document.getElementById('catalog-grid');
const emptyState = document.getElementById('empty-state');
const loadingState = document.getElementById('loading-state');
const catScroll = document.getElementById('cat-scroll');

let allDesigns = [];
let activeCategory = 'todos';

// -LINKS DEL FOOTER Y DEL HEADER
function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || 'Hola! Vi su catálogo y me gustaría más información ');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

document.getElementById('header-whatsapp').href = buildWhatsAppLink();
document.getElementById('footer-whatsapp').href = buildWhatsAppLink();

// -DISEÑOS DEL FIRESTORE
function loadDesigns() {
  db.collection('designs')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        allDesigns = [];
        snapshot.forEach((doc) => {
          allDesigns.push({ id: doc.id, ...doc.data() });
        });
        loadingState.hidden = true;
        renderCategories();
        renderGrid();
      },
      (error) => {
        console.error('Error cargando catálogo:', error);
        loadingState.innerHTML = '<p>No se pudo cargar el catálogo. Intenta de nuevo en un momento.</p>';
      }
    );
}

// -Generar pills
function renderCategories() {
  const cats = [...new Set(allDesigns.map(d => d.category).filter(Boolean))];

  // Limpia todo excepto el boton de "Todos"
  catScroll.querySelectorAll('.cat-pill:not([data-cat="todos"])').forEach(el => el.remove());

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-pill';
    btn.dataset.cat = cat;
    btn.textContent = cat;
    catScroll.appendChild(btn);
  });

  catScroll.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      catScroll.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderGrid();
    });
  });
}

// -Pintar las tarjetas del catalogo
function renderGrid() {
  const filtered = activeCategory === 'todos'
    ? allDesigns
    : allDesigns.filter(d => d.category === activeCategory);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  filtered.forEach((design, i) => {
    const card = document.createElement('div');
    card.className = 'nail-card';
    card.style.animationDelay = `${Math.min(i * 0.05, 0.4)}s`;
    card.innerHTML = `
      <div class="nail-card-img">
        <img src="${design.imageUrl}" alt="${escapeHtml(design.name)}" loading="lazy">
      </div>
      <div class="nail-card-body">
        <p class="nail-card-cat">${escapeHtml(design.category || '')}</p>
        <h3 class="nail-card-name">${escapeHtml(design.name)}</h3>
        <p class="nail-card-price">Q${design.price}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(design));
    grid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// -Modal de detalle
const modalOverlay = document.getElementById('modal-overlay');
const modalImg = document.getElementById('modal-img');
const modalCat = document.getElementById('modal-cat');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalWhatsapp = document.getElementById('modal-whatsapp');

function openModal(design) {
  modalImg.src = design.imageUrl;
  modalImg.alt = design.name;
  modalCat.textContent = design.category || '';
  modalName.textContent = design.name;
  modalPrice.textContent = `Q${design.price}`;
  modalDesc.textContent = design.description || '';
  modalDesc.hidden = !design.description;
  modalWhatsapp.href = buildWhatsAppLink(`Hola! Me interesa este diseño: ${design.name} (Q${design.price}) `);
  modalOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// -Y por fin el boton inicar va vos
loadDesigns();
