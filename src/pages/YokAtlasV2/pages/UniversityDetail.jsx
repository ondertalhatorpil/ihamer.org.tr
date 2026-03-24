import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Building2, BookOpen, AlertCircle,
         ChevronRight, School, X, Search, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { calculateTrend, categorizePuanTuru, normalizeProgramName } from '../utils/dataProcessor';


// Türkçe karakter duyarsız normalize
const trNorm = (s) =>
  (s || '').toLocaleLowerCase('tr-TR')
    .normalize('NFC')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c');

const T = {
  bg: '#faf8f4', bgDeep: '#f4f0e8', bgCard: '#ffffff',
  border: 'rgba(28,31,46,0.10)', borderCard: 'rgba(28,31,46,0.08)',
  text: '#1c1f2e', textSub: '#4a4e65', textMuted: '#8a8ea8',
  navy: '#1c1f2e', navyMid: '#2d3250',
  brown: '#8b5e3c', brownLight: '#c49a6c', brownPale: '#f0e4d0',
  shadow: 'rgba(28,31,46,0.08)', shadowMd: 'rgba(28,31,46,0.14)',
};

const TYPE_STYLES = {
  Devlet: { bg: `${T.navy}12`, color: T.navy, border: `${T.navy}28` },
  Vakıf:  { bg: `${T.brown}12`, color: T.brown, border: `${T.brown}28` },
  KKTC:   { bg: `${T.brownLight}22`, color: '#7a4a10', border: `${T.brownLight}44` },
};

const YEARS = ['Tüm Yıllar', '2023', '2024', '2025'];

const Badge = ({ type }) => {
  const s = TYPE_STYLES[type] || TYPE_STYLES.Devlet;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 6, background: s.bg, color: s.color,
      border: `1px solid ${s.border}`, flexShrink: 0 }}>
      {type}
    </span>
  );
};

const Card = ({ children, style = {}, accent }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const ac = accent || T.brown;
  return (
    <div ref={ref} style={{
      background: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 14,
      padding: '22px 20px', position: 'relative', boxShadow: `0 2px 10px ${T.shadow}`,
      overflow: 'hidden',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)',
      ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2,
        background: `linear-gradient(90deg, transparent, ${ac}44, transparent)` }}/>
      {children}
    </div>
  );
};

