// services/sessionStore.js

import crypto from "crypto";

/**
 * Sessions live in memory.
 * Replace this with Redis later without changing the controller code.
 */

/** @type {Map<string, { uid: string, email: string, name: string | null, createdAt: number, expiresAt: number }>} */
const sessions = new Map();

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function createSession(user) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const now = Date.now();

  sessions.set(sessionId, {
    uid: user.uid,
    email: user.email,
    name: user.name || null,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });

  return sessionId;
}

export function getSession(sessionId) {
  if (!sessionId) return null;

  const session = sessions.get(sessionId);

  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function deleteSession(sessionId) {
  return sessions.delete(sessionId);
}

/** Used only for local debugging */
export function debugAllSessions() {
  return Array.from(sessions.entries()).map(([id, s]) => ({
    sessionId: `${id.slice(0, 8)}…`,
    uid: s.uid,
    email: s.email,
    createdAt: new Date(s.createdAt).toISOString(),
    expiresAt: new Date(s.expiresAt).toISOString(),
  }));
}