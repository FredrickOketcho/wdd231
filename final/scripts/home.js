import { formatFare, getSavedRoutes, loadRoutes, saveRoutes } from './routes-data.js';

const cards = document.querySelector('#featured-routes');
const search = document.querySelector('#route-search');
const count = document.querySelector('#results-count');
const error = document.querySelector('#home-error');
const dialog = document.querySelector('#route-dialog');
let routes = [];
let filter = 'all';
let favorites = getSavedRoutes();

function routeCard(route) {
  const isSaved = favorites.includes(route.id);
  const kind = route.type === 'Express' ? 'service-tag express' : 'service-tag';
  return `<article class="route-card">
    <div class="route-card-top"><div><h3>${route.name}</h3><p class="route-endpoints">${route.origin} <span aria-hidden="true">&#8594;</span> ${route.destination}</p></div><span class="${kind}">${route.type}</span></div>
    <div class="route-card-facts"><div><span class="fact-label">Indicative fare</span><span class="fact-value">${formatFare(route.baseFare)}</span></div><div><span class="fact-label">Typical journey</span><span class="fact-value">${route.duration}</span></div><div><span class="fact-label">Peak hours</span><span class="fact-value">${route.peakHours}</span></div><div><span class="fact-label">Operating hours</span><span class="fact-value">${route.operatingHours}</span></div></div>
    <div class="route-card-actions"><button class="details-button" type="button" data-details="${route.id}">Route details</button><button class="favorite-button" type="button" data-favorite="${route.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? 'Remove' : 'Save'} ${route.name} ${isSaved ? 'from' : 'to'} favorites">${isSaved ? '&#9733;' : '&#9734;'}</button></div>
  </article>`;
}

function renderRoutes() {
  const query = search.value.trim().toLowerCase();
  const shown = routes.filter((route) => {
    const matchesFilter = filter === 'all' || (filter === 'favorites' ? favorites.includes(route.id) : route.type === filter);
    const searchable = [route.name, route.origin, route.destination, ...route.stages].join(' ').toLowerCase();
    return matchesFilter && searchable.includes(query);
  }).slice(0, 6);
  cards.innerHTML = shown.length ? shown.map(routeCard).join('') : '<p class="empty-state">No matching routes. Try another search or service filter.</p>';
  count.textContent = `${shown.length} ${shown.length === 1 ? 'route' : 'routes'} shown${filter === 'favorites' ? ' in saved routes' : ''}.`;
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    renderRoutes();
  });
});

search.addEventListener('input', renderRoutes);
cards.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('[data-favorite]');
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter((savedId) => savedId !== id) : [...favorites, id];
    try { saveRoutes(favorites); } catch (storageError) { console.error('Unable to save favorites:', storageError); }
    renderRoutes();
    return;
  }

  const detailsButton = event.target.closest('[data-details]');
  if (!detailsButton) return;
  const route = routes.find((item) => item.id === detailsButton.dataset.details);
  if (!route) return;
  dialog.querySelector('[data-dialog-title]').textContent = route.name;
  dialog.querySelector('[data-dialog-type]').textContent = route.type;
  dialog.querySelector('[data-dialog-description]').textContent = route.description;
  dialog.querySelector('[data-dialog-fare]').textContent = formatFare(route.baseFare);
  dialog.querySelector('[data-dialog-stages]').textContent = route.stages.join(' - ');
  dialog.querySelector('[data-dialog-hours]').textContent = route.operatingHours;
  dialog.querySelector('[data-dialog-peak]').textContent = route.peakHours;
  dialog.showModal();
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog || event.target.closest('[data-dialog-close]')) dialog.close();
});

try {
  routes = await loadRoutes();
  renderRoutes();
} catch {
  count.textContent = 'Route data is unavailable.';
  error.hidden = false;
}
