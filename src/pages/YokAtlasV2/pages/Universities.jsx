import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, ChevronRight, Filter, Building2,
         MapPin, ArrowUpDown, School, X, GraduationCap, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { groupByUniversity, calculateTrend } from '../utils/dataProcessor';

const T = {
  bg: '#faf8f4', bgDeep: '#f4f0e8', bgCard: '#ffffff',
  border: 'rgba(28,31,46,0.10)', borderCard: 'rgba(28,31,46,0.08)',
  text: '#1c1f2e', textSub: '#4a4e65', textMuted: '#8a8ea8',
  navy: '#1c1f2e', navyMid: '#2d3250',
  brown: '#8b5e3c', brownLight: '#c49a6c', brownPale: '#f0e4d0',
  shadow: 'rgba(28,31,46,0.08)', shadowMd: 'rgba(28,31,46,0.14)',
};

/* ─── Türkçe karaktere duyarlı normalize ─── */
const trNormalize = (str) =>
  (str || '')
    .replace(/İ/g, 'i').replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş').replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase()
    .trim();

const TYPE_STYLES = {
  Devlet: { bg: `${T.navy}12`,       color: T.navy,    border: `${T.navy}28`        },
  Vakıf:  { bg: `${T.brown}12`,      color: T.brown,   border: `${T.brown}28`       },
  KKTC:   { bg: `${T.brownLight}22`, color: '#7a4a10', border: `${T.brownLight}44`  },
};

const Badge = ({ type }) => {
  const s = TYPE_STYLES[type] || TYPE_STYLES.Devlet;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0,
    }}>{type}</span>
  );
};

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

const SORT_OPTIONS = [
  { value: 'count_desc', label: 'Öğrenci Sayısı (Çok → Az)' },
  { value: 'alpha_asc',  label: 'Alfabetik (A → Z)'         },
];

const YEARS = ['Tüm Yıllar', '2023', '2024', '2025'];