const SectionTitle = ({ children, color }) => (
  <div style={{ marginBottom: 18 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: T.navy, fontFamily: '"Playfair Display", serif',
      fontStyle: 'italic', letterSpacing: '-0.01em' }}>{children}</h2>
    <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${color || T.brown}, transparent)`,
      borderRadius: 1, marginTop: 4 }}/>
  </div>
);

const tipStyle = { backgroundColor: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 10,
  color: T.text, fontSize: 12, boxShadow: `0 4px 16px ${T.shadow}` };

/* ─────────────────────────────────────────────────────
   imam_hatip_liseler iki formatı destekler
   Format 1: [{ lise, yerlesen }]
   Format 2: [{ imam_hatip_liseler: [{ lise, yerlesen }] }]
───────────────────────────────────────────────────── */
const extractSchools = (arr) => {
  if (!arr || !Array.isArray(arr)) return [];
  const out = [];
  arr.forEach(item => {
    if (item.lise !== undefined) {
      out.push(item);
    } else if (Array.isArray(item.imam_hatip_liseler)) {
      item.imam_hatip_liseler.forEach(s => out.push(s));
    }
  });
  return out;
};

/* Üniversite + bölüm kombinasyonu için lise listesi (yıl filtrelemeli) */
const buildProgramSchools = (data, univName, progName, year = 'Tüm Yıllar') => {
  const schoolMap = {};
  data
    .filter(r =>
      r.university_name === univName &&
      normalizeProgramName(r.program_name) === progName &&
      (year === 'Tüm Yıllar' || r.year === year)
    )
    .forEach(record => {
      extractSchools(record.imam_hatip_liseler).forEach(s => {
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

/* ─────────────────────────────────────────────────────
   MEZUNLARIN LİSELERİ MODAL
───────────────────────────────────────────────────── */
const SchoolModal = ({ univName, progName, data, onClose }) => {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('Tüm Yıllar');

  // Yıla göre okul listesi
  const schools = useMemo(() => 
    buildProgramSchools(data, univName, progName, year),
  [data, univName, progName, year]);

  const filtered = useMemo(() =>
    search.trim()
      ? schools.filter(s =>
          trNorm(s.name).includes(trNorm(search)) ||
          trNorm(s.city).includes(trNorm(search)))
      : schools,
  [schools, search]);

  const totalStudents = schools.reduce((s, x) => s + x.total, 0);

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(28,31,46,0.55)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ background: T.bgCard, borderRadius: 20, width: '100%', maxWidth: 680,
          maxHeight: '90vh', overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(28,31,46,0.28)',
          border: `1px solid ${T.borderCard}`,
          display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Header ── */}
        <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
          padding: '22px 24px 18px', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: 2,
            background: `linear-gradient(90deg, transparent, ${T.brownLight}88, transparent)` }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={13} color="#fff" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.brownLight,
                  letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                  Mezunların Liseleri
                </span>
              </div>
              {/* bölüm adı — birincil başlık */}
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff',
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                lineHeight: 1.2, marginBottom: 5 }}>
                {progName}
              </h2>
              {/* üniversite adı — ikincil */}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)',
                display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={11} />{univName}
              </p>
            </div>
            <button onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 9,
                padding: 8, cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              ['Toplam İHL Mezunu',  totalStudents.toLocaleString('tr-TR')],
              ['Farklı Lise Sayısı', schools.length.toLocaleString('tr-TR')],
            ].map(([label, val]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#fff',
                  fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Year filter buttons */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYear(y)}
                style={{
                  padding: '5px 14px', borderRadius: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                  cursor: 'pointer', transition: 'all 0.18s',
                  border: year === y ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  background: year === y ? `linear-gradient(135deg, ${T.brown}, ${T.brownLight})` : 'rgba(255,255,255,0.08)',
                  color: year === y ? '#fff' : 'rgba(255,255,255,0.6)',
                  boxShadow: year === y ? `0 2px 10px ${T.brown}66` : 'none',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Calendar size={10} />
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search ── */}
        <div style={{ padding: '14px 24px 10px', borderBottom: `1px solid ${T.borderCard}`, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color={T.textMuted}
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              autoFocus
              type="text"
              placeholder="Lise veya şehir ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 32px',
                border: `1px solid ${T.border}`, borderRadius: 9,
                background: T.bgDeep, color: T.text, fontSize: 13,
                outline: 'none', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = T.brown}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <X size={12} color={T.textMuted} />
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>
            <strong style={{ color: T.text }}>{filtered.length}</strong> lise
            {search ? ` (arama: "${search}")` : ` · ${year}`}
          </p>
        </div>

        {/* ── List ── */}
        <div style={{ overflowY: 'auto', padding: '12px 24px 20px', flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted }}>
              <School size={32} color={T.borderCard} style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontSize: 13 }}>Arama kriterine uygun lise bulunamadı</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.map((school, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 13px', borderRadius: 10,
                  background: i < 3 ? `${T.navy}06` : T.bgDeep,
                  border: `1px solid ${i < 3 ? T.navy + '14' : T.borderCard}` }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                    background: i < 3 ? `linear-gradient(135deg, ${T.navy}, ${T.navyMid})` : `${T.navy}10`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 700,
                      color: i < 3 ? '#fff' : T.textMuted,
                      fontFamily: '"Playfair Display", serif' }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: T.text,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      lineHeight: 1.3 }}>{school.name.split('(')[0].trim()}</p>
                    <p style={{ fontSize: 10.5, color: T.textMuted,
                      display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <MapPin size={9} />{school.city}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 20, fontWeight: 800,
                      color: i < 3 ? T.navy : T.brown,
                      fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{school.total}</p>
                    <p style={{ fontSize: 9.5, color: T.textMuted }}>öğrenci</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '11px 24px 15px', borderTop: `1px solid ${T.borderCard}`,
          flexShrink: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: T.textMuted }}>
            {year === 'Tüm Yıllar' ? 'Tüm yıllar (2023–2025) dahil' : `${year} yılı verileri`} · ESC veya dışına tıkla kapatmak için
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
const UniversityDetail = ({ data }) => {
  const { universityName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(universityName);
  const [uData, setUData]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [schoolModal, setSchoolModal] = useState(null); // { progName }
  const [progSearch, setProgSearch]   = useState('');

  const hasAcikogretim = n =>
    ['ATATÜRK ÜNİVERSİTESİ', 'ANADOLU ÜNİVERSİTESİ', 'İSTANBUL ÜNİVERSİTESİ'].some(x => n.includes(x));

  useEffect(() => {
    if (!data?.length) return;
    const recs = data.filter(r => r.university_name === decodedName);
    if (!recs.length) { setLoading(false); return; }

    const calcYear = (year) => {
      const yr = recs.filter(r => r.year === year);
      const ihl = yr.reduce((s, r) => s + (r.imam_hatip_lise_tipi?.reduce((a, t) => a + (t.yerlesen || 0), 0) || 0), 0);
      const tot = yr.reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);
      return { year, ihlCount: ihl, totalStudents: tot, percentage: tot > 0 ? ((ihl / tot) * 100).toFixed(2) : 0 };
    };

    const d23 = calcYear('2023'), d24 = calcYear('2024'), d25 = calcYear('2025');

    const progMap = {};
    ['2025', '2024', '2023'].forEach(yr => {
      recs.filter(r => r.year === yr).forEach(r => {
        const nm  = normalizeProgramName(r.program_name);
        const ihl = r.imam_hatip_lise_tipi?.reduce((s, t) => s + (t.yerlesen || 0), 0) || 0;
        if (!progMap[nm]) progMap[nm] = { name: nm, count2023: 0, total2023: 0, count2024: 0, total2024: 0, count2025: 0, total2025: 0, puanTuru: r.puan_turu };
        progMap[nm][`count${yr}`] += ihl;
        progMap[nm][`total${yr}`] += r.toplam_yerlesen || 0;
      });
    });

    const programs = Object.values(progMap)
      .filter(p => p.count2023 > 0 || p.count2024 > 0 || p.count2025 > 0)
      .map(p => ({
        ...p,
        percentage2025: p.total2025 > 0 ? ((p.count2025 / p.total2025) * 100).toFixed(2) : 0,
        percentage2024: p.total2024 > 0 ? ((p.count2024 / p.total2024) * 100).toFixed(2) : 0,
        percentage2023: p.total2023 > 0 ? ((p.count2023 / p.total2023) * 100).toFixed(2) : 0,
        trend: calculateTrend(p.count2025, p.count2024),
        category: categorizePuanTuru(p.puanTuru),
      }));

    const catMap = {};
    programs.forEach(p => {
      const c = p.category;
      if (!catMap[c]) catMap[c] = { category: c, count: 0, total: 0 };
      catMap[c].count += p.count2025; catMap[c].total += p.total2025;
    });
    const categories = Object.values(catMap).map(c => ({
      ...c, percentage: c.total > 0 ? ((c.count / c.total) * 100).toFixed(2) : 0,
    }));

    setUData({
      name: decodedName, type: recs[0]?.university_type || 'Devlet', city: recs[0]?.city || '',
      yearlyData: [d23, d24, d25], data2023: d23, data2024: d24, data2025: d25,
      programCount: programs.length,
      topPrograms:  [...programs].sort((a, b) => b.count2025 - a.count2025).slice(0, 10),
      allPrograms:  [...programs].sort((a, b) => a.name.localeCompare(b.name, 'tr')),
      categories:   categories.sort((a, b) => b.count - a.count),
    });
    setLoading(false);
  }, [data, decodedName]);

  const openModal = (progName) => {
    setSchoolModal({ progName });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }}/>
    </div>
  );

  if (!uData) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: T.textMuted }}>
      <Building2 size={40} color={T.borderCard} style={{ margin: '0 auto 12px' }}/>
      <p>Üniversite bulunamadı</p>
      <button onClick={() => navigate('/universities/v2')}
        style={{ marginTop: 16, padding: '9px 20px', background: T.navy, color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>
        Üniversitelere Dön
      </button>
    </div>
  );

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: '0 0 80px',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: T.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {schoolModal && (
          <SchoolModal
            univName={uData.name}
            progName={schoolModal.progName}
            data={data}
            onClose={() => setSchoolModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section style={{
        padding: 'clamp(36px,5vw,64px) clamp(20px,6vw,80px) clamp(28px,4vw,48px)',
        position: 'relative', overflow: 'hidden',
        background: T.bg, borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 65% 55% at 85% 45%, ${T.brownPale} 0%, transparent 65%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.45 }} />
        <div style={{ position: 'absolute', left: 'clamp(16px,4.5vw,56px)', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Back */}
          <motion.button onClick={() => navigate('/universities/v2')} whileHover={{ x: -3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: T.textSub, fontSize: 12, marginBottom: 20, padding: 0,
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600 }}>
            <ArrowLeft size={14}/> Üniversitelere Dön
          </motion.button>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · Üniversite Detayı · YÖK Atlas
          </motion.p>

          {/* Üniversite adı animasyonu */}
          <div style={{ overflow: 'hidden', marginBottom: 14 }}>
            {uData.name.split('').slice(0, 20).map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 + ci * 0.022, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: 'clamp(24px,4vw,52px)', marginTop:10, marginBottom:10, fontWeight: 800, lineHeight: 1.0, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em' }}
              >{ch === ' ' ? '\u00A0' : ch}</motion.span>
            ))}
            {uData.name.length > 20 && (
              <motion.span
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: 'clamp(24px,4vw,52px)', fontWeight: 800, lineHeight: 1.0, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.avy, letterSpacing: '-0.02em' }}
              >{uData.name.slice(20)}</motion.span>
            )}
          </div>

          {/* Badge + şehir */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}
          >
            <Badge type={uData.type}/>
            {uData.city && (
              <span style={{ fontSize: 12, color: T.textSub, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11}/>{uData.city}
              </span>
            )}
          </motion.div>

          {hasAcikogretim(uData.name) && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18,
                padding: '7px 12px', background: T.brownPale, border: `1px solid ${T.brown}22`, borderRadius: 8 }}>
              <AlertCircle size={13} color={T.brown}/>
              <span style={{ fontSize: 12, color: T.brown, fontWeight: 500 }}>Açık Öğretim Lisans Bölümleri Dahildir</span>
            </motion.div>
          )}

          {/* Rule */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 2, width: 'min(45%, 280px)', originX: 0, marginBottom: 24, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`, borderRadius: 1 }}
          />

          {/* Stat strip */}
          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', flexWrap: 'wrap' }}>
            {[
              { l: 'İHL 2025', v: uData.data2025.ihlCount.toLocaleString('tr-TR'), c: T.navy  },
              { l: 'İHL 2024', v: uData.data2024.ihlCount.toLocaleString('tr-TR'), c: T.brown },
              { l: 'Oran',     v: `%${uData.data2025.percentage}`,                 c: T.navy  },
              { l: 'Program',  v: String(uData.programCount),                      c: T.brown },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderLeft: `2px solid ${s.c}33`, paddingLeft: 14 }}
              >
                <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{s.l}</p>
                <p style={{ fontSize: 'clamp(20px,2.8vw,30px)', fontWeight: 800, color: s.c, lineHeight: 1, fontFamily: '"Playfair Display", serif' }}>{s.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div style={{ padding: '28px 5vw 0' }}>

      {/* ── TWO COL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 16, marginBottom: 16 }}>
        <Card accent={T.navy}>
          <SectionTitle color={T.navy}>Son Üç Yıl İstatistikleri</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Yıl','İHL','Toplam','Oran','Değişim'].map(h => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 700, color: T.textMuted,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textAlign: h === 'Yıl' ? 'left' : 'right',
                    padding: '0 0 12px', borderBottom: `1px solid ${T.borderCard}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uData.yearlyData.map((yd, idx) => {
                const prev = idx > 0 ? uData.yearlyData[idx - 1] : null;
                const tr   = prev ? calculateTrend(yd.ihlCount, prev.ihlCount) : null;
                const isLatest = idx === 2;
                return (
                  <tr key={yd.year}>
                    <td style={{ padding: '11px 0', borderBottom: `1px solid ${T.borderCard}` }}>
                      <span style={{ fontSize: isLatest ? 16 : 14, fontWeight: isLatest ? 800 : 600,
                        color: isLatest ? T.navy : T.textSub, fontFamily: '"Playfair Display", serif' }}>{yd.year}</span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '11px 0', borderBottom: `1px solid ${T.borderCard}`, fontSize: 14, fontWeight: 700, color: T.text }}>{yd.ihlCount.toLocaleString('tr-TR')}</td>
                    <td style={{ textAlign: 'right', padding: '11px 0', borderBottom: `1px solid ${T.borderCard}`, fontSize: 13, color: T.textSub }}>{yd.totalStudents.toLocaleString('tr-TR')}</td>
                    <td style={{ textAlign: 'right', padding: '11px 0', borderBottom: `1px solid ${T.borderCard}`, fontSize: 13, fontWeight: 700, color: T.brown }}>%{yd.percentage}</td>
                    <td style={{ textAlign: 'right', padding: '11px 0', borderBottom: `1px solid ${T.borderCard}` }}>
                      {tr && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                          {tr.direction === 'up' ? <TrendingUp size={12} color="#22a55e"/> : <TrendingDown size={12} color="#d94040"/>}
                          <span style={{ fontSize: 12, fontWeight: 700, color: tr.direction === 'up' ? '#22a55e' : '#d94040' }}>
                            {tr.direction === 'up' ? '+' : '-'}%{tr.percentage}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card accent={T.brown}>
          <SectionTitle color={T.brown}>İHL Öğrenci Trendi</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={uData.yearlyData}>
              <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false}/>
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tipStyle} formatter={v => [v.toLocaleString('tr-TR'), 'İHL Öğrenci']}/>
              <Line type="monotone" dataKey="ihlCount" stroke={T.brown} strokeWidth={2.5}
                dot={{ fill: T.brown, r: 5, strokeWidth: 0 }} name="İHL"/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── ALAN DAĞILIMI ── */}
      <Card accent={T.navy} style={{ marginBottom: 16 }}>
        <SectionTitle color={T.navy}>Alan Dağılımı (2025)</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={uData.categories} margin={{ bottom: 10 }}>
            <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false}/>
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={tipStyle} cursor={false}/>
            <Bar yAxisId="left"  dataKey="count"      fill={T.navy}       name="Öğrenci"  radius={[5,5,0,0]} opacity={0.85}/>
            <Bar yAxisId="right" dataKey="percentage" fill={T.brownLight} name="Oran (%)" radius={[5,5,0,0]} opacity={0.75}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── PROGRAM BANNER ── */}
      <div style={{ background: T.brownPale, border: `1px solid ${T.brown}22`, borderRadius: 12,
        padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10,
          background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BookOpen size={18} color="#fff"/>
        </div>
        <div>
          <p style={{ fontSize: 11, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Toplam Program</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: T.navy, fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{uData.programCount}</p>
          <p style={{ fontSize: 12, color: T.textSub }}>farklı bölümde İHL mezunu var</p>
        </div>
      </div>

      {/* ── TOP 10 PROGRAMS ── */}
      <Card accent={T.brown} style={{ marginBottom: 16 }}>
        <SectionTitle color={T.brown}>En Çok Tercih Edilen 10 Bölüm (2025)</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Bölüm','2025','Oran','Trend','Liseler'].map(h => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 700, color: T.textMuted,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textAlign: h === 'Bölüm' ? 'left' : 'center',
                    padding: '10px 8px', whiteSpace: 'nowrap',
                    position: 'sticky', top: 0, zIndex: 10,
                    background: T.bgCard,
                    borderBottom: `2px solid ${T.borderCard}`,
                    boxShadow: '0 2px 8px rgba(28,31,46,0.06)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uData.topPrograms.map((p, i) => (
                <ProgRow key={i} prog={p} navigate={navigate} onSchoolModal={openModal}/>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── ALL PROGRAMS ── */}
      <Card accent={T.navy}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
          <SectionTitle color={T.navy}>Tüm Bölümler ({uData.allPrograms.length})</SectionTitle>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Search size={13} color={T.textMuted} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}/>
            <input
              type="text"
              placeholder="Bölüm ara..."
              value={progSearch}
              onChange={e => setProgSearch(e.target.value)}
              style={{
                paddingLeft: 32, paddingRight: progSearch ? 30 : 12, paddingTop: 8, paddingBottom: 8,
                border: `1px solid ${T.border}`, borderRadius: 9,
                fontSize: 12, color: T.text, background: T.bgDeep,
                outline: 'none', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                width: 'clamp(180px,25vw,280px)', transition: 'border-color 0.18s',
              }}
              onFocus={e => e.target.style.borderColor = T.brown}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            {progSearch && (
              <button onClick={() => setProgSearch('')}
                style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <X size={12} color={T.textMuted}/>
              </button>
            )}
          </div>
        </div>
        {progSearch && (
          <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 12, marginTop: -10 }}>
            <strong style={{ color: T.text }}>
              {uData.allPrograms.filter(p => trNorm(p.name).includes(trNorm(progSearch))).length}
            </strong> sonuç
          </p>
        )}
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '68vh' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Bölüm','2023','2024','2025','Liseler'].map(h => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 700, color: T.textMuted,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textAlign: h === 'Bölüm' ? 'left' : 'center',
                    padding: '10px 8px', whiteSpace: 'nowrap',
                    position: 'sticky', top: 0, zIndex: 10,
                    background: T.bgDeep,
                    borderBottom: `2px solid ${T.borderCard}`,
                    boxShadow: '0 2px 8px rgba(28,31,46,0.06)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uData.allPrograms
                .filter(p => !progSearch || trNorm(p.name).includes(trNorm(progSearch)))
                .map((p, i) => (
                  <AllProgRow key={i} prog={p} navigate={navigate} onSchoolModal={openModal}/>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
      </div>{/* ── /CONTENT ── */}
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   Top-10 satır
───────────────────────────────────────────────────── */
const LiselerBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 7,
      background: T.brownPale, color: T.brown,
      border: `1px solid ${T.brown}28`,
      cursor: 'pointer', fontSize: 11, fontWeight: 600,
      whiteSpace: 'nowrap', transition: 'all 0.15s' }}
    onMouseEnter={e => { e.currentTarget.style.background = T.brown; e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={e => { e.currentTarget.style.background = T.brownPale; e.currentTarget.style.color = T.brown; }}
  >
    <School size={11}/> Mezunların Liseleri
  </button>
);

const ProgRow = ({ prog, navigate, onSchoolModal }) => {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.bgDeep : 'transparent', transition: 'background 0.15s' }}>
      <td style={{ padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
        <span onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
          style={{ fontSize: 13, fontWeight: 500, color: hov ? T.brown : T.text,
            transition: 'color 0.15s', cursor: 'pointer' }}>
          {prog.name}
        </span>
      </td>
      <td style={{ textAlign: 'center', padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}`,
        fontSize: 14, fontWeight: 700, color: T.navy, fontFamily: '"Playfair Display", serif' }}>
        {prog.count2025}
      </td>
      <td style={{ textAlign: 'center', padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}`,
        fontSize: 13, fontWeight: 600, color: T.brown }}>
        %{prog.percentage2025}
      </td>
      <td style={{ textAlign: 'center', padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {prog.trend.direction === 'up'   ? <TrendingUp size={12} color="#22a55e"/> :
           prog.trend.direction === 'down' ? <TrendingDown size={12} color="#d94040"/> : null}
          <span style={{ fontSize: 12, fontWeight: 700,
            color: prog.trend.direction === 'up' ? '#22a55e'
                 : prog.trend.direction === 'down' ? '#d94040' : T.textMuted }}>
            {prog.trend.direction !== 'neutral'
              ? (prog.trend.direction === 'up' ? '+' : '-') + '%' + prog.trend.percentage : '—'}
          </span>
        </div>
      </td>
      <td style={{ textAlign: 'center', padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
        <LiselerBtn onClick={e => { e.stopPropagation(); onSchoolModal(prog.name); }}/>
      </td>
    </tr>
  );
};

/* ─────────────────────────────────────────────────────
   Tüm Bölümler satır
───────────────────────────────────────────────────── */
const AllProgRow = ({ prog, navigate, onSchoolModal }) => {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? T.bgDeep : 'transparent', transition: 'background 0.15s' }}>
      <td style={{ padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
        <span onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
          style={{ fontSize: 13, fontWeight: 500, color: hov ? T.brown : T.text,
            transition: 'color 0.15s', cursor: 'pointer' }}>
          {prog.name}
        </span>
      </td>
      {['2023','2024','2025'].map(yr => (
        <td key={yr} style={{ textAlign: 'center', padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
          {prog[`count${yr}`] > 0 ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700,
                color: yr === '2025' ? T.navy : T.textSub, display: 'block' }}>
                {prog[`count${yr}`]}
              </span>
              <span style={{ fontSize: 10, color: T.textMuted }}>%{prog[`percentage${yr}`]}</span>
            </>
          ) : (
            <span style={{ fontSize: 13, color: T.borderCard }}>—</span>
          )}
        </td>
      ))}
      <td style={{ textAlign: 'center', padding: '9px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
        <LiselerBtn onClick={e => { e.stopPropagation(); onSchoolModal(prog.name); }}/>
      </td>
    </tr>
  );
};

export default UniversityDetail;