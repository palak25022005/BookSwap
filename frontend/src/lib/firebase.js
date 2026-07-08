// src/lib/firebase.js
// Initializes the Firebase client SDK. This is what runs in the browser —
// it talks directly to Firebase Auth to create accounts and sign users in.
// The backend never sees passwords; it only ever sees the ID token Firebase
// hands back after a successful sign-in.

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// Pull config from Vite/CRA env vars — never hardcode these.
// Vite: import.meta.env.VITE_FIREBASE_*  |  CRA: process.env.REACT_APP_FIREBASE_*
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

/** Creates a Firebase account and returns the fresh ID token. */
export async function firebaseSignUp(email, password, name) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(credential.user, {
    displayName: name,
  });

  const idToken = await credential.user.getIdToken(true);

  return idToken;
}

/** Signs in with Firebase and returns the ID token. */
export async function firebaseSignIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user.getIdToken();
}

/** Signs out of the Firebase client SDK (separate from clearing the backend session). */
export function firebaseSignOut() {
  return signOut(auth);
}