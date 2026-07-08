import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
/**
 * BookSwap — Landing Page (Pink/Purple Edition)
 * Aesthetic: vibrant gradient mesh, glassmorphism cards, floating blobs,
 * gradient headlines, scroll-reveal motion, glowing CTAs.
 * Fonts: Outfit (display, geometric + friendly) + Inter (body) + JetBrains Mono (data/labels).
 * Signature element: a floating "swap orb" hero visual with two book cards
 * orbiting and exchanging, plus a live-updating match card.
 */




/* ---------------- Scroll reveal hook ---------------- */

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------------- Background blobs ---------------- */

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="bg-mesh absolute inset-0" />
      <div
        className="blob absolute w-[420px] h-[420px] rounded-full top-[-80px] left-[-100px]"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.55), transparent 70%)" }}
      />
      <div
        className="blob absolute w-[380px] h-[380px] rounded-full top-[20%] right-[-120px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.55), transparent 70%)", animationDelay: "3s" }}
      />
      <div
        className="blob absolute w-[340px] h-[340px] rounded-full bottom-[-100px] left-[20%]"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.45), transparent 70%)", animationDelay: "6s" }}
      />
    </div>
  );
}

/* ---------------- Hero swap orb ---------------- */

const SAMPLE_SWAPS = [
  { from: "Aanya · Hostel B-204", to: "Rohit · Hostel A-112", book: "The Alchemist" },
  { from: "Meera · PG Sunrise", to: "Kabir · PG Sunrise", book: "Sapiens" },
  { from: "Dev · CS Batch '26", to: "Naina · ECE Batch '26", book: "Clean Code" },
  { from: "Farah · Team Design", to: "Ishaan · Team Eng", book: "Atomic Habits" },
];

function SwapCard() {
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SAMPLE_SWAPS.length);
      setKey((k) => k + 1);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const current = SAMPLE_SWAPS[index];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl"
        style={{ background: "linear-gradient(135deg, var(--magenta), var(--violet))" }}
      />
      <div className="glass gradient-border rounded-3xl p-6 sm:p-8 relative">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[11px] tracking-widest uppercase text-fuchsia-200/80">
            Live match feed
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-400" />
          </span>
        </div>

        <p className="font-display text-2xl sm:text-3xl font-semibold gradient-text mb-1">
          {current.book}
        </p>
        <p className="font-mono text-xs text-violet-200/70 mb-6">
          matched in 0.4s by the swap algorithm
        </p>

        <div className="flex items-center gap-3 font-body text-sm text-ice">
          <div className="flex-1">
            <p className="text-[10px] font-mono uppercase tracking-wide text-violet-200/60">Lending</p>
            <p className="font-medium">{current.from}</p>
          </div>
          <div className="float text-2xl" style={{ "--r": "0deg" }} aria-hidden="true">
            🔁
          </div>
          <div className="flex-1 text-right">
            <p className="text-[10px] font-mono uppercase tracking-wide text-violet-200/60">Receiving</p>
            <p className="font-medium">{current.to}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="font-mono text-[11px] text-violet-200/70">
            money saved · ₹{180 + index * 35}
          </span>
          <div
            key={key}
            className="pop-stamp font-mono text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: "#fff", background: "linear-gradient(95deg, var(--rose), var(--magenta))" }}
          >
            SWAPPED ✓
          </div>
        </div>
      </div>

      {/* orbiting mini book chips */}
      <div className="hidden sm:block absolute -top-6 -right-6 orbit" style={{ "--orbit-r": "150px" }} aria-hidden="true">
        <span className="text-3xl">📕</span>
      </div>
      <div className="hidden sm:block absolute -bottom-4 -left-6 orbit" style={{ "--orbit-r": "150px", animationDelay: "-5s", animationDirection: "reverse" }} aria-hidden="true">
        <span className="text-3xl">📗</span>
      </div>
    </div>
  );
}

/* ---------------- NavBar ---------------- */

function NavBar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="glass">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-xl font-bold gradient-text focus-ring rounded-sm">
            BookSwap
          </a>
          <nav className="hidden md:flex items-center gap-8 font-body text-sm text-violet-100/80">
            <a href="#how" className="hover:text-white transition-colors focus-ring rounded-sm">How it works</a>
            <a href="#communities" className="hover:text-white transition-colors focus-ring rounded-sm">Communities</a>
            <a href="#savings" className="hover:text-white transition-colors focus-ring rounded-sm">Savings</a>
          </nav>
          <Link
  to="/login"
  className="btn-glow font-body text-sm font-semibold px-5 py-2.5 rounded-full text-white focus-ring"
