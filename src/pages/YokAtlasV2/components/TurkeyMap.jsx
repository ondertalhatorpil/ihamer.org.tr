import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { interpolateRgb } from 'd3-interpolate';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, Building2, ChevronRight, GraduationCap, MapPin, BarChart2, Percent, TrendingUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const T = {
  bg:'#faf8f5', bgDeep:'#f4f1ec', bgCard:'#ffffff',
  navy:'#1a2744', navyMid:'#2d4070', navyLight:'#3d5494',
  brown:'#8b5e3c', brownLight:'#c49a6c', brownPale:'#fdf3e8',
  gold:'#d4a853', text:'#1e1e1e', textSub:'#3d3d3d', textMuted:'#8a8a8a',
  border:'#e8e2d9', borderCard:'#ede8e0',
  shadow:'rgba(26,39,68,0.07)', shadowMd:'rgba(26,39,68,0.13)',
  sidebar:'#1a2744',
};

const MAP = {
  empty:'#ddd8ce', c1:'#f5e0c8', c2:'#e8a96a', c3:'#c4622a', c4:'#8b2020', c5:'#1a2744',
  hover:'#d4a853', stroke:'#ffffff',
};

const TURKEY_GEOJSON =
  'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/turkey.geojson';

const normalizeCity = (name) => {
  if (!name) return '';
  return name.toUpperCase()
    .replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ş/g,'S')
    .replace(/İ/g,'I').replace(/I/g,'I')
    .replace(/Ö/g,'O').replace(/Ç/g,'C').trim();
};

const SPECIAL = {
  'AFYON':'AFYONKARAHISAR',
  'K.MARAS':'KAHRAMANMARAS','KMARAS':'KAHRAMANMARAS',
  'K MARAS':'KAHRAMANMARAS','MARAS':'KAHRAMANMARAS',
  'S.URFA':'SANLIURFA','SURFA':'SANLIURFA',
  'S URFA':'SANLIURFA','URFA':'SANLIURFA',
};

const logNorm = (val, min, max) => {
  if (val <= 0 || max <= min) return 0;
  const lv = Math.log(Math.max(val,1));
  const lmin = Math.log(Math.max(min,1));
  const lmax = Math.log(Math.max(max,1));
  return lmax > lmin ? (lv - lmin) / (lmax - lmin) : 0;
};

const getMapColor = (t) => {
  if (t <= 0)   return MAP.empty;
  if (t < 0.2)  return interpolateRgb(MAP.c1, MAP.c2)(t / 0.2);
  if (t < 0.45) return interpolateRgb(MAP.c2, MAP.c3)((t - 0.2) / 0.25);
  if (t < 0.72) return interpolateRgb(MAP.c3, MAP.c4)((t - 0.45) / 0.27);
  return          interpolateRgb(MAP.c4, MAP.c5)((t - 0.72) / 0.28);
};

/* Hook for detecting mobile */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

/* ── ANIMATED COUNTER (mini) ── */
const MiniCounter = ({ target, color = '#fff', size = 22, duration = 1.2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = typeof target === 'number' ? target : parseInt(String(target).replace(/\D/g, ''), 10);
    if (isNaN(num)) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(num * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return (
    <span ref={ref} style={{ fontSize: size, fontWeight: 800, color, lineHeight: 1,
      fontFamily: '"Playfair Display", "Cormorant Garamond", serif' }}>
      {val.toLocaleString('tr-TR')}
    </span>
  );
};

/* ── DIVIDER ── */
const Divider = ({ color = T.brown, delay = 0, width = '50%' }) => (
  <div style={{ position:'relative', height:2, width, marginTop:8 }}>
    <motion.div
      initial={{ scaleX:0 }} animate={{ scaleX:1 }}
      transition={{ duration:0.9, delay, ease:[0.22,1,0.36,1] }}
      style={{ position:'absolute', inset:0, originX:0,
        background:`linear-gradient(90deg, ${color}, ${color}55 60%, transparent)`,
        borderRadius:1 }}
    />
  </div>
);

/* ── FLOATING MAP PARTICLES ── */
const MapParticles = ({ count = 12 }) => {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80,
    size: 2 + Math.random() * 3, dur: 10 + Math.random() * 16, delay: Math.random() * -15,
  })), [count]);
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:1, borderRadius:18 }}>
      {particles.map(p => (
        <motion.div key={p.id}
          animate={{ y:[0,-25,0,20,0], opacity:[0.08,0.22,0.12,0.18,0.08] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.delay, ease:'easeInOut' }}
          style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
            width:p.size, height:p.size, borderRadius:'50%', background:T.brown }}
        />
      ))}
    </div>
  );
};

