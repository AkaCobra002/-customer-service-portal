const AUTH_TOKEN_KEY = "wdc.auth.token.v1";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (typeof window === "undefined") return;
  if (!token) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function apiRequest(path, { method = "GET", body } = {}) {
  const token = getAuthToken();
  const headers = {
    accept: "application/json",
  };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";

  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} for ${path}${text ? `: ${text}` : ""}`);
  }

  return res.json();
}

function apiGet(path) {
  return apiRequest(path);
}

function apiPost(path, body) {
  return apiRequest(path, { method: "POST", body });
}

export function getUsers() {
  return apiGet("/api/users");
}

export function getUser(userId) {
  return apiGet(`/api/users/${userId}`);
}

export function getPersonnel() {
  return apiGet("/api/personnel");
}

export function getPersonnelMember(personnelId) {
  return apiGet(`/api/personnel/${personnelId}`);
}

export function getTickets() {
  return apiGet("/api/tickets");
}

export function getAdsConnections() {
  return apiGet("/api/ads/connections");
}

export function login(username, password) {
  return apiPost("/api/auth/login", { username, password });
}

export function getMe() {
  return apiGet("/api/me");
}
