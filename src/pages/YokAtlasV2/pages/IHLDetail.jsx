import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, School, Building2, BookOpen, MapPin, ChevronRight, Users, Search, X } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { getIHLUniversityFlow } from '../utils/dataProcessor';

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

const YearBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '7px 18px', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    background: active ? T.navy : T.bgCard, color: active ? '#fff' : T.textSub,
    border: active ? 'none' : `1px solid ${T.borderCard}`,
    transition: 'all 0.2s', fontFamily: FONT_BODY,
  }}>{children}</button>
);

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
const IHLDetail = ({ data }) => {
  const { ihlName } = useParams();
  const navigate    = useNavigate();
  const decodedName = decodeURIComponent(ihlName);

  const [detailData, setDetailData]   = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [univSearch, setUnivSearch]   = useState('');
  const [progSearch, setProgSearch]   = useState('');

  useEffect(() => {
    if (!data?.length) return;
    setLoading(true);

    const match       = decodedName.match(/\(([^-]+?)(?:\s*-\s*(.+?))?\)\s*$/);
    const city        = match?.[1]?.trim() || '';
    const district    = match?.[2]?.trim() || '';
    const displayName = decodedName.replace(/\s*\([^)]*\)\s*$/, '').trim();

    const univsByYear = {};
    ['2023', '2024', '2025'].forEach(yr => {
      univsByYear[yr] = getIHLUniversityFlow(data, decodedName, yr);
    });

    const yearlyTotals = {
      '2023': univsByYear['2023'].reduce((s, u) => s + u.count, 0),
      '2024': univsByYear['2024'].reduce((s, u) => s + u.count, 0),
      '2025': univsByYear['2025'].reduce((s, u) => s + u.count, 0),
    };

    /* ── Üniversite + bölüm detayı ── */
    const univProgramMap = {};
    data.filter(r => r.year === selectedYear).forEach(record => {
      if (!record.imam_hatip_liseler) return;
      const schools = [];
      record.imam_hatip_liseler.forEach(item => {
        if (item.lise !== undefined) schools.push(item);
        else if (item.imam_hatip_liseler) item.imam_hatip_liseler.forEach(s => schools.push(s));
      });
      schools.forEach(school => {
        if (school.lise !== decodedName) return;
        const cnt = school.yerlesen || 0;
        if (!cnt) return;
        const un = record.university_name;
        const pn = record.program_name?.replace(/\s*\([^)]*\)/g, '').trim();
        if (!univProgramMap[un])
          univProgramMap[un] = { name: un, type: record.university_type, city: record.city, programs: {} };
        univProgramMap[un].programs[pn] = (univProgramMap[un].programs[pn] || 0) + cnt;
      });
    });

    const universityDetails = Object.values(univProgramMap).map(u => {
      const programsList = Object.entries(u.programs)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      return { ...u, totalCount: programsList.reduce((s, p) => s + p.count, 0), programCount: programsList.length, programs: programsList };
    }).sort((a, b) => b.totalCount - a.totalCount);

    /* ── Top programlar ── */
    const progFlow = {};
    data.filter(r => r.year === selectedYear).forEach(record => {
      if (!record.imam_hatip_liseler) return;
      const schools = [];
      record.imam_hatip_liseler.forEach(item => {
        if (item.lise !== undefined) schools.push(item);
        else if (item.imam_hatip_liseler) item.imam_hatip_liseler.forEach(s => schools.push(s));
      });
      schools.forEach(school => {
        if (school.lise !== decodedName) return;
        const pn = record.program_name?.replace(/\s*\([^)]*\)/g, '').trim();
        if (pn) progFlow[pn] = (progFlow[pn] || 0) + (school.yerlesen || 0);
      });
    });
    const topPrograms = Object.entries(progFlow)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalStudents = univsByYear[selectedYear].reduce((s, u) => s + u.count, 0);
    setDetailData({
      name: decodedName, displayName, city, district,
      totalStudents, universities: univsByYear[selectedYear],
      universityDetails, yearlyTotals, topPrograms,
    });
    setLoading(false);
  }, [data, decodedName, selectedYear]);

  /* ── Filtreler ── */
  const filteredUnivDetails = useMemo(() =>
    (detailData?.universityDetails || []).filter(u =>
      !univSearch ||
      trNorm(u.name).includes(trNorm(univSearch)) ||
      trNorm(u.city || '').includes(trNorm(univSearch))
    ),
  [detailData, univSearch]);

  const filteredTopPrograms = useMemo(() =>
    (detailData?.topPrograms || []).filter(p =>
      !progSearch || trNorm(p.name).includes(trNorm(progSearch))
    ),
  [detailData, progSearch]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%',
          border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }}/>
    </div>
  );

  if (!detailData || detailData.universities.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: T.textMuted }}>
      <School size={40} color={T.borderCard} style={{ margin: '0 auto 12px' }}/>
      <p style={{ marginBottom: 16 }}>Bu okul için {selectedYear} yılında veri bulunamadı</p>
      <button onClick={() => navigate('/ihl/v2')}
        style={{ padding: '9px 20px', background: T.navy, color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: FONT_BODY }}>
        Geri Dön
      </button>
    </div>
  );

  /* Başlık bölünmesi — ilk 18 harf navy, kalan brown */
  const titleNavy  = detailData.displayName.slice(0, 18);
  const titleBrown = detailData.displayName.slice(18);

  return (
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
          {detailData.displayName.charAt(0)}
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Back */}
          <motion.button onClick={() => navigate('/ihl/v2')} whileHover={{ x: -3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: T.textSub, fontSize: 12, marginBottom: 20, padding: 0,
              fontFamily: FONT_BODY, fontWeight: 600 }}>
            <ArrowLeft size={14}/> İHL Köken Analizine Dön
          </motion.button>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase',
              letterSpacing: '0.22em', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · Lise Detayı · YÖK Atlas
          </motion.p>

          {/* Okul adı — harf-harf animasyon */}
          <div style={{ overflow: 'hidden', marginBottom: 12 }}>
            {titleNavy.split('').map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + ci * 0.025, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block',
                  fontSize: 'clamp(24px,4vw,56px)', fontWeight: 800, lineHeight: 0.95,
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                  color: T.navy, letterSpacing: '-0.02em' }}
              >{ch === ' ' ? '\u00A0' : ch}</motion.span>
            ))}
            {titleBrown && (
              <motion.span
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block',
                  fontSize: 'clamp(24px,4vw,56px)', fontWeight: 800, lineHeight: 0.95,
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                  color: T.brown, letterSpacing: '-0.02em' }}
              >{titleBrown}</motion.span>
            )}
          </div>

          {/* Şehir / ilçe chip */}
          {(detailData.city || detailData.district) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                marginBottom: 16, padding: '4px 12px',
                background: `${T.brown}12`, border: `1px solid ${T.brown}22`,
                borderRadius: 20 }}
            >
              <MapPin size={11} color={T.brown}/>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.brown }}>
                {detailData.city}{detailData.district ? ` / ${detailData.district}` : ''}
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

          {/* Stat strip — 3 yıl */}
          <div style={{ display: 'flex', gap: 'clamp(14px,2.5vw,32px)', flexWrap: 'wrap' }}>
            {['2023', '2024', '2025'].map((yr, i) => (
              <motion.div key={yr}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedYear(yr)}
                style={{
                  borderLeft: `2px solid ${selectedYear === yr ? T.navy : T.brown}55`,
                  paddingLeft: 14, cursor: 'pointer',
                  opacity: selectedYear === yr ? 1 : 0.55,
                  transition: 'opacity 0.2s',
                }}
              >
                <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 5 }}>{yr}</p>
                <p style={{ fontSize: 'clamp(20px,2.6vw,28px)', fontWeight: 800,
                  color: selectedYear === yr ? T.navy : T.brown,
                  lineHeight: 1, fontFamily: FONT_DISPLAY }}>
                  {detailData.yearlyTotals[yr]}
                </p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ borderLeft: `2px solid ${T.navy}33`, paddingLeft: 14 }}
            >
              <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em',
                textTransform: 'uppercase', marginBottom: 5 }}>Üniversite ({selectedYear})</p>
              <p style={{ fontSize: 'clamp(20px,2.6vw,28px)', fontWeight: 800,
                color: T.navy, lineHeight: 1, fontFamily: FONT_DISPLAY }}>
                {detailData.universities.length}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div style={{ padding: '28px 5vw 0' }}>

        {/* YIL SEÇİCİ */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['2023', '2024', '2025'].map(y => (
            <YearBtn key={y} active={selectedYear === y} onClick={() => setSelectedYear(y)}>
              {y}
              <span style={{ opacity: 0.65, marginLeft: 5, fontSize: 11 }}>
                ({detailData.yearlyTotals[y]})
              </span>
            </YearBtn>
          ))}
        </div>

        {/* STAT KARTLARI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14, marginBottom: 20 }}>
          {[
            { icon: Users,    label: 'Toplam Yerleşen',  value: detailData.totalStudents,          sub: selectedYear + ' yılı',      accent: T.navy  },
            { icon: Building2,label: 'Üniversite Sayısı',value: detailData.universities.length,    sub: 'farklı üniversite',          accent: T.brown },
            { icon: BookOpen, label: 'Bölüm Sayısı',     value: detailData.topPrograms.length + '+', sub: 'farklı bölüm',            accent: T.navy  },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} delay={i * 0.05} accent={s.accent}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: s.accent === T.navy ? `${T.navy}12` : T.brownPale,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={s.accent}/>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: 3 }}>{s.label}</p>
                    <p style={{ fontSize: 24, fontWeight: 800, color: s.accent,
                      fontFamily: FONT_DISPLAY, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: 10.5, color: T.textMuted, marginTop: 2 }}>{s.sub}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* EN ÇOK TERCİH EDİLEN BÖLÜMLER */}
        <Card accent={T.brown} delay={0.1} style={{ marginBottom: 16 }}>
          {/* Başlık + Arama */}
          <div style={{ display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <SectionTitle color={T.brown}>
              En Çok Tercih Edilen Bölümler ({selectedYear})
            </SectionTitle>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Search size={13} color={T.textMuted}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}/>
              <input
                type="text"
                placeholder="Bölüm ara..."
                value={progSearch}
                onChange={e => setProgSearch(e.target.value)}
                style={{
                  paddingLeft: 30, paddingRight: progSearch ? 28 : 12,
                  paddingTop: 7, paddingBottom: 7,
                  border: `1px solid ${T.border}`, borderRadius: 9,
                  fontSize: 12, color: T.text, background: T.bgDeep,
                  outline: 'none', fontFamily: FONT_BODY,
                  width: 'clamp(140px,18vw,220px)', transition: 'border-color 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = T.brown}
                onBlur={e  => e.target.style.borderColor = T.border}
              />
              {progSearch && (
                <button onClick={() => setProgSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  <X size={12} color={T.textMuted}/>
                </button>
              )}
            </div>
          </div>

          {progSearch && (
            <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 12, marginTop: -8 }}>
              <strong style={{ color: T.text }}>{filteredTopPrograms.length}</strong> sonuç
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {filteredTopPrograms.length > 0
              ? filteredTopPrograms.map((prog, i) => {
                  const max = filteredTopPrograms[0]?.count || 1;
                  return (
                    <div key={prog.name}
                      onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 11,
                        padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                        background: 'transparent', border: `1px solid ${T.borderCard}`,
                        transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.bgDeep; e.currentTarget.style.borderColor = T.brown + '30'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.borderCard; }}
                    >
                      <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                        background: i < 3 ? T.navy : `${T.navy}12`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700,
                          color: i < 3 ? '#fff' : T.textMuted }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: T.text,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          marginBottom: 5 }}>{prog.name}</p>
                        <div style={{ height: 4, background: T.bgDeep, borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(prog.count / max) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%',
                              background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight})`,
                              borderRadius: 2 }}/>
                        </div>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: T.brown,
                        fontFamily: FONT_DISPLAY, flexShrink: 0 }}>{prog.count}</span>
                      <ChevronRight size={13} color={T.textMuted}/>
                    </div>
                  );
                })
              : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: T.textMuted }}>
                  <BookOpen size={24} color={T.borderCard} style={{ margin: '0 auto 8px', display: 'block' }}/>
                  <p style={{ fontSize: 13 }}>Sonuç bulunamadı</p>
                </div>
              )
            }
          </div>
        </Card>

        {/* ÜNİVERSİTE VE BÖLÜM DETAYLARI */}
        <Card accent={T.navy} delay={0.15}>
          {/* Başlık + Arama */}
          <div style={{ display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <SectionTitle color={T.navy}>
              Üniversite ve Bölüm Detayları ({selectedYear})
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
                  width: 'clamp(160px,22vw,280px)', transition: 'border-color 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = T.navy}
                onBlur={e  => e.target.style.borderColor = T.border}
              />
              {univSearch && (
                <button onClick={() => setUnivSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  <X size={12} color={T.textMuted}/>
                </button>
              )}
            </div>
          </div>

          {univSearch && (
            <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 12, marginTop: -8 }}>
              <strong style={{ color: T.text }}>{filteredUnivDetails.length}</strong> üniversite
              {filteredUnivDetails.length === 0 && (
                <span style={{ color: T.brown, marginLeft: 6, fontStyle: 'italic' }}>
                  — Türkçe karakterleri deneyebilirsiniz (ö, ü, ş, ç, ğ, ı)
                </span>
              )}
            </p>
          )}

          <div style={{ padding: '8px 12px', background: T.brownPale, borderRadius: 8,
            marginBottom: 16, fontSize: 12, color: T.textSub }}>
            💡 <strong style={{ color: T.navy }}>{detailData.totalStudents} öğrenci</strong>{' '}
            hangi üniversitelerin hangi bölümlerine yerleşti?
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredUnivDetails.length > 0
              ? filteredUnivDetails.map((univ, idx) => (
                  <UnivBlock key={univ.name} univ={univ} idx={idx} navigate={navigate}/>
                ))
              : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: T.textMuted }}>
                  <Building2 size={28} color={T.borderCard} style={{ margin: '0 auto 8px', display: 'block' }}/>
                  <p style={{ fontSize: 13 }}>Sonuç bulunamadı</p>
                </div>
              )
            }
          </div>
        </Card>

      </div>{/* ── /CONTENT ── */}
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   ÜNİVERSİTE BLOĞU
───────────────────────────────────────────────────── */
const UnivBlock = ({ univ, idx, navigate }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ border: `1px solid ${hov ? T.brown + '30' : T.borderCard}`,
        borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* Header */}
      <div
        onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ.name)}`)}
        style={{ background: T.bgDeep, padding: '13px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8,
            background: T.navy, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{idx + 1}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{univ.name}</span>
              <Badge type={univ.type}/>
            </div>
            <p style={{ fontSize: 11, color: T.textMuted,
              display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
              <MapPin size={9}/>{univ.city} · {univ.programCount} bölüm
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: T.navy, fontFamily: FONT_DISPLAY }}>
            {univ.totalCount}
          </span>
          <ChevronRight size={14} color={T.textMuted}/>
        </div>
      </div>

      {/* Programs grid */}
      <div style={{ padding: '12px 16px', background: T.bgCard }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.textMuted,
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          Yerleştikleri Bölümler
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 6 }}>
          {univ.programs.map((prog, pi) => (
            <div key={pi}
              onClick={e => { e.stopPropagation(); navigate(`/programs/v2/${encodeURIComponent(prog.name)}`); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px', background: T.bgDeep, borderRadius: 8,
                cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = T.brownPale; e.currentTarget.style.borderColor = T.brown + '22'; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.bgDeep; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                <BookOpen size={11} color={T.textMuted}/>
                <span style={{ fontSize: 12, color: T.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {prog.name}
                </span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: T.brown,
                fontFamily: FONT_DISPLAY, flexShrink: 0, marginLeft: 8 }}>
                {prog.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IHLDetail;