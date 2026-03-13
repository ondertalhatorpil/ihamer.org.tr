import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, School, MapPin, Building2, BookOpen, ChevronRight, Search, X } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { normalizeProgramName } from '../utils/dataProcessor';

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
      border: `1px solid ${s.border}`, flexShrink: 0 }}>
      {type}
    </span>
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

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
const ProgramUniversityDetail = ({ data }) => {
  const { programName, universityName } = useParams();
  const navigate = useNavigate();
  const decodedProgram    = decodeURIComponent(programName);
  const decodedUniversity = decodeURIComponent(universityName);

  const [detailData, setDetailData]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [hoveredCity, setHoveredCity]   = useState(null);
  const [schoolSearch, setSchoolSearch] = useState('');

  useEffect(() => {
    if (!data?.length) return;
    const recs = data.filter(r =>
      normalizeProgramName(r.program_name) === decodedProgram &&
      r.university_name === decodedUniversity &&
      r.year === '2025'
    );
    if (!recs.length) { setLoading(false); return; }

    const ihlSchools = [];
    const cityMap    = {};

    recs.forEach(record => {
      record.imam_hatip_liseler?.forEach(item => {
        const schools = Array.isArray(item.imam_hatip_liseler) ? item.imam_hatip_liseler : [item];
        schools.forEach(school => {
          const nm  = school.lise;
          const cnt = school.yerlesen || 0;
          if (!nm || !cnt) return;
          const cityMatch = nm.match(/\(([^-]+)/);
          const cityName  = cityMatch?.[1]?.trim() || 'Bilinmiyor';
          ihlSchools.push({ name: nm, city: cityName, count: cnt });
          if (!cityMap[cityName]) cityMap[cityName] = { city: cityName, count: 0, schools: [] };
          cityMap[cityName].count += cnt;
          cityMap[cityName].schools.push({ name: nm, count: cnt });
        });
      });
    });

    ihlSchools.sort((a, b) => b.count - a.count);
    const citiesData = Object.values(cityMap).sort((a, b) => b.count - a.count);

    setDetailData({
      programName: decodedProgram, universityName: decodedUniversity,
      universityType: recs[0]?.university_type || 'Devlet',
      universityCity: recs[0]?.city || '',
      totalStudents: ihlSchools.reduce((s, x) => s + x.count, 0),
      schools: ihlSchools, citiesData,
    });
    setLoading(false);
  }, [data, decodedProgram, decodedUniversity]);

  /* Türkçe-duyarsız okul filtresi */
  const filteredSchools = detailData?.schools.filter(s =>
    !schoolSearch ||
    trNorm(s.name).includes(trNorm(schoolSearch)) ||
    trNorm(s.city).includes(trNorm(schoolSearch))
  ) || [];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%',
          border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }}/>
    </div>
  );

  if (!detailData) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: T.textMuted }}>
      <School size={40} color={T.borderCard} style={{ margin: '0 auto 12px' }}/>
      <p style={{ marginBottom: 16 }}>Veri bulunamadı</p>
      <button onClick={() => navigate(-1)}
        style={{ padding: '9px 20px', background: T.navy, color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: FONT_BODY }}>
        Geri Dön
      </button>
    </div>
  );

  /* İlk 20 harf navy, kalanı brown */
  const titleNavy  = decodedProgram.slice(0, 20);
  const titleBrown = decodedProgram.slice(20);

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
        {/* Ghost letter — ilk harfi */}
        <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)',
          fontSize: '28vw', fontWeight: 800, color: T.navy, opacity: 0.022,
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none' }}>
          {decodedProgram.charAt(0)}
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Back */}
          <motion.button onClick={() => navigate(-1)} whileHover={{ x: -3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: T.textSub, fontSize: 12, marginBottom: 20, padding: 0,
              fontFamily: FONT_BODY, fontWeight: 600 }}>
            <ArrowLeft size={14}/> Geri Dön
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
            İHL Mezunları · Program & Üniversite · YÖK Atlas
          </motion.p>

          {/* Program adı — harf-harf animasyon */}
          <div style={{ overflow: 'hidden', marginBottom: 12 }}>
            {titleNavy.split('').map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + ci * 0.028, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block',
                  fontSize: 'clamp(26px,4.5vw,60px)', marginTop: "0.1em", fontWeight: 800, lineHeight: 1,
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                  color: T.navy, letterSpacing: '-0.02em' }}
              >{ch === ' ' ? '\u00A0' : ch}</motion.span>
            ))}
            {titleBrown && (
              <motion.span
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block',
                  fontSize: 'clamp(26px,4.5vw,60px)', marginTop: "0.1em", fontWeight: 800, lineHeight: 1,
                  fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                  color: T.brown, letterSpacing: '-0.02em' }}
              >{titleBrown}</motion.span>
            )}
          </div>

          {/* Üniversite chip + badge + şehir */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}
          >
            <div
              onClick={() => navigate(`/universities/v2/${encodeURIComponent(decodedUniversity)}`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', background: `${T.navy}0e`,
                border: `1px solid ${T.navy}20`, borderRadius: 20, cursor: 'pointer',
                transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = `${T.navy}1a`}
              onMouseLeave={e => e.currentTarget.style.background = `${T.navy}0e`}
            >
              <Building2 size={11} color={T.navy}/>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>{decodedUniversity}</span>
            </div>
            <Badge type={detailData.universityType}/>
            {detailData.universityCity && (
              <span style={{ fontSize: 12, color: T.textSub,
                display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={10}/>{detailData.universityCity}
              </span>
            )}
          </motion.div>

          {/* Rule */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 2, width: 'min(45%, 280px)', originX: 0, marginBottom: 28,
              background: `linear-gradient(90deg, ${T.brown}, ${T.brownLight}77, transparent)`,
              borderRadius: 1 }}
          />

          {/* Stat strip */}
          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', flexWrap: 'wrap' }}>
            {[
              { l: 'İHL Öğrencisi', v: detailData.totalStudents.toLocaleString('tr-TR'), c: T.navy  },
              { l: 'Farklı Okul',   v: detailData.schools.length,                        c: T.brown },
              { l: 'Farklı Şehir',  v: detailData.citiesData.length,                     c: T.navy  },
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
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div style={{ padding: '28px 5vw 0' }}>

        {/* ── ŞEHİR DAĞILIMI ── */}
        <Card accent={T.navy} delay={0.06} style={{ marginBottom: 16 }}>
          <SectionTitle color={T.navy}>Şehir Bazlı Dağılım</SectionTitle>
          <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 16, marginTop: -10 }}>
            Üzerine gelerek okul detaylarını görebilirsiniz
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 10 }}>
            {detailData.citiesData.map((city, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredCity(city.city)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{
                  padding: '14px', borderRadius: 11, cursor: 'pointer',
                  background: hoveredCity === city.city ? T.navy : T.bgDeep,
                  border: `1px solid ${hoveredCity === city.city ? T.navy : T.borderCard}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={12} color={hoveredCity === city.city ? T.brownLight : T.brown}/>
                    <span style={{ fontSize: 12, fontWeight: 700,
                      color: hoveredCity === city.city ? '#fff' : T.text }}>{city.city}</span>
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 800,
                    color: hoveredCity === city.city ? '#fff' : T.navy,
                    fontFamily: FONT_DISPLAY }}>{city.count}</span>
                </div>
                {hoveredCity === city.city && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 8, paddingTop: 8,
                      borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: T.brownLight,
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                      {city.schools.length} okul
                    </p>
                    {city.schools.slice(0, 4).map((s, si) => (
                      <div key={si} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {s.name.split('(')[0].trim()}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700,
                          color: T.brownLight, marginLeft: 6, flexShrink: 0 }}>{s.count}</span>
                      </div>
                    ))}
                    {city.schools.length > 4 && (
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                        +{city.schools.length - 4} daha
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ── LİSELER ── */}
        <Card accent={T.brown} delay={0.12} style={{ marginBottom: 20 }}>

          {/* Başlık + Arama yan yana */}
          <div style={{ display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <SectionTitle color={T.brown}>
              Mezun Olunan İmam Hatip Liseleri ({detailData.schools.length})
            </SectionTitle>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Search size={13} color={T.textMuted}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}/>
              <input
                type="text"
                placeholder="Okul veya şehir ara..."
                value={schoolSearch}
                onChange={e => setSchoolSearch(e.target.value)}
                style={{
                  paddingLeft: 30, paddingRight: schoolSearch ? 28 : 12,
                  paddingTop: 7, paddingBottom: 7,
                  border: `1px solid ${T.border}`, borderRadius: 9,
                  fontSize: 12, color: T.text, background: T.bgDeep,
                  outline: 'none', fontFamily: FONT_BODY,
                  width: 'clamp(160px,22vw,260px)', transition: 'border-color 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = T.brown}
                onBlur={e  => e.target.style.borderColor = T.border}
              />
              {schoolSearch && (
                <button onClick={() => setSchoolSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  <X size={12} color={T.textMuted}/>
                </button>
              )}
            </div>
          </div>

          {/* Sonuç sayacı */}
          {schoolSearch && (
            <p style={{ fontSize: 11, color: T.textMuted, marginBottom: 12, marginTop: -8 }}>
              <strong style={{ color: T.text }}>{filteredSchools.length}</strong> sonuç
              {filteredSchools.length === 0 && (
                <span style={{ color: T.brown, marginLeft: 6, fontStyle: 'italic' }}>
                  — Türkçe karakterleri deneyebilirsiniz (ö, ü, ş, ç, ğ, ı)
                </span>
              )}
            </p>
          )}

          {/* En çok gönderen banner — sadece arama yokken */}
          {!schoolSearch && detailData.schools.length > 0 && (
            <div style={{ padding: '12px 14px', background: T.brownPale,
              border: `1px solid ${T.brown}22`, borderRadius: 10,
              marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
              <School size={14} color={T.brown}/>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: T.brown,
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  En Çok Gönderen Okul
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: T.navy }}>
                  {detailData.schools[0].name}
                </p>
                <p style={{ fontSize: 12, color: T.textSub }}>
                  {detailData.schools[0].count} öğrenci · {detailData.schools[0].city}
                </p>
              </div>
            </div>
          )}

          {/* Liste — sticky başlık */}
          <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
            {/* Sticky sütun başlıkları */}
            <div style={{
              display: 'grid', gridTemplateColumns: '36px 1fr auto',
              gap: 12, padding: '7px 13px 9px',
              position: 'sticky', top: 0, zIndex: 5,
              background: T.bgCard,
              borderBottom: `2px solid ${T.borderCard}`,
              boxShadow: '0 2px 8px rgba(28,31,46,0.06)',
              marginBottom: 6,
            }}>
              {['#', 'Okul', 'Öğrenci'].map((h, i) => (
                <span key={h} style={{ fontSize: 9, fontWeight: 700, color: T.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  textAlign: i === 2 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {/* Satırlar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredSchools.length > 0
                ? filteredSchools.map((school, i) => (
                    <SchoolRow key={i} school={school} index={i}/>
                  ))
                : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: T.textMuted }}>
                    <School size={28} color={T.borderCard}
                      style={{ margin: '0 auto 8px', display: 'block' }}/>
                    <p style={{ fontSize: 13 }}>Sonuç bulunamadı</p>
                  </div>
                )
              }
            </div>
          </div>
        </Card>

        {/* ── QUICK LINKS ── */}
        <QuickLinks
          universityName={detailData.universityName}
          programName={detailData.programName}
          navigate={navigate}
        />

      </div>{/* ── /CONTENT ── */}
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   QUICK LINKS — ayrı bileşen (hooks kuralı)
───────────────────────────────────────────────────── */
const QuickLinks = ({ universityName, programName, navigate }) => {
  const links = [
    { label: 'Üniversite Detay', sub: universityName, icon: Building2, accent: T.navy,
      path: `/universities/v2/${encodeURIComponent(universityName)}` },
    { label: 'Bölüm Detay',     sub: programName,    icon: BookOpen,  accent: T.brown,
      path: `/programs/v2/${encodeURIComponent(programName)}` },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 12 }}>
      {links.map((link, i) => <QuickLinkBtn key={i} link={link} navigate={navigate}/>)}
    </div>
  );
};

const QuickLinkBtn = ({ link, navigate }) => {
  const [hov, setHov] = useState(false);
  const Icon = link.icon;
  return (
    <motion.button
      onClick={() => navigate(link.path)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px',
        background: hov ? link.accent : T.bgCard,
        border: `1px solid ${hov ? link.accent : T.borderCard}`,
        borderRadius: 12, cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s', fontFamily: FONT_BODY,
        boxShadow: hov ? `0 6px 20px ${T.shadowMd}` : `0 1px 6px ${T.shadow}`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10,
          background: hov ? 'rgba(255,255,255,0.15)' : link.accent + '14',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={hov ? '#fff' : link.accent}/>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600,
            color: hov ? '#fff' : T.text }}>{link.label}</p>
          <p style={{ fontSize: 11, color: hov ? 'rgba(255,255,255,0.65)' : T.textMuted,
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', maxWidth: 180 }}>{link.sub}</p>
        </div>
      </div>
      <ChevronRight size={14} color={hov ? '#fff' : T.textMuted}/>
    </motion.button>
  );
};

/* ─────────────────────────────────────────────────────
   OKUL SATIRI
───────────────────────────────────────────────────── */
const SchoolRow = ({ school, index }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 13px',
        borderRadius: 10,
        background: hov ? T.bgDeep : 'transparent',
        border: `1px solid ${hov ? T.borderCard : 'transparent'}`,
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
          transition: 'color 0.15s' }}>
          {school.name.split('(')[0].trim()}
        </p>
        <p style={{ fontSize: 11, color: T.textMuted,
          display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <MapPin size={9}/>{school.city}
        </p>
      </div>
      <span style={{ fontSize: 20, fontWeight: 800, flexShrink: 0,
        color: hov ? T.brown : (index < 3 ? T.navy : T.brown),
        fontFamily: FONT_DISPLAY, transition: 'color 0.15s' }}>
        {school.count}
      </span>
    </div>
  );
};

export default ProgramUniversityDetail;