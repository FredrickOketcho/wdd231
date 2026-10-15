import { attractions as places } from '../data/discover.mjs?v=restore-images';

const cards = document.querySelector('#discover-cards');
const visitorMessage = document.querySelector('#visitor-message');
const visitKey = 'kansanga-discover-last-visit';
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

function getVisitMessage() {
  const now = Date.now();
  let previousVisit;
  try {
    previousVisit = Number(localStorage.getItem(visitKey));
    localStorage.setItem(visitKey, String(now));
  } catch {
    return 'Welcome! Explore the places around Kampala.';
  }

  if (!previousVisit) return 'Welcome! Let us know if you have any questions.';

  const daysSinceVisit = Math.floor((now - previousVisit) / 86400000);
  if (daysSinceVisit < 1) return 'Back so soon! Awesome!';
  return `You last visited ${daysSinceVisit} ${daysSinceVisit === 1 ? 'day' : 'days'} ago.`;
}

function placeCard(place, index) {
  const mapQuery = encodeURIComponent(`${place.name} ${place.address}`);
  return `<article class="discover-card card-${index + 1}">
    <figure><img src="${place.image}" alt="${place.name}" width="300" height="200" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${index === 0 ? 'high' : 'auto'}"></figure>
    <div class="discover-card-content">
      <h2>${place.name}</h2>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <a class="button-link discover-button" href="https://www.google.com/maps/search/?api=1&amp;query=${mapQuery}" target="_blank" rel="noopener noreferrer">View on map <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

visitorMessage.textContent = getVisitMessage();
cards.innerHTML = places.map(placeCard).join('');
currentYear.textContent = new Date().getFullYear();
lastModified.textContent += document.lastModified;
