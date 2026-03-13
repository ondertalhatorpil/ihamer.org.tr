import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { BookOpen, Search, X } from 'lucide-react';
import { groupByFakulte, groupByFakulteKategori } from '../utils/dataProcessor';

const T = {
  bg:         '#faf8f5',
  bgDeep:     '#f4f1ec',
  bgCard:     '#ffffff',
  navy:       '#1a2744',
  navyMid:    '#2d4070',
  navyLight:  '#3d5494',
  brown:      '#8b5e3c',
  brownLight: '#c49a6c',
  brownPale:  '#fdf3e8',
  gold:       '#d4a853',
  text:       '#1e1e1e',
  textSub:    '#3d3d3d',
  textMuted:  '#8a8a8a',
  border:     '#e8e2d9',
  borderCard: '#ede8e0',
  shadow:     'rgba(26,39,68,0.07)',
  shadowMd:   'rgba(26,39,68,0.13)',
  sidebar:    '#1a2744',
};

const FONT_BODY    = '"Plus Jakarta Sans", system-ui, sans-serif';
const FONT_DISPLAY = '"Playfair Display", serif';

/* ─── Türkçe karaktere duyarlı normalize ─── */
const trNormalize = (str) =>
  (str || '')
    .replace(/İ/g, 'i').replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş').replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase()
    .trim();

const KAT_COLOR = {
  'İlahiyat & İslami İlimler': '#b45309',
  'Tıp':             '#991b1b',
  'Hukuk':           '#5b21b6',
  'Eğitim':          '#1e40af',
  'Mühendislik':     '#92400e',
  'Fen-Edebiyat':    '#0e7490',
  'İktisat':         '#9d174d',
  'İşletme':         '#7c2d12',
  'Sosyal Bilimler': '#3730a3',
  'Sağlık':          '#065f46',
  'İletişim':        '#6b21a8',
  'Mimarlık':        '#78350f',
  'Eczacılık':       '#0c4a6e',
  'Diş Hekimliği':   '#334155',
  'Güzel Sanatlar':  '#9d174d',
  'Diğer':           '#374151',
};

const katColor  = (k) => KAT_COLOR[k] || '#374151';
const katBg     = (k) => `${katColor(k)}12`;
const katBorder = (k) => `${katColor(k)}28`;

/* ─── ALT BİLEŞENLER ─── */
const Divider = ({ color, delay = 0, width = '55%' }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const c = color || T.brown;
  return (
    <div ref={ref} style={{ position: 'relative', height: 2, width, marginTop: 8 }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', inset: 0, originX: 0,
          background: `linear-gradient(90deg, ${c}, ${c}55 60%, transparent)`,
          borderRadius: 1,
        }}
      />
    </div>
  );
};

const SectionHeading = ({ label, children, color, align = 'left', delay = 0 }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const c = color || T.brown;
  const justify = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  return (
    <div ref={ref} style={{ textAlign: align, marginBottom: 36 }}>
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
        style={{
          fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 700, color: T.navy,
          fontFamily: FONT_DISPLAY, fontStyle: 'italic',
          lineHeight: 1.1, letterSpacing: '-0.01em', display: 'inline-block',
        }}
      >{children}</motion.h2>
      <div style={{ display: 'flex', justifyContent: justify }}>
        <Divider color={c} delay={delay + 0.2} width="60%" />
      </div>
    </div>
  );
};

const Card = ({ children, delay = 0, accent, style = {} }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hov, setHov] = useState(false);
  const ac = accent || T.brown;
  return (
    <div ref={ref} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: T.bgCard,
          border: `1px solid ${hov ? ac + '30' : T.borderCard}`,
          borderRadius: 16, padding: '24px 22px',
          position: 'relative', overflow: 'hidden',
          boxShadow: hov ? `0 12px 36px ${T.shadowMd}, 0 0 0 1px ${ac}22` : `0 2px 12px ${T.shadow}`,
          transition: 'box-shadow 0.3s, border-color 0.3s',
          height: '100%',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${ac}55, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity 0.3s' }} />
        <div style={{ position: 'absolute', top: 16, right: 18, width: 6, height: 6, borderRadius: '50%', background: ac, opacity: hov ? 0.6 : 0.2, transition: 'opacity 0.3s' }} />
        {children}
      </motion.div>
    </div>
  );
};

