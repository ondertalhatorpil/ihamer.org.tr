import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { interpolateRgb } from 'd3-interpolate';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, ChevronRight, GraduationCap, MapPin, BarChart2, Percent } from 'lucide-react';
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

/* ── LEGEND ── */
const LegendBar = ({ maxCount }) => {
  const stops = [0, 0.2, 0.45, 0.72, 1];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
      <div style={{ position:'relative', width:320 }}>
        <div style={{
          height:14, borderRadius:7, overflow:'hidden',
          background:`linear-gradient(90deg, ${MAP.empty} 0%, ${MAP.c1} 8%, ${MAP.c2} 28%, ${MAP.c3} 52%, ${MAP.c4} 75%, ${MAP.c5} 100%)`,
          border:`1px solid ${T.border}`,
          boxShadow:`inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px ${T.shadow}`,
        }} />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
          {stops.map((s, i) => {
            const rawVal = s === 0 ? 0 : Math.round(Math.exp(Math.log(Math.max(maxCount,1)) * s));
            const isMax = i === stops.length - 1;
            return (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                <div style={{ width:1, height:5, background: isMax ? T.navy : T.border }} />
                <span style={{ fontSize:9.5, fontVariantNumeric:'tabular-nums',
                  color: isMax ? T.navy : T.textMuted, fontWeight: isMax ? 700 : 400 }}>
                  {rawVal === 0 ? '0' : rawVal >= 1000 ? `${(rawVal/1000).toFixed(1)}k` : rawVal}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:12, height:12, borderRadius:3, background:MAP.empty, border:`1px solid ${T.border}` }} />
          <span style={{ fontSize:10, color:T.textMuted }}>Veri yok</span>
        </div>
        <div style={{ width:1, height:10, background:T.border }} />
        <span style={{ fontSize:10, color:T.textMuted, fontStyle:'italic' }}>Logaritmik ölçek</span>
      </div>
    </div>
  );
};

/* ── UNIV ROW ── */
const UnivRow = ({ univ, index, onNavigate }) => {
  const [hov, setHov] = useState(false);
  const pct = parseFloat(univ.percentage);
  const barW = Math.min(pct * 2.8, 100);
  return (
    <motion.div
      initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
      transition={{ delay:index*0.04, duration:0.42, ease:[0.22,1,0.36,1] }}
      onClick={() => onNavigate(univ.name)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding:'11px 14px', borderRadius:12, cursor:'pointer', marginBottom:6,
        background: hov ? T.bgDeep : 'transparent',
        border:`1px solid ${hov ? T.brown+'30' : T.borderCard}`,
        transition:'background 0.2s, border-color 0.2s, box-shadow 0.2s',
        boxShadow: hov ? `0 4px 16px ${T.shadow}` : 'none',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{
          width:30, height:30, flexShrink:0, borderRadius:8,
          display:'flex', alignItems:'center', justifyContent:'center',
          background: index < 3 ? `${T.gold}20` : `${T.navy}0e`,
          color: index < 3 ? T.gold : T.navy,
          fontSize:12, fontWeight:700, fontFamily:'"Cormorant Garamond", serif',
          border: index < 3 ? `1px solid ${T.gold}44` : '1px solid transparent',
        }}>{index+1}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:13, fontWeight:600, lineHeight:1.35,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            color: hov ? T.brown : T.text, transition:'color 0.2s' }}>{univ.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:3 }}>
            <span style={{ fontSize:9.5, fontWeight:600, letterSpacing:'0.07em',
              padding:'1px 7px', borderRadius:4,
              background: univ.type === 'Devlet' ? `${T.navy}12` : `${T.brown}12`,
              color: univ.type === 'Devlet' ? T.navyMid : T.brown,
            }}>{univ.type}</span>
            <span style={{ fontSize:10, color:T.textMuted }}>{univ.programCount} program</span>
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <p style={{ fontSize:20, fontWeight:800, lineHeight:1,
            fontFamily:'"Cormorant Garamond", serif', color:T.navy }}>
            {univ.count.toLocaleString('tr-TR')}
          </p>
          <p style={{ fontSize:10, color:T.textMuted, marginTop:1 }}>%{univ.percentage}</p>
        </div>
        <ChevronRight size={13} color={hov ? T.brown : T.textMuted}
          style={{ flexShrink:0, transition:'color 0.2s, transform 0.2s',
            transform: hov ? 'translateX(2px)' : 'translateX(0)' }} />
      </div>
      <div style={{ marginTop:8, height:2, borderRadius:1, background:T.border, overflow:'hidden' }}>
        <motion.div
          animate={{ width: hov ? `${barW}%` : `${barW*0.65}%` }}
          transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
          style={{ height:'100%', borderRadius:1,
            background:`linear-gradient(90deg, ${T.brown}, ${T.gold})` }}
        />
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   TOOLTIP — harita container'ına göre absolute konumlanır.
   pos = { x, y } client koordinatları (mouse pozisyonu).
   mapRef = harita wrapper'ının ref'i.
   getBoundingClientRect() ile container'a göre dönüştürür,
   kenar taşmalarını PAD payı bırakarak önler.
