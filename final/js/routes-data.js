export async function loadRoutes() {
  try {
    const response = await fetch('./data/routes.json');
    if (!response.ok) throw new Error(`Route data request failed: ${response.status}`);
    const routes = await response.json();
    if (!Array.isArray(routes) || routes.length < 15) throw new Error('At least 15 route records are required.');
    return routes;
  } catch (error) {
    console.error('Unable to load route data:', error);
    throw error;
  }
}

export function formatFare(amount) {
  return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount);
}

export function getSavedRoutes() {
  try {
    const saved = JSON.parse(localStorage.getItem('kampala-fare-favorites') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveRoutes(routeIds) {
  localStorage.setItem('kampala-fare-favorites', JSON.stringify(routeIds));
}
