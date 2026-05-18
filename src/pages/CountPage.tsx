import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ─── Countdown helpers ─── */
const getEndOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
};

const calcTimeLeft = () => {
  const diff = getEndOfMonth().getTime() - Date.now();
  if (diff <= 0) return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  return {
    days: String(Math.floor(diff / 864e5)).padStart(2, "0"),
    hours: String(Math.floor((diff / 36e5) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((diff / 6e4) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((diff / 1e3) % 60)).padStart(2, "0"),
  };
};
/* ─── Flip digit component ─── */
const FlipDigit = ({ value, label }: { value: string; label: string }) => {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlipping(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Card */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-600/20 blur-xl" />
        {/* Glass card */}
        <div className="relative w-full h-full rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          {/* Top half highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/[0.04] rounded-t-2xl" />
          {/* Center divider */}
          <div className="absolute top-1/2 left-3 right-3 h-px bg-black/40" />

          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={flipping ? { y: -30, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-black text-white tracking-tight tabular-nums select-none"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Label */}
      <span className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70 font-semibold">
        {label}
      </span>
    </motion.div>
  );
};

/* ─── Animated grid background ─── */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Radial gradient overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.18),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(139,92,246,0.12),transparent)]" />

    {/* Grid lines */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />

    {/* Corner bleed */}
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
    <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px]" />
  </div>
);

/* ─── Cursor glow ─── */
const CursorGlow = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 18 });
  const springY = useSpring(y, { stiffness: 80, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
      }}
    />
  );
};


/* ─── Email waitlist ─── */
const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1400);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.7 }}
      className="mt-12 w-full max-w-md"
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-green-500/30 bg-green-500/10 backdrop-blur-xl"
          >
            <span className="text-lg">🎉</span>
            <span className="text-green-300 font-medium text-sm">
              You're on the list! We'll notify you at launch.
            </span>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white placeholder-white/30 text-sm outline-none focus:border-blue-500/60 focus:bg-white/[0.09] transition-all duration-200"
                disabled={status === "loading"}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              disabled={status === "loading"}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50 transition-all duration-200 whitespace-nowrap disabled:opacity-70"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Joining…
                </span>
              ) : (
                "Get Early Access"
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {status !== "success" && (
        <p className="mt-2.5 text-center text-xs text-white/25">
          No spam. Unsubscribe anytime.
        </p>
      )}
    </motion.form>
  );
};

/* ─── Social links ─── */
const SocialLinks = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.3 }}
    className="mt-8 flex items-center gap-5"
  >
    {[
      {
        label: "Twitter / X",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.1 2.25h6.978l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ),
        href: "#",
      },
      {
        label: "LinkedIn",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        ),
        href: "#",
      },
      {
        label: "Instagram",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        ),
        href: "#",
      },
    ].map(({ label, icon, href }) => (
      <motion.a
        key={label}
        href={href}
        aria-label={label}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.1] transition-all duration-200"
      >
        {icon}
      </motion.a>
    ))}
  </motion.div>
);

/* ─── Live build badge ─── */
const LiveBadge = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl mb-8"
  >
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity }}
      className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
    />
    <span className="text-xs text-white/60 font-medium tracking-wide">
      Building in progress — launching soon
    </span>
  </motion.div>
);

/* ─── Progress bar ─── */
const LaunchProgress = () => {
  const progress = 78;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7 }}
      className="mt-10 w-full max-w-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/35 tracking-wide">Launch readiness</span>
        <span className="text-xs font-bold text-blue-400">{progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: 1.1, duration: 1.4, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        />
      </div>
    </motion.div>
  );
};

/* ─── Floating particles ─── */
const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -60, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
const CountdownPage = () => {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col items-center justify-center px-6 py-20">
      {/* Backgrounds */}
      <GridBackground />
      <Particles />
      <CursorGlow />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl">

        {/* Live badge */}
        <LiveBadge />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          className="mb-6"
        >
          <img
            src="favi.png"
            alt="AAKT logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight"
        >
          The Operating System{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            for Modern Businesses
          </span>
        </motion.h1>

    

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-12 flex flex-wrap justify-center gap-5 sm:gap-8"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <FlipDigit key={item.label} value={item.value} label={item.label} />
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12 text-xs text-white/20 tracking-wide"
        >
          © {new Date().getFullYear()} AAKT · All rights reserved
        </motion.p>
      </div>

      {/* Giant watermark */}
      <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <h2 className="text-[160px] sm:text-[240px] md:text-[340px] font-black tracking-[-0.06em] text-white/[0.025] leading-none">
          AAKT
        </h2>
      </div>
    </div>
  );
};

export default CountdownPage;