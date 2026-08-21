import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus, X, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// "Kinetic Stillness" — a Coming Soon page
// Design philosophy: The Theater of Anticipation
// ─────────────────────────────────────────────────────────────

const LAUNCH_ISO = "2026-09-21T00:00:00Z"; // T-minus target

const useCountdown = (targetIso) => {
  const calc = () => {
    const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      done: diff === 0,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso]);
  return t;
};

const pad = (n) => String(n).padStart(2, "0");

export default function ComingSoon() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const t = useCountdown(LAUNCH_ISO);

  // Cursor-driven horizon rule (0..1 vertical position)
  const mouseY = useMotionValue(0.5);
  const horizonY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.8 });

  // Parallax drift of the split brand halves toward center
  const driftX = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const topDriftX = useTransform(driftX, [0, 1], [0, 60]);
  const bottomDriftX = useTransform(driftX, [0, 1], [0, -60]);

  useEffect(() => {
    const onMove = (e) => {
      mouseY.set(Math.min(1, Math.max(0, e.clientY / window.innerHeight)));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseY]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 1600);
    },
    [email]
  );

  const horizonTop = useTransform(horizonY, (v) => `${v * 100}vh`);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden font-body text-[#121212] transition-colors duration-500"
      style={{ backgroundColor: submitted ? "#0033FF" : "#F9F8F6" }}
    >
      {/* ── Background monolithic countdown number ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 flex items-center justify-center select-none"
      >
        <span
          className="font-display leading-none text-[#121212]/[0.045]"
          style={{ fontSize: "40vw", letterSpacing: "-0.05em" }}
        >
          {pad(t.days)}
        </span>
      </div>

      {/* ── Cursor-driven Horizon Rule ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 w-full"
        style={{ top: horizonTop }}
      >
        <div className="relative h-px w-full bg-[#121212]/15">
          <motion.div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0033FF]"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* ── Ghost nav: single "+" ── */}
      <button
        onClick={() => setMenuOpen(true)}
        aria-label="Open coordinates"
        className="fixed top-6 right-6 z-40 flex h-12 w-12 items-center justify-center text-[#121212] transition-colors hover:text-[#0033FF]"
      >
        <Plus size={28} strokeWidth={1.25} />
      </button>

      {/* ── The Monolith (Hero Arrival) ── */}
      <section className="relative flex min-h-screen flex-col justify-between px-6 py-8 sm:px-10 md:px-16">
        {/* top-left half of brand */}
        <motion.div
          style={{ x: topDriftX }}
          className="relative z-10"
        >
          <h1
            className="font-display leading-[0.85] text-[#121212]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 16rem)", letterSpacing: "-0.05em" }}
          >
            Astra
          </h1>
        </motion.div>

        {/* center: lead capture (View B) */}
        <div className="relative z-10 mx-auto w-full max-w-2xl py-10">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.3em] text-[#121212]/50">
            The next paradigm is approaching
          </p>
          <form onSubmit={onSubmit} className="group">
            <div
              className={`flex items-center gap-3 border-b pb-3 transition-colors duration-300 ${
                submitted ? "border-white" : "border-[#121212]/30 focus-within:border-[#0033FF]"
              }`}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Claim your place in the sequence"
                className={`h-12 flex-1 bg-transparent text-lg outline-none placeholder:text-[#121212]/35 ${
                  submitted ? "text-white placeholder:text-white/60" : "text-[#121212]"
                }`}
                style={{ caretColor: submitted ? "#fff" : "#0033FF" }}
              />
              <button
                type="submit"
                aria-label="Submit"
                className={`flex h-12 w-12 shrink-0 items-center justify-center transition-colors ${
                  submitted
                    ? "text-white"
                    : "text-[#121212] hover:text-[#0033FF]"
                }`}
              >
                <ArrowRight size={22} strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </div>

        {/* bottom-right half of brand */}
        <motion.div
          style={{ x: bottomDriftX }}
          className="relative z-10 flex justify-end"
        >
          <h1
            className="font-display leading-[0.85] text-[#121212]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 16rem)", letterSpacing: "-0.05em" }}
          >
            Nova
          </h1>
        </motion.div>
      </section>

      {/* ── The Manifest (View C) ── */}
      <section className="relative px-6 pb-32 pt-10 sm:px-10 md:px-16">
        <div className="grid grid-cols-1 gap-12 border-t border-[#121212]/15 pt-16 md:grid-cols-3 md:gap-8">
          {[
            "We are not launching a product — we are unveiling a discipline.",
            "Every interface you have tolerated was a draft of what arrives next.",
            "The future is not predicted here. It is rehearsed, then released.",
          ].map((line, i) => (
            <ManifestColumn key={i} text={line} index={i} />
          ))}
        </div>
      </section>

      {/* ── Footer: timestamp + T-minus ── */}
      <footer className="fixed bottom-0 left-0 z-30 w-full px-6 py-4 sm:px-10 md:px-16">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[#121212]/55">
          <span>
            {now.toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })} · LOCAL
          </span>
          <span className="hidden sm:inline">T-MINUS {pad(t.days)}:{pad(t.hours)}:{pad(t.minutes)}:{pad(t.seconds)}</span>
          <span className="sm:hidden">T-{pad(t.days)}:{pad(t.hours)}:{pad(t.minutes)}:{pad(t.seconds)}</span>
        </div>
      </footer>

      {/* ── Full-screen coordinates overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#121212] px-6 py-8 text-[#F9F8F6] sm:px-10 md:px-16"
          >
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close"
              className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center text-[#F9F8F6] hover:text-[#0033FF]"
            >
              <X size={28} strokeWidth={1.25} />
            </button>

            <div className="mt-16 grid flex-1 grid-cols-1 gap-10 md:mt-0 md:grid-cols-3 md:items-end md:pb-16">
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[#F9F8F6]/40">
                  Manifesto
                </p>
                <p className="font-display text-2xl leading-snug md:text-3xl">
                  To build the stillness before the signal.
                </p>
              </div>
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[#F9F8F6]/40">
                  Coordinates
                </p>
                <ul className="space-y-2 font-mono text-sm">
                  <li>
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#0033FF]">
                      X / Twitter →
                    </a>
                  </li>
                  <li>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#0033FF]">
                      Instagram →
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[#F9F8F6]/40">
                  Contact
                </p>
                <a
                  href="mailto:hello@astranova.io"
                  className="font-mono text-sm transition-colors hover:text-[#0033FF]"
                >
                  hello@astranova.io
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Manifest column: assembles from horizontal slices ──
function ManifestColumn({ text, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const slices = 5;
  return (
    <div ref={ref} className="relative overflow-hidden">
      <p className="font-display text-xl leading-relaxed md:text-2xl">
        {text.split("").map((ch, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={visible ? { y: "0%" } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.15 + (i / text.length) * 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </span>
        ))}
      </p>
    </div>
  );
}