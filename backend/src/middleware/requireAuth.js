// middleware/requireAuth.js

import { getSession } from "../services/sessionStore.js";
import { SESSION_COOKIE } from "../controllers/authController.js";

/**
 * Protect routes that require authentication.
 *
 * Example:
 * router.get("/api/books/mine", requireAuth, booksController.mine);
 */
export default function requireAuth(req, res, next) {
  const sessionId = req.cookies[SESSION_COOKIE];
  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  req.user = {
    uid: session.uid,
    email: session.email,
    name: session.name,
  };

  next();
}