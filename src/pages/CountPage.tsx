import { useEffect, useState } from "react";
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
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-400/10 blur-xl" />
        {/* Glass card */}
        <div className="relative w-full h-full rounded-2xl border border-black/[0.08] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden shadow-lg shadow-black/[0.08]">
          {/* Top half highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/50 rounded-t-2xl" />
          {/* Center divider */}
          <div className="absolute top-1/2 left-3 right-3 h-px bg-black/10" />

          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={flipping ? { y: -30, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight tabular-nums select-none"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Label */}
      <span className="text-[11px] uppercase tracking-[0.25em] text-indigo-500/80 font-semibold">
        {label}
      </span>
    </motion.div>
  );
};

/* ─── Animated grid background ─── */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Radial gradient overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.08),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(139,92,246,0.06),transparent)]" />

    {/* Grid lines */}
    <div
      className="absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />

    {/* Corner bleed */}
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[100px]" />
    <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-[100px]" />
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
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
      }}
    />
  );
};

/* ─── Notify form ─── */
const NotifyForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7 }}
      className="mt-5 w-full max-w-md"
    >
      <p className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">
        Sign up to get notified when we launch
      </p>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl border border-emerald-200 bg-emerald-50"
          >
            <span className="text-lg">🎉</span>
            <span className="text-emerald-700 font-medium text-sm">
              You're on the list! We'll notify you at launch.
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex gap-2 mt-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 rounded-xl border border-black/10 bg-white text-gray-800 placeholder-gray-400 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 shadow-sm"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              disabled={status === "loading"}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 whitespace-nowrap disabled:opacity-70"
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
                "Notify Me"
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {status !== "success" && (
        <p className="mt-2 text-center text-xs text-gray-400">
          No spam. Unsubscribe anytime.
        </p>
      )}
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
          className="absolute rounded-full bg-blue-400/30"
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
    <div className="relative min-h-screen bg-[#f8f9ff] overflow-hidden flex flex-col items-center justify-center px-6 py-0">
      {/* Backgrounds */}
      <GridBackground />
      <Particles />
      <CursorGlow />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl">

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
          className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight"
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

        {/* Notify form */}
        <NotifyForm />

      </div>

      {/* Giant watermark */}
      <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <h2 className="text-[160px] sm:text-[240px] md:text-[340px] font-black tracking-[-0.06em] text-black/[0.04] leading-none">
          AAKT
        </h2>
      </div>
    </div>
  );
};

export default CountdownPage;