══════════════════════════════════════════════════════════ */
const TOOLTIP_W = 210;
const TOOLTIP_H = 155;

const MapTooltip = ({ city, pos, mapRef }) => {
  const [style, setStyle] = useState({ left:0, top:0 });

  useEffect(() => {
    if (!city || !mapRef?.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const PAD  = 12;

    // Mouse pozisyonunu container'a çevir
    let left = pos.x - rect.left + 18;
    let top  = pos.y - rect.top  - TOOLTIP_H / 2;

    // Sağa taşarsa sola al
    if (left + TOOLTIP_W > rect.width - PAD)
      left = pos.x - rect.left - TOOLTIP_W - 14;

    // Üst sınır
    if (top < PAD) top = PAD;

    // Alt sınır
    if (top + TOOLTIP_H > rect.height - PAD)
      top = rect.height - TOOLTIP_H - PAD;

    setStyle({ left, top });
  }, [pos.x, pos.y, city, mapRef]);

  return (
    <AnimatePresence>
      {city && (
        <motion.div
          key={city.city}
          initial={{ opacity:0, scale:0.88, y:6 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{   opacity:0, scale:0.88, y:6 }}
          transition={{ duration:0.15, ease:[0.22,1,0.36,1] }}
          style={{
            position:'absolute',   /* ← fixed değil, absolute */
            pointerEvents:'none',
            zIndex:50,
            left: style.left,
            top:  style.top,
            width: TOOLTIP_W,
          }}
        >
          <div style={{
            background:T.sidebar, borderRadius:14, padding:'14px 18px',
            boxShadow:'0 20px 56px rgba(14,22,48,0.38), 0 0 0 1px rgba(255,255,255,0.07)',
            position:'relative', overflow:'hidden',
          }}>
            {/* shimmer çizgisi */}
            <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1,
              background:`linear-gradient(90deg, transparent, ${T.gold}99, transparent)` }} />

            <p style={{ fontSize:15, fontWeight:800, color:'#fff',
              fontFamily:'"Cormorant Garamond", serif', fontStyle:'italic',
              letterSpacing:'-0.01em', marginBottom:11,
              display:'flex', alignItems:'center', gap:7 }}>
              <MapPin size={11} color={T.gold} style={{ flexShrink:0 }} />
              {city.city}
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { icon:<BarChart2 size={9} color={T.brownLight}/>, label:'Öğrenci',
                  value:city.count.toLocaleString('tr-TR'), color:'#fff' },
                { icon:<Percent size={9} color={T.gold}/>, label:'Oran',
                  value:`%${city.percentage}`, color:T.gold },
              ].map((s,i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.06)',
                  borderRadius:8, padding:'8px 10px',
                  border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
                    {s.icon}
                    <span style={{ fontSize:8, color:'rgba(255,255,255,0.4)',
                      letterSpacing:'0.13em', textTransform:'uppercase' }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1,
                    fontFamily:'"Cormorant Garamond", serif' }}>{s.value}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize:9, color:'rgba(255,255,255,0.28)', marginTop:10,
              textAlign:'center', letterSpacing:'0.09em' }}>tıklayın · detay görün</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════
   ANA BİLEŞEN
══════════════════════════════════════════════════════════ */
const TurkeyMap = ({ citiesData, data }) => {
  const navigate   = useNavigate();
  const mapRef     = useRef(null);   /* tooltip konumlandırma için */

  const [hoveredCity,  setHoveredCity]  = useState(null);
  const [activeGeo,    setActiveGeo]    = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [tooltipPos,   setTooltipPos]   = useState({ x:0, y:0 });

  useEffect(() => {
    if (!selectedCity) return;
    const stop = (e) => e.stopPropagation();
    window.addEventListener('wheel', stop, { capture:true });
    return () => window.removeEventListener('wheel', stop, { capture:true });
  }, [selectedCity]);

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
    const cd = findCityData(geo.properties.name);
    setActiveGeo(geo.rsmKey);
    if (cd) { setHoveredCity(cd); setTooltipPos({ x:e.clientX, y:e.clientY }); }
  };
  const onMove  = (e) => setTooltipPos({ x:e.clientX, y:e.clientY });
  const onLeave = ()  => { setHoveredCity(null); setActiveGeo(null); };

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
    <div style={{ position:'relative', fontFamily:'"DM Sans", system-ui, sans-serif' }}>

      {/* ══ HARİTA WRAPPER — position:relative → tooltip buraya göre ══ */}
      <div
        ref={mapRef}
        style={{
          position:'relative',  /* ← tooltip absolute için şart */
          background:`radial-gradient(ellipse 95% 85% at 50% 50%, ${T.bgDeep} 0%, ${T.bg} 100%)`,
          borderRadius:18,
          border:`1px solid ${T.borderCard}`,
          boxShadow:`0 4px 28px ${T.shadow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
        }}
      >
        {/* Köşe aksanları */}
        {[
          { top:16, left:16,   bL:true, bT:true },
          { top:16, right:16,  bR:true, bT:true },
          { bottom:16, left:16,  bL:true, bB:true },
          { bottom:16, right:16, bR:true, bB:true },
        ].map((p,i) => (
          <div key={i} style={{
            position:'absolute', width:22, height:22, zIndex:2, pointerEvents:'none',
            ...(p.top    !== undefined ? { top:p.top       } : {}),
            ...(p.bottom !== undefined ? { bottom:p.bottom } : {}),
            ...(p.left   !== undefined ? { left:p.left     } : {}),
            ...(p.right  !== undefined ? { right:p.right   } : {}),
            borderLeft:   p.bL ? `1.5px solid ${T.brown}50` : 'none',
            borderRight:  p.bR ? `1.5px solid ${T.brown}50` : 'none',
            borderTop:    p.bT ? `1.5px solid ${T.brown}50` : 'none',
            borderBottom: p.bB ? `1.5px solid ${T.brown}50` : 'none',
            borderTopLeftRadius:     p.bL && p.bT ? 4 : 0,
            borderTopRightRadius:    p.bR && p.bT ? 4 : 0,
            borderBottomLeftRadius:  p.bL && p.bB ? 4 : 0,
            borderBottomRightRadius: p.bR && p.bB ? 4 : 0,
          }} />
        ))}

        {/* Grid dokusu */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none', zIndex:1, opacity:0.22,
          backgroundImage:`linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize:'64px 64px', borderRadius:18,
        }} />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale:2800, center:[35.5, 39.0] }}
          width={1000} height={520}
          style={{ width:'100%', height:'auto', display:'block', position:'relative', zIndex:2, borderRadius:18 }}
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
                      default:  { fill, stroke:MAP.stroke, strokeWidth:0.7, outline:'none',
                        filter: t > 0.78 ? `drop-shadow(0 0 4px ${fill}55)` : 'none',
                        transition:'fill 0.22s ease' },
                      hover:    { fill:MAP.hover, stroke:'#fff', strokeWidth:2.2, outline:'none',
                        cursor:'pointer', filter:`drop-shadow(0 2px 10px ${MAP.hover}aa)` },
                      pressed:  { fill:T.brown, stroke:'#fff', strokeWidth:2, outline:'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Sol alt etiket */}
        <div style={{ position:'absolute', bottom:20, left:24, zIndex:3,
          display:'flex', alignItems:'center', gap:7 }}>
          <div style={{ width:7, height:7, borderRadius:'50%',
            background:`radial-gradient(circle, ${T.gold}, ${T.brown})`,
            boxShadow:`0 0 8px ${T.gold}99` }} />
          <span style={{ fontSize:9, color:T.textMuted, letterSpacing:'0.15em', textTransform:'uppercase' }}>
            2025 · İHL Yerleşim Yoğunluğu
          </span>
        </div>

        {/* ══ TOOLTIP — wrapper içinde absolute ══ */}
        <MapTooltip city={hoveredCity} pos={tooltipPos} mapRef={mapRef} />
      </div>

      {/* ══ LEGEND ══ */}
      <div style={{
        marginTop:16, background:T.bgCard, border:`1px solid ${T.borderCard}`,
        borderRadius:14, padding:'14px 24px',
        display:'flex', flexDirection:'column', alignItems:'center', gap:4,
        boxShadow:`0 2px 12px ${T.shadow}`,
      }}>
        <p style={{ fontSize:9, fontWeight:700, color:T.textMuted,
          letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:4 }}>
          Öğrenci Sayısı Dağılımı
        </p>
        <LegendBar maxCount={maxCount} />
      </div>

      {/* ══ MODAL ══ */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.22 }}
            onClick={() => setSelectedCity(null)}
            style={{
              position:'fixed', inset:0, zIndex:2000,
              background:'rgba(12,20,46,0.72)',
              backdropFilter:'blur(10px)',
              display:'flex', alignItems:'center', justifyContent:'center',
              padding:'16px',
            }}
          >
            <motion.div
              initial={{ opacity:0, scale:0.93, y:28 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{   opacity:0, scale:0.93, y:28 }}
              transition={{ duration:0.42, ease:[0.22,1,0.36,1] }}
              onClick={e => e.stopPropagation()}
              style={{
                background:T.bgCard, borderRadius:22,
                width:'100%', maxWidth:680, height:'88vh',
                display:'flex', flexDirection:'column', overflow:'hidden',
                boxShadow:'0 48px 120px rgba(12,20,46,0.42), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* HEADER */}
              <div style={{
                background:`linear-gradient(140deg, ${T.sidebar} 0%, #243561 60%, #1e3054 100%)`,
                padding:'28px 28px 26px', position:'relative', overflow:'hidden', flexShrink:0,
              }}>
                <div style={{ position:'absolute', inset:0, opacity:0.07, pointerEvents:'none',
                  backgroundImage:`radial-gradient(ellipse at 15% 60%, ${T.brownLight} 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, ${T.navyLight} 0%, transparent 55%)` }} />
                <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
                  backgroundImage:`linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                  backgroundSize:'32px 32px' }} />
                <div style={{ position:'absolute', right:-18, top:'50%', transform:'translateY(-52%)',
                  fontSize:'160px', fontWeight:800, color:'#fff', opacity:0.04,
                  fontFamily:'"Cormorant Garamond", serif', fontStyle:'italic',
                  lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                  {selectedCity.cityName?.[0]}
                </div>
                <div style={{ position:'absolute', bottom:0, left:'5%', right:'5%', height:1,
                  background:`linear-gradient(90deg, transparent, ${T.gold}66, transparent)` }} />

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
                  <div>
                    <motion.p initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:0.1 }}
                      style={{ fontSize:9, fontWeight:700, color:T.gold, letterSpacing:'0.24em',
                        textTransform:'uppercase', marginBottom:7,
                        display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ display:'inline-block', width:16, height:1.5, background:T.gold, borderRadius:1 }} />
                      Şehir Detayı
                    </motion.p>
                    <motion.h2 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:0.14, duration:0.5, ease:[0.22,1,0.36,1] }}
                      style={{ fontSize:'clamp(28px,5vw,46px)', fontWeight:800,
                        fontFamily:'"Cormorant Garamond", serif', fontStyle:'italic',
                        color:'#fff', lineHeight:1, letterSpacing:'-0.02em' }}>
                      {selectedCity.cityName}
                    </motion.h2>
                  </div>
                  <button onClick={() => setSelectedCity(null)}
                    style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                      background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      cursor:'pointer', transition:'background 0.18s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.16)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
                  ><X size={15} color="rgba(255,255,255,0.7)" /></button>
                </div>

                <div style={{ display:'flex', gap:24, marginTop:22, position:'relative', zIndex:1 }}>
                  {[
                    { icon:<BarChart2 size={10} color={T.brownLight}/>, l:'İHL Öğrencisi', v:selectedCity.count.toLocaleString('tr-TR'), vc:'#fff' },
                    { icon:<Percent size={10} color={T.gold}/>, l:'Oran', v:`%${selectedCity.percentage}`, vc:T.gold },
                    { icon:<Building2 size={10} color={T.brownLight}/>, l:'Üniversite', v:String(selectedCity.universities.length), vc:T.brownLight },
                  ].map((s,i) => (
                    <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:0.18+i*0.07, duration:0.42, ease:[0.22,1,0.36,1] }}
                      style={{ borderLeft:'2px solid rgba(255,255,255,0.1)', paddingLeft:14 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
                        {s.icon}
                        <span style={{ fontSize:8.5, color:'rgba(255,255,255,0.38)',
                          letterSpacing:'0.14em', textTransform:'uppercase' }}>{s.l}</span>
                      </div>
                      <p style={{ fontSize:26, fontWeight:800, lineHeight:1,
                        fontFamily:'"Cormorant Garamond", serif', color:s.vc }}>{s.v}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* BODY */}
              <div style={{ padding:'20px 22px', overflowY:'auto', flex:1, minHeight:0 }}
                onWheel={e => e.stopPropagation()}>
                <div style={{ marginBottom:18 }}>
                  <p style={{ fontSize:9.5, fontWeight:700, color:T.brown,
                    letterSpacing:'0.18em', textTransform:'uppercase',
                    marginBottom:4, display:'flex', alignItems:'center', gap:7 }}>
                    <Building2 size={11} color={T.brown} />
                    Üniversiteler &nbsp;·&nbsp; {selectedCity.universities.length}
                  </p>
                  <Divider color={T.brown} width="40%" delay={0.2} />
                </div>
                {selectedCity.universities.length > 0
                  ? selectedCity.universities.map((univ,i) => (
                      <UnivRow key={i} univ={univ} index={i}
                        onNavigate={(name) => { setSelectedCity(null); navigate(`/universities/v2/${encodeURIComponent(name)}`); }}
                      />
                    ))
                  : (
                    <div style={{ textAlign:'center', padding:'56px 0' }}>
                      <GraduationCap size={38} color={T.textMuted} style={{ margin:'0 auto 12px' }} />
                      <p style={{ fontSize:14, color:T.textMuted }}>Bu ilde üniversite verisi bulunamadı</p>
                    </div>
                  )
                }
              </div>

              {/* FOOTER */}
              <div style={{ padding:'13px 22px', flexShrink:0,
                borderTop:`1px solid ${T.borderCard}`, background:T.bgDeep,
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <p style={{ fontSize:10.5, color:T.textMuted, fontStyle:'italic' }}>
                  Üniversiteye tıklayarak detay sayfasına gidin
                </p>
                <button onClick={() => setSelectedCity(null)}
                  style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5,
                    fontWeight:600, color:T.textMuted, letterSpacing:'0.06em',
                    background:'none', border:'none', cursor:'pointer',
                    padding:'5px 10px', borderRadius:7, transition:'background 0.15s, color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background=T.border; e.currentTarget.style.color=T.text; }}
                  onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=T.textMuted; }}
                >Kapat <X size={11} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TurkeyMap;