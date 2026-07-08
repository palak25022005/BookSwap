import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { firebaseSignUp } from "../lib/firebase";
import { signupWithIdToken } from "../lib/authApi";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password needs to be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const idToken = await firebaseSignUp(email, password, name);
      await signupWithIdToken(idToken);
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
            Join the shelf
          </span>
          <h1 className="font-display text-3xl font-bold mt-2 mb-6 gradient-text">
            Create your account
          </h1>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 font-body text-sm text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-left">
            <label className="font-mono text-[11px] uppercase tracking-widest text-violet-200/70" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aanya Sharma"
              className="font-body w-full mt-1 mb-4 px-3 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-violet-300/40 focus-ring focus:border-fuchsia-400/60 transition-colors"
            />

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
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="font-body w-full mt-1 mb-6 px-3 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-violet-300/40 focus-ring focus:border-fuchsia-400/60 transition-colors"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-glow font-body font-semibold w-full px-6 py-3.5 rounded-full text-white focus-ring disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="font-body text-sm mt-6 text-center text-violet-100/70">
            Already have an account?{" "}
            <Link to="/login" className="text-fuchsia-300 hover:text-fuchsia-200 font-medium focus-ring rounded-sm">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function mapAuthError(err) {
  const code = err?.code || "";
  if (code.includes("email-already-in-use")) {
    return "An account with that email already exists.";
  }
  if (code.includes("weak-password")) {
    return "That password is too weak — try something longer.";
  }
  if (code.includes("invalid-email")) {
    return "That doesn't look like a valid email.";
  }
  return err?.message || "Something went wrong. Please try again.";
}