const Reveal = ({ children, delay = 0 }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

/* ─── KATEGORİ KARTI ─── */
const KategoriKarti = ({ kat, active, onClick, delay }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const [hov, setHov] = useState(false);
  const c   = katColor(kat.name);
  const pct = parseFloat(kat.percentage);
  const barW = Math.min(pct * 3, 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
        background: active ? `${c}18` : hov ? `${c}0d` : T.bgCard,
        border: `1.5px solid ${active ? c + '55' : hov ? c + '30' : T.borderCard}`,
        transition: 'all 0.22s ease',
        boxShadow: active ? `0 8px 28px ${c}22, 0 0 0 1px ${c}22` : hov ? `0 4px 16px ${T.shadow}` : `0 1px 6px ${T.shadow}`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {active && (
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: `linear-gradient(90deg, ${c}, ${c}88, transparent)`, originX: 0 }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: c, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{kat.name}</span>
        {active && (
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={9} color="#fff" />
          </div>
        )}
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color: T.navy, lineHeight: 1, fontFamily: FONT_DISPLAY, letterSpacing: '-0.01em', marginBottom: 4 }}>
        {kat.count.toLocaleString('tr-TR')}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 10.5, color: T.textMuted }}>%{kat.percentage} oran</span>
        <span style={{ fontSize: 10, color: T.textMuted }}>{kat.fakulteCount} fakülte</span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: T.border, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${barW}%` }}
          transition={{ duration: 0.9, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${c}, ${c}88)` }}
        />
      </div>
    </motion.div>
  );
};

