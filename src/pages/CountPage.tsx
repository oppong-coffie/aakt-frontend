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
    <div className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col items-center justify-center px-6 py-0">
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