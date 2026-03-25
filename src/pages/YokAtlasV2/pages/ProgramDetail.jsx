/* ProgramDetail.jsx */
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Building2, TrendingUp, TrendingDown, Info, X, School, MapPin, ChevronRight, Search, GraduationCap, Calendar, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { calculateTrend, normalizeProgramName } from '../utils/dataProcessor';

const T = {
  bg: '#faf8f4', bgDeep: '#f4f0e8', bgCard: '#ffffff',
  border: 'rgba(28,31,46,0.10)', borderCard: 'rgba(28,31,46,0.08)',
  text: '#1c1f2e', textSub: '#4a4e65', textMuted: '#8a8ea8',
  navy: '#1c1f2e', navyMid: '#2d3250',
  brown: '#8b5e3c', brownLight: '#c49a6c', brownPale: '#f0e4d0',
  shadow: 'rgba(28,31,46,0.08)', shadowMd: 'rgba(28,31,46,0.14)',
};

const FONT_BODY    = '"Plus Jakarta Sans", system-ui, sans-serif';
const FONT_DISPLAY = '"Playfair Display", serif';

/* Türkçe karakter + büyük/küçük harf duyarsız normalize */
const trNorm = (s) =>
  (s || '')
    .replace(/İ/g, 'i').replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş').replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase().trim();

const TYPE_STYLES = {
  Devlet: { bg: `${T.navy}12`, color: T.navy, border: `${T.navy}28` },
  Vakıf:  { bg: `${T.brown}12`, color: T.brown, border: `${T.brown}28` },
  KKTC:   { bg: `${T.brownLight}22`, color: '#7a4a10', border: `${T.brownLight}44` },
};

const Badge = ({ type }) => {
  const s = TYPE_STYLES[type] || TYPE_STYLES.Devlet;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 6, background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, flexShrink: 0 }}>{type}</span>
  );
};

const Card = ({ children, accent, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const ac = accent || T.brown;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 14,
        padding: '22px 20px', boxShadow: `0 2px 10px ${T.shadow}`,
        position: 'relative', overflow: 'hidden', ...style }}
    >
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
        background: `linear-gradient(90deg, transparent, ${ac}44, transparent)` }}/>
      {children}
    </motion.div>
  );
};