>
  Join the shelf →
</Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section id="top" className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <span className="font-mono text-[11px] tracking-widest uppercase inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-fuchsia-200 mb-6">
            <span className="text-base">✨</span> For hostels · PGs · colleges · offices
          </span>
          <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.04] font-extrabold text-white">
            Your shelf is full.
            <br />
            <span className="gradient-text">Someone else's</span> is the
            <br />
            book you need next.
          </h1>
          <p className="font-body text-base sm:text-lg mt-6 max-w-md text-violet-100/80">
            BookSwap matches your shelf with people around you — hostel
            block, PG floor, batch, or office — so you exchange books
            instead of buying them. Our matching algorithm does the
            pairing; you just hand the book over.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#join"
              className="btn-glow font-body font-semibold px-7 py-3.5 rounded-full text-white focus-ring"
            >
              List your first book
            </a>
            <a
              href="#how"
              className="font-body font-semibold px-7 py-3.5 rounded-full glass text-white focus-ring hover:bg-white/10 transition-colors"
            >
              See how matching works
            </a>
          </div>
          <p className="font-mono text-xs mt-9 text-violet-200/60">
            Avg. reader saves ₹2,400/year · 6,000+ swaps catalogued
          </p>
        </Reveal>

        <Reveal delay={150}>
          <SwapCard />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */

const STEPS = [
  { emoji: "📚", tag: "LIST", title: "Add what's on your shelf", body: "Title, condition, and how long you're happy lending it. Takes under a minute per book." },
  { emoji: "🧠", tag: "MATCH", title: "The algorithm finds your swap", body: "We pair your books against everyone nearby — same hostel, PG, college batch, or office — ranking matches by distance, condition, and mutual interest." },
  { emoji: "🤝", tag: "MEET", title: "Hand it over, in person", body: "Confirm the swap in-app, meet on campus or in the common room, exchange books directly. No shipping, no middleman." },
  { emoji: "🔄", tag: "RETURN", title: "Read, return, repeat", body: "Keep it for the window you agreed on, swap it back or pass it forward to the next match in the chain." },
];

