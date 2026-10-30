const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`Respuesta ${res.status} del backend en ${path}`);
  return res.json();
}

export function getSummary() {
  return request('/api/metrics/summary');
}

export function getLogs(filters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value !== '' && value != null),
  );
  const query = params.toString();
  return request(`/api/metrics/logs${query ? `?${query}` : ''}`);
}

export function clearLogs() {
  return request('/api/metrics/logs', { method: 'DELETE' });
}

export function simulateLoad() {
  return request('/api/metrics/simulate-load', { method: 'POST' });
}