const SectionTitle = ({ children, color }) => (
  <div style={{ marginBottom: 18 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: T.navy,
      fontFamily: FONT_DISPLAY, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{children}</h2>
    <div style={{ width: 40, height: 2,
      background: `linear-gradient(90deg, ${color || T.brown}, transparent)`,
      borderRadius: 1, marginTop: 4 }}/>
  </div>
);

const tipStyle = {
  backgroundColor: T.bgCard, border: `1px solid ${T.borderCard}`,
  borderRadius: 10, color: T.text, fontSize: 12, boxShadow: `0 4px 16px ${T.shadow}`,
};

/* ─── Width hook ─── */
const useWidth = () => {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
};

const YEARS = ['Tüm Yıllar', '2023', '2024', '2025'];

/* ─── Okul listesini çıkar (3 yıllık) ─── */
const extractSchoolsForYear = (data, univName, programName, year) => {
  const schoolMap = {};
  data
    .filter(r => 
      r.university_name === univName && 
      normalizeProgramName(r.program_name) === programName &&
      (year === 'Tüm Yıllar' || r.year === year)
    )
    .forEach(record => {
      const arr = record.imam_hatip_liseler;
      if (!arr || !Array.isArray(arr)) return;
      const schools = [];
      arr.forEach(item => {
        if (item.lise !== undefined) schools.push(item);
        else if (Array.isArray(item.imam_hatip_liseler))
          item.imam_hatip_liseler.forEach(s => schools.push(s));
      });
      schools.forEach(s => {
        const nm  = s.lise || s.okul_adi || '';
        const cnt = s.yerlesen || 0;
        if (!nm || !cnt) return;
        const cityMatch = nm.match(/\(([^-\)]+)/);
        const city = cityMatch?.[1]?.trim() || 'Bilinmiyor';
        if (!schoolMap[nm]) schoolMap[nm] = { name: nm, city, total: 0 };
        schoolMap[nm].total += cnt;
      });
    });
  return Object.values(schoolMap).sort((a, b) => b.total - a.total);
};

/* ─── School Row ─── */
const SchoolRow = ({ school, index, isMobile, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12,
        padding: isMobile ? '9px 10px' : '11px 14px', borderRadius: 10, cursor: 'pointer',
        background: hov ? T.brownPale : (index < 3 ? `${T.navy}06` : T.bgDeep),
        border: `1px solid ${hov ? T.brown + '44' : (index < 3 ? T.navy + '14' : T.borderCard)}`,
        transition: 'all 0.18s',
        boxShadow: hov ? `0 4px 16px ${T.shadow}` : 'none',
      }}
    >
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        background: index < 3 ? `linear-gradient(135deg, ${T.navy}, ${T.navyMid})` : `${T.navy}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: index < 3 ? '#fff' : T.textMuted }}>{index + 1}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: isMobile ? 11.5 : 13, fontWeight: 500, color: hov ? T.brown : T.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3, transition: 'color 0.18s',
        }}>{school.name.split('(')[0].trim()}</p>
        <p style={{ fontSize: 9.5, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
          <MapPin size={8}/>{school.city}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: isMobile ? 16 : 20, fontWeight: 800,
            color: hov ? T.brown : (index < 3 ? T.navy : T.brown),
            fontFamily: FONT_DISPLAY, lineHeight: 1,
          }}>{school.total}</p>
        </div>
        <ExternalLink size={11} color={hov ? T.brown : T.textMuted} style={{ transition: 'color 0.18s' }} />
      </div>
    </div>
  );
};

/* ─── SCHOOL MODAL (Universities.jsx ile aynı tasarım) ─── */
const SchoolModal = ({ univ, data, programName, onClose }) => {
  const navigate = useNavigate();
  const vw = useWidth();
  const isMobile = vw < 640;
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('Tüm Yıllar');

  const schools = useMemo(() => extractSchoolsForYear(data, univ.name, programName, year), [data, univ.name, programName, year]);
  const filtered = useMemo(() => {
    const q = trNorm(search);
    if (!q.trim()) return schools;
    return schools.filter(s => trNorm(s.name).includes(q) || trNorm(s.city).includes(q));
  }, [schools, search]);

  const totalStudents = schools.reduce((s, x) => s + x.total, 0);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const goToSchoolDetail = (school) => {
    onClose();
    navigate(`/schools/${encodeURIComponent(school.name)}/${encodeURIComponent(univ.name)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(28,31,46,0.55)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '8px' : '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bgCard, borderRadius: isMobile ? 16 : 20,
          width: '100%', maxWidth: 700, maxHeight: isMobile ? '95vh' : '90vh',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(28,31,46,0.28)',
          border: `1px solid ${T.borderCard}`,
          display: 'flex', flexDirection: 'column', fontFamily: FONT_BODY,
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
          padding: isMobile ? '16px 16px 14px' : '22px 24px 18px',
          position: 'relative', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 2,
            background: `linear-gradient(90deg, transparent, ${T.brownLight}88, transparent)`,
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <GraduationCap size={12} color="#fff" />
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.brownLight, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                  Mezunların Liseleri
                </span>
              </div>
              <h2 style={{
                fontSize: isMobile ? 15 : 18, fontWeight: 700, color: '#fff',
                fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                lineHeight: 1.25, letterSpacing: '-0.01em',
                wordBreak: 'break-word',
              }}>{univ.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                <Badge type={univ.type} />
                {univ.city && (
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MapPin size={9}/>{univ.city}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                padding: 7, cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            ><X size={15} /></button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              ['İHL Mezunu', totalStudents.toLocaleString('tr-TR')],
              ['Farklı Lise', schools.length.toLocaleString('tr-TR')],
            ].map(([label, val]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: isMobile ? '8px 10px' : '10px 14px' }}>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 2, letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, color: '#fff', fontFamily: FONT_DISPLAY, lineHeight: 1 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Year filter */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYear(y)}
                style={{
                  padding: isMobile ? '4px 10px' : '5px 14px', borderRadius: 20,
                  fontSize: isMobile ? 10 : 11, fontWeight: 700, letterSpacing: '0.04em',
                  cursor: 'pointer', transition: 'all 0.18s',
                  border: year === y ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  background: year === y ? `linear-gradient(135deg, ${T.brown}, ${T.brownLight})` : 'rgba(255,255,255,0.08)',
                  color: year === y ? '#fff' : 'rgba(255,255,255,0.6)',
                  boxShadow: year === y ? `0 2px 10px ${T.brown}66` : 'none',
                  fontFamily: FONT_BODY,
                }}
              >
                <Calendar size={8} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: isMobile ? '10px 14px 8px' : '14px 24px 10px', borderBottom: `1px solid ${T.borderCard}`, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color={T.textMuted} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              autoFocus type="text" placeholder="Lise veya şehir ara..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 32px',
                border: `1px solid ${T.border}`, borderRadius: 9,
                background: T.bgDeep, color: T.text, fontSize: 13,
                outline: 'none', fontFamily: FONT_BODY, boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = T.brown}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <X size={12} color={T.textMuted} />
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
            <strong style={{ color: T.text }}>{filtered.length}</strong> lise
            {search ? ` (arama: "${search}")` : ` · ${year}`}
          </p>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: isMobile ? '10px 14px 16px' : '12px 24px 20px', flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted }}>
              <School size={32} color={T.borderCard} style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontSize: 13 }}>Sonuç bulunamadı</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {filtered.map((school, i) => (
                <SchoolRow key={i} school={school} index={i} isMobile={isMobile} onClick={() => goToSchoolDetail(school)} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: isMobile ? '10px 14px' : '12px 24px 16px', borderTop: `1px solid ${T.borderCard}`, flexShrink: 0 }}>
          <button
            onClick={() => { onClose(); navigate(`/universities/v2/${encodeURIComponent(univ.name)}`); }}
            style={{ width: '100%', padding: '11px', background: T.navy, color: '#fff',
              border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontFamily: FONT_BODY, marginBottom: 8 }}>
            <Building2 size={15}/> {univ.name} Detay Sayfasına Git
          </button>
          <p style={{ fontSize: 10, color: T.textMuted, textAlign: 'center' }}>
            {isMobile ? 'Liseye tıklayarak detayları görün' : 'ESC veya dışına tıkla kapatmak için · Liseye tıklayarak bölüm detaylarını görün'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
const ProgramDetail = ({ data }) => {
  const { programName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(programName);

  const [progData, setProgData]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedUniv, setSelectedUniv] = useState(null);
  const [univSearch, setUnivSearch]   = useState('');

  useEffect(() => {
    if (!data?.length) return;
    const recs = data.filter(r => normalizeProgramName(r.program_name) === decodedName);
    if (!recs.length) { setLoading(false); return; }

    const calcYear = (year) => {
      const yr  = recs.filter(r => r.year === year);
      const ihl = yr.reduce((s, r) => s + (r.imam_hatip_lise_tipi?.reduce((a, t) => a + (t.yerlesen || 0), 0) || 0), 0);
      const tot = yr.reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);
      return {
        year, ihlCount: ihl, totalStudents: tot,
        universityCount: new Set(yr.map(r => r.university_name)).size,
        percentage: tot > 0 ? ((ihl / tot) * 100).toFixed(2) : 0,
      };
    };

    const d23 = calcYear('2023'), d24 = calcYear('2024'), d25 = calcYear('2025');

    const univMap = {};
    ['2023', '2024', '2025'].forEach(yr => {
      recs.filter(r => r.year === yr).forEach(r => {
        const n   = r.university_name;
        const ihl = r.imam_hatip_lise_tipi?.reduce((s, t) => s + (t.yerlesen || 0), 0) || 0;
        if (!univMap[n]) univMap[n] = { name: n, type: r.university_type, city: r.city, count2025: 0, total2025: 0, count2024: 0, count2023: 0 };
        univMap[n][`count${yr}`] += ihl;
        if (yr === '2025') univMap[n].total2025 += r.toplam_yerlesen || 0;
      });
    });

    const universities = Object.values(univMap)
      .filter(u => u.count2025 > 0)
      .map(u => ({
        ...u,
        percentage2025: u.total2025 > 0 ? ((u.count2025 / u.total2025) * 100).toFixed(2) : 0,
        trend: calculateTrend(u.count2025, u.count2024),
      }))
      .sort((a, b) => b.count2025 - a.count2025);

    setProgData({
      name: decodedName, category: recs[0]?.puan_turu || '',
      yearlyData: [d23, d24, d25], data2025: d25, data2024: d24,
      universities, topUniversities: universities.slice(0, 10),
    });
    setLoading(false);
  }, [data, decodedName]);

  const handleUnivClick = (univ) => {
    setSelectedUniv(univ);
  };

  /* Türkçe-duyarsız üniversite filtresi */
  const filteredUnivs = progData?.universities.filter(u =>
    !univSearch ||
    trNorm(u.name).includes(trNorm(univSearch)) ||
    trNorm(u.city || '').includes(trNorm(univSearch))
  ) || [];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%',
          border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }}/>
    </div>
  );

  if (!progData) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: T.textMuted }}>
      <Building2 size={40} color={T.borderCard} style={{ margin: '0 auto 12px' }}/>
      <p style={{ marginBottom: 16 }}>Bölüm bulunamadı</p>
      <button onClick={() => navigate('/programs/v2')}
        style={{ padding: '9px 20px', background: T.navy, color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: FONT_BODY }}>
        Bölümlere Dön
      </button>
    </div>
  );

  const trend2425    = calculateTrend(progData.data2025.ihlCount, progData.data2024.ihlCount);
  const titleNavy  = progData.name.slice(0, 20);
  const titleBrown = progData.name.slice(20);

  return (
    <>
      {/* ── IHL SCHOOLS MODAL ── */}
      <AnimatePresence>
        {selectedUniv && (
          <SchoolModal 
            univ={selectedUniv} 
            data={data} 
            programName={decodedName}
            onClose={() => setSelectedUniv(null)} 
          />
        )}
      </AnimatePresence>

      <div style={{ background: T.bg, minHeight: '100vh', padding: '0 0 80px',
        fontFamily: FONT_BODY, color: T.text }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

        {/* ══ HERO ══ */}
        <section style={{
          padding: 'clamp(36px,5vw,64px) clamp(20px,6vw,80px) clamp(28px,4vw,52px)',
          position: 'relative', overflow: 'hidden',
          background: T.bg, borderBottom: `1px solid ${T.border}`,
        }}>
          {/* Warm radial wash */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 65% 55% at 85% 45%, ${T.brownPale} 0%, transparent 65%)` }} />
          {/* Notebook lines */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`,
            opacity: 0.45 }} />
          {/* Left margin rule */}
          <div style={{ position: 'absolute', left: 'clamp(16px,4.5vw,56px)', top: 0, bottom: 0, width: 1,
            background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />
          {/* Ghost letter */}
          <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)',
            fontSize: '28vw', fontWeight: 800, color: T.navy, opacity: 0.022,
            fontFamily: FONT_DISPLAY, fontStyle: 'italic', lineHeight: 1,
            userSelect: 'none', pointerEvents: 'none' }}>
            {progData.name.charAt(0)}
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Back */}
            <motion.button onClick={() => navigate('/programs/v2')} whileHover={{ x: -3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                cursor: 'pointer', color: T.textSub, fontSize: 12, marginBottom: 20, padding: 0,
                fontFamily: FONT_BODY, fontWeight: 600 }}>
              <ArrowLeft size={14}/> Bölümlere Dön
            </motion.button>

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase',
                letterSpacing: '0.22em', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{ display: 'inline-block', width: 28, height: 1.5,
                background: T.brown, borderRadius: 1 }} />
              İHL Mezunları · Bölüm Detayı · YÖK Atlas
            </motion.p>

            {/* Program adı — harf-harf animasyon */}
            <div style={{ overflow: 'hidden', marginBottom: 14 }}>
              {titleNavy.split('').map((ch, ci) => (
                <motion.span key={ci}
                  initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 + ci * 0.028, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'inline-block',
                    fontSize: 'clamp(28px,5vw,68px)', marginTop: "0.1em", marginBottom: "0.1em" , fontWeight: 800, lineHeight: 1,
                    fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                    color: T.navy, letterSpacing: '-0.02em' }}
                >{ch === ' ' ? '\u00A0' : ch}</motion.span>
              ))}
              {titleBrown && (
                <motion.span
                  initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'inline-block',
                    fontSize: 'clamp(28px,5vw,68px)', marginTop: "0.1em", fontWeight: 800, lineHeight: 1,
                    fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                    color: T.navy, letterSpacing: '-0.02em' }}
                >{titleBrown}</motion.span>
              )}
            </div>

            {/* Puan türü chip */}
            {progData.category && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16,
                  padding: '4px 12px', background: `${T.brown}14`,
                  border: `1px solid ${T.brown}28`, borderRadius: 20 }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: T.brown }}>
                  Alan: {progData.category}
                </span>
              </motion.div>
            )}

            {/* Rule */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 1.3, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: 2, width: 'min(45%, 280px)', originX: 0, marginBottom: 28,
                background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`,
                borderRadius: 1 }}
            />

            {/* Stat strip */}
            <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', flexWrap: 'wrap' }}>
              {[
                { l: 'İHL 2025',    v: progData.data2025.ihlCount.toLocaleString('tr-TR'), c: T.navy  },
                { l: 'Üniversite',  v: String(progData.data2025.universityCount),          c: T.brown },
                { l: 'Oran',        v: `%${progData.data2025.percentage}`,                 c: T.navy  },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ borderLeft: `2px solid ${s.c}33`, paddingLeft: 14 }}
                >
                  <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: 5 }}>{s.l}</p>
                  <p style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: s.c,
                    lineHeight: 1, fontFamily: FONT_DISPLAY }}>{s.v}</p>
                </motion.div>
              ))}
              {/* Trend stat */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderLeft: `2px solid ${trend2425.direction === 'up' ? '#22a55e' : '#d94040'}33`, paddingLeft: 14 }}
              >
                <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 5 }}>Trend 24→25</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {trend2425.direction === 'up'
                    ? <TrendingUp size={18} color="#22a55e"/>
                    : <TrendingDown size={18} color="#d94040"/>}
                  <span style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, lineHeight: 1,
                    fontFamily: FONT_DISPLAY,
                    color: trend2425.direction === 'up' ? '#22a55e' : '#d94040' }}>
                    {trend2425.direction === 'up' ? '+' : '-'}%{trend2425.percentage}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CONTENT ── */}
        <div style={{ padding: '28px 5vw 0' }}>

          {/* ── İKİ KOLON ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 16, marginBottom: 16 }}>
            {/* 3 Yıl Tablosu */}
            <Card accent={T.navy} delay={0.06}>
              <SectionTitle color={T.navy}>Son Üç Yıl</SectionTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Yıl','İHL','Toplam','Üniv.','Oran'].map(h => (
                      <th key={h} style={{ fontSize: 10, fontWeight: 700, color: T.textMuted,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        textAlign: h === 'Yıl' ? 'left' : 'right',
                        padding: '0 0 10px', borderBottom: `1px solid ${T.borderCard}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progData.yearlyData.map((yd, i) => (
                    <tr key={yd.year}>
                      <td style={{ padding: '10px 0', borderBottom: `1px solid ${T.borderCard}`,
                        fontSize: i === 2 ? 16 : 13, fontWeight: i === 2 ? 800 : 600,
                        color: i === 2 ? T.navy : T.textSub, fontFamily: FONT_DISPLAY }}>{yd.year}</td>
                      <td style={{ textAlign: 'right', padding: '10px 0',
                        borderBottom: `1px solid ${T.borderCard}`, fontSize: 13, fontWeight: 700, color: T.text }}>
                        {yd.ihlCount.toLocaleString('tr-TR')}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 0',
                        borderBottom: `1px solid ${T.borderCard}`, fontSize: 12, color: T.textSub }}>
                        {yd.totalStudents.toLocaleString('tr-TR')}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 0',
                        borderBottom: `1px solid ${T.borderCard}`, fontSize: 12, color: T.textSub }}>
                        {yd.universityCount}
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 0',
                        borderBottom: `1px solid ${T.borderCard}`, fontSize: 13, fontWeight: 700, color: T.brown }}>
                        %{yd.percentage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Trend Chart */}
            <Card accent={T.brown} delay={0.1}>
              <SectionTitle color={T.brown}>İHL Öğrenci Trendi</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={progData.yearlyData}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false}/>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={tipStyle} formatter={v => [v.toLocaleString('tr-TR'), 'İHL']}/>
                  <Line type="monotone" dataKey="ihlCount" stroke={T.brown} strokeWidth={2.5}
                    dot={{ fill: T.brown, r: 5, strokeWidth: 0 }}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* ── TOP 10 ÜNİVERSİTE ── */}
          <Card accent={T.navy} delay={0.14} style={{ marginBottom: 16 }}>
            <SectionTitle color={T.navy}>En Çok Tercih Edilen 10 Üniversite (2025)</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16,
              marginTop: -10, padding: '8px 12px', background: T.brownPale, borderRadius: 8 }}>
              <Info size={12} color={T.brown}/>
              <span style={{ fontSize: 12, color: T.textSub }}>
                Üniversiteye tıklayarak mezun olunan İmam Hatip Liselerini görün
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {progData.topUniversities.map((u, i) => (
                <UnivRow key={i} univ={u} index={i} onIHLClick={handleUnivClick} navigate={navigate}/>
              ))}
            </div>
          </Card>

          {/* ── TÜM ÜNİVERSİTELER ── */}
          <Card accent={T.brown} delay={0.18}>
            {/* Başlık + Arama */}
            <div style={{ display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <SectionTitle color={T.brown}>
                Tüm Üniversiteler ({progData.universities.length})
              </SectionTitle>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Search size={13} color={T.textMuted}
                  style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}/>
                <input
                  type="text"
                  placeholder="Üniversite veya şehir ara..."
                  value={univSearch}
                  onChange={e => setUnivSearch(e.target.value)}
                  style={{
                    paddingLeft: 30, paddingRight: univSearch ? 28 : 12,
                    paddingTop: 7, paddingBottom: 7,
                    border: `1px solid ${T.border}`, borderRadius: 9,
                    fontSize: 12, color: T.text, background: T.bgDeep,
                    outline: 'none', fontFamily: FONT_BODY,
                    width: 'clamp(180px,25vw,300px)', transition: 'border-color 0.18s',
                  }}
                  onFocus={e => e.target.style.borderColor = T.brown}
                  onBlur={e  => e.target.style.borderColor = T.border}
                />
                {univSearch && (
                  <button onClick={() => setUnivSearch('')}
                    style={{ position: 'absolute', right: 8, top: '50%',
                      transform: 'translateY(-50%)', background: 'none',
                      border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                    <X size={12} color={T.textMuted}/>
                  </button>
                )}
              </div>
            </div>

            {/* Sonuç sayacı */}
            {univSearch && (
              <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 12, marginTop: -8 }}>
                <strong style={{ color: T.text }}>{filteredUnivs.length}</strong> sonuç
                {filteredUnivs.length === 0 && (
                  <span style={{ color: T.brown, marginLeft: 6, fontStyle: 'italic' }}>
                    — Türkçe karakterleri deneyebilirsiniz (ö, ü, ş, ç, ğ, ı)
                  </span>
                )}
              </p>
            )}

            {/* Tablo — sticky başlık */}
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '68vh' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {['Üniversite','Şehir','Tip','2025','Oran','Trend','İHL Detay'].map(h => (
                      <th key={h} style={{
                        fontSize: 10, fontWeight: 700, color: T.textMuted,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        textAlign: h === 'Üniversite' ? 'left' : 'center',
                        padding: '10px 10px', whiteSpace: 'nowrap',
                        position: 'sticky', top: 0, zIndex: 10,
                        background: T.bgDeep,
                        borderBottom: `2px solid ${T.borderCard}`,
                        boxShadow: '0 2px 8px rgba(28,31,46,0.06)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUnivs.map((u, i) => (
                    <tr key={i}
                      onMouseEnter={e => e.currentTarget.style.background = T.bgDeep}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      style={{ transition: 'background 0.15s' }}
                    >
                      <td style={{ padding: '9px 10px', borderBottom: `1px solid ${T.borderCard}`,
                        fontSize: 13, fontWeight: 500, color: T.text }}>{u.name}</td>
                      <td style={{ textAlign: 'center', padding: '9px 10px',
                        borderBottom: `1px solid ${T.borderCard}`, fontSize: 12, color: T.textSub }}>
                        {u.city}
                      </td>
                      <td style={{ textAlign: 'center', padding: '9px 10px',
                        borderBottom: `1px solid ${T.borderCard}` }}>
                        <Badge type={u.type}/>
                      </td>
                      <td style={{ textAlign: 'center', padding: '9px 10px',
                        borderBottom: `1px solid ${T.borderCard}`,
                        fontSize: 15, fontWeight: 800, color: T.navy, fontFamily: FONT_DISPLAY }}>
                        {u.count2025}
                      </td>
                      <td style={{ textAlign: 'center', padding: '9px 10px',
                        borderBottom: `1px solid ${T.borderCard}`,
                        fontSize: 12, fontWeight: 600, color: T.brown }}>
                        %{u.percentage2025}
                      </td>
                      <td style={{ textAlign: 'center', padding: '9px 10px',
                        borderBottom: `1px solid ${T.borderCard}` }}>
                        <div style={{ display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: 3 }}>
                          {u.trend.direction === 'up'
                            ? <TrendingUp size={12} color="#22a55e"/>
                            : u.trend.direction === 'down'
                            ? <TrendingDown size={12} color="#d94040"/> : null}
                          <span style={{ fontSize: 11, fontWeight: 700,
                            color: u.trend.direction === 'up' ? '#22a55e'
                              : u.trend.direction === 'down' ? '#d94040' : T.textMuted }}>
                            {u.trend.direction !== 'neutral'
                              ? (u.trend.direction === 'up' ? '+' : '-') + '%' + u.trend.percentage
                              : '—'}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '9px 10px',
                        borderBottom: `1px solid ${T.borderCard}` }}>
                        <div style={{ display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: 5 }}>
                          <button
                            onClick={e => { e.stopPropagation(); handleUnivClick(u); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 4,
                              padding: '4px 10px', background: T.brownPale, color: T.brown,
                              border: `1px solid ${T.brown}22`, borderRadius: 7,
                              cursor: 'pointer', fontSize: 11, fontWeight: 600,
                              transition: 'all 0.15s', fontFamily: FONT_BODY }}
                            onMouseEnter={e => { e.currentTarget.style.background = T.brown; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = T.brownPale; e.currentTarget.style.color = T.brown; }}
                          >
                            <School size={11}/> Liseler
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/universities/v2/${encodeURIComponent(u.name)}`); }}
                            style={{ padding: 5, background: 'transparent', border: 'none',
                              cursor: 'pointer', color: T.textMuted, display: 'flex' }}>
                            <ChevronRight size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUnivs.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: T.textMuted, fontSize: 13 }}>
                        Sonuç bulunamadı
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>{/* ── /CONTENT ── */}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────────
   TOP-10 ÜNİVERSİTE SATIRI
───────────────────────────────────────────────────── */
const UnivRow = ({ univ, index, onIHLClick, navigate }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onIHLClick(univ)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        borderRadius: 11, cursor: 'pointer',
        background: hov ? T.bgDeep : 'transparent',
        border: `1px solid ${hov ? T.brown + '30' : T.borderCard}`,
        transition: 'all 0.15s' }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: index < 3 ? T.navy : `${T.navy}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700,
          color: index < 3 ? '#fff' : T.textMuted }}>{index + 1}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500,
          color: hov ? T.brown : T.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'color 0.15s' }}>{univ.name}</p>
        <p style={{ fontSize: 11, color: T.textMuted,
          display: 'flex', alignItems: 'center', gap: 5 }}>
          {univ.city}
          {univ.city && <span style={{ color: T.borderCard }}>·</span>}
          <Badge type={univ.type}/>
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 20, fontWeight: 800, color: T.navy,
          fontFamily: FONT_DISPLAY, lineHeight: 1 }}>{univ.count2025}</p>
        <p style={{ fontSize: 10.5, color: T.textMuted }}>%{univ.percentage2025}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, width: 52 }}>
        {univ.trend.direction === 'up'
          ? <TrendingUp size={12} color="#22a55e"/>
          : univ.trend.direction === 'down'
          ? <TrendingDown size={12} color="#d94040"/> : null}
        <span style={{ fontSize: 11, fontWeight: 700,
          color: univ.trend.direction === 'up' ? '#22a55e'
            : univ.trend.direction === 'down' ? '#d94040' : T.textMuted }}>
          {univ.trend.direction !== 'neutral'
            ? (univ.trend.direction === 'up' ? '+' : '-') + '%' + univ.trend.percentage : '—'}
        </span>
      </div>
      <button
        onClick={e => { e.stopPropagation(); navigate(`/universities/v2/${encodeURIComponent(univ.name)}`); }}
        style={{ padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
        <ChevronRight size={14} color={hov ? T.brown : T.textMuted}/>
      </button>
    </div>
  );
};

export default ProgramDetail;