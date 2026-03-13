import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion, useInView, AnimatePresence,
  useScroll, useTransform, useSpring, motionValue,
} from 'framer-motion';
import {
  GraduationCap, Building2, TrendingUp, TrendingDown,
  Info, BookOpen, ArrowUpRight, Map,
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

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });
  const remainingCards = TOTAL_CARDS - index - 1;
  const scaleTarget = Math.max(1 - remainingCards * SCALE_SHRINK, 0.84);
  const rawScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, isMobile ? 1 : scaleTarget]);
  const scale = useSpring(rawScale, { stiffness: 140, damping: 32 });

  const cardH = fixedHeight && !isMobile ? `calc(100vh - ${topPx}px)` : undefined;

  return (
    <div
      ref={cardRef}
      style={{
        position: isMobile ? 'relative' : 'sticky',
        top: topPx,
        zIndex: 10 + index,
        height: cardH,          /* fixedHeight: dış wrapper tam yükseklik */
      }}
    >
      <motion.div
        style={{ scale: isMobile ? 1 : scale, transformOrigin: '50% 0%', willChange: 'transform', height: '100%' }}
      >
        <div style={{
          background: bg || T.bgDeep,
          borderRadius: index === 0 ? '32px 32px 0 0' : '28px 28px 0 0',
          minHeight: isMobile ? 'auto' : `calc(100vh - ${topPx}px)`,
          height: cardH ? '100%' : undefined,
          padding: padding || '80px 6vw',
          boxShadow: '0 -8px 48px rgba(28,31,46,0.13), 0 -1px 0 rgba(28,31,46,0.06)',
          overflow: overflowHidden ? 'hidden' : 'visible',
          position: 'relative',
          boxSizing: 'border-box',
        }}>
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
const StackCard = React.forwardRef(StackCardInner);

/* ─────────────────────────────────────────────────────────
   HORIZONTAL SCROLL CARDS (KART 2 içi)
   Dikey scroll'u yakalar → yatay kayan bölüm kartları.
   Tüm 10 kart ekran genişliğine göre boyutlanır.
───────────────────────────────────────────────────────── */
const HorizScrollCards = ({ items, navigate, cardRef, topPx }) => {
  const xMV = useRef(motionValue(0)).current;
  const progressMV = useRef(motionValue(0)).current;
  const xSpring = useSpring(xMV, { stiffness: 50, damping: 18, restDelta: 0.5 });

  useEffect(() => {
    let xVal = 0;

    const getAbsoluteTop = (el) => {
      let top = 0;
      while (el) { top += el.offsetTop; el = el.offsetParent; }
      return top;
    };

    const getMetrics = () => {
      const vw = window.innerWidth;
      const padPx = vw * 0.12;
      const visibleW = vw - padPx;
      /* Kart genişliği: görünür alanın ~%20'si, 150-240 arası */
      const cw = Math.round(Math.min(240, Math.max(150, visibleW * 0.20)));
      const gap = Math.round(Math.max(14, vw * 0.064));
      const totalW = (cw + gap) * 10 - gap;
      const maxShift = Math.max(totalW - visibleW, 0);
      return { cw, gap, maxShift };
    };

    const onWheel = (e) => {
      const el = cardRef?.current;
      if (!el) return;

      const absTop = getAbsoluteTop(el);
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      /* sticky başlangıç/bitiş noktaları */
      const enterY = absTop - topPx;
      const exitY = absTop + el.offsetHeight - vh;

      if (scrollY < enterY - 2 || scrollY > exitY + 2) {
        window.__horizScrollActive = false;
        return;
      }

      const { maxShift } = getMetrics();
      if (xVal >= 0 && e.deltaY < 0) { window.__horizScrollActive = false; return; }
      if (xVal <= -maxShift && e.deltaY > 0) { window.__horizScrollActive = false; return; }

      e.preventDefault();
      window.__horizScrollActive = true;
      xVal = Math.max(-maxShift, Math.min(0, xVal - e.deltaY * 1.2));
      xMV.set(xVal);
      progressMV.set(maxShift > 0 ? -xVal / maxShift : 0);
    };

    const onScroll = () => {
      const el = cardRef?.current;
      if (!el) return;
      const absTop = getAbsoluteTop(el);
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const enterY = absTop - topPx;
      const exitY = absTop + el.offsetHeight - vh;
      if (scrollY < enterY - 2 || scrollY > exitY + 2) window.__horizScrollActive = false;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.__horizScrollActive = false;
    };
  }, [xMV, progressMV, cardRef, topPx]);

  /* Render-time metrics */
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const padPx = vw * 0.12;
  const visibleW = vw - padPx;
  const cw = Math.round(Math.min(240, Math.max(150, visibleW * 0.20)));
  const gap = Math.round(Math.max(14, vw * 0.015));
  const cardH = Math.round(Math.min(300, Math.max(200, (typeof window !== 'undefined' ? window.innerHeight : 700) * 0.40)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Kaydırılabilir kart alanı */}
      <div style={{ overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <motion.div style={{ display: 'flex', gap, x: xSpring, width: 'max-content', paddingRight: 32 }}>
          {items.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/programs/v2/${encodeURIComponent(p.name)}`)}
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.09)' }}
              style={{
                width: cw, height: cardH,
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 20, padding: 20,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                flexShrink: 0, backdropFilter: 'blur(8px)', cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: Math.round(cw * 0.24),
                fontWeight: 800, color: T.brown, opacity: 0.28,
                fontFamily: '"Playfair Display", serif', lineHeight: 1,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 style={{
                  fontSize: Math.max(12, Math.round(cw * 0.068)),
                  fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3,
                }}>{p.name}</h4>
                <p style={{ color: T.brownLight, fontSize: 11.5, fontWeight: 600 }}>
                  {p.count.toLocaleString('tr-TR')} Öğrenci
                </p>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, marginTop: 2 }}>
                  %{p.percentage}
                </p>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.12em', color: 'rgba(255,255,255,0.36)',
                borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10,
              }}>
                Detayları Gör <ArrowUpRight size={10} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div style={{ paddingTop: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Aşağı kaydırarak gezin
          </span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>10 bölüm</span>
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div style={{
            height: '100%', originX: 0, scaleX: progressMV,
            background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`, borderRadius: 1,
          }} />
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
  const words = ['Veri', 'Analiz'];
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 2), 3200);
    return () => clearInterval(id);
  }, []);
  const fs = isMobile ? 'clamp(44px,12vw,68px)' : 'clamp(60px,8vw,108px)';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.12em', lineHeight: 1 }}>
      {'İhamer'.split('').map((ch, ci) => (
        <motion.span key={ci}
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 + ci * 0.055, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', fontSize: fs, fontWeight: 800, lineHeight: 1, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.navy, letterSpacing: '-0.03em' }}
        >{ch}</motion.span>
      ))}
      <div style={{ display: 'inline-block', overflow: 'hidden', right: "0.1em", height: isMobile ? 'clamp(44px,12vw,68px)' : 'clamp(60px,8vw,108px)', verticalAlign: 'bottom' }}>
        <AnimatePresence mode="wait">
          <motion.span key={phase}
            initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block', fontSize: fs, fontWeight: 800, marginRight: "0.1em", lineHeight: 1, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: phase === 0 ? T.brown : T.navyMid, letterSpacing: '-0.03em', paddingLeft: '0.12em' }}
          >{words[phase]}</motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   DIVIDER
