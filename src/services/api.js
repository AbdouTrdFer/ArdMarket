// Client léger pour l'API ArdMarket backend.
// Configurez VITE_API_URL dans un .env pour surcharger la base URL.

const BASE = import.meta.env?.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "ardmarket_token";

export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token) {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, { method = "GET", body, auth = false, formData = false } = {}) {
  const headers = {};
  if (!formData && body) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: formData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  me: () => request("/auth/me", { auth: true }),

  // Lands
  listLands: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/lands${qs ? `?${qs}` : ""}`, { auth: true });
  },
  getLand: (id) => request(`/lands/${id}`, { auth: true }),
  createLand: (payload) => request("/lands", { method: "POST", body: payload, auth: true }),
  patchLand: (id, payload) => request(`/lands/${id}`, { method: "PATCH", body: payload, auth: true }),
  deleteLand: (id) => request(`/lands/${id}`, { method: "DELETE", auth: true }),
  recommendations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/lands/recommendations${qs ? `?${qs}` : ""}`, { auth: true });
  },
  landScore: (id) => request(`/lands/${id}/score`),
  simulateLand: (id, payload = {}) => request(`/lands/${id}/simulate`, { method: "POST", body: payload }),
  unlockContact: (id) => request(`/lands/${id}/unlock-contact`, { method: "POST", auth: true }),
  uploadLandImages: (id, files) => {
    const fd = new FormData();
    for (const f of files) fd.append("images", f);
    return request(`/lands/${id}/images`, { method: "POST", body: fd, formData: true, auth: true });
  },
  uploadLandDocument: (id, file, type) => {
    const fd = new FormData();
    fd.append("document", file);
    fd.append("type", type);
    return request(`/lands/${id}/documents`, { method: "POST", body: fd, formData: true, auth: true });
  },

  // Offers
  createOffer: (landId, payload) =>
    request(`/lands/${landId}/offers`, { method: "POST", body: payload, auth: true }),
  myOffers: () => request("/offers/mine", { auth: true }),
  updateOfferStatus: (id, status) =>
    request(`/offers/${id}/status`, { method: "PATCH", body: { status }, auth: true }),

  // Plans & credits
  listPlans: () => request("/plans"),
  subscribe: (plan) => request("/me/subscribe", { method: "POST", body: { plan }, auth: true }),
  myCredits: () => request("/me/credits", { auth: true }),
  purchaseCredits: (pack) => request("/me/credits/purchase", { method: "POST", body: { pack }, auth: true }),
  boost: (payload) => request("/me/boost", { method: "POST", body: payload, auth: true }),

  // Ads / Notaries
  listAds: (category) => request(`/ads${category ? `?category=${category}` : ""}`),
  listNotaries: (region) => request(`/notaries${region ? `?region=${encodeURIComponent(region)}` : ""}`),

  // AI
  simulateYield: (payload) => request("/ai/simulate-yield", { method: "POST", body: payload }),
  analyzeDocument: (payload) => request("/ai/analyze-document", { method: "POST", body: payload }),
  voiceToLand: (payload) => request("/ai/voice-to-land", { method: "POST", body: payload }),

  // Health
  health: () => request("/health"),
};

export default api;