/* ── LEGEND ── */
const LegendBar = ({ maxCount, isMobile }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const stops = isMobile ? [0, 0.5, 1] : [0, 0.2, 0.45, 0.72, 1];
  return (
    <div ref={ref} style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center', width: '100%' }}>
      <div style={{ position:'relative', width: isMobile ? '100%' : 320, maxWidth:'100%' }}>
        <motion.div
          initial={{ scaleX:0, opacity:0 }}
          animate={inView ? { scaleX:1, opacity:1 } : {}}
          transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
          style={{
            height: isMobile ? 10 : 14, borderRadius: isMobile ? 5 : 7, overflow:'hidden', originX:0,
            background:`linear-gradient(90deg, ${MAP.empty} 0%, ${MAP.c1} 8%, ${MAP.c2} 28%, ${MAP.c3} 52%, ${MAP.c4} 75%, ${MAP.c5} 100%)`,
            border:`1px solid ${T.border}`,
            boxShadow:`inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px ${T.shadow}`,
          }}
        />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
          {stops.map((s, i) => {
            const rawVal = s === 0 ? 0 : Math.round(Math.exp(Math.log(Math.max(maxCount,1)) * s));
            const isMax = i === stops.length - 1;
            return (
              <motion.div key={i}
                initial={{ opacity:0, y:6 }}
                animate={inView ? { opacity:1, y:0 } : {}}
                transition={{ delay:0.4 + i * 0.08, duration:0.5 }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                <div style={{ width:1, height: isMobile ? 3 : 5, background: isMax ? T.navy : T.border }} />
                <span style={{ fontSize: isMobile ? 8 : 9.5, fontVariantNumeric:'tabular-nums',
                  color: isMax ? T.navy : T.textMuted, fontWeight: isMax ? 700 : 400 }}>
                  {rawVal === 0 ? '0' : rawVal >= 1000 ? `${(rawVal/1000).toFixed(1)}k` : rawVal}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div style={{ display:'flex', gap: isMobile ? 10 : 16, alignItems:'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width: isMobile ? 10 : 12, height: isMobile ? 10 : 12, borderRadius:3, background:MAP.empty, border:`1px solid ${T.border}` }} />
          <span style={{ fontSize: isMobile ? 9 : 10, color:T.textMuted }}>Veri yok</span>
        </div>
        <div style={{ width:1, height:10, background:T.border }} />
        <span style={{ fontSize: isMobile ? 9 : 10, color:T.textMuted, fontStyle:'italic' }}>Logaritmik ölçek</span>
      </div>
    </div>
  );
};

/* ── UNIV ROW — enhanced with ranking medal + animated bar ── */
const UnivRow = ({ univ, index, onNavigate, totalCount, isMobile }) => {
  const [hov, setHov] = useState(false);
  const barW = totalCount > 0 ? Math.min((univ.count / totalCount) * 100, 100) : 0;
  const isTop3 = index < 3;
  const medals = ['#C9A84C', '#A8A8A8', '#B87333'];

  return (
    <motion.div
      initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
      transition={{ delay:index*0.04, duration:0.42, ease:[0.22,1,0.36,1] }}
      onClick={() => onNavigate(univ.name)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: isMobile ? '10px 12px' : '13px 16px', 
        borderRadius: isMobile ? 12 : 14, 
        cursor:'pointer', 
        marginBottom: isMobile ? 4 : 6,
        background: hov ? T.bgDeep : 'transparent',
        border:`1px solid ${hov ? T.brown+'30' : T.borderCard}`,
        transition:'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        boxShadow: hov ? `0 8px 24px ${T.shadow}, 0 0 0 1px ${T.brown}10` : 'none',
        transform: hov ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap: isMobile ? 8 : 12 }}>
        {/* Rank badge */}
        <div style={{
          width: isMobile ? 28 : 34, 
          height: isMobile ? 28 : 34, 
          flexShrink:0, 
          borderRadius: isMobile ? 8 : 10,
          display:'flex', alignItems:'center', justifyContent:'center',
          background: isTop3
            ? `linear-gradient(135deg, ${medals[index]}22, ${medals[index]}11)`
            : `${T.navy}08`,
          color: isTop3 ? medals[index] : T.textMuted,
          fontSize: isMobile ? 12 : 14, 
          fontWeight:800,
          fontFamily:'"Playfair Display", "Cormorant Garamond", serif',
          border: isTop3 ? `1.5px solid ${medals[index]}44` : `1px solid ${T.borderCard}`,
          boxShadow: isTop3 ? `0 2px 8px ${medals[index]}22` : 'none',
        }}>{index+1}</div>

        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ 
            fontSize: isMobile ? 11 : 13, 
            fontWeight:600, 
            lineHeight:1.35,
            overflow:'hidden', 
            textOverflow:'ellipsis', 
            whiteSpace:'nowrap',
            color: hov ? T.brown : T.text, 
            transition:'color 0.2s' 
          }}>{univ.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap: isMobile ? 5 : 7, marginTop: isMobile ? 2 : 4 }}>
            <span style={{ 
              fontSize: isMobile ? 8 : 9, 
              fontWeight:600, 
              letterSpacing:'0.05em',
              padding: isMobile ? '1px 5px' : '2px 8px', 
              borderRadius:4,
              background: univ.type === 'Devlet' ? `${T.navy}10` : `${T.brown}10`,
              color: univ.type === 'Devlet' ? T.navyMid : T.brown,
            }}>{univ.type}</span>
            <span style={{ fontSize: isMobile ? 9 : 10, color:T.textMuted }}>{univ.programCount} program</span>
          </div>
        </div>

        <div style={{ textAlign:'right', flexShrink:0 }}>
          <p style={{ 
            fontSize: isMobile ? 16 : 22, 
            fontWeight:800, 
            lineHeight:1,
            fontFamily:'"Playfair Display", "Cormorant Garamond", serif',
            color: hov ? T.brown : T.navy, 
            transition:'color 0.2s' 
          }}>
            {univ.count.toLocaleString('tr-TR')}
          </p>
          <p style={{ fontSize: isMobile ? 9 : 10, color:T.textMuted, marginTop:1 }}>%{univ.percentage}</p>
        </div>

        <ChevronRight size={isMobile ? 12 : 14} color={hov ? T.brown : T.textMuted}
          style={{ flexShrink:0, transition:'all 0.25s',
            transform: hov ? 'translateX(3px)' : 'translateX(0)',
            opacity: hov ? 1 : 0.5 }} />
      </div>

      {/* Animated progress bar */}
      <div style={{ marginTop: isMobile ? 6 : 10, height: isMobile ? 2 : 3, borderRadius:2, background:`${T.border}88`, overflow:'hidden' }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width: `${barW * 0.8}%` }}
          transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
          style={{ height:'100%', borderRadius:2,
            background: isTop3
              ? `linear-gradient(90deg, ${medals[index]}, ${T.gold})`
              : `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`,
          }}
        />
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   TOOLTIP — hidden on mobile, shown on desktop hover
══════════════════════════════════════════════════════════ */
const TOOLTIP_W = 230;
const TOOLTIP_H = 170;

const MapTooltip = ({ city, pos, mapRef, isMobile }) => {
  const [style, setStyle] = useState({ left:0, top:0 });

  useEffect(() => {
    if (!city || !mapRef?.current || isMobile) return;
    const rect = mapRef.current.getBoundingClientRect();
    const PAD = 14;
    let left = pos.x - rect.left + 20;
    let top  = pos.y - rect.top  - TOOLTIP_H / 2;
    if (left + TOOLTIP_W > rect.width - PAD) left = pos.x - rect.left - TOOLTIP_W - 16;
    if (top < PAD) top = PAD;
    if (top + TOOLTIP_H > rect.height - PAD) top = rect.height - TOOLTIP_H - PAD;
    setStyle({ left, top });
  }, [pos.x, pos.y, city, mapRef, isMobile]);

  // Don't show tooltip on mobile
  if (isMobile) return null;

  return (
    <AnimatePresence>
      {city && (
        <motion.div
          key={city.city}
          initial={{ opacity:0, scale:0.85, y:8 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.85, y:8 }}
          transition={{ duration:0.18, ease:[0.22,1,0.36,1] }}
          style={{
            position:'absolute', pointerEvents:'none', zIndex:50,
            left: style.left, top: style.top, width: TOOLTIP_W,
          }}
        >
          <div style={{
            background:'linear-gradient(145deg, rgba(26,39,68,0.96), rgba(18,26,52,0.98))',
            borderRadius:16, padding:'16px 20px',
            boxShadow:'0 24px 64px rgba(14,22,48,0.45), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
            backdropFilter:'blur(16px)',
            position:'relative', overflow:'hidden',
          }}>
            {/* Top shimmer */}
            <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:1,
              background:`linear-gradient(90deg, transparent, ${T.gold}88, transparent)` }} />

            {/* Subtle corner glow */}
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80,
              background:`radial-gradient(circle, ${T.brown}15, transparent 70%)`,
              pointerEvents:'none' }} />

            <p style={{ fontSize:16, fontWeight:800, color:'#fff',
              fontFamily:'"Playfair Display", "Cormorant Garamond", serif', fontStyle:'italic',
              letterSpacing:'-0.01em', marginBottom:12,
              display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:22, height:22, borderRadius:6,
                background:`linear-gradient(135deg, ${T.gold}33, ${T.brown}22)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                border:`1px solid ${T.gold}33`,
              }}>
                <MapPin size={10} color={T.gold} />
              </div>
              {city.city}
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { icon:<BarChart2 size={9} color={T.brownLight}/>, label:'Öğrenci',
                  value:city.count.toLocaleString('tr-TR'), color:'#fff' },
                { icon:<Percent size={9} color={T.gold}/>, label:'Oran',
                  value:`%${city.percentage}`, color:T.gold },
              ].map((s,i) => (
                <div key={i} style={{
                  background:'rgba(255,255,255,0.05)',
                  borderRadius:10, padding:'9px 11px',
                  border:'1px solid rgba(255,255,255,0.06)',
                  transition:'background 0.2s',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:5 }}>
                    {s.icon}
                    <span style={{ fontSize:8, color:'rgba(255,255,255,0.36)',
                      letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize:24, fontWeight:800, color:s.color, lineHeight:1,
                    fontFamily:'"Playfair Display", "Cormorant Garamond", serif' }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop:10, display:'flex', alignItems:'center', justifyContent:'center', gap:5,
              padding:'5px 0', borderTop:'1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ width:4, height:4, borderRadius:'50%', background:T.gold,
                animation:'pulse 1.5s ease-in-out infinite' }} />
              <p style={{ fontSize:8.5, color:'rgba(255,255,255,0.28)',
                letterSpacing:'0.12em', textTransform:'uppercase' }}>tıklayın · detay görün</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   MODAL — Fully responsive for all screen sizes
══════════════════════════════════════════════════════════ */
const CityModal = ({ selectedCity, onClose, navigate, isMobile }) => {
  const [windowSize, setWindowSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1200, height: typeof window !== 'undefined' ? window.innerHeight : 800 });
  
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallMobile = windowSize.width < 380;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isLandscape = windowSize.width > windowSize.height;
  
  const totalCount = useMemo(() =>
    selectedCity?.universities?.reduce((s, u) => s + u.count, 0) || 0,
  [selectedCity]);

  // Calculate optimal modal dimensions based on screen size
  const getModalStyle = () => {
    if (isMobile) {
      return {
        width: '100%',
        maxWidth: '100%',
        height: isLandscape ? '95vh' : '85vh',
        maxHeight: isLandscape ? '95vh' : '85vh',
        borderRadius: '16px 16px 0 0',
        margin: 0,
      };
    }
    if (isTablet) {
      return {
        width: '90%',
        maxWidth: 540,
        height: 'auto',
        maxHeight: '80vh',
        borderRadius: 20,
        margin: '0 auto',
      };
    }
    // Desktop
    return {
      width: '90%',
      maxWidth: 600,
      height: 'auto',
      maxHeight: '85vh',
      borderRadius: 24,
      margin: '0 auto',
    };
  };

  const modalStyle = getModalStyle();

  return (
    <AnimatePresence>
      {selectedCity && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.2 }}
          onClick={onClose}
          style={{
            position:'fixed', inset:0, zIndex:2000,
            background:'rgba(12,20,46,0.6)',
            backdropFilter:'blur(8px)',
            display:'flex', 
            alignItems: isMobile ? 'flex-end' : 'center', 
            justifyContent:'center',
            padding: isMobile ? 0 : 16,
          }}
        >
          <motion.div
            initial={{ opacity:0, y: isMobile ? '100%' : 40, scale: isMobile ? 1 : 0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y: isMobile ? '100%' : 40, scale: isMobile ? 1 : 0.95 }}
            transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background:T.bgCard, 
              borderRadius: modalStyle.borderRadius,
              width: modalStyle.width, 
              maxWidth: modalStyle.maxWidth, 
              height: 600,
              maxHeight: modalStyle.maxHeight,
              display:'flex', flexDirection:'column', overflow:'hidden',
              boxShadow:'0 25px 80px rgba(12,20,46,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            {/* HEADER - Compact */}
            <div style={{
              background:`linear-gradient(140deg, ${T.sidebar} 0%, #243561 100%)`,
              padding: isSmallMobile ? '14px 12px 12px' : isMobile ? '16px 14px 14px' : isTablet ? '18px 20px 16px' : '22px 24px 20px', 
              position:'relative', overflow:'hidden', flexShrink:0,
            }}>
              {/* Subtle gradient overlay */}
              <div style={{ position:'absolute', inset:0, opacity:0.08, pointerEvents:'none',
                background:`radial-gradient(ellipse at 80% 20%, ${T.brownLight} 0%, transparent 50%)` }} />

              {/* Bottom accent line */}
              <div style={{ position:'absolute', bottom:0, left:'10%', right:'10%', height:1,
                background:`linear-gradient(90deg, transparent, ${T.gold}44, transparent)` }} />

              {/* Mobile drag handle */}
              {isMobile && (
                <div style={{ 
                  position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                  width: 32, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)'
                }} />
              )}

              {/* Close button - Always visible and prominent */}
              <button 
                onClick={onClose}
                style={{ 
                  position: 'absolute',
                  top: isSmallMobile ? 10 : isMobile ? 12 : 16,
                  right: isSmallMobile ? 10 : isMobile ? 12 : 16,
                  width: isSmallMobile ? 28 : isMobile ? 32 : 36, 
                  height: isSmallMobile ? 28 : isMobile ? 32 : 36, 
                  borderRadius: isSmallMobile ? 8 : 10, 
                  flexShrink:0,
                  background:'rgba(255,255,255,0.12)', 
                  border:'1px solid rgba(255,255,255,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor:'pointer', 
                  transition:'all 0.2s',
                  zIndex: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
              >
                <X size={isSmallMobile ? 14 : isMobile ? 16 : 18} color="#fff" strokeWidth={2.5} />
              </button>

              {/* Title */}
              <div style={{ paddingRight: isSmallMobile ? 36 : isMobile ? 44 : 50 }}>
                <p style={{ 
                  fontSize: isSmallMobile ? 7 : isMobile ? 8 : 9, 
                  fontWeight:700, color:T.gold, letterSpacing:'0.15em',
                  textTransform:'uppercase', marginBottom: isSmallMobile ? 4 : 6,
                  display:'flex', alignItems:'center', gap:5 
                }}>
                  <MapPin size={isSmallMobile ? 9 : 10} />
                  Şehir Detayı
                </p>
                <h2 style={{ 
                  fontSize: isSmallMobile ? 22 : isMobile ? 26 : isTablet ? 30 : 34, 
                  fontWeight:800,
                  fontFamily:'"Playfair Display", serif', fontStyle:'italic',
                  color:'#fff', lineHeight:1.1, letterSpacing:'-0.02em',
                  margin: 0,
                }}>
                  {selectedCity.cityName}
                </h2>
              </div>

              {/* Stats row - Compact */}
              <div style={{ 
                display:'flex', 
                gap: isSmallMobile ? 8 : isMobile ? 12 : 16, 
                marginTop: isSmallMobile ? 12 : isMobile ? 14 : 18, 
                position:'relative', zIndex:1 
              }}>
                {[
                  { icon: BarChart2, label: 'İHL', value: selectedCity.count, isNum: true, color: '#fff' },
                  { icon: Percent, label: 'Oran', value: `%${selectedCity.percentage}`, isNum: false, color: T.gold },
                  { icon: Building2, label: 'Üniversite', value: selectedCity.universities.length, isNum: true, color: T.brownLight },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: isSmallMobile ? 8 : 10,
                    padding: isSmallMobile ? '8px 6px' : isMobile ? '10px 8px' : '12px 10px',
                    textAlign: 'center',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, marginBottom: isSmallMobile ? 2 : 4 }}>
                      <s.icon size={isSmallMobile ? 8 : 9} color={s.color} />
                      <span style={{ 
                        fontSize: isSmallMobile ? 6 : isMobile ? 7 : 8, 
                        color:'rgba(255,255,255,0.4)',
                        letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600 
                      }}>{s.label}</span>
                    </div>
                    <p style={{ 
                      fontSize: isSmallMobile ? 16 : isMobile ? 18 : isTablet ? 20 : 22, 
                      fontWeight:800, lineHeight:1,
                      fontFamily:'"Playfair Display", serif', color: s.color,
                      margin: 0,
                    }}>
                      {s.isNum ? s.value.toLocaleString('tr-TR') : s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BODY - Scrollable list */}
            <div 
              style={{ 
                padding: isSmallMobile ? '12px 10px' : isMobile ? '14px 12px' : '18px 20px', 
                overflowY:'auto', 
                flex:1, 
                minHeight: 0,
                maxHeight: isMobile ? (isLandscape ? '40vh' : '45vh') : '50vh',
                WebkitOverflowScrolling: 'touch' 
              }}
              onWheel={e => e.stopPropagation()}
            >
              {/* Section header */}
              <div style={{ 
                display:'flex', alignItems:'center', justifyContent:'space-between',
                marginBottom: isSmallMobile ? 8 : 12,
                paddingBottom: isSmallMobile ? 6 : 8,
                borderBottom: `1px solid ${T.borderCard}`,
              }}>
                <p style={{ 
                  fontSize: isSmallMobile ? 9 : isMobile ? 10 : 11, 
                  fontWeight:700, color:T.brown,
                  letterSpacing:'0.1em', textTransform:'uppercase',
                  display:'flex', alignItems:'center', gap: 5,
                  margin: 0,
                }}>
                  <Building2 size={isSmallMobile ? 10 : 12} color={T.brown} />
                  Üniversiteler ({selectedCity.universities.length})
                </p>
                {selectedCity.universities.length > 0 && (
                  <span style={{ fontSize: isSmallMobile ? 8 : 9, color:T.textMuted }}>
                    {totalCount.toLocaleString('tr-TR')} öğrenci
                  </span>
                )}
              </div>

              {selectedCity.universities.length > 0
                ? selectedCity.universities.map((univ, i) => (
                    <UnivRowCompact 
                      key={i} 
                      univ={univ} 
                      index={i} 
                      totalCount={totalCount} 
                      isSmallMobile={isSmallMobile}
                      isMobile={isMobile}
                      onNavigate={(name) => { onClose(); navigate(`/universities/v2/${encodeURIComponent(name)}`); }}
                    />
                  ))
                : (
                  <div style={{ textAlign:'center', padding: isSmallMobile ? '24px 0' : '32px 0' }}>
                    <GraduationCap size={isSmallMobile ? 28 : 36} color={T.textMuted} style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: isSmallMobile ? 11 : 13, color:T.textMuted, fontWeight:500, margin: 0 }}>
                      Bu ilde veri bulunamadı
                    </p>
                  </div>
                )
              }
            </div>

            {/* FOOTER - Always visible close button */}
            <div style={{ 
              padding: isSmallMobile ? '10px 12px' : isMobile ? '12px 14px' : '14px 20px', 
              paddingBottom: isMobile ? 'max(12px, env(safe-area-inset-bottom))' : '14px',
              flexShrink:0,
              borderTop:`1px solid ${T.borderCard}`, 
              background:T.bgDeep,
              display:'flex', 
              gap: 10,
              alignItems:'center',
              justifyContent: isMobile ? 'center' : 'space-between',
            }}>
              {!isMobile && (
                <p style={{ fontSize:10, color:T.textMuted, fontStyle:'italic', margin: 0 }}>
                  Üniversiteye tıklayarak detay görün
                </p>
              )}
              <button 
                onClick={onClose}
                style={{ 
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6, 
                  fontSize: isSmallMobile ? 12 : isMobile ? 13 : 12,
                  fontWeight:600, 
                  color: '#fff',
                  letterSpacing:'0.04em',
                  background: T.brown, 
                  border: 'none', 
                  cursor:'pointer',
                  padding: isSmallMobile ? '10px 32px' : isMobile ? '11px 40px' : '9px 20px', 
                  borderRadius: isSmallMobile ? 10 : 12, 
                  transition:'all 0.2s',
                  width: isMobile ? '100%' : 'auto',
                  maxWidth: isMobile ? 280 : 'none',
                  boxShadow: `0 4px 12px ${T.brown}44`,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 16px ${T.brown}55`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px ${T.brown}44`; }}
              >
                <X size={isSmallMobile ? 14 : 16} strokeWidth={2.5} />
                Kapat
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── COMPACT UNIV ROW for Modal ── */
const UnivRowCompact = ({ univ, index, onNavigate, totalCount, isSmallMobile, isMobile }) => {
  const barW = totalCount > 0 ? Math.min((univ.count / totalCount) * 100, 100) : 0;
  const isTop3 = index < 3;
  const medals = ['#C9A84C', '#A8A8A8', '#B87333'];

  return (
    <motion.div
      initial={{ opacity:0, y:10 }} 
      animate={{ opacity:1, y:0 }}
      transition={{ delay: Math.min(index * 0.03, 0.15), duration:0.3 }}
      onClick={() => onNavigate(univ.name)}
      style={{
        padding: isSmallMobile ? '10px' : isMobile ? '11px 12px' : '12px 14px', 
        borderRadius: isSmallMobile ? 10 : 12, 
        cursor:'pointer', 
        marginBottom: isSmallMobile ? 6 : 8,
        background: T.bgCard,
        border:`1px solid ${T.borderCard}`,
        transition:'all 0.2s',
        boxShadow: `0 2px 8px ${T.shadow}`,
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap: isSmallMobile ? 8 : 10 }}>
        {/* Rank */}
        <div style={{
          width: isSmallMobile ? 24 : 28, 
          height: isSmallMobile ? 24 : 28, 
          flexShrink:0, 
          borderRadius: isSmallMobile ? 6 : 8,
          display:'flex', alignItems:'center', justifyContent:'center',
          background: isTop3 ? `${medals[index]}18` : `${T.navy}08`,
          color: isTop3 ? medals[index] : T.textMuted,
          fontSize: isSmallMobile ? 10 : 12, 
          fontWeight:800,
          fontFamily:'"Playfair Display", serif',
        }}>{index + 1}</div>

        {/* Info */}
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ 
            fontSize: isSmallMobile ? 11 : isMobile ? 12 : 13, 
            fontWeight:600, 
            lineHeight:1.3,
            overflow:'hidden', 
            textOverflow:'ellipsis', 
            whiteSpace:'nowrap',
            color: T.text,
            margin: 0,
          }}>{univ.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: 3 }}>
            <span style={{ 
              fontSize: isSmallMobile ? 7 : 8, 
              fontWeight:600,
              padding: '1px 5px', 
              borderRadius: 4,
              background: univ.type === 'Devlet' ? `${T.navy}12` : `${T.brown}12`,
              color: univ.type === 'Devlet' ? T.navyMid : T.brown,
            }}>{univ.type}</span>
            <span style={{ fontSize: isSmallMobile ? 8 : 9, color:T.textMuted }}>
              {univ.programCount} program
            </span>
          </div>
        </div>

        {/* Count */}
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <p style={{ 
            fontSize: isSmallMobile ? 14 : isMobile ? 16 : 18, 
            fontWeight:800, 
            lineHeight:1,
            fontFamily:'"Playfair Display", serif',
            color: T.navy,
            margin: 0,
          }}>
            {univ.count.toLocaleString('tr-TR')}
          </p>
          <p style={{ fontSize: isSmallMobile ? 8 : 9, color:T.textMuted, margin: '2px 0 0 0' }}>
            %{univ.percentage}
          </p>
        </div>

        <ChevronRight size={isSmallMobile ? 12 : 14} color={T.textMuted} style={{ flexShrink:0, opacity: 0.5 }} />
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: isSmallMobile ? 6 : 8, height: 2, borderRadius: 1, background:`${T.border}`, overflow:'hidden' }}>
        <div
          style={{ 
            height:'100%', 
            width: `${barW}%`,
            borderRadius: 1,
            background: isTop3
              ? `linear-gradient(90deg, ${medals[index]}, ${T.gold})`
              : `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`,
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   ANA BİLEŞEN — Mobile optimized
══════════════════════════════════════════════════════════ */
const TurkeyMap = ({ citiesData, data }) => {
  const navigate   = useNavigate();
  const mapRef     = useRef(null);
  const isMobile   = useIsMobile();

  const [hoveredCity,  setHoveredCity]  = useState(null);
  const [activeGeo,    setActiveGeo]    = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [tooltipPos,   setTooltipPos]   = useState({ x:0, y:0 });

  useEffect(() => {
    if (!selectedCity) return;
    const stop = (e) => e.stopPropagation();
    window.addEventListener('wheel', stop, { capture:true });
    // Prevent body scroll on mobile when modal is open
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('wheel', stop, { capture:true });
      if (isMobile) {
        document.body.style.overflow = '';
      }
    };
  }, [selectedCity, isMobile]);

  const findCityData = useCallback((geoName) => {
    const n = normalizeCity(geoName);
    let f = citiesData.find(c => normalizeCity(c.city) === n);
    if (f) return f;
    const nw = n.split(/\s+/).filter(w => w.length > 0);
    f = citiesData.find(c => {
      const cw = normalizeCity(c.city).split(/\s+/).filter(w => w.length > 0);
      if (nw.length === cw.length && nw.every((w,i) => cw[i] === w)) return true;
      const l1 = nw.filter(w => w.length > 4), l2 = cw.filter(w => w.length > 4);
      return l1.length && l2.length && l1.some(w => l2.some(c => w.includes(c) || c.includes(w)));
    });
    if (f) return f;
    f = citiesData.find(c => { const cn = normalizeCity(c.city); return cn.includes(n) || n.includes(cn); });
    if (f) return f;
    const mapped = SPECIAL[n];
    if (mapped) f = citiesData.find(c => normalizeCity(c.city).includes(mapped));
    return f || null;
  }, [citiesData]);

  const maxCount = useMemo(() => Math.max(...citiesData.map(c => c.count)), [citiesData]);
  const minCount = useMemo(() => Math.min(...citiesData.filter(c => c.count > 0).map(c => c.count)), [citiesData]);

  const getFill = useCallback((geoName, isHov) => {
    if (isHov) return MAP.hover;
    const cd = findCityData(geoName);
    if (!cd || cd.count === 0) return MAP.empty;
    return getMapColor(logNorm(cd.count, minCount, maxCount));
  }, [findCityData, minCount, maxCount]);

  const onEnter = (geo, e) => {
    if (isMobile) return; // Skip hover on mobile
    const cd = findCityData(geo.properties.name);
    setActiveGeo(geo.rsmKey);
    if (cd) { setHoveredCity(cd); setTooltipPos({ x:e.clientX, y:e.clientY }); }
  };
  const onMove  = (e) => {
    if (isMobile) return;
    setTooltipPos({ x:e.clientX, y:e.clientY });
  };
  const onLeave = ()  => { 
    setHoveredCity(null); 
    setActiveGeo(null); 
  };

  const onClick = (geo) => {
    const cityName = geo.properties.name;
    const cityData = findCityData(cityName);
    if (!cityData || !data) return;
    const ng = normalizeCity(cityName);
    const cityRecords = data.filter(r => {
      if (r.year !== '2025' || !r.city) return false;
      const rc = normalizeCity(r.city);
      if (rc === ng) return true;
      if (rc.includes(ng) || ng.includes(rc)) return true;
      const m1 = SPECIAL[ng], m2 = SPECIAL[rc];
      if (m1 && (rc.includes(m1) || m1.includes(rc))) return true;
      if (m2 && (ng.includes(m2) || m2.includes(ng))) return true;
      const gw = ng.split(/\s+/).filter(w => w.length > 3);
      const cw = rc.split(/\s+/).filter(w => w.length > 3);
      return gw.length && cw.length && gw.some(g => cw.some(c => g.includes(c) || c.includes(g)));
    });
    const univMap = {};
    cityRecords.forEach(r => {
      const ihlCount = r.imam_hatip_lise_tipi?.reduce((s,t) => s + (t.yerlesen||0), 0) || 0;
      if (!univMap[r.university_name])
        univMap[r.university_name] = { name:r.university_name, type:r.university_type, count:0, total:0, programs:new Set() };
      univMap[r.university_name].count += ihlCount;
      univMap[r.university_name].total += r.toplam_yerlesen || 0;
      univMap[r.university_name].programs.add(r.program_name);
    });
    const universities = Object.values(univMap).map(u => ({
      ...u, programCount:u.programs.size,
      percentage: u.total > 0 ? ((u.count/u.total)*100).toFixed(2) : '0',
    })).sort((a,b) => b.count - a.count);
    setSelectedCity({ ...cityData, cityName, universities });
  };

  return (
    <div style={{ position:'relative', fontFamily:'"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @keyframes pulse { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:1; transform:scale(1.4); } }
      `}</style>

      {/* ══ HARİTA WRAPPER ══ */}
      <div
        ref={mapRef}
        style={{
          position:'relative',
          background:`radial-gradient(ellipse 95% 85% at 50% 50%, ${T.bgDeep} 0%, ${T.bg} 100%)`,
          borderRadius: isMobile ? 14 : 20,
          border:`1px solid ${T.borderCard}`,
          boxShadow:`0 4px 28px ${T.shadow}, 0 16px 48px ${T.shadow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
          overflow: 'hidden',
        }}
      >
        {/* Corner accents — hidden on mobile */}
        {!isMobile && [
          { top:16, left:16,   bL:true, bT:true },
          { top:16, right:16,  bR:true, bT:true },
          { bottom:16, left:16,  bL:true, bB:true },
          { bottom:16, right:16, bR:true, bB:true },
        ].map((p,i) => (
          <div key={i} style={{
            position:'absolute', width:24, height:24, zIndex:2, pointerEvents:'none',
            ...(p.top    !== undefined ? { top:p.top       } : {}),
            ...(p.bottom !== undefined ? { bottom:p.bottom } : {}),
            ...(p.left   !== undefined ? { left:p.left     } : {}),
            ...(p.right  !== undefined ? { right:p.right   } : {}),
            borderLeft:   p.bL ? `1.5px solid ${T.brown}44` : 'none',
            borderRight:  p.bR ? `1.5px solid ${T.brown}44` : 'none',
            borderTop:    p.bT ? `1.5px solid ${T.brown}44` : 'none',
            borderBottom: p.bB ? `1.5px solid ${T.brown}44` : 'none',
            borderTopLeftRadius:     p.bL && p.bT ? 5 : 0,
            borderTopRightRadius:    p.bR && p.bT ? 5 : 0,
            borderBottomLeftRadius:  p.bL && p.bB ? 5 : 0,
            borderBottomRightRadius: p.bR && p.bB ? 5 : 0,
          }} />
        ))}

        {/* Grid texture — reduced opacity on mobile */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', zIndex:1, opacity: isMobile ? 0.08 : 0.18,
          backgroundImage:`linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize: isMobile ? '32px 32px' : '64px 64px', borderRadius: isMobile ? 14 : 20,
        }} />

        {/* Floating particles — fewer on mobile */}
        <MapParticles count={isMobile ? 5 : 10} />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: isMobile ? 2400 : 2800, center:[35.5, 39.0] }}
          width={1000} height={520}
          style={{ width:'100%', height:'auto', display:'block', position:'relative', zIndex:2, borderRadius: isMobile ? 14 : 20, touchAction: 'pan-y' }}
        >
          <Geographies geography={TURKEY_GEOJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHov = activeGeo === geo.rsmKey;
                const cd    = findCityData(geo.properties.name);
                const t     = cd ? logNorm(cd.count, minCount, maxCount) : 0;
                const fill  = getFill(geo.properties.name, isHov);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => onEnter(geo, e)}
                    onMouseMove={onMove}
                    onMouseLeave={onLeave}
                    onClick={() => onClick(geo)}
                    style={{
                      default: { fill, stroke:MAP.stroke, strokeWidth: isMobile ? 0.5 : 0.7, outline:'none',
                        filter: t > 0.78 ? `drop-shadow(0 0 5px ${fill}55)` : 'none',
                        transition:'fill 0.22s ease' },
                      hover: { fill:MAP.hover, stroke:'#fff', strokeWidth: isMobile ? 1.5 : 2.2, outline:'none',
                        cursor:'pointer', filter:`drop-shadow(0 3px 12px ${MAP.hover}aa)` },
                      pressed: { fill:T.brown, stroke:'#fff', strokeWidth: isMobile ? 1.5 : 2, outline:'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Bottom left label */}
        <div style={{ position:'absolute', bottom: isMobile ? 10 : 20, left: isMobile ? 10 : 24, zIndex:3,
          display:'flex', alignItems:'center', gap: isMobile ? 5 : 8 }}>
          <div style={{ width: isMobile ? 5 : 7, height: isMobile ? 5 : 7, borderRadius:'50%',
            background:`radial-gradient(circle, ${T.gold}, ${T.brown})`,
            boxShadow:`0 0 10px ${T.gold}99`,
            animation:'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: isMobile ? 7 : 9, color:T.textMuted, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500 }}>
            {isMobile ? '2025 · İHL Yoğunluğu' : '2025 · İHL Yerleşim Yoğunluğu'}
          </span>
        </div>

        {/* Top right mini stats */}
        <motion.div
          initial={{ opacity:0, y:-10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5, duration:0.6 }}
          style={{
            position:'absolute', top: isMobile ? 10 : 18, right: isMobile ? 10 : 18, zIndex:3,
            background:'rgba(255,255,255,0.85)', backdropFilter:'blur(8px)',
            borderRadius: isMobile ? 8 : 12, padding: isMobile ? '6px 10px' : '10px 14px',
            border:`1px solid ${T.borderCard}`,
            boxShadow:`0 4px 16px ${T.shadow}`,
          }}
        >
          <p style={{ fontSize: isMobile ? 6 : 8, fontWeight:700, color:T.textMuted, letterSpacing:'0.12em',
            textTransform:'uppercase', marginBottom: isMobile ? 2 : 4 }}>Şehir</p>
          <p style={{ fontSize: isMobile ? 16 : 20, fontWeight:800, color:T.navy, lineHeight:1,
            fontFamily:'"Playfair Display", "Cormorant Garamond", serif' }}>
            {citiesData.filter(c => c.count > 0).length}
          </p>
        </motion.div>

        {/* Mobile tap hint */}
        {isMobile && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10, zIndex: 3,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: 8, padding: '5px 8px',
            border: `1px solid ${T.borderCard}`,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <MapPin size={10} color={T.brown} />
            <span style={{ fontSize: 8, color: T.textMuted }}>Şehre dokun</span>
          </div>
        )}

        {/* TOOLTIP — desktop only */}
        <MapTooltip city={hoveredCity} pos={tooltipPos} mapRef={mapRef} isMobile={isMobile} />
      </div>

      {/* ══ LEGEND ══ */}
      <div style={{
        marginTop: isMobile ? 10 : 16, 
        background:T.bgCard, 
        border:`1px solid ${T.borderCard}`,
        borderRadius: isMobile ? 12 : 16, 
        padding: isMobile ? '12px 14px' : '16px 24px',
        display:'flex', flexDirection:'column', alignItems:'center', gap:4,
        boxShadow:`0 2px 12px ${T.shadow}`,
      }}>
        <p style={{ fontSize: isMobile ? 8 : 9, fontWeight:700, color:T.textMuted,
          letterSpacing:'0.15em', textTransform:'uppercase', marginBottom: isMobile ? 2 : 4 }}>
          Öğrenci Dağılımı
        </p>
        <LegendBar maxCount={maxCount} isMobile={isMobile} />
      </div>

      {/* ══ MODAL ══ */}
      <CityModal
        selectedCity={selectedCity}
        onClose={() => setSelectedCity(null)}
        navigate={navigate}
        isMobile={isMobile}
      />
    </div>
  );
};

export default TurkeyMap;