import crypto from "crypto";

/**
 * Session format:
 * {
 *   id: PostgreSQL user id
 *   uid: Firebase UID
 *   email
 *   name
 *   createdAt
 *   expiresAt
 * }
 */

const sessions = new Map();

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export function createSession(user) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const now = Date.now();

  sessions.set(sessionId, {
    id: user.id,                     // PostgreSQL id
    uid: user.firebase_uid,          // Firebase UID
    email: user.email,
    name: user.name,
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

export function debugAllSessions() {
  return Array.from(sessions.entries()).map(([id, s]) => ({
    sessionId: `${id.slice(0, 8)}…`,
    id: s.id,
    uid: s.uid,
    email: s.email,
    name: s.name,
    createdAt: new Date(s.createdAt).toISOString(),
    expiresAt: new Date(s.expiresAt).toISOString(),
  }));
}