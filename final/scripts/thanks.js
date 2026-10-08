import { loadRoutes } from './routes-data.js';

const parameters = new URLSearchParams(window.location.search);
const submittedName = document.querySelector('#submitted-name');
const details = document.querySelector('#submitted-details');
const emptyMessage = document.querySelector('#empty-submission');
const fields = [['Email', 'email'], ['Route', 'route'], ['Passengers', 'passengers'], ['Question or feedback', 'message']];
const name = parameters.get('name')?.trim();

function addDetail(label, value) {
  const row = document.createElement('div');
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  term.textContent = label;
  description.textContent = value;
  row.append(term, description);
  details.append(row);
}

if (!name) {
  emptyMessage.hidden = false;
  details.hidden = true;
} else {
  submittedName.textContent = name;
  fields.forEach(([label, key]) => addDetail(label, parameters.get(key)?.trim() || 'Not provided'));
  try {
    const routes = await loadRoutes();
    const selectedRoute = routes.find((route) => route.id === parameters.get('route'));
    if (selectedRoute) details.querySelector('div:nth-child(2) dd').textContent = selectedRoute.name;
  } catch (error) {
    console.error('Unable to resolve submitted route:', error);
  }
}
