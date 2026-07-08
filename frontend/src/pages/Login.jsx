import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { firebaseSignIn } from "../lib/firebase";
import { loginWithIdToken } from "../lib/authApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Sign in with Firebase directly from the browser.
      const idToken = await firebaseSignIn(email, password);
      // 2. Hand the ID token to our backend, which verifies it and opens
      //    an in-memory session, returned as an httpOnly cookie.
      await loginWithIdToken(idToken);
      navigate("/dashboard");
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-body min-h-screen relative text-white flex items-center justify-center px-5 py-16">
      <div className="relative w-full max-w-md">
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl"
          style={{ background: "linear-gradient(135deg, var(--magenta), var(--violet))" }}
        />
        <div className="glass gradient-border rounded-3xl p-8 relative">
          <span className="font-mono text-[11px] tracking-widest uppercase text-fuchsia-200/80">
            Welcome back
          </span>
          <h1 className="font-display text-3xl font-bold mt-2 mb-6 gradient-text">
            Log in to your shelf
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 font-body text-sm text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-left">
            <label className="font-mono text-[11px] uppercase tracking-widest text-violet-200/70" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="font-body w-full mt-1 mb-4 px-3 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-violet-300/40 focus-ring focus:border-fuchsia-400/60 transition-colors"
            />

            <label className="font-mono text-[11px] uppercase tracking-widest text-violet-200/70" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="font-body w-full mt-1 mb-6 px-3 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-violet-300/40 focus-ring focus:border-fuchsia-400/60 transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-glow font-body font-semibold w-full px-6 py-3.5 rounded-full text-white focus-ring disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="font-body text-sm mt-6 text-center text-violet-100/70">
            New to BookSwap?{" "}
            <Link to="/signup" className="text-fuchsia-300 hover:text-fuchsia-200 font-medium focus-ring rounded-sm">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function mapAuthError(err) {
  const code = err?.code || "";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "That email and password don't match.";
  }
  if (code.includes("user-not-found")) {
    return "No account found with that email.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Try again in a bit.";
  }
  return err?.message || "Something went wrong. Please try again.";
}