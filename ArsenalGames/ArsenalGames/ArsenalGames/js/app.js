const products = [...document.querySelectorAll('.product-card')];
const filterButtons = [...document.querySelectorAll('.filter-button')];
const searchInput = document.querySelector('#search-input');
const emptyState = document.querySelector('#empty-state');
const catalogCount = document.querySelector('#catalog-count');
const cartButton = document.querySelector('.cart-button');
const cartCount = document.querySelector('.cart-count');
const toast = document.querySelector('.toast');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
let currentFilter = 'Todos';
let itemsInCart = 0;
let toastTimeout;

function updateProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase('es');
  let visibleCount = 0;

  products.forEach((product) => {
    const matchesCategory = currentFilter === 'Todos' || product.dataset.category === currentFilter;
    const matchesSearch = product.dataset.name.toLocaleLowerCase('es').includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;
    product.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  catalogCount.textContent = `${String(visibleCount).padStart(2, '0')} PRODUCTOS`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 2500);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle('active', filterButton === button);
    });
    updateProducts();
  });
});

document.querySelectorAll('[data-category-link]').forEach((link) => {
  link.addEventListener('click', () => {
    currentFilter = link.dataset.categoryLink;
    filterButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === currentFilter);
    });
    updateProducts();
  });
});

searchInput.addEventListener('input', updateProducts);

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    itemsInCart += 1;
    cartCount.textContent = String(itemsInCart);
    cartButton.setAttribute('aria-label', `Carrito, ${itemsInCart} ${itemsInCart === 1 ? 'producto' : 'productos'}`);
    showToast(`${button.dataset.product} añadido al carrito`);
  });
});

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => {
    const isFavorite = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(isFavorite));
    button.textContent = isFavorite ? '♥' : '♡';
    showToast(isFavorite ? 'Añadido a tus favoritos' : 'Eliminado de tus favoritos');
  });
});

menuToggle.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menú' : 'Cerrar menú');
  mainNav.classList.toggle('open', !isExpanded);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  });
});

/* ===== HERO PS4: carrusel de armas ===== */
const weapons = [
  { name: 'Lancer', description: 'Potencia sci-fi para partidas intensas, con diseño modular y precisión.', image: 'img/Lancer.png', fondo: 'claro' },
  { name: 'Espadas del Exilio', description: 'Doble filo de fantasía con cadena para duelos que dejan huella.', image: 'img/Exilio.png', fondo: 'claro' },
  { name: 'Ray-Gun', description: 'Energía pulp y color retro para explorar galaxias y sobrevivir al modo Zombies.', image: 'img/Raygun.png', fondo: 'oscuro' },
  { name: 'Arpón Scorpion', description: 'Alcance, cadena y precisión inspirados en aventuras de otro mundo.', image: 'img/Arpon.png', fondo: 'claro' }
];

const hero = document.getElementById('hero');
if (hero) {
  const track = hero.querySelector('.hero-track');
  const dotsRoot = hero.querySelector('.hero-dots');
  const total = weapons.length;
  const half = Math.floor(total / 2);
  const FIRST_DELAY = 900;
  const INTERVAL = 4500;
  let active = 0;
  let direction = 1;
  let timer;
  const lastOffset = [];

  track.innerHTML = weapons.map((w, i) => `<article class="hero-slide" aria-label="${w.name}"><div class="hero-ring" data-fondo="${w.fondo}"><img src="${w.image}" alt="${w.name}" draggable="false"></div><div class="hero-info"><span class="hero-kicker">${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span><h2>${w.name}</h2><p>${w.description}</p></div></article>`).join('');
  dotsRoot.innerHTML = weapons.map((w, i) => `<button type="button" role="tab" aria-label="Ver ${w.name}" data-index="${i}"></button>`).join('');

  const slides = [...track.querySelectorAll('.hero-slide')];
  const dots = [...dotsRoot.querySelectorAll('button')];

  // El hero mide: pantalla − (anuncio + header)
  const setChrome = () => {
    const header = document.querySelector('.site-header');
    hero.style.setProperty('--chrome', `${Math.round(header.getBoundingClientRect().bottom + window.scrollY)}px`);
  };

  const render = () => {
    slides.forEach((slide, i) => {
      let offset = ((i - active + total + half) % total) - half;
      if (total % 2 === 0 && offset === -half && direction < 0) offset = half;
      const distance = Math.min(Math.abs(offset), 2);
      const wrapped = lastOffset[i] !== undefined
        && Math.abs(lastOffset[i]) > 1
        && Math.abs(offset) === 1
        && Math.sign(offset) === direction;
      if (wrapped) slide.style.transition = 'none';
      slide.style.setProperty('--o', String(offset));
      slide.style.setProperty('--a', String(distance));
      slide.style.setProperty('--info-x', offset === 0 ? '0px' : offset < 0 ? '-30px' : '30px');
      slide.classList.toggle('is-active', offset === 0);
      slide.classList.toggle('is-far', Math.abs(offset) > 1);
      slide.setAttribute('aria-hidden', String(offset !== 0));
      if (wrapped) {
        void slide.offsetWidth;
        slide.style.transition = '';
      }
      lastOffset[i] = offset;
      dots[i].classList.toggle('is-active', offset === 0);
      dots[i].setAttribute('aria-selected', String(offset === 0));
    });
  };

  const goTo = (index) => {
    const next = (index + total) % total;
    if (next === active) return;
    const forward = (next - active + total) % total;
    direction = forward <= total / 2 ? 1 : -1;
    active = next;
    render();
  };
  const restart = (delay = INTERVAL) => {
    window.clearTimeout(timer);
    if (!document.hidden) {
      timer = window.setTimeout(() => {
        goTo(active + 1);
        timer = window.setInterval(() => goTo(active + 1), INTERVAL);
      }, delay);
    }
  };
  const move = (step) => { direction = step; goTo(active + step); restart(); };

  slides.forEach((slide, i) => slide.addEventListener('click', () => { if (!dragged && i !== active) { goTo(i); restart(); } }));
  dots.forEach((dot) => dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); restart(); }));
  hero.querySelectorAll('.hero-arrow').forEach((btn) => btn.addEventListener('click', () => move(Number(btn.dataset.dir))));

  // Teclado (sin interferir con el buscador)
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowLeft') move(-1);
  });

  // Deslizar con dedo o mouse
  let startX = null;
  let dragged = false;
  hero.addEventListener('pointerdown', (e) => { startX = e.clientX; dragged = false; });
  hero.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 50) { dragged = true; move(delta < 0 ? 1 : -1); }
    startX = null;
  });

  window.addEventListener('resize', () => {
    setChrome();
    render();
  });
  document.addEventListener('visibilitychange', restart);

  setChrome();
  render();
  restart(FIRST_DELAY);
}
