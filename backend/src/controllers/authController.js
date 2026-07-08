// controllers/authController.js

import { verifyIdToken } from "../services/authService.js";
import {
  createSession,
  getSession,
  deleteSession,
} from "../services/sessionStore.js";

export const SESSION_COOKIE = "session_id";

const cookieOptions = {
  httpOnly: true, // JS on the page can't read it
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // Use "none" + secure:true if frontend/backend are on different domains
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

/** Shared by both login and signup */
async function establishSession(req, res) {
  const { idToken } = req.body;

  const user = await verifyIdToken(idToken);
  const sessionId = createSession(user);

  res.cookie(SESSION_COOKIE, sessionId, cookieOptions);

  res.status(200).json({
    user: {
      uid: user.uid,
      email: user.email,
      name: user.name,
    },
  });
}

export async function signup(req, res, next) {
  try {
    await establishSession(req, res);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    await establishSession(req, res);
  } catch (err) {
    next(err);
  }
}

/** Returns the logged-in user for the current session */
export function me(req, res) {
  const sessionId = req.cookies[SESSION_COOKIE];
  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  res.status(200).json({
    user: {
      uid: session.uid,
      email: session.email,
      name: session.name,
    },
  });
}

/** Deletes the session and clears the cookie */
export function logout(req, res) {
  const sessionId = req.cookies[SESSION_COOKIE];

  if (sessionId) {
    deleteSession(sessionId);
  }

  res.clearCookie(SESSION_COOKIE, {
    path: "/",
  });

  res.status(200).json({
    message: "Logged out",
  });
}