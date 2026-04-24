import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion, useInView, AnimatePresence,
  useScroll, useTransform, useSpring, motionValue,
} from 'framer-motion';
import {
  GraduationCap, Building2, TrendingUp, TrendingDown,
  Info, BookOpen, ArrowUpRight, Map, ChevronDown, Sparkles,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TurkeyMap from '../components/TurkeyMap';
import { THEME as T } from '../components/Layout';
import {
  calculateTotalIHLStudents, groupByCity, groupByUniversity,
  groupByProgram, calculateTrend, isAcikogretim, normalizeProgramName,
} from '../utils/dataProcessor';

/* ─────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────── */
const useWidth = () => {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
};

const useSmoothScroll = (disabled = false) => {
  useEffect(() => {
    if (disabled) return;
    let cur = window.scrollY, tgt = window.scrollY, raf;
    const onWheel = e => {
      if (window.__horizScrollActive) return;
      e.preventDefault();
      tgt += e.deltaY * 0.88;
      tgt = Math.max(0, Math.min(tgt, document.body.scrollHeight - window.innerHeight));
    };
    const tick = () => {
      if (!window.__horizScrollActive) {
        cur += (tgt - cur) * 0.08;
        window.scrollTo(0, cur);
      } else {
        cur = window.scrollY;
        tgt = window.scrollY;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('wheel', onWheel); cancelAnimationFrame(raf); };
  }, [disabled]);
};

/* Mouse position hook for 3D tilt */
const useMouse3D = (ref) => {
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setPos({ x, y, active: true });
    };
    const onLeave = () => setPos({ x: 0, y: 0, active: false });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref]);
  return pos;
};

/* ─────────────────────────────────────────────────────────
   3D WIREFRAME POLYHEDRON — CSS-only rotating shape
───────────────────────────────────────────────────────── */
const WireframePolyhedron = ({ size = 280, color = T.brown, opacity = 0.12, speed = 28 }) => {
  const id = useRef(`poly-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div style={{ width: size, height: size, perspective: 800, pointerEvents: 'none' }}>
      <style>{`
        @keyframes ${id}-spin { 0% { transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg); } 100% { transform: rotateX(-20deg) rotateY(360deg) rotateZ(15deg); } }
        .${id} { width: ${size}px; height: ${size}px; position: relative; transform-style: preserve-3d; animation: ${id}-spin ${speed}s linear infinite; }
        .${id} .face { position: absolute; border: 1px solid ${color}; background: ${color}08; }
      `}</style>
      <div className={id} style={{ opacity }}>
        {[
          { transform: `translateZ(${size * 0.35}px)`, width: size * 0.7, height: size * 0.7 },
          { transform: `rotateY(180deg) translateZ(${size * 0.35}px)`, width: size * 0.7, height: size * 0.7 },
          { transform: `rotateY(90deg) translateZ(${size * 0.35}px)`, width: size * 0.7, height: size * 0.7 },
          { transform: `rotateY(-90deg) translateZ(${size * 0.35}px)`, width: size * 0.7, height: size * 0.7 },
          { transform: `rotateX(90deg) translateZ(${size * 0.35}px)`, width: size * 0.7, height: size * 0.7 },
          { transform: `rotateX(-90deg) translateZ(${size * 0.35}px)`, width: size * 0.7, height: size * 0.7 },
        ].map((face, i) => (
          <div key={i} className="face" style={{
            ...face, left: '50%', top: '50%',
            marginLeft: -face.width / 2, marginTop: -face.height / 2, borderRadius: 2,
          }} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div key={`oct-${i}`} className="face" style={{
            width: size * 0.45, height: size * 0.45,
            left: '50%', top: '50%',
            marginLeft: -size * 0.225, marginTop: -size * 0.225,
            transform: `rotateY(${deg}deg) rotateX(45deg) translateZ(${size * 0.18}px)`,
            borderRadius: 1, borderColor: `${color}88`, background: `${color}04`,
          }} />
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   3D FLOATING PARTICLES
───────────────────────────────────────────────────────── */
const FloatingParticles = ({ count = 18, color = T.brown }) => {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 4, duration: 12 + Math.random() * 20, delay: Math.random() * -20,
  })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div key={p.id}
          animate={{ y: [0, -40, 0, 30, 0], x: [0, 20, -15, 10, 0], opacity: [0.15, 0.4, 0.2, 0.35, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: '50%', background: color }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   3D TILT CARD WRAPPER
───────────────────────────────────────────────────────── */
const TiltCard3D = ({ children, intensity = 8, style = {}, disabled = false }) => {
  const ref = useRef(null);
  const mouse = useMouse3D(ref);

  if (disabled) {
    return <div style={style}>{children}</div>;
  }

  return (
    <div ref={ref} style={{ perspective: 1000, ...style }}>
      <motion.div
        animate={{ rotateX: mouse.active ? -mouse.y * intensity : 0, rotateY: mouse.active ? mouse.x * intensity : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform', height: '100%' }}
      >
        {children}
        {mouse.active && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 10,
            background: `radial-gradient(circle at ${(mouse.x + 0.5) * 100}% ${(mouse.y + 0.5) * 100}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          }} />
        )}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   3D ROTATING RING — orbiting dots
