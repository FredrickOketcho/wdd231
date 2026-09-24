import { attractions } from '../data/discover.mjs';

const gallery = document.querySelector('#discover-gallery');
const visitMessage = document.querySelector('#visit-message');
const storageKey = 'kampala-chamber-last-visit';

function updateVisitMessage() {
  if (!visitMessage) return;

  try {
    const lastVisit = Number(localStorage.getItem(storageKey));
    const now = Date.now();

    if (!lastVisit) {
      visitMessage.textContent = 'Welcome! Let us know if you have any questions.';
    } else {
      const dayMs = 1000 * 60 * 60 * 24;
      const diffDays = Math.floor((now - lastVisit) / dayMs);

      if (diffDays < 1) {
        visitMessage.textContent = 'Back so soon! Awesome!';
      } else if (diffDays === 1) {
        visitMessage.textContent = 'You last visited 1 day ago.';
      } else {
        visitMessage.textContent = `You last visited ${diffDays} days ago.`;
      }
    }

    localStorage.setItem(storageKey, String(now));
  } catch (error) {
    visitMessage.textContent = 'Welcome! Let us know if you have any questions.';
  }
}

function renderAttractions() {
  if (!gallery) return;

  gallery.innerHTML = attractions.map((item) => `
    <article class="discover-card">
      <figure>
        <img src="${item.image}" alt="${item.name} in Kampala" loading="lazy" width="300" height="220">
      </figure>
      <div class="discover-card__content">
        <h2>${item.name}</h2>
        <address>${item.address}</address>
        <p>${item.description}</p>
        <button type="button">Learn more</button>
      </div>
    </article>
  `).join('');
}

function initFooterDates() {
  const yearEl = document.querySelector('#current-year');
  const modifiedEl = document.querySelector('#last-modified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modifiedEl) modifiedEl.textContent = document.lastModified;
}

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

initNavToggle();
initFooterDates();
renderAttractions();
updateVisitMessage();
