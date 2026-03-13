import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Search, TrendingUp, ChevronRight, Trophy, Users } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { groupByIHL, groupIHLByCity } from '../utils/dataProcessor';

const T = {
  bg: '#faf8f4', bgDeep: '#f4f0e8', bgCard: '#ffffff',
  border: 'rgba(28,31,46,0.10)', borderCard: 'rgba(28,31,46,0.08)',
  text: '#1c1f2e', textSub: '#4a4e65', textMuted: '#8a8ea8',
  navy: '#1c1f2e', navyMid: '#2d3250',
  brown: '#8b5e3c', brownLight: '#c49a6c', brownPale: '#f0e4d0',
  shadow: 'rgba(28,31,46,0.08)', shadowMd: 'rgba(28,31,46,0.14)',
};

const FONT_BODY = '"Plus Jakarta Sans", system-ui, sans-serif';
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

const Card = ({ children, accent, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const ac = accent || T.brown;
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 14, padding: '22px 20px', boxShadow: `0 2px 10px ${T.shadow}`, position: 'relative', overflow: 'hidden', ...style }}
    >
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: `linear-gradient(90deg, transparent, ${ac}44, transparent)` }}/>
      {children}
    </motion.div>
  );
};

const SectionTitle = ({ children, color }) => (
  <div style={{ marginBottom: 18 }}>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: T.navy, fontFamily: FONT_DISPLAY, fontStyle: 'italic' }}>{children}</h2>
    <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${color || T.brown}, transparent)`, borderRadius: 1, marginTop: 4 }}/>
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

const IHLKoken = ({ data }) => {
  const navigate = useNavigate();
  const [ihlData, setIhlData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [hoveredCity, setHoveredCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    if (!data?.length) return;
    setIhlData(groupByIHL(data, selectedYear));
    setCityData(groupIHLByCity(data, selectedYear));
    setLoading(false);
  }, [data, selectedYear]);

  const allCities = useMemo(() =>
    [...new Set(ihlData.map(i => i.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'tr')),
  [ihlData]);

  const filtered = useMemo(() => {
    const q = trNormalize(search);
    return ihlData.filter(ihl => {
      const ms = !q || trNormalize(ihl.displayName).includes(q);
      const mc = !cityFilter || ihl.city === cityFilter;
      return ms && mc;
    });
  }, [ihlData, search, cityFilter]);

  const top15 = cityData.slice(0, 15);
  const maxCount = top15[0]?.count || 1;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${T.brown}`, borderTopColor: 'transparent' }}/>
    </div>
  );

  return (
    <div style={{ background: T.bg, minHeight: '100vh', padding: '36px 5vw 80px', fontFamily: FONT_BODY, color: T.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      {/* ══ HERO ══ */}
      <section style={{
        margin: '-36px -5vw 32px',
        padding: 'clamp(56px,8vw,96px) clamp(20px,6vw,80px) clamp(40px,5vw,72px)',
        position: 'relative', overflow: 'hidden',
        background: T.bg, borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 65% 55% at 85% 45%, ${T.brownPale} 0%, transparent 65%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 71px, ${T.border} 71px, ${T.border} 72px)`, opacity: 0.45 }} />
        <div style={{ position: 'absolute', left: 'clamp(16px,4.5vw,56px)', top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${T.brown}33 15%, ${T.brown}33 85%, transparent)` }} />
        <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)', fontSize: '32vw', fontWeight: 800, color: T.navy, opacity: 0.022, fontFamily: FONT_DISPLAY, fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>İ</div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · Okul Bazlı Analiz · YÖK Atlas
          </motion.p>

          <div style={{ overflow: 'hidden' }}>
            {'İHL '.split('').map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 + ci * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em' }}
              >{ch === ' ' ? '\u00A0' : ch}</motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: T.brown, letterSpacing: '-0.02em' }}
            >Köken</motion.span>
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
            Hangi İmam Hatip Liselerinden kaç öğrenci üniversiteye yerleşti? Şehir ve okul bazlı dağılım.
          </motion.p>

          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { l: 'Toplam İHL',   v: ihlData.length ? ihlData.length.toLocaleString('tr-TR') : '–',                                      c: T.navy  },
              { l: 'Yerleşen',     v: ihlData.length ? ihlData.reduce((s, i) => s + i.totalCount, 0).toLocaleString('tr-TR') : '–',        c: T.brown },
              { l: 'Şehir',        v: ihlData.length ? [...new Set(ihlData.map(i => i.city).filter(Boolean))].length.toLocaleString('tr-TR') : '–', c: T.navy  },
              { l: 'Yıl',          v: selectedYear,                                                                                        c: T.brown },
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

      {/* YEAR TOGGLE */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['2023', '2024', '2025'].map(y => <YearBtn key={y} active={selectedYear === y} onClick={() => setSelectedYear(y)}>{y}</YearBtn>)}
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { icon: School, label: 'Toplam İHL Sayısı', value: ihlData.length.toLocaleString('tr-TR'), sub: 'farklı okul', accent: T.navy },
          { icon: Users,  label: 'Toplam Yerleşen',  value: ihlData.reduce((s, i) => s + i.totalCount, 0).toLocaleString('tr-TR'), sub: `öğrenci (${selectedYear})`, accent: T.brown },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} delay={i * 0.06} accent={s.accent}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: s.accent === T.navy ? `${T.navy}12` : T.brownPale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={s.accent}/>
                </div>
                <div>
                  <p style={{ fontSize: 10.5, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{s.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: s.accent, fontFamily: FONT_DISPLAY, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{s.sub}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CITY GRID */}
      <Card delay={0.1} accent={T.navy} style={{ marginBottom: 20 }}>
        <SectionTitle color={T.navy}>Şehir Bazlı Dağılım ({selectedYear})</SectionTitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))', gap: 8, marginBottom: 20 }}>
          {top15.map((city, idx) => {
            const isSelected = cityFilter === city.city;
            return (
              <motion.div key={city.city}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => setCityFilter(city.city === cityFilter ? '' : city.city)}
                style={{
                  padding: '11px 10px', borderRadius: 11, cursor: 'pointer', position: 'relative',
                  background: isSelected ? T.navy : T.bgDeep,
                  border: `1.5px solid ${isSelected ? T.navy : T.borderCard}`,
                  transition: 'all 0.18s',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#fff' : T.text, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {idx < 3 && <Trophy size={9} style={{ display: 'inline', marginRight: 3, color: isSelected ? '#fff' : T.brownLight }}/>}
                  {city.city}
                </p>
                <p style={{ fontSize: 18, fontWeight: 800, color: isSelected ? '#fff' : T.navy, fontFamily: FONT_DISPLAY, lineHeight: 1 }}>{city.count}</p>
                <p style={{ fontSize: 9.5, color: isSelected ? 'rgba(255,255,255,0.65)' : T.textMuted }}>{city.schoolCount} okul</p>

                {hoveredCity?.city === city.city && !isSelected && (
                  <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, background: T.navy, color: '#fff', fontSize: 11, borderRadius: 8, padding: '8px 12px', whiteSpace: 'nowrap', boxShadow: `0 4px 16px ${T.shadowMd}`, pointerEvents: 'none', fontFamily: FONT_BODY }}>
                    <p style={{ fontWeight: 700 }}>{city.city}</p>
                    <p style={{ opacity: 0.8 }}>{city.count} öğrenci · {city.schoolCount} okul</p>
                    <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${T.navy}` }}/>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {top15.slice(0, 10).map((city, idx) => (
            <div key={city.city} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: T.textSub, width: 80, textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{city.city}</span>
              <div style={{ flex: 1, height: 18, background: T.bgDeep, borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} whileInView={{ width: `${(city.count / maxCount) * 100}%` }} viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${T.navy}, ${T.brown})`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 7 }}
                >
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>{city.count}</span>
                </motion.div>
              </div>
              <span style={{ fontSize: 10, color: T.textMuted, width: 40, flexShrink: 0 }}>{city.schoolCount} ok.</span>
            </div>
          ))}
        </div>
      </Card>

      {/* RANKING TABLE */}
      <Card delay={0.18} accent={T.brown}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <SectionTitle color={T.brown}>Türkiye Geneli İHL Sıralaması</SectionTitle>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: -10 }}>{filtered.length} okul</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} color={T.textMuted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}/>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Okul ara..."
                style={{
                  paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7,
                  border: `1px solid ${T.border}`, borderRadius: 9,
                  fontSize: 12, color: T.text, background: T.bgCard,
                  outline: 'none', width: 210, fontFamily: FONT_BODY,
                  transition: 'border-color 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = T.brown}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
            <select
              value={cityFilter} onChange={e => setCityFilter(e.target.value)}
              style={{ padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 12, color: T.text, background: T.bgCard, outline: 'none', fontFamily: FONT_BODY }}
            >
              <option value="">Tüm Şehirler</option>
              {allCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {(search || cityFilter) && (
              <button onClick={() => { setSearch(''); setCityFilter(''); }}
                style={{ padding: '7px 12px', border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 12, color: T.textSub, background: T.bgCard, cursor: 'pointer', fontFamily: FONT_BODY }}>
                Temizle
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '65vh', borderRadius: 10, border: `1px solid ${T.borderCard}` }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['#', 'Okul Adı', 'Şehir', 'Yerleşen', 'Üniversite', 'Bölüm', ''].map(h => (
                  <th key={h} style={{ position: 'sticky', top: 0, zIndex: 10, fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: h === 'Okul Adı' ? 'left' : 'center', padding: '11px 10px', background: T.bgDeep, borderBottom: `2px solid ${T.borderCard}`, boxShadow: '0 2px 6px rgba(28,31,46,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ihl, idx) => (
                <IHLRow key={ihl.name} ihl={ihl} idx={idx} navigate={navigate}/>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const IHLRow = ({ ihl, idx, navigate }) => {
  const [hov, setHov] = useState(false);
  const isTop3 = idx < 3;
  const medalColor = idx === 0 ? '#c49a6c' : idx === 1 ? T.textMuted : '#8b5e3c';

  return (
    <tr
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/ihl/v2/${encodeURIComponent(ihl.name)}`)}
      style={{ cursor: 'pointer', background: hov ? T.bgDeep : 'transparent', transition: 'background 0.15s' }}
    >
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}`, textAlign: 'center' }}>
        {isTop3
          ? <div style={{ width: 26, height: 26, borderRadius: '50%', background: medalColor, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{idx + 1}</span>
            </div>
          : <span style={{ fontSize: 12, color: T.textMuted }}>{idx + 1}</span>}
      </td>
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}` }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: hov ? T.brown : T.text, transition: 'color 0.15s' }}>{ihl.displayName}</span>
      </td>
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}`, textAlign: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: T.bgDeep, color: T.textSub }}>{ihl.city}</span>
      </td>
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}`, textAlign: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: T.navy, fontFamily: FONT_DISPLAY }}>{ihl.totalCount}</span>
      </td>
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}`, textAlign: 'center', fontSize: 13, color: T.textSub }}>{ihl.universityCount}</td>
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}`, textAlign: 'center', fontSize: 13, color: T.textSub }}>{ihl.programCount}</td>
      <td style={{ padding: '10px 10px', borderBottom: `1px solid ${T.borderCard}`, textAlign: 'center' }}>
        <ChevronRight size={14} color={hov ? T.brown : T.textMuted} style={{ transition: 'color 0.15s' }}/>
      </td>
    </tr>
  );
};

export default IHLKoken;