───────────────────────────────────────────────────────── */
const OrbitRing = ({ size = 160, dotCount = 12, color = T.brown, speed = 16 }) => {
  const id = useRef(`orbit-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <div style={{ width: size, height: size, perspective: 600, pointerEvents: 'none' }}>
      <style>{`@keyframes ${id}-orbit { 0% { transform: rotateX(65deg) rotateZ(0deg); } 100% { transform: rotateX(65deg) rotateZ(360deg); } }`}</style>
      <div style={{ width: size, height: size, position: 'relative', transformStyle: 'preserve-3d', animation: `${id}-orbit ${speed}s linear infinite` }}>
        {Array.from({ length: dotCount }, (_, i) => {
          const angle = (i / dotCount) * Math.PI * 2;
          const r = size * 0.42;
          return (
            <div key={i} style={{
              position: 'absolute', width: 4 + (i % 3), height: 4 + (i % 3), borderRadius: '50%',
              background: color, opacity: 0.15 + (i / dotCount) * 0.25, left: '50%', top: '50%',
              transform: `translateX(${Math.cos(angle) * r}px) translateY(${Math.sin(angle) * r}px) translateZ(${Math.sin(angle * 2) * 20}px)`,
            }} />
          );
        })}
        <div style={{ position: 'absolute', inset: '8%', border: `1px solid ${color}18`, borderRadius: '50%' }} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
const AnimatedCounter = ({ target, duration = 1.8, color, size = 52, suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.-]/g, '')) : target;
    if (isNaN(num)) { setValue(target); return; }
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);
  return (
    <motion.p ref={ref} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ fontSize: size, fontWeight: 800, color, lineHeight: 1, fontFamily: '"Playfair Display", serif', letterSpacing: '-0.03em' }}
    >{prefix}{value.toLocaleString('tr-TR')}{suffix}</motion.p>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION NAV DOTS — hidden on mobile
───────────────────────────────────────────────────────── */
const SectionDots = ({ total = 6 }) => {
  const [active, setActive] = useState(0);
  const labels = ['Genel', 'Özet', 'Oran', 'Bölüm', 'Üniversİte', 'Şehİr', 'Harİta'];
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const totalH = document.body.scrollHeight - vh;
      const pct = scrollY / totalH;
      setActive(Math.min(Math.floor(pct * (total + 1)), total));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [total]);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2, duration: 0.8 }}
      style={{ position: 'fixed', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      {labels.slice(0, total + 1).map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <AnimatePresence>
            {active === i && (
              <motion.span initial={{ opacity: 0, x: 8, width: 0 }} animate={{ opacity: 1, x: 0, width: 'auto' }} exit={{ opacity: 0, x: 8, width: 0 }}
                transition={{ duration: 0.3 }}
                style={{ fontSize: 8, fontWeight: 700, color: T.brown, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
              >{label}</motion.span>
            )}
          </AnimatePresence>
          <motion.div animate={{ width: active === i ? 20 : 5, height: 5, background: active === i ? T.brown : `${T.navy}33`, borderRadius: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ cursor: 'pointer', boxShadow: active === i ? `0 0 10px ${T.brown}44` : 'none' }} />
        </div>
      ))}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   PROGRESS RING
───────────────────────────────────────────────────────── */
const ProgressRing = ({ value, max, size = 64, strokeWidth = 4, color = T.brown }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`${color}15`} strokeWidth={strokeWidth} />
        <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - pct) } : {}}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} strokeDasharray={circ} />
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const STACK_GAP = 16;
const SCALE_SHRINK = 0.025;
const TOTAL_CARDS = 6;

/* ─────────────────────────────────────────────────────────
   STICKY STACK CARD
───────────────────────────────────────────────────────── */
const StackCardInner = ({ children, index, bg, padding, isMobile, overflowHidden, fixedHeight }, ref) => {
  const innerRef = useRef(null);
  const cardRef = ref || innerRef;
  const topPx = isMobile ? 0 : index * STACK_GAP;
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start start', 'end start'] });
  const remainingCards = TOTAL_CARDS - index - 1;
  const scaleTarget = Math.max(1 - remainingCards * SCALE_SHRINK, 0.84);
  const rawScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, isMobile ? 1 : scaleTarget]);
  const scale = useSpring(rawScale, { stiffness: 140, damping: 32 });
  const cardH = fixedHeight && !isMobile ? `calc(100vh - ${topPx}px)` : undefined;
  return (
    <div ref={cardRef} style={{ position: isMobile ? 'relative' : 'sticky', top: topPx, zIndex: 10 + index, height: cardH }}>
      <motion.div style={{ scale: isMobile ? 1 : scale, transformOrigin: '50% 0%', willChange: 'transform', height: '100%' }}>
        <div style={{
          background: bg || T.bgDeep,
          borderRadius: isMobile ? '20px 20px 0 0' : (index === 0 ? '32px 32px 0 0' : '28px 28px 0 0'),
          minHeight: isMobile ? 'auto' : `calc(100vh - ${topPx}px)`,
          height: cardH ? '100%' : undefined,
          padding: padding,
          boxShadow: '0 -8px 48px rgba(28,31,46,0.13), 0 -1px 0 rgba(28,31,46,0.06)',
          overflow: overflowHidden ? 'hidden' : 'visible',
          position: 'relative', boxSizing: 'border-box',
        }}>
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
        </div>
      </motion.div>
    </div>
  );
};
const StackCard = React.forwardRef(StackCardInner);

/* ─────────────────────────────────────────────────────────
   HORIZONTAL SCROLL CARDS (KART 2) — Touch-friendly for mobile
───────────────────────────────────────────────────────── */
const HorizScrollCards = ({ items, navigate, cardRef, topPx, isMobile }) => {
  const scrollContainerRef = useRef(null);
  const xMV = useRef(motionValue(0)).current;
  const progressMV = useRef(motionValue(0)).current;
  const xSpring = useSpring(xMV, { stiffness: 50, damping: 18, restDelta: 0.5 });

  // Mobile: Use native horizontal scroll
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <div
          ref={scrollContainerRef}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            paddingBottom: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 12, paddingLeft: 4, paddingRight: 20 }}>
            {items.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => navigate(`/programs/v2/${encodeURIComponent(p.name)}`)}
                style={{
                  width: 200,
                  minWidth: 200,
                  height: 240,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  scrollSnapAlign: 'start',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: T.brown, opacity: 0.2, fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: `${T.brown}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={10} color={T.brownLight} />
                  </div>
                </div>
                <div>
                  <h4 style={{
                    fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {p.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <p style={{ color: T.brownLight, fontSize: 16, fontWeight: 800, fontFamily: '"Playfair Display", serif' }}>
                      {p.count.toLocaleString('tr-TR')}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>öğrenci</p>
                  </div>
                  <div style={{ marginTop: 6, height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(p.percentage * 4, 100)}%`,
                      background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`,
                      borderRadius: 1
                    }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 9, marginTop: 4 }}>%{p.percentage}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                  Detay <ArrowUpRight size={9} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 12, flexShrink: 0 }}>
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ← Kaydırarak gezin →
          </p>
        </div>
      </div>
    );
  }

  // Desktop: Original wheel-based scroll
  useEffect(() => {
    let xVal = 0;
    const getAbsoluteTop = (el) => { let top = 0; while (el) { top += el.offsetTop; el = el.offsetParent; } return top; };
    const getMetrics = () => {
      const vw = window.innerWidth; const padPx = vw * 0.12; const visibleW = vw - padPx;
      const cw = Math.round(Math.min(260, Math.max(160, visibleW * 0.21)));
      const gap = Math.round(Math.max(16, vw * 0.064));
      const totalW = (cw + gap) * items.length - gap;
      return { cw, gap, maxShift: Math.max(totalW - visibleW, 0) };
    };
    const onWheel = (e) => {
      const el = cardRef?.current; if (!el) return;
      const absTop = getAbsoluteTop(el); const scrollY = window.scrollY; const vh = window.innerHeight;
      const enterY = absTop - topPx; const exitY = absTop + el.offsetHeight - vh;
      if (scrollY < enterY - 2 || scrollY > exitY + 2) { window.__horizScrollActive = false; return; }
      const { maxShift } = getMetrics();
      if (xVal >= 0 && e.deltaY < 0) { window.__horizScrollActive = false; return; }
      if (xVal <= -maxShift && e.deltaY > 0) { window.__horizScrollActive = false; return; }
      e.preventDefault(); window.__horizScrollActive = true;
      xVal = Math.max(-maxShift, Math.min(0, xVal - e.deltaY * 1.2));
      xMV.set(xVal); progressMV.set(maxShift > 0 ? -xVal / maxShift : 0);
    };
    const onScroll = () => {
      const el = cardRef?.current; if (!el) return;
      const absTop = getAbsoluteTop(el); const scrollY = window.scrollY; const vh = window.innerHeight;
      if (scrollY < absTop - topPx - 2 || scrollY > absTop + el.offsetHeight - vh + 2) window.__horizScrollActive = false;
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('wheel', onWheel); window.removeEventListener('scroll', onScroll); window.__horizScrollActive = false; };
  }, [xMV, progressMV, cardRef, topPx]);

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const padPx = vw * 0.12; const visibleW = vw - padPx;
  const cw = Math.round(Math.min(260, Math.max(160, visibleW * 0.21)));
  const gap = Math.round(Math.max(16, vw * 0.015));
  const cardH = Math.round(Math.min(320, Math.max(220, (typeof window !== 'undefined' ? window.innerHeight : 700) * 0.42)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <motion.div style={{ display: 'flex', gap, x: xSpring, width: 'max-content', paddingRight: 32 }}>
          {items.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/programs/v2/${encodeURIComponent(p.name)}`)}
              whileHover={{ scale: 1.03, y: -4 }}
              style={{
                width: cw, height: cardH,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, padding: 22,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                flexShrink: 0, backdropFilter: 'blur(12px)', cursor: 'pointer',
                transition: 'box-shadow 0.3s', boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: Math.round(cw * 0.28), fontWeight: 800, color: T.brown, opacity: 0.2, fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${T.brown}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={12} color={T.brownLight} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: Math.max(12.5, Math.round(cw * 0.065)), fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{p.name}</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <p style={{ color: T.brownLight, fontSize: 18, fontWeight: 800, fontFamily: '"Playfair Display", serif' }}>{p.count.toLocaleString('tr-TR')}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>öğrenci</p>
                </div>
                <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(p.percentage * 4, 100)}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`, borderRadius: 2 }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10, marginTop: 6 }}>%{p.percentage}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.32)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                Detayları Gör <ArrowUpRight size={10} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div style={{ paddingTop: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Aşağı kaydırarak gezin</span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)' }}>10 bölüm</span>
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', originX: 0, scaleX: progressMV, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   CYCLING TITLE
───────────────────────────────────────────────────────── */
const CyclingTitle = ({ isMobile }) => {
  const [phase, setPhase] = useState(0);
  const words = ['Veri', 'Analiz', 'Atlas'];
  const colors = [T.brown, T.navyMid, '#5a7a5a'];
  useEffect(() => { const id = setInterval(() => setPhase(p => (p + 1) % 3), 2800); return () => clearInterval(id); }, []);
  const fs = isMobile ? 'clamp(36px,10vw,52px)' : 'clamp(60px,8vw,108px)';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.08em', lineHeight: 1 }}>
      {'İhamer'.split('').map((ch, ci) => (
        <motion.span key={ci} initial={{ opacity: 0, y: 32, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.75, delay: 0.2 + ci * 0.06, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', fontSize: fs, fontWeight: 800, lineHeight: 1, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.navy, letterSpacing: '-0.03em' }}
        >{ch}</motion.span>
      ))}
      <div style={{ display: 'inline-block', overflow: 'hidden', position: 'relative', height: isMobile ? 'clamp(36px,10vw,52px)' : 'clamp(60px,8vw,108px)', verticalAlign: 'bottom' }}>
        <AnimatePresence mode="wait">
          <motion.span key={phase} initial={{ y: '110%', opacity: 0, rotateX: -40 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: '-110%', opacity: 0, rotateX: 40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block', fontSize: fs, fontWeight: 800, marginRight: '0.1em', lineHeight: 1, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: colors[phase], letterSpacing: '-0.03em', paddingLeft: '0.08em' }}
          >{words[phase]}</motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   DIVIDER / SECTION HEADING / CARD / STATNUM / REVEAL
───────────────────────────────────────────────────────── */
const Divider = ({ color, delay = 0, width = '55%' }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-20px' }); const c = color || T.brown;
  return (
    <div ref={ref} style={{ position: 'relative', height: 2, width, marginTop: 8 }}>
      <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', inset: 0, originX: 0, background: `linear-gradient(90deg, ${c}, ${c}55 60%, transparent)`, borderRadius: 1 }} />
    </div>
  );
};

const SectionHeading = ({ label, children, color, align = 'left', delay = 0, dark = false, isMobile = false }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-30px' });
  const c = color || T.brown; const textColor = dark ? '#fff' : T.navy;
  const justify = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  return (
    <div ref={ref} style={{ textAlign: align, marginBottom: isMobile ? 28 : 48 }}>
      {label && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: 'easeOut' }}
          style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: c, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: isMobile ? 6 : 10, display: 'flex', alignItems: 'center', gap: 8, justifyContent: justify }}>
          <span style={{ display: 'inline-block', width: isMobile ? 16 : 22, height: 1.5, background: c, borderRadius: 1 }} />{label}
        </motion.p>
      )}
      <motion.h2 initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: delay + 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: isMobile ? 'clamp(20px, 6vw, 28px)' : 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: textColor, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1.1, letterSpacing: '-0.02em', display: 'inline-block' }}
      >{children}</motion.h2>
      <div style={{ display: 'flex', justifyContent: justify }}><Divider color={c} delay={delay + 0.2} width="60%" /></div>
    </div>
  );
};

