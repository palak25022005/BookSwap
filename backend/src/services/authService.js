// services/authService.js
// Business logic for auth — kept separate from the controller so the
// controller only deals with req/res, and this stays testable on its own.

import { firebaseAuth } from "../config/firebaseAdmin.js";

/**
 * Verifies a Firebase ID token sent from the frontend.
 * Throws if the token is invalid, expired, or revoked.
 */
export async function verifyIdToken(idToken) {
  if (!idToken) {
    const err = new Error("Missing ID token");
    err.status = 400;
    throw err;
  }

  const decoded = await firebaseAuth.verifyIdToken(
    idToken,
    true // checkRevoked
  );

  return {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name || null,
  };
}