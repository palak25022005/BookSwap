// src/lib/authApi.js
// Thin wrapper around our backend's auth endpoints. The backend issues an
// httpOnly session cookie, so we always send credentials: "include".

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send/receive the session cookie
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/** Exchanges a Firebase ID token for a backend session (login). */
export function loginWithIdToken(idToken) {
  return postJSON("/api/auth/login", { idToken });
}

/** Exchanges a Firebase ID token for a backend session (signup). */
export function signupWithIdToken(idToken) {
  return postJSON("/api/auth/signup", { idToken });
}

/** Returns the current session's user, or null if not logged in. */
export async function getCurrentSession() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    credentials: "include",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load session");
  return res.json();
}

/** Deletes the session on the backend and clears the cookie. */
export function logout() {
  return postJSON("/api/auth/logout", {});
}