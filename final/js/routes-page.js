import { formatFare, getSavedRoutes, loadRoutes } from './routes-data.js';

const directory = document.querySelector('#route-directory');
const search = document.querySelector('#directory-search');
const typeFilter = document.querySelector('#type-filter');
const count = document.querySelector('#directory-count');
const error = document.querySelector('#directory-error');
let routes = [];
const favorites = getSavedRoutes();

function routeCard(route) {
  const kind = route.type === 'Express' ? 'service-tag express' : 'service-tag';
  return `<article class="directory-card"><div class="route-card-top"><div><h3>${route.name}</h3><p class="route-endpoints">${route.origin} <span aria-hidden="true">&#8594;</span> ${route.destination}</p></div><span class="${kind}">${route.type}</span></div>
    <div class="route-card-facts"><div><span class="fact-label">Indicative fare</span><span class="fact-value">${formatFare(route.baseFare)}</span></div><div><span class="fact-label">Journey time</span><span class="fact-value">${route.duration}</span></div><div><span class="fact-label">Operating hours</span><span class="fact-value">${route.operatingHours}</span></div><div><span class="fact-label">Peak hours</span><span class="fact-value">${route.peakHours}</span></div></div>
    <ul class="route-stages" aria-label="${route.name} stops">${route.stages.map((stage) => `<li>${stage}</li>`).join('')}</ul><p class="route-endpoints">${favorites.includes(route.id) ? 'Saved to your favorites. ' : ''}${route.description}</p></article>`;
}

function renderDirectory() {
  const query = search.value.trim().toLowerCase();
  const matches = routes.filter((route) => {
    const matchesType = typeFilter.value === 'all' || route.type === typeFilter.value;
    return matchesType && [route.name, route.origin, route.destination, ...route.stages].join(' ').toLowerCase().includes(query);
  });
  directory.innerHTML = matches.length ? matches.map(routeCard).join('') : '<p class="empty-state">No routes match your search.</p>';
  count.textContent = `${matches.length} ${matches.length === 1 ? 'route' : 'routes'} in the directory.`;
}

search.addEventListener('input', renderDirectory);
typeFilter.addEventListener('change', renderDirectory);
try {
  routes = await loadRoutes();
  renderDirectory();
} catch {
  count.textContent = 'Route data is unavailable.';
  error.hidden = false;
}