const Card = ({ children, delay = 0, accent, style = {}, dark = false }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-30px' }); const [hov, setHov] = useState(false);
  const ac = accent || T.brown; const bg = dark ? 'rgba(255,255,255,0.06)' : T.bgCard;
  const borderBase = dark ? 'rgba(255,255,255,0.10)' : T.borderCard; const borderHov = dark ? ac + '55' : ac + '30';
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`, height: '100%', ...style }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          background: bg, border: `1px solid ${hov ? borderHov : borderBase}`, borderRadius: 16, padding: '20px 18px', position: 'relative', overflow: 'hidden',
          boxShadow: hov ? `0 16px 48px ${dark ? 'rgba(0,0,0,0.5)' : T.shadowMd}, 0 0 0 1px ${ac}18` : `0 2px 12px ${dark ? 'rgba(0,0,0,0.25)' : T.shadow}`,
          transition: 'box-shadow 0.35s, border-color 0.35s, transform 0.3s', transform: hov ? 'translateY(-2px)' : 'translateY(0)', height: '100%'
        }}>
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${ac}55, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', top: 12, right: 14, width: 6, height: 6, borderRadius: '50%', background: ac, opacity: hov ? 0.6 : 0.18, transition: 'opacity 0.3s', boxShadow: hov ? `0 0 8px ${ac}55` : 'none' }} />
        {children}
      </div>
    </div>
  );
};

const StatNum = ({ value, color, size = 52 }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true });
  return (
    <motion.p ref={ref} initial={{ opacity: 0, scale: 0.75 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
      style={{ fontSize: size, fontWeight: 800, color, lineHeight: 1, fontFamily: '"Playfair Display", serif', letterSpacing: '-0.03em' }}>{value}</motion.p>
  );
};

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-50px' });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
};

/* ─────────────────────────────────────────────────────────
   UNIV ROW
───────────────────────────────────────────────────────── */
const UnivRow = ({ item, index, onClick, isMobile }) => {
  const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-24px' }); const [hov, setHov] = useState(false);
  const isTop3 = index < 3; const medals = ['#C9A84C', '#A8A8A8', '#B87333'];
  return (
    <div ref={ref}>
      <motion.div initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }} animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ type: 'spring', stiffness: 75, damping: 16, delay: index * 0.055 }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 14,
          padding: isMobile ? '12px 12px' : '14px 18px 14px 16px',
          borderRadius: isMobile ? 12 : 16, cursor: 'pointer',
          background: hov ? T.bgDeep : T.bgCard, border: `1px solid ${hov ? T.brown + '33' : T.borderCard}`,
          boxShadow: hov ? `0 12px 32px ${T.shadowMd}` : `0 2px 8px ${T.shadow}`,
          transform: hov ? 'translateX(6px) scale(1.005)' : 'translateX(0) scale(1)',
          transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)', position: 'relative', overflow: 'hidden',
        }}>
        <motion.div initial={{ scale: 2.4, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 240, damping: 18, delay: index * 0.055 + 0.15 }}
          style={{
            width: isMobile ? 36 : 48, height: isMobile ? 36 : 48, flexShrink: 0, borderRadius: isMobile ? 10 : 14,
            background: isTop3 ? `linear-gradient(135deg, ${medals[index]} 0%, ${medals[index]}bb 100%)` : T.bgDeep,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMobile ? 14 : 18, fontWeight: 800, fontFamily: '"Playfair Display", serif',
            color: isTop3 ? '#fff' : T.textMuted, boxShadow: isTop3 ? `0 4px 16px ${medals[index]}44` : 'none',
          }}>{index + 1}</motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: isMobile ? 12 : 13.5, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{item.name}</p>
          {item.city && <p style={{ fontSize: isMobile ? 9 : 10.5, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}><Map size={isMobile ? 8 : 9} /> {item.city}</p>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: hov ? T.brown : T.navy, fontFamily: '"Playfair Display", serif', lineHeight: 1, transition: 'color 0.25s' }}>{item.count?.toLocaleString('tr-TR')}</p>
          <p style={{ fontSize: isMobile ? 9 : 10, color: T.textMuted, marginTop: 1 }}>%{item.percentage}</p>
        </div>
        <motion.div animate={{ height: hov ? 44 : 0, opacity: hov ? 1 : 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 3, borderRadius: '2px 0 0 2px', background: `linear-gradient(180deg, ${T.brown}, ${T.brownLight})`, overflow: 'hidden' }} />
      </motion.div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════
   MAIN OVERVIEW
═════════════════════════════════════════════════════════ */
const Overview = ({ data }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const containerRef = useRef(null);
  const kart2Ref = useRef(null);
  const vw = useWidth();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  useSmoothScroll(isMobile);

  useEffect(() => {
    if (!data?.length) return;
    const ihl23 = calculateTotalIHLStudents(data, '2023'); const ihl24 = calculateTotalIHLStudents(data, '2024'); const ihl25 = calculateTotalIHLStudents(data, '2025');
    const tot = yr => data.filter(r => r.year === yr).reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);
    const tot23 = tot('2023'), tot24 = tot('2024'), tot25 = tot('2025');
    const cities = groupByCity(data, '2025');
    setStats({
      ihl: { 2023: ihl23, 2024: ihl24, 2025: ihl25 },
      tot: { 2023: tot23, 2024: tot24, 2025: tot25 },
      pct: { 2023: tot23 > 0 ? ((ihl23 / tot23) * 100).toFixed(2) : '0', 2024: tot24 > 0 ? ((ihl24 / tot24) * 100).toFixed(2) : '0', 2025: tot25 > 0 ? ((ihl25 / tot25) * 100).toFixed(2) : '0' },
      univ: new Set(data.map(r => r.university_name)).size,
      prog: new Set(data.map(r => normalizeProgramName(r.program_name))).size,
      topCities: [...groupByCity(data, '2025')].sort((a, b) => b.count - a.count).slice(0, isMobile ? 15 : 15),
      topCityPct: [...groupByCity(data, '2025')].sort((a, b) => b.percentage - a.percentage).filter(c => c.city !== 'BOSNA-HERSEK').slice(0, isMobile ? 15 : 15),
      topUniv: [...groupByUniversity(data, '2025')].sort((a, b) => b.count - a.count).slice(0, 10),
      topProg: [...groupByProgram(data, '2025')].filter(p => !isAcikogretim(p.name, '')).sort((a, b) => b.count - a.count).slice(0, 10),
      cities,
    });
  }, [data, isMobile]);

  const heroScale = useTransform(smoothProgress, [0, 0.12], [1, isMobile ? 1 : 0.82]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, isMobile ? 1 : 0]);
  const heroBlur = useTransform(smoothProgress, [0, 0.12], ['blur(0px)', isMobile ? 'blur(0px)' : 'blur(20px)']);

  if (!stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 20, background: T.bg }}>
        <div style={{ position: 'relative' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${T.brown}15`, borderTopColor: T.brown }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 120, height: 12, borderRadius: 6, background: T.border }} />
          <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            style={{ width: 80, height: 8, borderRadius: 4, background: T.border }} />
        </div>
      </div>
    );
  }
  const trend = calculateTrend(stats.ihl[2025], stats.ihl[2024]);
  const secPad = isMobile ? '48px 4vw 40px' : isTablet ? '64px 5vw 56px' : '100px 6vw 96px';
  const tipStyle = { backgroundColor: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 10, color: T.text, fontSize: 11, boxShadow: `0 8px 32px ${T.shadow}`, padding: '6px 10px' };
  const KART2_TOPPX = 2 * STACK_GAP;

  return (
    <div ref={containerRef} style={{ background: T.bg, color: T.text, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        ::selection { background: ${T.brown}33; color: ${T.navy}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.brown}44; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.brown}88; }
      `}</style>

      {/* Section dots — hidden on mobile */}
      {!isMobile && !isTablet && <SectionDots total={6} />}

      {/* ══ HERO ══ */}
      <section style={{ height: isMobile ? 'auto' : '160vh', minHeight: isMobile ? '100vh' : undefined, position: 'relative', zIndex: 3 }}>
        <div style={{ position: isMobile ? 'relative' : 'sticky', top: 0, height: isMobile ? 'auto' : '100vh', minHeight: isMobile ? '100vh' : undefined, overflow: 'hidden' }}>
          <motion.div style={{
            height: '100%', minHeight: isMobile ? '100vh' : undefined,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: isMobile ? '80px 5vw 60px' : '0 6vw',
            scale: isMobile ? 1 : heroScale,
            opacity: isMobile ? 1 : heroOpacity,
            filter: isMobile ? 'none' : heroBlur,
            position: 'relative', overflow: 'hidden', background: T.bg,
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 60% at 80% 40%, ${T.brownPale} 0%, transparent 65%)` }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.4 }} />
            <div style={{ position: 'absolute', left: isMobile ? '3vw' : '5vw', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />

            {/* 3D Polyhedron — hidden on mobile */}
            {!isMobile && !isTablet && (
              <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-55%)', zIndex: 0 }}>
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}>
                  <WireframePolyhedron size={vw < 1200 ? 220 : 320} color={T.brown} opacity={0.10} speed={32} />
                </motion.div>
              </div>
            )}

            <FloatingParticles count={isMobile ? 6 : 16} color={`${T.brown}33`} />

            {/* Big background letter — hidden on mobile */}
            {!isMobile && (
              <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-52%)', fontSize: '38vw', fontWeight: 800, color: T.navy, opacity: 0.02, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>İ</div>
            )}

            <div style={{ position: 'relative', zIndex: 2, maxWidth: isMobile ? '100%' : 520 }}>
              <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: isMobile ? 8 : 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: isMobile ? 14 : 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: isMobile ? 20 : 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
                İHL Mezunları · 2023 — 2025
              </motion.p>
              <CyclingTitle isMobile={isMobile} />
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 2, width: isMobile ? '80%' : '50%', originX: 0, marginTop: isMobile ? 16 : 22, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`, borderRadius: 1 }} />
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: isMobile ? 13 : 15, color: T.textSub, marginTop: isMobile ? 16 : 24, lineHeight: 1.8, maxWidth: 460 }}>
                İmam Hatip Lisesi mezunlarının üniversiteye yerleşim verileri.
              </motion.p>

              {/* Hero stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.8 }}
                style={{ display: 'flex', gap: isMobile ? 8 : 16, marginTop: isMobile ? 24 : 36, flexWrap: 'wrap' }}>
                {[
                  { label: isMobile ? 'İHL 2025' : 'İHL Öğrencisi · 2025', value: stats.ihl[2025].toLocaleString('tr-TR'), color: T.navy, icon: GraduationCap },
                  { label: 'Oran', value: `%${stats.pct[2025]}`, color: T.brown, icon: TrendingUp },
                  { label: 'Üniversite', value: String(stats.univ), color: T.navyMid, icon: Building2 },
                ].map((s, i) => (
                  <motion.div key={i} whileHover={isMobile ? {} : { scale: 1.04, y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    style={{
                      padding: isMobile ? '10px 12px' : '14px 18px',
                      borderRadius: isMobile ? 12 : 16,
                      background: T.bgCard,
                      border: `1px solid ${T.borderCard}`,
                      boxShadow: `0 4px 16px ${T.shadow}`,
                      minWidth: isMobile ? 90 : 110,
                      flex: isMobile ? '1 1 calc(50% - 4px)' : 'none',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: isMobile ? 4 : 6 }}>
                      <s.icon size={isMobile ? 10 : 11} color={s.color} />
                      <p style={{ fontSize: isMobile ? 7 : 8.5, fontWeight: 700, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</p>
                    </div>
                    <p style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, fontFamily: '"Playfair Display", serif', color: s.color, lineHeight: 1 }}>{s.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Scroll indicator — hidden on mobile */}
            {!isMobile && (
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 1, height: 44, background: `linear-gradient(180deg, transparent, ${T.brown}88)` }} />
                <p style={{ fontSize: 8, letterSpacing: '0.26em', textTransform: 'uppercase', color: T.textMuted }}>Kaydır</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* KART 0 : GENEL BAKIŞ */}
      <StackCard index={0} bg={T.bgDeep} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative' }}>
          {!isMobile && !isTablet && <div style={{ position: 'absolute', right: -40, top: -20, opacity: 0.5, zIndex: 0 }}><OrbitRing size={140} dotCount={10} color={T.brown} speed={20} /></div>}
          <Reveal><SectionHeading label="Özet" color={T.brown} isMobile={isMobile}>Genel Bakış</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.5fr 1fr 1fr', gap: isMobile ? 12 : 16, position: 'relative', zIndex: 1 }}>
            {/* Main stat card */}
            <div style={{ gridRow: isMobile ? 'auto' : isTablet ? 'auto' : '1 / 3' }}>
              <TiltCard3D intensity={isMobile ? 0 : 5} disabled={isMobile} style={{ height: isTablet || isMobile ? 'auto' : '100%' }}>
                <Card delay={0.05} accent={T.navy} style={{ height: isTablet || isMobile ? 'auto' : '100%' }}>
                  <p style={{ fontSize: isMobile ? 9 : 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Toplam İHL Öğrencisi · 2025</p>
                  <AnimatedCounter target={stats.ihl[2025]} color={T.navy} size={isMobile ? 36 : 58} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                    {trend.direction === 'up' ? <TrendingUp size={isMobile ? 12 : 14} color="#22a55e" /> : <TrendingDown size={isMobile ? 12 : 14} color="#d94040" />}
                    <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: trend.direction === 'up' ? '#22a55e' : '#d94040' }}>%{trend.percentage}</span>
                    <span style={{ fontSize: isMobile ? 10 : 12, color: T.textMuted }}>2024'e göre</span>
                  </div>
                  <div style={{ marginTop: isMobile ? 12 : 18, padding: isMobile ? '10px 12px' : '12px 14px', borderRadius: 10, background: `linear-gradient(135deg, ${T.brownPale}, ${T.brownPale}88)`, border: `1px solid ${T.brown}18`, display: 'flex', gap: 8 }}>
                    <Info size={isMobile ? 11 : 13} color={T.brown} style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: isMobile ? 11 : 12.5, color: T.textSub, lineHeight: 1.6 }}>
                      Toplam <strong style={{ color: T.navy }}>{stats.tot[2025].toLocaleString('tr-TR')}</strong> yerleşmeden <strong style={{ color: T.brown }}>{stats.ihl[2025].toLocaleString('tr-TR')}</strong>'i İHL mezunu.
                    </p>
                  </div>
                  {/* Mini trend bars */}
                  <div style={{ marginTop: isMobile ? 16 : 24 }}>
                    <p style={{ fontSize: 9, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Trend 2023 → 2025</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: isMobile ? 40 : 54 }}>
                      {[2023, 2024, 2025].map((yr, i) => {
                        const mx = Math.max(stats.ihl[2023], stats.ihl[2024], stats.ihl[2025]);
                        const h = (stats.ihl[yr] / mx) * (isMobile ? 32 : 46);
                        return (
                          <div key={yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <motion.div initial={{ height: 0 }} whileInView={{ height: h }} viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.12 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                              style={{ width: '100%', borderRadius: '3px 3px 0 0', background: i === 2 ? `linear-gradient(180deg, ${T.navy}, ${T.navyMid})` : `${T.navy}22` }} />
                            <span style={{ fontSize: 8, color: T.textMuted, fontWeight: i === 2 ? 700 : 400 }}>{yr}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </TiltCard3D>
            </div>

            <TiltCard3D intensity={isMobile ? 0 : 6} disabled={isMobile}><Card delay={0.13} accent={T.brown}>
              <p style={{ fontSize: isMobile ? 9 : 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Üniversite</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: 10, background: `linear-gradient(135deg, ${T.brownPale}, ${T.brown}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={isMobile ? 14 : 17} color={T.brown} /></div>
                <AnimatedCounter target={stats.univ} color={T.brown} size={isMobile ? 36 : 50} />
              </div>
              <p style={{ fontSize: isMobile ? 11 : 13, color: T.textSub, marginTop: 8 }}>Farklı üniversite</p>
            </Card></TiltCard3D>

            <TiltCard3D intensity={isMobile ? 0 : 6} disabled={isMobile}><Card delay={0.2} accent={T.navy}>
              <p style={{ fontSize: isMobile ? 9 : 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Program</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, borderRadius: 10, background: `${T.navy}0e`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={isMobile ? 14 : 17} color={T.navy} /></div>
                <AnimatedCounter target={stats.prog} color={T.navy} size={isMobile ? 36 : 50} />
              </div>
              <p style={{ fontSize: isMobile ? 11 : 13, color: T.textSub, marginTop: 8 }}>Farklı program</p>
            </Card></TiltCard3D>

            <TiltCard3D intensity={isMobile ? 0 : 6} disabled={isMobile}><Card delay={0.26} accent={T.brown}>
              <p style={{ fontSize: isMobile ? 9 : 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Oran 2025</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ProgressRing value={parseFloat(stats.pct[2025])} max={20} size={isMobile ? 44 : 56} strokeWidth={isMobile ? 3 : 4} color={T.brown} />
                <StatNum value={`%${stats.pct[2025]}`} color={T.brown} size={isMobile ? 32 : 40} />
              </div>
              <p style={{ fontSize: isMobile ? 10 : 12, color: T.textMuted, marginTop: 8 }}>2024: %{stats.pct[2024]} · 2023: %{stats.pct[2023]}</p>
            </Card></TiltCard3D>

            <TiltCard3D intensity={isMobile ? 0 : 6} disabled={isMobile}><Card delay={0.32} accent={T.navy}>
              <p style={{ fontSize: isMobile ? 9 : 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Yıllık Değişim</p>
              {['2024', '2025'].map((yr) => {
                const prevYr = String(Number(yr) - 1);
                const tr = calculateTrend(parseFloat(stats.pct[yr]), parseFloat(stats.pct[prevYr]));
                return (
                  <div key={yr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '8px 0' : '10px 0', borderBottom: `1px solid ${T.borderCard}` }}>
                    <span style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: T.navy }}>{yr}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {tr.direction === 'up' ? <TrendingUp size={isMobile ? 11 : 13} color="#22a55e" /> : <TrendingDown size={isMobile ? 11 : 13} color="#d94040" />}
                      <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 700, color: tr.direction === 'up' ? '#22a55e' : '#d94040' }}>{tr.direction === 'up' ? '+' : '-'}%{tr.percentage}</span>
                    </div>
                  </div>
                );
              })}
            </Card></TiltCard3D>
          </div>
        </div>
      </StackCard>

      {/* KART 1 : YILLIK ORAN */}
      <StackCard index={1} bg={T.bg} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Karşılaştırma" color={T.navy} align="center" isMobile={isMobile}>Yıllara Göre İHL Mezunu Oranı</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 16 }}>
            {['2023', '2024', '2025'].map((yr, i) => {
              const prevYr = String(Number(yr) - 1);
              const tr = yr !== '2023' ? calculateTrend(parseFloat(stats.pct[yr]), parseFloat(stats.pct[prevYr])) : null;
              const isLatest = i === 2;
              return (
                <TiltCard3D key={yr} intensity={isMobile ? 0 : 7} disabled={isMobile}>
                  <Card delay={i * 0.11} accent={isLatest ? T.brown : T.navy}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <p style={{ fontSize: isMobile ? 10 : 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{yr}</p>
                      {isLatest && (
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                          style={{ padding: '2px 6px', borderRadius: 5, background: `linear-gradient(135deg, ${T.brown}20, ${T.brownPale})`, fontSize: 7, fontWeight: 700, color: T.brown, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Güncel</motion.div>
                      )}
                    </div>
                    <motion.p initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                      style={{ fontSize: isMobile ? 'clamp(40px,12vw,56px)' : 'clamp(48px,7vw,72px)', fontWeight: 800, lineHeight: 1, marginTop: 4, fontFamily: '"Playfair Display", serif', color: isLatest ? T.brown : T.navy, letterSpacing: '-0.04em' }}>
                      %{stats.pct[yr]}
                    </motion.p>
                    <p style={{ fontSize: isMobile ? 11 : 13, color: T.textSub, marginTop: 8 }}>
                      <strong style={{ color: T.text }}>{stats.ihl[yr].toLocaleString('tr-TR')}</strong> / {stats.tot[yr].toLocaleString('tr-TR')}
                    </p>
                    {tr && (
                      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {tr.direction === 'up' ? <TrendingUp size={isMobile ? 11 : 13} color="#22a55e" /> : <TrendingDown size={isMobile ? 11 : 13} color="#d94040" />}
                        <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: tr.direction === 'up' ? '#22a55e' : '#d94040' }}>{tr.direction === 'up' ? '+' : '-'}%{tr.percentage}</span>
                        <span style={{ fontSize: isMobile ? 9 : 11, color: T.textMuted }}>önceki yıla göre</span>
                      </div>
                    )}
                    <div style={{ marginTop: isMobile ? 12 : 18, height: 3, borderRadius: 2, overflow: 'hidden', background: `${isLatest ? T.brown : T.navy}12` }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(parseFloat(stats.pct[yr]) * 6, 100)}%` }}
                        viewport={{ once: true }} transition={{ duration: 1.4, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', borderRadius: 2, background: isLatest ? `linear-gradient(90deg, ${T.brown}, ${T.brownLight})` : `linear-gradient(90deg, ${T.navy}, ${T.navyMid})` }} />
                    </div>
                  </Card>
                </TiltCard3D>
              );
            })}
          </div>
        </div>
      </StackCard>

      {/* KART 2 : TOP BÖLÜMLER */}
      <StackCard ref={kart2Ref} index={2} bg={T.navy} padding={isMobile ? '40px 4vw 32px' : '48px 6vw 36px'} isMobile={isMobile} overflowHidden={!isMobile} fixedHeight={!isMobile}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, #fff 71px, #fff 72px)` }} />
        {!isMobile && <div style={{ position: 'absolute', right: '-4%', top: '50%', transform: 'translateY(-52%)', fontSize: '40vw', fontWeight: 800, color: '#fff', opacity: 0.015, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>B</div>}
        {!isMobile && !isTablet && <div style={{ position: 'absolute', left: '3%', bottom: '10%', opacity: 0.15, zIndex: 0 }}><OrbitRing size={100} dotCount={8} color={T.brownLight} speed={14} /></div>}
        <FloatingParticles count={isMobile ? 6 : 10} color={`${T.brownLight}22`} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexShrink: 0, marginBottom: isMobile ? 16 : 20 }}>
            <p style={{ fontSize: isMobile ? 8 : 10, fontWeight: 700, color: T.brown, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: isMobile ? 14 : 18, height: 1.5, background: T.brown, borderRadius: 1 }} />Sıralamalar · 2025
            </p>
            <h2 style={{ fontSize: isMobile ? 'clamp(18px, 5vw, 24px)' : 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: '#fff', fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>Top 10 Bölüm</h2>
          </div>
          {isMobile ? (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.topProg.map((p, i) => (
                <Card key={i} delay={i * 0.03} accent={T.brown} dark>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    onClick={() => navigate(`/programs/v2/${encodeURIComponent(p.name)}`)}
                  >
                    <span style={{ fontSize: 28, fontWeight: 800, color: T.brown, opacity: 0.35, fontFamily: '"Playfair Display", serif', lineHeight: 1, width: 36, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 10, color: T.brownLight, marginTop: 2 }}>{p.count.toLocaleString('tr-TR')} öğrenci · %{p.percentage}</p>
                    </div>
                    <div style={{ cursor: 'pointer', opacity: 0.6, flexShrink: 0 }}><ArrowUpRight size={14} color="#fff" /></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <HorizScrollCards items={stats.topProg} navigate={navigate} cardRef={kart2Ref} topPx={KART2_TOPPX} isMobile={isMobile} />
          )}
        </div>
      </StackCard>

      {/* KART 3 : TOP ÜNİVERSİTELER */}
      <StackCard index={3} bg={T.bgDeep} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Sıralamalar · 2025" color={T.brown} align={isMobile ? 'left' : 'right'} isMobile={isMobile}>Top 10 Üniversite</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 8 : 10 }}>
            {stats.topUniv.map((item, i) => (
              <UnivRow key={i} item={item} index={i} onClick={() => navigate(`/universities/v2/${encodeURIComponent(item.name)}`)} isMobile={isMobile} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.55, duration: 0.65 }}
            style={{ marginTop: isMobile ? 16 : 24, display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, padding: isMobile ? '12px 14px' : '16px 20px', borderRadius: isMobile ? 12 : 16, background: T.bgCard, border: `1px solid ${T.borderCard}`, flexWrap: 'wrap', boxShadow: `0 4px 20px ${T.shadow}` }}>
            <div style={{ width: isMobile ? 28 : 36, height: isMobile ? 28 : 36, borderRadius: isMobile ? 8 : 10, background: `linear-gradient(135deg, ${T.brownPale}, ${T.brown}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={isMobile ? 12 : 15} color={T.brown} /></div>
            <p style={{ flex: 1, fontSize: isMobile ? 11 : 12.5, color: T.textSub, lineHeight: 1.5 }}>Listede yer alan <strong style={{ color: T.navy }}>10 üniversite</strong>, 2025 yılında İHL mezunu yerleşiminin büyük bölümünü oluşturmaktadır.</p>
            <motion.div whileHover={isMobile ? {} : { x: 4, scale: 1.02 }} onClick={() => navigate('/universities/v2')}
              style={{ cursor: 'pointer', color: T.brown, display: 'flex', alignItems: 'center', gap: 4, fontSize: isMobile ? 10 : 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0, padding: isMobile ? '5px 10px' : '6px 12px', borderRadius: 8, background: T.brownPale, border: `1px solid ${T.brown}18` }}>
              Tümünü Gör <ArrowUpRight size={isMobile ? 11 : 13} />
            </motion.div>
          </motion.div>
        </div>
      </StackCard>

      {/* KART 4 : ŞEHİR DAĞILIMLARI */}
      <StackCard index={4} bg={T.bg} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Coğrafi Analiz" color={T.navy} isMobile={isMobile}>Şehir Dağılımları</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 12 : 16 }}>
            <TiltCard3D intensity={isMobile ? 0 : 4} disabled={isMobile}><Card delay={0.07} accent={T.navy}>
              <p style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>En Çok Öğrenci · İlk {isMobile ? 15 : 15} Şehir</p>
              <Divider color={T.navy} width="50%" />
              <div style={{ marginTop: 12 }}>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <BarChart data={stats.topCities} margin={{ bottom: isMobile ? 50 : 52, left: -20, right: 4 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false} />
                    <XAxis dataKey="city" angle={-45} textAnchor="end" height={isMobile ? 60 : 72} interval={0} tick={{ fontSize: isMobile ? 7 : 10.5, fill: T.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: isMobile ? 8 : 10.5, fill: T.textMuted }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tipStyle} formatter={v => [v.toLocaleString('tr-TR'), 'Öğrenci']} />
                    <Bar dataKey="count" fill={T.navy} radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card></TiltCard3D>

            <TiltCard3D intensity={isMobile ? 0 : 4} disabled={isMobile}><Card delay={0.17} accent={T.brown}>
              <p style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: T.brown, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>En Yüksek Oran · İlk {isMobile ? 15 : 15} Şehir</p>
              <Divider color={T.brown} width="50%" />
              <div style={{ marginTop: 12 }}>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <BarChart data={stats.topCityPct} margin={{ bottom: isMobile ? 50 : 52, left: -20, right: 4 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false} />
                    <XAxis dataKey="city" angle={-45} textAnchor="end" height={isMobile ? 60 : 72} interval={0} tick={{ fontSize: isMobile ? 7 : 10.5, fill: T.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: isMobile ? 8 : 10.5, fill: T.textMuted }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tipStyle} formatter={v => [`%${v}`, 'Oran']} />
                    <Bar dataKey="percentage" fill={T.brown} radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: isMobile ? 9 : 11, fontStyle: 'italic', color: T.textMuted, marginTop: 6 }}>* Kontenjan Sayısına Göre En Yüksek Oranlar</p>
              </div>
            </Card></TiltCard3D>
          </div>
        </div>
      </StackCard>

      {/* KART 5 : HARİTA */}
      <StackCard index={5} bg={T.bgDeep} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Coğrafi Görünüm" color={T.brown} isMobile={isMobile}>Türkiye Haritası · 2025</SectionHeading></Reveal>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <Card delay={0} accent={T.navy}>
              <p style={{ fontSize: isMobile ? 11 : 13, color: T.textSub, marginBottom: isMobile ? 12 : 18, lineHeight: 1.7 }}>
                {isMobile
                  ? 'Bir şehre tıklayarak o ilin üniversitelerini görüntüleyin.'
                  : 'Bir şehre geldiğinizde İHL mezunu öğrenci sayısını görebilirsiniz. Tıklayarak o ilin üniversitelerini görüntüleyin.'}
              </p>
              <TurkeyMap citiesData={stats.cities} data={data} />
            </Card>
          </motion.div>
        </div>
      </StackCard>
    </div>
  );
};

export default Overview;