───────────────────────────────────────────────────────── */
const Divider = ({ color, delay = 0, width = '55%' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const c = color || T.brown;
  return (
    <div ref={ref} style={{ position: 'relative', height: 2, width, marginTop: 8 }}>
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', inset: 0, originX: 0, background: `linear-gradient(90deg, ${c}, ${c}55 60%, transparent)`, borderRadius: 1 }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────────────────── */
const SectionHeading = ({ label, children, color, align = 'left', delay = 0, dark = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const c = color || T.brown;
  const textColor = dark ? '#fff' : T.navy;
  const justify = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  return (
    <div ref={ref} style={{ textAlign: align, marginBottom: 48 }}>
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay, ease: 'easeOut' }}
          style={{ fontSize: 10, fontWeight: 700, color: c, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}
        >{label}</motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: delay + 0.08, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: textColor, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1.1, letterSpacing: '-0.02em', display: 'inline-block' }}
      >{children}</motion.h2>
      <div style={{ display: 'flex', justifyContent: justify }}>
        <Divider color={c} delay={delay + 0.2} width="60%" />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   CARD
───────────────────────────────────────────────────────── */
const Card = ({ children, delay = 0, accent, style = {}, dark = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hov, setHov] = useState(false);
  const ac = accent || T.brown;
  const bg = dark ? 'rgba(255,255,255,0.06)' : T.bgCard;
  const borderBase = dark ? 'rgba(255,255,255,0.10)' : T.borderCard;
  const borderHov = dark ? ac + '55' : ac + '30';
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`, height: '100%', ...style }}>
      <div
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ background: bg, border: `1px solid ${hov ? borderHov : borderBase}`, borderRadius: 18, padding: '24px 22px', position: 'relative', overflow: 'hidden', boxShadow: hov ? `0 12px 40px ${dark ? 'rgba(0,0,0,0.5)' : T.shadowMd}, 0 0 0 1px ${ac}22` : `0 2px 12px ${dark ? 'rgba(0,0,0,0.25)' : T.shadow}`, transition: 'box-shadow 0.3s, border-color 0.3s', height: '100%' }}
      >
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${ac}55, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', top: 16, right: 18, width: 6, height: 6, borderRadius: '50%', background: ac, opacity: hov ? 0.6 : 0.2, transition: 'opacity 0.3s' }} />
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   STAT NUMBER
───────────────────────────────────────────────────────── */
const StatNum = ({ value, color, size = 52 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.p ref={ref}
      initial={{ opacity: 0, scale: 0.75 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
      style={{ fontSize: size, fontWeight: 800, color, lineHeight: 1, fontFamily: '"Playfair Display", serif', letterSpacing: '-0.03em' }}
    >{value}</motion.p>
  );
};

/* ─────────────────────────────────────────────────────────
   REVEAL
───────────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   UNIV ROW — stamp cascade
───────────────────────────────────────────────────────── */
const UnivRow = ({ item, index, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-24px' });
  const [hov, setHov] = useState(false);
  const isTop3 = index < 3;
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ type: 'spring', stiffness: 75, damping: 16, delay: index * 0.06 }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '13px 16px 13px 14px', borderRadius: 14, cursor: 'pointer',
          background: hov ? T.bgDeep : T.bgCard,
          border: `1px solid ${hov ? T.brown + '33' : T.borderCard}`,
          boxShadow: hov ? `0 8px 28px ${T.shadowMd}` : `0 2px 8px ${T.shadow}`,
          transform: hov ? 'translateX(5px)' : 'translateX(0)',
          transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.22s',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ scale: 2.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 240, damping: 18, delay: index * 0.06 + 0.15 }}
          style={{
            width: 46, height: 46, flexShrink: 0, borderRadius: 12,
            background: isTop3 ? `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)` : T.bgDeep,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, fontFamily: '"Playfair Display", serif',
            color: isTop3 ? '#fff' : T.textMuted,
            boxShadow: isTop3 ? `0 4px 14px ${T.navy}44` : 'none',
          }}
        >{index + 1}</motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{item.name}</p>
          {item.city && <p style={{ fontSize: 10.5, color: T.textMuted }}>{item.city}</p>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 21, fontWeight: 800, color: hov ? T.brown : T.navy, fontFamily: '"Playfair Display", serif', lineHeight: 1, transition: 'color 0.2s' }}>
            {item.count?.toLocaleString('tr-TR')}
          </p>
          <p style={{ fontSize: 10, color: T.textMuted, marginTop: 2 }}>%{item.percentage}</p>
        </div>
        <motion.div
          animate={{ height: hov ? 44 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 3, borderRadius: '2px 0 0 2px', background: `linear-gradient(180deg, ${T.brown}, ${T.brownLight})`, overflow: 'hidden' }}
        />
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
  const kart2Ref = useRef(null);   /* KART 2 — HorizScrollCards için */

  const vw = useWidth();
  const isMobile = vw < 640;
  const isTablet = vw < 900;

  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  useSmoothScroll(isMobile);

  /* DATA */
  useEffect(() => {
    if (!data?.length) return;
    const ihl23 = calculateTotalIHLStudents(data, '2023');
    const ihl24 = calculateTotalIHLStudents(data, '2024');
    const ihl25 = calculateTotalIHLStudents(data, '2025');
    const tot = yr => data.filter(r => r.year === yr).reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);
    const tot23 = tot('2023'), tot24 = tot('2024'), tot25 = tot('2025');
    const cities = groupByCity(data, '2025');
    setStats({
      ihl: { 2023: ihl23, 2024: ihl24, 2025: ihl25 },
      tot: { 2023: tot23, 2024: tot24, 2025: tot25 },
      pct: {
        2023: tot23 > 0 ? ((ihl23 / tot23) * 100).toFixed(2) : '0',
        2024: tot24 > 0 ? ((ihl24 / tot24) * 100).toFixed(2) : '0',
        2025: tot25 > 0 ? ((ihl25 / tot25) * 100).toFixed(2) : '0',
      },
      univ: new Set(data.map(r => r.university_name)).size,
      prog: new Set(data.map(r => normalizeProgramName(r.program_name))).size,
      topCities: [...groupByCity(data, '2025')].sort((a, b) => b.count - a.count).slice(0, 15),
      topCityPct: [...groupByCity(data, '2025')].sort((a, b) => b.percentage - a.percentage).filter(c => c.city !== 'BOSNA-HERSEK').slice(0, 15),
      topUniv: [...groupByUniversity(data, '2025')].sort((a, b) => b.count - a.count).slice(0, 10),
      topProg: [...groupByProgram(data, '2025')].filter(p => !isAcikogretim(p.name, '')).sort((a, b) => b.count - a.count).slice(0, 10),
      cities,
    });
  }, [data]);

  /* HERO PARALLAX */
  const heroScale = useTransform(smoothProgress, [0, 0.12], [1, 0.82]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const heroBlur = useTransform(smoothProgress, [0, 0.12], ['blur(0px)', 'blur(20px)']);

  if (!stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }} />
        <p style={{ fontSize: 13, color: T.textMuted }}>Veriler yükleniyor…</p>
      </div>
    );
  }

  const trend = calculateTrend(stats.ihl[2025], stats.ihl[2024]);
  const secPad = isMobile ? '72px 5vw 64px' : '100px 6vw 96px';
  const tipStyle = { backgroundColor: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 10, color: T.text, fontSize: 12, boxShadow: `0 4px 16px ${T.shadow}` };
  const KART2_TOPPX = 2 * STACK_GAP;

  return (
    <div ref={containerRef} style={{ background: T.bg, color: T.text, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* ══ HERO ══ */}
      <section style={{ height: isMobile ? '100vh' : '160vh', position: 'relative', zIndex: 3 }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <motion.div style={{
            height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: isMobile ? '0 5vw' : '0 6vw',
            scale: heroScale, opacity: heroOpacity, filter: heroBlur,
            position: 'relative', overflow: 'hidden', background: T.bg,
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 60% at 80% 40%, ${T.brownPale} 0%, transparent 65%)` }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.5 }} />
            <div style={{ position: 'absolute', left: isMobile ? '4vw' : '5vw', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />
            <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-52%)', fontSize: '38vw', fontWeight: 800, color: T.navy, opacity: 0.025, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>İ</div>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
              <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
                İHL Mezunları · 2023 — 2025 · YÖK Atlas
              </motion.p>
              <CyclingTitle isMobile={isMobile} />
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 2, width: isMobile ? '70%' : '50%', originX: 0, marginTop: 22, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`, borderRadius: 1 }} />
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: 15, color: T.textSub, marginTop: 24, lineHeight: 1.8, maxWidth: 460 }}>
                İmam Hatip Lisesi mezunlarının üniversiteye yerleşim verileri.
                Şehirden şehire, bölümden fakülteye kapsamlı analiz.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.8 }}
                style={{ display: 'flex', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
                {[
                  { label: 'İHL Öğrencisi · 2025', value: stats.ihl[2025].toLocaleString('tr-TR'), color: T.navy },
                  { label: 'Oran', value: `%${stats.pct[2025]}`, color: T.brown },
                  { label: 'Üniversite', value: String(stats.univ), color: T.navyMid },
                ].map((s, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: T.textMuted, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 26, fontWeight: 800, fontFamily: '"Playfair Display", serif', color: s.color, lineHeight: 1 }}>{s.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
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

      {/* ══ STICKY CARD STACK ══ */}

      {/* KART 0 : GENEL BAKIŞ */}
      <StackCard index={0} bg={T.bgDeep} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Özet" color={T.brown}>Genel Bakış</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.5fr 1fr 1fr', gap: 16 }}>
            <div style={{ gridRow: isTablet ? 'auto' : '1 / 3' }}>
              <Card delay={0.05} accent={T.navy} style={{ height: isTablet ? 'auto' : '100%' }}>
                <p style={{ fontSize: 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Toplam İHL Öğrencisi · 2025</p>
                <StatNum value={stats.ihl[2025].toLocaleString('tr-TR')} color={T.navy} size={isMobile ? 44 : 58} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12 }}>
                  {trend.direction === 'up' ? <TrendingUp size={14} color="#22a55e" /> : <TrendingDown size={14} color="#d94040" />}
                  <span style={{ fontSize: 14, fontWeight: 700, color: trend.direction === 'up' ? '#22a55e' : '#d94040' }}>%{trend.percentage}</span>
                  <span style={{ fontSize: 12, color: T.textMuted }}>2024'e göre</span>
                </div>
                <div style={{ marginTop: 18, padding: '11px 13px', borderRadius: 10, background: T.brownPale, border: `1px solid ${T.brown}22`, display: 'flex', gap: 9 }}>
                  <Info size={13} color={T.brown} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 12.5, color: T.textSub, lineHeight: 1.7 }}>
                    Toplam <strong style={{ color: T.navy }}>{stats.tot[2025].toLocaleString('tr-TR')}</strong> yerleşmeden{' '}
                    <strong style={{ color: T.brown }}>{stats.ihl[2025].toLocaleString('tr-TR')}</strong>'i İHL mezunu.
                  </p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <p style={{ fontSize: 9.5, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Trend 2023 → 2025</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 54 }}>
                    {[2023, 2024, 2025].map((yr, i) => {
                      const mx = Math.max(stats.ihl[2023], stats.ihl[2024], stats.ihl[2025]);
                      const h = (stats.ihl[yr] / mx) * 46;
                      return (
                        <div key={yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                          <motion.div initial={{ height: 0 }} whileInView={{ height: h }} viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.12 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{ width: '100%', borderRadius: '3px 3px 0 0', background: i === 2 ? `linear-gradient(180deg, ${T.navy}, ${T.navyMid})` : `${T.navy}22` }} />
                          <span style={{ fontSize: 9, color: T.textMuted }}>{yr}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
            <Card delay={0.13} accent={T.brown}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Üniversite</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.brownPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color={T.brown} /></div>
                <StatNum value={String(stats.univ)} color={T.brown} size={50} />
              </div>
              <p style={{ fontSize: 13, color: T.textSub, marginTop: 10 }}>Farklı üniversite</p>
            </Card>
            <Card delay={0.2} accent={T.navy}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Program</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.navy}0e`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={16} color={T.navy} /></div>
                <StatNum value={String(stats.prog)} color={T.navy} size={50} />
              </div>
              <p style={{ fontSize: 13, color: T.textSub, marginTop: 10 }}>Farklı program</p>
            </Card>
            <Card delay={0.26} accent={T.brown}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Oran 2025</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.brownPale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} color={T.brown} /></div>
                <StatNum value={`%${stats.pct[2025]}`} color={T.brown} size={44} />
              </div>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 10 }}>2024: %{stats.pct[2024]} · 2023: %{stats.pct[2023]}</p>
            </Card>
            <Card delay={0.32} accent={T.navy}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Yıllık Değişim</p>
              {['2024', '2025'].map((yr) => {
                const prevYr = String(Number(yr) - 1);
                const tr = calculateTrend(parseFloat(stats.pct[yr]), parseFloat(stats.pct[prevYr]));
                return (
                  <div key={yr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${T.borderCard}` }}>
                    <span style={{ fontSize: 22, fontWeight: 700, fontFamily: '"Playfair Display", serif', color: T.navy }}>{yr}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {tr.direction === 'up' ? <TrendingUp size={13} color="#22a55e" /> : <TrendingDown size={13} color="#d94040" />}
                      <span style={{ fontSize: 14, fontWeight: 700, color: tr.direction === 'up' ? '#22a55e' : '#d94040' }}>{tr.direction === 'up' ? '+' : '-'}%{tr.percentage}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </StackCard>

      {/* KART 1 : YILLIK ORAN */}
      <StackCard index={1} bg={T.bg} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Karşılaştırma" color={T.navy} align="center">Yıllara Göre İHL Mezunu Oranı</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {['2023', '2024', '2025'].map((yr, i) => {
              const prevYr = String(Number(yr) - 1);
              const tr = yr !== '2023' ? calculateTrend(parseFloat(stats.pct[yr]), parseFloat(stats.pct[prevYr])) : null;
              const isLatest = i === 2;
              return (
                <Card key={yr} delay={i * 0.11} accent={isLatest ? T.brown : T.navy}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{yr}</p>
                  <motion.p initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                    style={{ fontSize: 'clamp(48px,7vw,72px)', fontWeight: 800, lineHeight: 1, marginTop: 6, fontFamily: '"Playfair Display", serif', color: isLatest ? T.brown : T.navy, letterSpacing: '-0.04em' }}>
                    %{stats.pct[yr]}
                  </motion.p>
                  <p style={{ fontSize: 13, color: T.textSub, marginTop: 10 }}>
                    <strong style={{ color: T.text }}>{stats.ihl[yr].toLocaleString('tr-TR')}</strong> / {stats.tot[yr].toLocaleString('tr-TR')}
                  </p>
                  {tr && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {tr.direction === 'up' ? <TrendingUp size={13} color="#22a55e" /> : <TrendingDown size={13} color="#d94040" />}
                      <span style={{ fontSize: 13, fontWeight: 700, color: tr.direction === 'up' ? '#22a55e' : '#d94040' }}>{tr.direction === 'up' ? '+' : '-'}%{tr.percentage}</span>
                      <span style={{ fontSize: 11, color: T.textMuted }}>önceki yıla göre</span>
                    </div>
                  )}
                  <div style={{ marginTop: 18, height: 2, borderRadius: 1, background: isLatest ? `linear-gradient(90deg, ${T.brown}, ${T.brownLight}66, transparent)` : `${T.navy}18` }} />
                </Card>
              );
            })}
          </div>
        </div>
      </StackCard>

      {/* KART 2 : TOP BÖLÜMLER — yatay scroll hijack */}
      <StackCard
        ref={kart2Ref}
        index={2}
        bg={T.navy}
        padding={isMobile ? '60px 5vw 48px' : '48px 6vw 36px'}
        isMobile={isMobile}
        overflowHidden
        fixedHeight
      >
        {/* Arka plan desenleri */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, #fff 71px, #fff 72px)` }} />
        <div style={{ position: 'absolute', right: '-4%', top: '50%', transform: 'translateY(-52%)', fontSize: '40vw', fontWeight: 800, color: '#fff', opacity: 0.018, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>B</div>

        {/* İçerik: flex column, tam yükseklik */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Başlık */}
          <div style={{ flexShrink: 0, marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: T.brown, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 18, height: 1.5, background: T.brown, borderRadius: 1 }} />
              Sıralamalar · 2025
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 42px)', fontWeight: 700, color: '#fff', fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
              Top 10 Bölüm
            </h2>
          </div>

          {isMobile ? (
            /* Mobil: dikey liste */
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.topProg.map((p, i) => (
                <Card key={i} delay={i * 0.04} accent={T.brown} dark>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: T.brown, opacity: 0.35, fontFamily: '"Playfair Display", serif', lineHeight: 1, width: 44, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: T.brownLight, marginTop: 3 }}>{p.count.toLocaleString('tr-TR')} öğrenci · %{p.percentage}</p>
                    </div>
                    <div onClick={() => navigate(`/programs/v2/${encodeURIComponent(p.name)}`)} style={{ cursor: 'pointer', opacity: 0.6, flexShrink: 0 }}><ArrowUpRight size={16} color="#fff" /></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop/Tablet: yatay scroll hijack */
            <HorizScrollCards
              items={stats.topProg}
              navigate={navigate}
              cardRef={kart2Ref}
              topPx={KART2_TOPPX}
            />
          )}
        </div>
      </StackCard>

      {/* KART 3 : TOP ÜNİVERSİTELER */}
      <StackCard index={3} bg={T.bgDeep} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Sıralamalar · 2025" color={T.brown} align="right">Top 10 Üniversite</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 10 }}>
            {stats.topUniv.map((item, i) => (
              <UnivRow key={i} item={item} index={i} onClick={() => navigate(`/universities/v2/${encodeURIComponent(item.name)}`)} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.55, duration: 0.65 }}
            style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, background: T.bgCard, border: `1px solid ${T.borderCard}`, flexWrap: 'wrap' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: T.brownPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={15} color={T.brown} /></div>
            <p style={{ flex: 1, fontSize: 12.5, color: T.textSub, lineHeight: 1.6 }}>Listede yer alan <strong style={{ color: T.navy }}>10 üniversite</strong>, 2025 yılında İHL mezunu yerleşiminin büyük bölümünü oluşturmaktadır.</p>
            <motion.div whileHover={{ x: 4 }} onClick={() => navigate('/universities/v2')}
              style={{ cursor: 'pointer', color: T.brown, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
              Tümünü Gör <ArrowUpRight size={13} />
            </motion.div>
          </motion.div>
        </div>
      </StackCard>

      {/* KART 4 : ŞEHİR DAĞILIMLARI */}
      <StackCard index={4} bg={T.bg} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Coğrafi Analiz" color={T.navy}>Şehir Dağılımları</SectionHeading></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
            <Card delay={0.07} accent={T.navy}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.navy, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>En Çok Öğrenci · İlk 15 Şehir</p>
              <Divider color={T.navy} width="54%" />
              <div style={{ marginTop: 16 }}>
                <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
                  <BarChart data={stats.topCities} margin={{ bottom: isMobile ? 64 : 52, left: -18 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false} />
                    <XAxis
                      dataKey="city"
                      angle={-45}
                      textAnchor="end"
                      height={isMobile ? 80 : 72}
                      interval={0}
                      tick={{ fontSize: isMobile ? 8.5 : 10.5, fill: T.textMuted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 8.5 : 10.5, fill: T.textMuted }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tipStyle} formatter={v => [v.toLocaleString('tr-TR'), 'Öğrenci']} />
                    <Bar dataKey="count" fill={T.navy} radius={[4, 4, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card delay={0.17} accent={T.brown}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.brown, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>En Yüksek Oran · İlk 15 Şehir</p>
              <Divider color={T.brown} width="54%" />
              <div style={{ marginTop: 16 }}>
                <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
                  <BarChart data={stats.topCityPct} margin={{ bottom: isMobile ? 64 : 52, left: -18 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false} />
                    <XAxis
                      dataKey="city"
                      angle={-45}
                      textAnchor="end"
                      height={isMobile ? 80 : 72}
                      interval={0}
                      tick={{ fontSize: isMobile ? 8.5 : 10.5, fill: T.textMuted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 8.5 : 10.5, fill: T.textMuted }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tipStyle} formatter={v => [`%${v}`, 'Oran']} />
                    <Bar dataKey="percentage" fill={T.brown} radius={[4, 4, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: isMobile ? 10 : 11, fontStyle: 'italic', color: T.textMuted, marginTop: 8 }}>* Kontenjan Sayısına Göre En Yüksek Oranlar</p>
              </div>
            </Card>
          </div>
        </div>
      </StackCard>

      {/* KART 5 : HARİTA */}
      <StackCard index={5} bg={T.bgDeep} padding={secPad} isMobile={isMobile}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <Reveal><SectionHeading label="Coğrafi Görünüm" color={T.brown}>Türkiye Haritası · 2025</SectionHeading></Reveal>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <Card delay={0} accent={T.navy}>
              <p style={{ fontSize: 13, color: T.textSub, marginBottom: 18, lineHeight: 1.8 }}>
                Bir şehre geldiğinizde İHL mezunu öğrenci sayısını görebilirsiniz. Tıklayarak o ilin üniversitelerini görüntüleyin.
              </p>
              <TurkeyMap citiesData={stats.cities} data={data} />
            </Card>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginTop: 16 }}>
          </div>
        </div>
      </StackCard>

      {/* FOOTER */}
  {/*     <footer style={{ padding: isMobile ? '18px 5vw' : '22px 6vw', background: T.sidebar, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.textInv, opacity: 0.75 }}>
            İhamer Veri &amp; Analiz · YÖK Atlas 2023–2025
          </span>
        </div>
        <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`, borderRadius: 1 }} />
      </footer> */}
    </div>
  );
};

export default Overview;