/* ─── TABLO SATIRI ─── */
const FakulteRow = ({ fak, idx, delay }) => {
  const [hov, setHov] = useState(false);
  const c   = katColor(fak.kategori);
  const pct = parseFloat(fak.percentage);
  const barW = Math.min(pct * 2.5, 100);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(delay, 0.4), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderBottom: `1px solid ${T.border}`, background: hov ? T.bgDeep : 'transparent', transition: 'background 0.16s', cursor: 'default' }}
    >
      <td style={{ padding: '11px 12px', width: 40 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: idx < 3 ? `${T.gold}18` : `${T.navy}0a`,
          color: idx < 3 ? T.gold : T.textMuted,
          fontSize: 11, fontWeight: 700,
          border: idx < 3 ? `1px solid ${T.gold}44` : 'none',
        }}>{idx + 1}</div>
      </td>
      <td style={{ padding: '11px 12px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: hov ? T.brown : T.text, transition: 'color 0.18s', lineHeight: 1.35 }}>{fak.name}</p>
      </td>
      <td style={{ padding: '11px 12px', textAlign: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 5, background: katBg(fak.kategori), border: `1px solid ${katBorder(fak.kategori)}`, color: c, whiteSpace: 'nowrap' }}>
          {fak.kategori}
        </span>
      </td>
      <td style={{ padding: '11px 12px', textAlign: 'right' }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: T.navy, lineHeight: 1, fontFamily: FONT_DISPLAY }}>
          {fak.count.toLocaleString('tr-TR')}
        </p>
      </td>
      <td style={{ padding: '11px 12px', textAlign: 'right' }}>
        <p style={{ fontSize: 12, color: T.textMuted }}>{fak.total.toLocaleString('tr-TR')}</p>
      </td>
      <td style={{ padding: '11px 16px 11px 12px', textAlign: 'right', minWidth: 110 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: pct > 25 ? '#166534' : pct > 12 ? T.navyMid : T.textMuted }}>%{fak.percentage}</span>
          <div style={{ width: 64, height: 3, borderRadius: 2, background: T.border, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2, width: `${barW}%`,
              background: pct > 25 ? `linear-gradient(90deg, #166534, #16a34a)` : `linear-gradient(90deg, ${T.navy}, ${T.navyMid})`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </td>
      <td style={{ padding: '11px 12px', textAlign: 'right' }}>
        <span style={{ fontSize: 12, color: T.textMuted }}>{fak.universityCount}</span>
      </td>
    </motion.tr>
  );
};

/* ─── FILTER BAR ─── */
const FilterBar = ({ search, onSearch, selectedKategori, onKategori, allKategoriler, sortBy, onSort, resultCount }) => {
  const selectStyle = {
    appearance: 'none', WebkitAppearance: 'none',
    padding: '8px 30px 8px 12px', borderRadius: 9,
    border: `1px solid ${T.borderCard}`,
    background: T.bgCard, color: T.text, fontSize: 12, fontWeight: 500,
    cursor: 'pointer', outline: 'none',
    boxShadow: `0 1px 4px ${T.shadow}`,
    fontFamily: FONT_BODY,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8a8a'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      padding: '14px 18px', borderRadius: 12,
      background: T.bgCard, border: `1px solid ${T.borderCard}`,
      boxShadow: `0 2px 10px ${T.shadow}`, marginBottom: 20,
    }}>
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
        <Search size={13} color={T.textMuted} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Fakülte ara…"
          style={{
            width: '100%', padding: '8px 10px 8px 32px',
            borderRadius: 9, border: `1px solid ${T.borderCard}`,
            background: T.bgDeep, color: T.text, fontSize: 12,
            outline: 'none', boxSizing: 'border-box', fontFamily: FONT_BODY,
            transition: 'border-color 0.18s',
          }}
          onFocus={e => e.target.style.borderColor = T.brown + '77'}
          onBlur={e  => e.target.style.borderColor = T.borderCard}
        />
        {search && (
          <button onClick={() => onSearch('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 0 }}>
            <X size={11} />
          </button>
        )}
      </div>

      <select value={selectedKategori} onChange={e => onKategori(e.target.value)} style={selectStyle}>
        <option value="">Tüm Kategoriler</option>
        {allKategoriler.map(k => <option key={k} value={k}>{k}</option>)}
      </select>

      <select value={sortBy} onChange={e => onSort(e.target.value)} style={selectStyle}>
        <option value="count">Öğrenci Sayısı</option>
        <option value="percentage">İHL Oranı</option>
      </select>

      <div style={{ marginLeft: 'auto', fontSize: 11, color: T.textMuted, fontStyle: 'italic', whiteSpace: 'nowrap' }}>
        {resultCount} fakülte
      </div>
    </div>
  );
};

/* ─── ANA BİLEŞEN ─── */
const FakulteAnaliz = ({ data }) => {
  const [fakulteData,      setFakulteData]     = useState([]);
  const [kategoriData,     setKategoriData]    = useState([]);
  const [loading,          setLoading]         = useState(true);
  const [search,           setSearch]          = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedYear,     setSelectedYear]    = useState('2025');
  const [sortBy,           setSortBy]          = useState('count');

  useEffect(() => {
    if (!data?.length) return;
    setLoading(true);
    setFakulteData(groupByFakulte(data, selectedYear));
    setKategoriData(groupByFakulteKategori(data, selectedYear));
    setLoading(false);
  }, [data, selectedYear]);

  const allKategoriler = [...new Set(fakulteData.map(f => f.kategori))].sort((a, b) => a.localeCompare(b, 'tr'));

  const filtered = fakulteData
    .filter(f => {
      const q  = trNormalize(search);
      const ms = !q || trNormalize(f.name).includes(q);
      const mk = !selectedKategori || f.kategori === selectedKategori;
      return ms && mk;
    })
    .sort((a, b) => sortBy === 'count' ? b.count - a.count : b.percentage - a.percentage);

  const visible = filtered;

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14, background: T.bg }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }} />
      <p style={{ fontSize: 13, color: T.textMuted, fontFamily: FONT_BODY }}>Veriler yükleniyor…</p>
    </div>
  );

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.text, fontFamily: FONT_BODY }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* ── HERO ── */}
      <section style={{
        padding: 'clamp(56px,8vw,96px) clamp(20px,6vw,80px) clamp(40px,5vw,72px)',
        position: 'relative', overflow: 'hidden', background: T.bg, borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 65% 55% at 85% 45%, ${T.brownPale} 0%, transparent 65%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.45 }} />
        <div style={{ position: 'absolute', left: 'clamp(16px,4.5vw,56px)', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />
        <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)', fontSize: '32vw', fontWeight: 800, color: T.navy, opacity: 0.022, fontFamily: FONT_DISPLAY, fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>F</div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · Fakülte Analizi · YÖK Atlas
          </motion.p>

          {/* Başlık — Playfair Display */}
          <div style={{ overflow: 'hidden' }}>
            {'Fakülte'.split('').map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 + ci * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em' }}
              >{ch}</motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', paddingLeft: '0.18em', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.brown, letterSpacing: '-0.02em' }}
            >Analizi</motion.span>
          </div>

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 2, width: 'min(55%, 320px)', originX: 0, marginTop: 20, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`, borderRadius: 1 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 15, color: T.textSub, marginTop: 20, lineHeight: 1.8, maxWidth: 460 }}
          >
            Fakülte kategorilerine göre İHL mezunu öğrenci yoğunluğu. Hangi fakülteler daha çok tercih ediliyor?
          </motion.p>

          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { l: 'Fakülte',  v: String(fakulteData.length),                c: T.navy  },
              { l: 'Kategori', v: String(allKategoriler.length),             c: T.brown },
              { l: 'Top Oran', v: `%${kategoriData[0]?.percentage || '–'}`,  c: T.navy  },
              { l: 'Yıl',      v: selectedYear,                              c: T.brown },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderLeft: `2px solid ${s.c}33`, paddingLeft: 14 }}
              >
                <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{s.l}</p>
                <p style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 800, color: s.c, lineHeight: 1, fontFamily: FONT_DISPLAY }}>{s.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YIL + KATEGORİ ── */}
      <section style={{ padding: 'clamp(40px,5vw,72px) clamp(20px,6vw,80px)', background: T.bgDeep }}>
        <Reveal>
          <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: T.textMuted, letterSpacing: '0.18em', textTransform: 'uppercase', marginRight: 8 }}>Yıl</p>
            {['2023', '2024', '2025'].map(y => (
              <motion.button key={y} onClick={() => setSelectedYear(y)} whileTap={{ scale: 0.96 }}
                style={{
                  padding: '9px 22px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                  fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
                  border: `1.5px solid ${selectedYear === y ? T.brown : T.borderCard}`,
                  background: selectedYear === y ? `linear-gradient(135deg, ${T.brown}, ${T.brownLight})` : T.bgCard,
                  color: selectedYear === y ? '#fff' : T.textMuted,
                  boxShadow: selectedYear === y ? `0 6px 20px ${T.brown}33` : `0 1px 6px ${T.shadow}`,
                  transition: 'all 0.22s ease',
                }}
              >{y}</motion.button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <SectionHeading label="Özet" color={T.brown}>Fakülte Kategorileri</SectionHeading>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {kategoriData.map((kat, i) => (
            <KategoriKarti key={kat.name} kat={kat}
              active={selectedKategori === kat.name}
              onClick={() => setSelectedKategori(kat.name === selectedKategori ? '' : kat.name)}
              delay={i * 0.05}
            />
          ))}
        </div>

        {selectedKategori && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.brown }}>
            <div style={{ width: 16, height: 1.5, background: T.brown, borderRadius: 1 }} />
            <span style={{ fontStyle: 'italic' }}>"{selectedKategori}" filtresi aktif —</span>
            <button onClick={() => setSelectedKategori('')} style={{ fontSize: 12, fontWeight: 600, color: T.brown, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: FONT_BODY }}>
              temizle
            </button>
          </motion.div>
        )}
      </section>

      {/* ── FAKÜLTE LİSTESİ ── */}
      <section style={{ padding: 'clamp(40px,5vw,72px) clamp(20px,6vw,80px)', background: T.bg }}>
        <Reveal>
          <SectionHeading label="Detay" color={T.navy} align="left">Tüm Fakülteler</SectionHeading>
        </Reveal>
        <Reveal delay={0.06}>
          <FilterBar
            search={search} onSearch={setSearch}
            selectedKategori={selectedKategori} onKategori={setSelectedKategori}
            allKategoriler={allKategoriler}
            sortBy={sortBy} onSort={setSortBy}
            resultCount={filtered.length}
          />
        </Reveal>

        <Card delay={0.1} accent={T.navy}>
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '65vh', borderRadius: 10, border: `1px solid ${T.borderCard}` }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['#', 'Fakülte Adı', 'Kategori', 'İHL Öğrenci', 'Toplam', 'Oran', 'Üniversite'].map((h, i) => (
                    <th key={i} style={{ position: 'sticky', top: 0, zIndex: 10, padding: '11px 12px', textAlign: i === 0 ? 'left' : i === 1 ? 'left' : i === 2 ? 'center' : 'right', fontSize: 9.5, fontWeight: 700, color: T.textMuted, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', background: T.bgDeep, borderBottom: `2px solid ${T.border}`, boxShadow: '0 2px 6px rgba(28,31,46,0.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {visible.map((fak, idx) => <FakulteRow key={fak.name} fak={fak} idx={idx} delay={idx * 0.018} />)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <BookOpen size={36} color={T.textMuted} style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14, color: T.textMuted }}>Arama kriterlerine uygun fakülte bulunamadı</p>
              <button onClick={() => { setSearch(''); setSelectedKategori(''); }}
                style={{ marginTop: 12, fontSize: 12, color: T.brown, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: FONT_BODY }}>
                Filtreleri temizle
              </button>
            </div>
          )}
        </Card>
      </section>

      {/* ── FOOTER ── */}
   {/*    <footer style={{
        padding: 'clamp(14px,2vw,22px) clamp(20px,6vw,80px)',
        background: T.sidebar,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${T.brown}, ${T.brownLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: '#f5f0e8', opacity: 0.75 }}>
            İhamer Veri &amp; Analiz · YÖK Atlas 2023–2025
          </span>
        </div>
        <div style={{ height: 1, width: 40, background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`, borderRadius: 1 }} />
      </footer> */}
    </div>
  );
};

export default FakulteAnaliz;