function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <span className="font-mono text-[11px] tracking-widest uppercase text-fuchsia-300">The process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-white">
            Four steps from shelf to swap.
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.tag} delay={i * 90}>
              <div className="glass gradient-border rounded-2xl p-7 sm:p-8 h-full group hover:-translate-y-1.5 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl float-slow inline-block" style={{ animationDelay: `${i * 0.6}s` }}>
                    {step.emoji}
                  </span>
                  <span
                    className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ background: "linear-gradient(95deg, var(--magenta), var(--violet))" }}
                  >
                    {step.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="font-body text-sm leading-relaxed text-violet-100/70">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Communities marquee ---------------- */

const COMMUNITY_CARDS = [
  { tag: "Hostel", line: "Block A meets Block C — swap before exams, return after." },
  { tag: "PG", line: "Six floors, one shelf. Your PG group chat becomes a library." },
  { tag: "College", line: "Pass your semester textbooks down a batch instead of reselling." },
  { tag: "Office", line: "Turn your team's bookshelf into a rotating reading list." },
  { tag: "Hostel", line: "New roommate, new genre — borrow before you buy." },
  { tag: "PG", line: "Moving out? Swap instead of leaving books behind." },
];

function Communities() {
  const track = [...COMMUNITY_CARDS, ...COMMUNITY_CARDS];
  return (
    <section id="communities" className="py-20 sm:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-xl mb-12">
          <span className="font-mono text-[11px] tracking-widest uppercase text-fuchsia-300">
            Built for groups, not strangers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-white">
            Invite the people already around you.
          </h2>
          <p className="font-body text-base mt-4 text-violet-100/75">
            BookSwap works best inside a circle that already trusts each
            other — your hostel wing, PG, college batch, or office floor.
            Create a circle, invite people with one link, and the algorithm
            only matches within it.
          </p>
        </Reveal>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-10"
          style={{ background: "linear-gradient(90deg, var(--bg-mid), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-10"
          style={{ background: "linear-gradient(-90deg, var(--bg-mid), transparent)" }}
        />
        <div className="flex w-max gap-6 marquee-track px-5 sm:px-8">
          {track.map((c, i) => (
            <div key={i} className="glass gradient-border rounded-2xl p-6 w-72 shrink-0 hover:-translate-y-1 transition-transform duration-300">
              <span
                className="font-mono text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-full text-white inline-block"
                style={{ background: "linear-gradient(95deg, var(--rose), var(--magenta))" }}
              >
                {c.tag}
              </span>
              <p className="font-display text-lg mt-3 leading-snug text-white">{c.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Savings stats with count-up ---------------- */

function useCountUp(target, isVisible, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, target, duration]);
  return value;
}

function StatCard({ target, prefix = "", suffix = "", label, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const value = useCountUp(target, visible);

  return (
    <Reveal delay={delay} className="glass gradient-border rounded-2xl p-7">
      <p ref={ref} className="font-display text-4xl font-bold gradient-text">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="font-body text-sm mt-2 text-violet-100/70">{label}</p>
    </Reveal>
  );
}

function Savings() {
  return (
    <section id="savings" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-3 gap-10 items-start">
        <Reveal className="md:col-span-1">
          <span className="font-mono text-[11px] tracking-widest uppercase text-fuchsia-300">Why it adds up</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 text-white">
            You don't buy a book. You borrow it for a while.
          </h2>
        </Reveal>
        <div className="md:col-span-2 grid sm:grid-cols-3 gap-5">
          <StatCard target={2400} prefix="₹" label="saved per reader, average per year" delay={0} />
          <StatCard target={11} suffix=" days" label="average time a book stays with you before it swaps onward" delay={120} />
          <StatCard target={6000} suffix="+" label="swaps catalogued across circles" delay={240} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Join CTA ---------------- */

function JoinCTA() {
  const [email, setEmail] = useState("");
  const [circle, setCircle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      inputRef.current?.focus();
      return;
    }
    setSubmitted(true);
  }

  return (
    <section id="join" className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Start your circle's <span className="gradient-text">first swap.</span>
          </h2>
          <p className="font-body text-base mt-4 text-violet-100/75">
            Tell us where to send your card. We'll set up your hostel, PG,
            college, or office circle and you invite the rest.
          </p>
        </Reveal>

        <Reveal delay={120}>
          {submitted ? (
            <div className="glass gradient-border rounded-2xl p-8 mt-8 max-w-md mx-auto">
              <p className="font-mono text-xs uppercase tracking-widest mb-2 text-fuchsia-300">
                Card issued ✓
              </p>
              <p className="font-display text-xl text-white">
                Check {email} for your invite link{circle ? ` for "${circle}"` : ""}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto glass gradient-border rounded-2xl p-6 text-left">
              <label className="font-mono text-[11px] uppercase tracking-widest text-violet-200/70" htmlFor="email">
                Your email
              </label>
              <input
                ref={inputRef}
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="font-body w-full mt-1 mb-4 px-3 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-violet-300/40 focus-ring focus:border-fuchsia-400/60 transition-colors"
              />
              <label className="font-mono text-[11px] uppercase tracking-widest text-violet-200/70" htmlFor="circle">
                Circle name (optional)
              </label>
              <input
                id="circle"
                type="text"
                value={circle}
                onChange={(e) => setCircle(e.target.value)}
                placeholder="e.g. Hostel Block C, PG Sunrise"
                className="font-body w-full mt-1 mb-5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white placeholder-violet-300/40 focus-ring focus:border-fuchsia-400/60 transition-colors"
              />
              <button
                type="submit"
                className="btn-glow font-body font-semibold w-full px-6 py-3.5 rounded-full text-white focus-ring"
              >
                Get my invite link
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="py-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg font-bold gradient-text">BookSwap</span>
        <p className="font-mono text-xs text-violet-200/50">
          Built for readers who'd rather swap than spend.
        </p>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */

export default function BookSwapLanding() {
  

  return (
    <div className="font-body min-h-screen relative text-white">
      <BackgroundBlobs />
      <NavBar />
      <Hero />
      <HowItWorks />
      <Communities />
      <Savings />
      <JoinCTA />
      <Footer />
    </div>
  );
}