// Client léger pour l'API ArdMarket backend.
// Configurez VITE_API_URL dans un .env pour surcharger la base URL.

const BASE = import.meta.env?.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "ardmarket_token";
const USER_KEY = "ardmarket_user";

export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function logout() {
  setToken(null);
  setStoredUser(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
  }
}

async function request(
  path,
  { method = "GET", body, auth = false, formData = false } = {},
) {
  const headers = {};
  if (!formData && body) headers["Content-Type"] = "application/json";
  // Toujours essayer d'envoyer le token si on en a un (pour le contact-mask, etc.)
  const token = getToken();
  if ((auth || token) && token) headers.Authorization = `Bearer ${token}`;
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

function persistAuth(response) {
  if (response?.token) setToken(response.token);
  if (response?.user) {
    setStoredUser(response.user);
    if (typeof window !== "undefined" && response.user.role) {
      localStorage.setItem("user_role", response.user.role);
    }
  }
  return response;
}

export const api = {
  // Auth
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }).then(
      persistAuth,
    ),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: { email, password },
    }).then(persistAuth),
  me: () => request("/auth/me", { auth: true }),
  logout,

  // Lands
  listLands: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/lands${qs ? `?${qs}` : ""}`);
  },
  getLand: (id) => request(`/lands/${id}`),
  createLand: (payload) =>
    request("/lands", { method: "POST", body: payload, auth: true }),
  patchLand: (id, payload) =>
    request(`/lands/${id}`, { method: "PATCH", body: payload, auth: true }),
  deleteLand: (id) => request(`/lands/${id}`, { method: "DELETE", auth: true }),
  recommendations: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/lands/recommendations${qs ? `?${qs}` : ""}`, {
      auth: true,
    });
  },
  landScore: (id) => request(`/lands/${id}/score`),
  simulateLand: (id, payload = {}) =>
    request(`/lands/${id}/simulate`, { method: "POST", body: payload }),
  unlockContact: (id) =>
    request(`/lands/${id}/unlock-contact`, { method: "POST", auth: true }),
  uploadLandImages: (id, files) => {
    const fd = new FormData();
    for (const f of files) fd.append("images", f);
    return request(`/lands/${id}/images`, {
      method: "POST",
      body: fd,
      formData: true,
      auth: true,
    });
  },
  uploadLandDocument: (id, file, type) => {
    const fd = new FormData();
    fd.append("document", file);
    fd.append("type", type);
    return request(`/lands/${id}/documents`, {
      method: "POST",
      body: fd,
      formData: true,
      auth: true,
    });
  },

  // Offers
  createOffer: (landId, payload) =>
    request(`/lands/${landId}/offers`, {
      method: "POST",
      body: payload,
      auth: true,
    }),
  myOffers: () => request("/offers/mine", { auth: true }),
  updateOfferStatus: (id, status) =>
    request(`/offers/${id}/status`, {
      method: "PATCH",
      body: { status },
      auth: true,
    }),

  // Plans & credits
  listPlans: () => request("/plans"),
  subscribe: (plan) =>
    request("/me/subscribe", { method: "POST", body: { plan }, auth: true }),
  myCredits: () => request("/me/credits", { auth: true }),
  purchaseCredits: (pack) =>
    request("/me/credits/purchase", {
      method: "POST",
      body: { pack },
      auth: true,
    }),
  boost: (payload) =>
    request("/me/boost", { method: "POST", body: payload, auth: true }),

  // Ads / Notaries
  listAds: (params = {}) => {
    if (typeof params === "string") params = { category: params };
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return request(`/ads${qs ? `?${qs}` : ""}`);
  },
  createAd: (payload) =>
    request("/ads", { method: "POST", body: payload, auth: true }),
  listNotaries: (params = {}) => {
    if (typeof params === "string") params = { region: params };
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== "")),
    ).toString();
    return request(`/notaries${qs ? `?${qs}` : ""}`);
  },
  getNotary: (id) => request(`/notaries/${id}`),
  reviewNotary: (id, payload) =>
    request(`/notaries/${id}/reviews`, {
      method: "POST",
      body: payload,
      auth: true,
    }),

  // AI
  simulateYield: (payload) =>
    request("/ai/simulate-yield", { method: "POST", body: payload }),
  analyzeDocument: (payload) =>
    request("/ai/analyze-document", { method: "POST", body: payload }),
  voiceToLand: (payload) =>
    request("/ai/voice-to-land", { method: "POST", body: payload }),

  // Sync (Telegram bot Firebase → ArdMarket)
  syncStatus: () => request("/sync/status"),
  triggerSync: () => request("/sync/firebase", { method: "POST", auth: true }),

  // Health
  health: () => request("/health"),
};

export default api;
