// Portal API client. Field names are Portal's (Items, OrderId, Quantity). Backend translates to the solver.

const API_BASE = import.meta.env.VITE_PORTAL_API_BASE || 'http://127.0.0.1:8000';
const VISUALISER_BASE = import.meta.env.VITE_VISUALISER_BASE || 'http://localhost:5173';
const MOCK_ROLE_HEADER = 'X-FitPortal-Mock-Role';

// TODO: Replace this development-only transport with real session/JWT auth.
let currentMockRole = null;

export function setMockIdentityRole(role) {
  currentMockRole = role;
}

export class ApiError extends Error {
  constructor(message, { status = 0, detail = '' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

function describe(status) {
  if (status === 401) return 'Your temporary sign-in identity is missing. Sign in again.';
  if (status === 403) return 'Your role does not have permission to perform this action.';
  if (status === 404) return 'That order no longer exists on the server.';
  if (status === 409) return 'This action conflicts with existing data or its current state.';
  if (status === 422) return 'The server rejected this order. Check the item details.';
  if (status >= 500) return 'The packing service failed. Try again in a moment.';
  return `The server returned an unexpected error (${status}).`;
}

function usefulJsonDetail(body) {
  try {
    const parsed = JSON.parse(body);
    return typeof parsed?.detail === 'string' && parsed.detail.trim()
      ? parsed.detail.trim()
      : '';
  } catch {
    return '';
  }
}

async function request(path, options) {
  const headers = new Headers(options?.headers);
  if (currentMockRole) headers.set(MOCK_ROLE_HEADER, currentMockRole);

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (cause) {
    console.error(`Portal API unreachable at ${API_BASE}${path}`, cause);
    throw new ApiError(
      `Cannot reach the Portal API at ${API_BASE}. Is the backend running?`,
      { detail: String(cause) }
    );
  }

  if (!response.ok) {
    const responseBody = await response.text().catch(() => '');
    const serverDetail = usefulJsonDetail(responseBody);
    console.error(`${options?.method || 'GET'} ${path} -> ${response.status}`, responseBody);
    throw new ApiError(serverDetail || describe(response.status), {
      status: response.status,
      detail: serverDetail || responseBody,
    });
  }

  if (response.status === 204) return null;
  return response.json();
}

const asJson = (body, method = 'POST') => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export function listOrders() {
  return request('/orders');
}

export function createOrder({ items }) {
  return request('/orders', asJson({ Items: items }));
}

export function getOrder(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}`);
}

export function updateOrder(orderId, { items }) {
  return request(`/orders/${encodeURIComponent(orderId)}`, asJson({ Items: items }, 'PUT'));
}

export function submitOrder(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/submit`, { method: 'POST' });
}

export function solveOrder(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/solve`, { method: 'POST' });
}

export function finaliseOrder(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/finalise`, { method: 'POST' });
}

export function getSolution(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/solution`);
}

export function getSolutionSummary(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/solution/summary`);
}

export function solutionUrl(orderId) {
  return `${API_BASE}/orders/${encodeURIComponent(orderId)}/solution`;
}

export function visualiserUrl(orderId) {
  return `${VISUALISER_BASE}/?solution=${encodeURIComponent(solutionUrl(orderId))}`;
}

export function listBoxes() {
  return request('/boxes');
}

export function getBox(reference) {
  return request(`/boxes/${encodeURIComponent(reference)}`);
}

export function createBox(box) {
  return request('/boxes', asJson(box));
}

export function updateBox(reference, box) {
  return request(`/boxes/${encodeURIComponent(reference)}`, asJson(box, 'PUT'));
}

export function importBoxes(boxes) {
  return request('/boxes/import', asJson({ Boxes: boxes }));
}
