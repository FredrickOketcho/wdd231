import { formatFare, loadRoutes } from './routes-data.js';

const routeSelect = document.querySelector('#route-choice');
const passengerInput = document.querySelector('#passengers');
const total = document.querySelector('#estimate-total');
const detail = document.querySelector('#estimate-detail');
const error = document.querySelector('#fare-error');
let routes = [];

function updateEstimate() {
  const route = routes.find((item) => item.id === routeSelect.value);
  const passengers = Number(passengerInput.value);
  if (!route || !Number.isFinite(passengers) || passengers < 1) {
    total.textContent = 'Choose a route';
    detail.textContent = 'Per passenger estimates are shown in UGX.';
    return;
  }
  total.textContent = formatFare(route.baseFare * passengers);
  detail.textContent = `${formatFare(route.baseFare)} per passenger x ${passengers} ${passengers === 1 ? 'passenger' : 'passengers'}`;
}

routeSelect.addEventListener('change', updateEstimate);
passengerInput.addEventListener('input', updateEstimate);
try {
  routes = await loadRoutes();
  const requested = new URLSearchParams(window.location.search).get('route');
  routeSelect.innerHTML = '<option value="">Select a route</option>' + routes.map((route) => `<option value="${route.id}">${route.name} - ${formatFare(route.baseFare)}</option>`).join('');
  if (routes.some((route) => route.id === requested)) routeSelect.value = requested;
  updateEstimate();
} catch {
  routeSelect.innerHTML = '<option value="">Route choices unavailable</option>';
  routeSelect.disabled = true;
  error.hidden = false;
}
