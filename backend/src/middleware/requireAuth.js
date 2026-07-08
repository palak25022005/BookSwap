// middleware/requireAuth.js

import { getSession } from "../services/sessionStore.js";
import { SESSION_COOKIE } from "../controllers/authController.js";

export default function requireAuth(req, res, next) {
  const sessionId = req.cookies[SESSION_COOKIE];
  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  req.user = {
    id: session.id,          // PostgreSQL users.id
    uid: session.uid,        // Firebase UID
    email: session.email,
    name: session.name,
  };

  next();
}