/* ─── Okul listesini belirli bir yıl (veya tümü) için çıkar ─── */
const extractSchoolsForYear = (data, univName, year) => {
  const schoolMap = {};
  data
    .filter(r => r.university_name === univName && (year === 'Tüm Yıllar' || r.year === year))
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

/* ─── SCHOOL MODAL ─── */
const SchoolModal = ({ univ, data, onClose }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [year,   setYear]   = useState('Tüm Yıllar');

  const schools = useMemo(
    () => extractSchoolsForYear(data, univ.name, year),
    [data, univ.name, year]
  );

  const filtered = useMemo(() => {
    const q = trNormalize(search);
    if (!q.trim()) return schools;
    return schools.filter(s =>
      trNormalize(s.name).includes(q) ||
      trNormalize(s.city).includes(q)
    );
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

  const fontBase = '"Plus Jakarta Sans", system-ui, sans-serif';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(28,31,46,0.55)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={{    opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bgCard, borderRadius: 20,
          width: '100%', maxWidth: 700, maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(28,31,46,0.28)',
          border: `1px solid ${T.borderCard}`,
          display: 'flex', flexDirection: 'column',
          fontFamily: fontBase,
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
          padding: '22px 24px 18px', position: 'relative', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '8%', right: '8%', height: 2,
            background: `linear-gradient(90deg, transparent, ${T.brownLight}88, transparent)`,
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <GraduationCap size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.brownLight, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Mezunların Liseleri
                </span>
              </div>
              <h2 style={{
                fontSize: 18, fontWeight: 700, color: '#fff',
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                lineHeight: 1.2, letterSpacing: '-0.01em',
              }}>{univ.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <Badge type={univ.type} />
                {univ.city && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <MapPin size={10}/>{univ.city}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 9,
                padding: 8, cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.18s', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            ><X size={16} /></button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              ['İHL Mezunu',  totalStudents.toLocaleString('tr-TR')],
              ['Farklı Lise', schools.length.toLocaleString('tr-TR')],
            ].map(([label, val]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 3, letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Yıl filtresi */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => setYear(y)}
                style={{
                  padding: '5px 14px', borderRadius: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                  cursor: 'pointer', transition: 'all 0.18s',
                  border: year === y ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  background: year === y
                    ? `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`
                    : 'rgba(255,255,255,0.08)',
                  color: year === y ? '#fff' : 'rgba(255,255,255,0.6)',
                  boxShadow: year === y ? `0 2px 10px ${T.brown}66` : 'none',
                  fontFamily: fontBase,
                }}
              >
                <Calendar size={9} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search ── */}
        <div style={{ padding: '14px 24px 10px', borderBottom: `1px solid ${T.borderCard}`, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color={T.textMuted} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              autoFocus type="text" placeholder="Lise veya şehir ara..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 32px',
                border: `1px solid ${T.border}`, borderRadius: 9,
                background: T.bgDeep, color: T.text, fontSize: 13,
                outline: 'none', fontFamily: fontBase, boxSizing: 'border-box',
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
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>
            <strong style={{ color: T.text }}>{filtered.length}</strong> lise
            {search ? ` (arama: "${search}")` : ` · ${year}`}
            <span style={{ marginLeft: 8, color: T.brown, fontStyle: 'italic' }}>
              Liseye tıklayarak detay sayfasına gidin
            </span>
          </p>
        </div>

        {/* ── List ── */}
        <div style={{ overflowY: 'auto', padding: '12px 24px 20px', flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: T.textMuted }}>
              <School size={32} color={T.borderCard} style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontSize: 13 }}>Sonuç bulunamadı</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.map((school, i) => (
                <SchoolRow key={i} school={school} index={i} onClick={() => goToSchoolDetail(school)} />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '12px 24px 16px', borderTop: `1px solid ${T.borderCard}`, flexShrink: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: T.textMuted }}>
            ESC veya dışına tıkla kapatmak için &nbsp;·&nbsp; Liseye tıklayarak bölüm detaylarını görün
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Tek lise satırı ─── */
const SchoolRow = ({ school, index, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
        background: hov ? T.brownPale : (index < 3 ? `${T.navy}06` : T.bgDeep),
        border: `1px solid ${hov ? T.brown + '44' : (index < 3 ? T.navy + '14' : T.borderCard)}`,
        transition: 'all 0.18s',
        boxShadow: hov ? `0 4px 16px ${T.shadow}` : 'none',
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 7, flexShrink: 0,
        background: index < 3 ? `linear-gradient(135deg, ${T.navy}, ${T.navyMid})` : `${T.navy}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: index < 3 ? '#fff' : T.textMuted }}>{index + 1}</span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 500, color: hov ? T.brown : T.text,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          lineHeight: 1.3, transition: 'color 0.18s',
        }}>{school.name.split('(')[0].trim()}</p>
        <p style={{ fontSize: 10.5, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <MapPin size={9}/>{school.city}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: hov ? T.brown : (index < 3 ? T.navy : T.brown), fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>
            {school.total}
          </p>
          <p style={{ fontSize: 9.5, color: T.textMuted }}>öğrenci</p>
        </div>
        <ExternalLink size={13} color={hov ? T.brown : T.textMuted} style={{ transition: 'color 0.18s' }} />
      </div>
    </div>
  );
};

/* ─── UNIV ROW ─── */
const UnivRow = ({ univ, index, navigate, data, onSchoolModal }) => {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.4), ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.bgCard,
        border: `1px solid ${hov ? T.brown + '30' : T.borderCard}`,
        borderRadius: 13, padding: '14px 16px', cursor: 'default',
        boxShadow: hov ? '0 6px 24px rgba(28,31,46,0.14)' : '0 1px 6px rgba(28,31,46,0.08)',
        transition: 'box-shadow 0.25s, border-color 0.25s',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      {/* Rank */}
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: index < 3 ? `linear-gradient(135deg, ${T.navy}, ${T.navyMid})` : T.bgDeep,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: index < 3 ? '#fff' : T.textMuted,
        fontSize: 12, fontWeight: 700,
      }}>{index + 1}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span
            onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ.name)}`)}
            style={{
              fontSize: 14, fontWeight: 600, color: hov ? T.brown : T.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              transition: 'color 0.2s', cursor: 'pointer',
            }}
          >{univ.name}</span>
          <Badge type={univ.type} />
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, color: T.textMuted, flexWrap: 'wrap', alignItems: 'center' }}>
          {univ.city && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <MapPin size={10}/>{univ.city}
            </span>
          )}
          {univ.programCount && <span>{univ.programCount} program</span>}
          {univ.percentage   && <span>%{univ.percentage} oran</span>}

          <button
            onClick={e => { e.stopPropagation(); onSchoolModal(univ); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 7,
              background: hov ? T.brownPale : `${T.navy}08`,
              color: hov ? T.brown : T.textSub,
              border: `1px solid ${hov ? T.brown + '33' : T.border}`,
              cursor: 'pointer', fontSize: 11, fontWeight: 600,
              transition: 'all 0.18s', outline: 'none', letterSpacing: '0.02em',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.brownPale; e.currentTarget.style.color = T.brown; e.currentTarget.style.borderColor = T.brown + '44'; }}
            onMouseLeave={e => { e.currentTarget.style.background = hov ? T.brownPale : `${T.navy}08`; e.currentTarget.style.color = hov ? T.brown : T.textSub; e.currentTarget.style.borderColor = hov ? T.brown + '33' : T.border; }}
          >
            <School size={11}/>
            Mezunların Liseleri
          </button>
        </div>
      </div>

      {/* Trend block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderLeft: `1px solid ${T.borderCard}`, paddingLeft: 14, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 9.5, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>2024</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: T.textSub, fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>
            {univ.count2024.toLocaleString('tr-TR')}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 44 }}>
          {univ.trend.direction === 'up'
            ? <TrendingUp size={14} color="#22a55e"/>
            : univ.trend.direction === 'down'
            ? <TrendingDown size={14} color="#d94040"/>
            : <span style={{ fontSize: 10, color: T.textMuted }}>—</span>}
          <span style={{ fontSize: 11, fontWeight: 700, color: univ.trend.direction === 'up' ? '#22a55e' : univ.trend.direction === 'down' ? '#d94040' : T.textMuted }}>
            {univ.trend.direction === 'up' ? '+' : univ.trend.direction === 'down' ? '-' : ''}%{univ.trend.percentage}
          </span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: 9.5, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>2025</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: T.navy, fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>
            {univ.count2025.toLocaleString('tr-TR')}
          </p>
        </div>
        <ChevronRight size={16} color={hov ? T.brown : T.textMuted}
          style={{ transition: 'color 0.2s', cursor: 'pointer' }}
          onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ.name)}`)}
        />
      </div>
    </motion.div>
  );
};

/* ─── MAIN PAGE ─── */
const Universities = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [selectedCity, setSelectedCity] = useState('Tümü');
  const [sortOrder, setSortOrder]       = useState('count_desc');
  const [universities, setUniversities] = useState([]);
  const [cities, setCities]             = useState([]);
  const [schoolModal, setSchoolModal]   = useState(null);

  useEffect(() => {
    if (!data?.length) return;
    const univs2023 = groupByUniversity(data, '2023');
    const univs2024 = groupByUniversity(data, '2024');
    const univs2025 = groupByUniversity(data, '2025');
    const merged = univs2025.map(u25 => {
      const u23 = univs2023.find(u => u.name === u25.name);
      const u24 = univs2024.find(u => u.name === u25.name);
      return { ...u25, count2023: u23?.count || 0, count2024: u24?.count || 0, count2025: u25.count,
               trend: calculateTrend(u25.count, u24?.count || 0) };
    });
    setUniversities(merged);
    setCities([...new Set(merged.map(u => u.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr')));
  }, [data]);

  const filtered = useMemo(() => {
    const q = trNormalize(searchTerm);
    const result = universities.filter(u => {
      const ms = !q || trNormalize(u.name).includes(q);
      const mt = selectedType === 'Tümü' || u.type === selectedType;
      const mc = selectedCity === 'Tümü' || u.city === selectedCity;
      return ms && mt && mc;
    });
    if (sortOrder === 'alpha_asc') return [...result].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    return [...result].sort((a, b) => b.count2025 - a.count2025);
  }, [universities, searchTerm, selectedType, selectedCity, sortOrder]);

  const fontBase = '"Plus Jakarta Sans", system-ui, sans-serif';

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: `1px solid ${T.border}`, borderRadius: 10,
    background: T.bgCard, color: T.text, fontSize: 13,
    outline: 'none', fontFamily: fontBase, transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: '36px 5vw 80px', fontFamily: fontBase, color: T.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      <AnimatePresence>
        {schoolModal && (
          <SchoolModal univ={schoolModal} data={data} onClose={() => setSchoolModal(null)} />
        )}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <section style={{
        margin: '-36px -5vw 32px',
        padding: 'clamp(56px,8vw,96px) clamp(20px,6vw,80px) clamp(40px,5vw,72px)',
        position: 'relative', overflow: 'hidden',
        background: T.bg, borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Warm radial wash */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 65% 55% at 85% 45%, ${T.brownPale} 0%, transparent 65%)` }} />
        {/* Notebook lines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.45 }} />
        {/* Left margin rule */}
        <div style={{ position: 'absolute', left: 'clamp(16px,4.5vw,56px)', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />
        {/* Ghost letter */}
        <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)', fontSize: '32vw', fontWeight: 800, color: T.navy, opacity: 0.022, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>Ü</div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · Kurumsal Analiz · YÖK Atlas
          </motion.p>

          {/* Animasyonlu başlık */}
          <div style={{ overflow: 'hidden' }}>
            {'Üniversi'.split('').map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 + ci * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em' }}
              >{ch}</motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', paddingLeft: '0.05em', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.brown, letterSpacing: '-0.02em' }}
            >teler</motion.span>
          </div>

          {/* Rule */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 2, width: 'min(55%, 320px)', originX: 0, marginTop: 20, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`, borderRadius: 1 }}
          />

          {/* Açıklama */}
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 15, color: T.textSub, marginTop: 20, lineHeight: 1.8, maxWidth: 460 }}
          >
            Türkiye'deki üniversitelere yerleşen İHL mezunu öğrenci sayıları, 3 yıllık trendler ve kaynak lise analizi.
          </motion.p>

          {/* Stat strip */}
          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { l: 'Üniversite', v: universities.length ? universities.length.toLocaleString('tr-TR') : '–', c: T.navy  },
              { l: 'Devlet',     v: universities.filter(u => u.type === 'Devlet').length || '–',              c: T.brown },
              { l: 'Vakıf',      v: universities.filter(u => u.type === 'Vakıf').length  || '–',             c: T.navy  },
              { l: 'Şehir',      v: cities.length || '–',                                                    c: T.brown },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderLeft: `2px solid ${s.c}33`, paddingLeft: 14 }}
              >
                <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{s.l}</p>
                <p style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 800, color: s.c, lineHeight: 1, fontFamily: '"Playfair Display", serif' }}>{s.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO BANNER */}
      <Reveal delay={0.06}>
        <div style={{ background: T.brownPale, border: `1px solid ${T.brown}22`, borderLeft: `3px solid ${T.brown}`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <TrendingUp size={15} color={T.brown} style={{ flexShrink: 0, marginTop: 2 }}/>
          <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.7 }}>
            <strong style={{ color: T.navy }}>3 Yıllık Karşılaştırma</strong> · Trend göstergeleri ·{' '}
            <strong style={{ color: T.navy }}>Devlet / Vakıf / KKTC</strong> ve şehir bazlı filtreleme ·
            Her üniversitede <strong style={{ color: T.navy }}>Mezunların Liseleri</strong> butonuna tıklayarak hangi liselerden öğrenci geldiğini ve lise bazında bölüm detaylarını görün
          </div>
        </div>
      </Reveal>

      {/* FILTERS */}
      <Reveal delay={0.1}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 14, padding: '20px 22px', marginBottom: 20, boxShadow: `0 2px 10px ${T.shadow}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Üniversite Ara</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} color={T.textMuted} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}/>
                <input type="text" placeholder="Üniversite adı..." value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 34 }}
                  onFocus={e => e.target.style.borderColor = T.brown}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Tip</label>
              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={inputStyle}>
                {['Tümü', 'Devlet', 'Vakıf', 'KKTC'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Şehir</label>
              <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} style={inputStyle}>
                <option>Tümü</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <ArrowUpDown size={11}/> Sıralama
              </label>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={inputStyle}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Reveal>

      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, paddingLeft: 2 }}>
        <strong style={{ color: T.text }}>{filtered.length}</strong> üniversite
      </div>

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((univ, i) => (
          <UnivRow key={univ.name} univ={univ} index={i}
            navigate={navigate} data={data} onSchoolModal={setSchoolModal}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 0', color: T.textMuted }}>
            <Filter size={36} color={T.borderCard} style={{ margin: '0 auto 12px' }}/>
            <p style={{ fontSize: 14 }}>Filtre kriterlerine uygun üniversite bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Universities;