import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';
import { motion, useInView } from 'framer-motion';
import { groupByPuanTuruYearly, groupByIHLTipi } from '../utils/dataProcessor';

const T = {
  bg: '#faf8f4', bgDeep: '#f4f0e8', bgCard: '#ffffff',
  border: 'rgba(28,31,46,0.10)', borderCard: 'rgba(28,31,46,0.08)',
  text: '#1c1f2e', textSub: '#4a4e65', textMuted: '#8a8ea8',
  navy: '#1c1f2e', navyMid: '#2d3250', navyLight: '#4a4e65',
  brown: '#8b5e3c', brownLight: '#c49a6c', brownPale: '#f0e4d0',
  shadow: 'rgba(28,31,46,0.08)', shadowMd: 'rgba(28,31,46,0.14)',
};

const FONT_BODY    = '"Plus Jakarta Sans", system-ui, sans-serif';
const FONT_DISPLAY = '"Playfair Display", serif';

const PUAN_COLORS = {
  SAY: T.navy, MF: T.navy,
  EA: T.brown, TM: T.brown,
  'SÖZ': '#5a7a4e', SOZ: '#5a7a4e',
  'DİL': T.brownLight, DIL: T.brownLight,
  'Diğer': T.textMuted,
};

const PUAN_LABELS = {
  SAY: 'Sayısal', MF: 'Matematik-Fen', EA: 'Eşit Ağırlık', TM: 'Temel Mat.',
  'SÖZ': 'Sözel', SOZ: 'Sözel', 'DİL': 'Dil', DIL: 'Dil',
};

const tipStyle = {
  backgroundColor: T.bgCard, border: `1px solid ${T.borderCard}`,
  borderRadius: 10, color: T.text, fontSize: 12,
  boxShadow: `0 4px 16px ${T.shadow}`,
  fontFamily: FONT_BODY,
};

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

const ToggleBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: '7px 16px', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    background: active ? T.navy : T.bgCard,
    color: active ? '#fff' : T.textSub,
    border: active ? 'none' : `1px solid ${T.borderCard}`,
    transition: 'all 0.2s', fontFamily: FONT_BODY,
  }}>{children}</button>
);

const PuanTuruAnaliz = ({ data }) => {
  const [puanData, setPuanData]       = useState([]);
  const [ihlTipiData, setIhlTipiData] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [viewMode, setViewMode]       = useState('count');

  useEffect(() => {
    if (!data?.length) return;
    setPuanData(groupByPuanTuruYearly(data));
    setIhlTipiData(groupByIHLTipi(data, '2025'));
    setLoading(false);
  }, [data]);

  const trendData = [
    { year: '2023', ...Object.fromEntries(puanData.map(p => [p.puan, viewMode === 'count' ? (p.count_2023 || 0) : (p.pct_2023 || 0)])) },
    { year: '2024', ...Object.fromEntries(puanData.map(p => [p.puan, viewMode === 'count' ? (p.count_2024 || 0) : (p.pct_2024 || 0)])) },
    { year: '2025', ...Object.fromEntries(puanData.map(p => [p.puan, viewMode === 'count' ? (p.count_2025 || 0) : (p.pct_2025 || 0)])) },
  ];

  const bar2025 = puanData
    .map(p => ({ puan: p.puan, label: PUAN_LABELS[p.puan] || p.puan, count: p.count_2025 || 0, pct: p.pct_2025 || 0 }))
    .sort((a, b) => b.count - a.count);

  const comparison = puanData.map(p => ({
    puan: p.puan, label: PUAN_LABELS[p.puan] || p.puan,
    count_2023: p.count_2023 || 0, count_2024: p.count_2024 || 0, count_2025: p.count_2025 || 0,
    pct_2023: p.pct_2023 || 0, pct_2024: p.pct_2024 || 0, pct_2025: p.pct_2025 || 0,
    trend: p.count_2025 > p.count_2024 ? 'up' : p.count_2025 < p.count_2024 ? 'down' : 'neutral',
    trendPct: p.count_2024 > 0 ? Math.abs(((p.count_2025 - p.count_2024) / p.count_2024) * 100).toFixed(1) : '0',
  }));

  const total = ihlTipiData.reduce((s, t) => s + t.count, 0);

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
        <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)', fontSize: '32vw', fontWeight: 800, color: T.navy, opacity: 0.022, fontFamily: FONT_DISPLAY, fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>P</div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · İstatistiksel Analiz · YÖK Atlas
          </motion.p>

          <div style={{ overflow: 'hidden' }}>
            {'Puan '.split('').map((ch, ci) => (
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
            >Türleri</motion.span>
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
            İHL mezunları hangi alanlara yöneliyor? SAY, SÖZ, EA dağılımı ve 3 yıllık trend.
          </motion.p>

          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', marginTop: 40, flexWrap: 'wrap' }}>
            {bar2025.slice(0, 4).map((p, i) => (
              <motion.div key={p.puan}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderLeft: `2px solid ${(PUAN_COLORS[p.puan] || T.textMuted)}33`, paddingLeft: 14 }}
              >
                <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{PUAN_LABELS[p.puan] || p.puan}</p>
                <p style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 800, color: PUAN_COLORS[p.puan] || T.textMuted, lineHeight: 1, fontFamily: FONT_DISPLAY }}>{p.count.toLocaleString('tr-TR')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <Card delay={0.06} accent={T.brown} style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 18 }}>
          {bar2025.slice(0, 4).map(p => (
            <div key={p.puan} style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ fontSize: 30, fontWeight: 800, color: PUAN_COLORS[p.puan] || T.textMuted, fontFamily: FONT_DISPLAY, lineHeight: 1 }}>
                {p.count.toLocaleString('tr-TR')}
              </p>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.textSub, marginTop: 4 }}>{PUAN_LABELS[p.puan] || p.puan}</p>
              <p style={{ fontSize: 10.5, color: T.textMuted }}>%{p.pct} oran</p>
            </div>
          ))}
        </div>
      </Card>

      {/* TOGGLE */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>Görünüm:</span>
        <ToggleBtn active={viewMode === 'count'} onClick={() => setViewMode('count')}>Öğrenci Sayısı</ToggleBtn>
        <ToggleBtn active={viewMode === 'percentage'} onClick={() => setViewMode('percentage')}>Oran (%)</ToggleBtn>
      </div>

      {/* BAR 2025 */}
      <Card delay={0.1} accent={T.navy} style={{ marginBottom: 16 }}>
        <SectionTitle color={T.navy}>Puan Türü Bazlı Dağılım (2025)</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={bar2025} margin={{ bottom: 10 }}>
            <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false}/>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: T.textMuted, fontFamily: FONT_BODY }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 11, fill: T.textMuted, fontFamily: FONT_BODY }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={tipStyle} formatter={v => [viewMode === 'count' ? v.toLocaleString('tr-TR') + ' öğrenci' : '%' + v, '']}/>
            <Bar dataKey={viewMode === 'count' ? 'count' : 'pct'} radius={[5, 5, 0, 0]}>
              {bar2025.map(e => <Cell key={e.puan} fill={PUAN_COLORS[e.puan] || T.textMuted}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* TREND LINE */}
      <Card delay={0.14} accent={T.brown} style={{ marginBottom: 16 }}>
        <SectionTitle color={T.brown}>3 Yıllık Trend (2023–2025)</SectionTitle>
        <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 16, marginTop: -10 }}>İHL'liler sayısal alanlara yöneliyor mu?</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="2 4" stroke={T.borderCard} vertical={false}/>
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: T.textMuted, fontFamily: FONT_BODY }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 11, fill: T.textMuted, fontFamily: FONT_BODY }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={tipStyle} formatter={(v, name) => [viewMode === 'count' ? v.toLocaleString('tr-TR') + ' öğrenci' : '%' + v, PUAN_LABELS[name] || name]}/>
            <Legend formatter={v => PUAN_LABELS[v] || v} wrapperStyle={{ fontSize: 11, color: T.textSub, fontFamily: FONT_BODY }}/>
            {puanData.slice(0, 5).map(p => (
              <Line key={p.puan} type="monotone" dataKey={p.puan} stroke={PUAN_COLORS[p.puan] || T.textMuted}
                strokeWidth={2.5} dot={{ r: 5, strokeWidth: 0, fill: PUAN_COLORS[p.puan] || T.textMuted }} activeDot={{ r: 7 }}/>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* COMPARISON TABLE */}
      <Card delay={0.18} accent={T.navy} style={{ marginBottom: 16 }}>
        <SectionTitle color={T.navy}>Puan Türü Bazlı Detaylı Karşılaştırma</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Puan Türü', '2023 Sayı', '2023 %', '2024 Sayı', '2024 %', '2025 Sayı', '2025 %', 'Trend'].map(h => (
                  <th key={h} style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: h === 'Puan Türü' ? 'left' : 'right', padding: '0 8px 10px', borderBottom: `1px solid ${T.borderCard}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map(p => (
                <tr key={p.puan}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bgDeep}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: PUAN_COLORS[p.puan] || T.textMuted, flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{p.label}</span>
                    </div>
                  </td>
                  {[['count_2023','pct_2023'], ['count_2024','pct_2024'], ['count_2025','pct_2025']].map(([ck, pk], yi) => (
                    <>
                      <td key={ck} style={{ textAlign: 'right', padding: '10px 8px', borderBottom: `1px solid ${T.borderCard}`, fontSize: 13, fontWeight: yi === 2 ? 700 : 500, color: yi === 2 ? T.navy : T.textSub }}>
                        {p[ck].toLocaleString('tr-TR')}
                      </td>
                      <td key={pk} style={{ textAlign: 'right', padding: '10px 8px', borderBottom: `1px solid ${T.borderCard}`, fontSize: 12, color: T.textMuted }}>
                        %{p[pk]}
                      </td>
                    </>
                  ))}
                  <td style={{ textAlign: 'right', padding: '10px 8px', borderBottom: `1px solid ${T.borderCard}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      {p.trend === 'up' ? <TrendingUp size={12} color="#22a55e"/> : p.trend === 'down' ? <TrendingDown size={12} color="#d94040"/> : null}
                      <span style={{ fontSize: 12, fontWeight: 700, color: p.trend === 'up' ? '#22a55e' : p.trend === 'down' ? '#d94040' : T.textMuted }}>
                        {p.trend !== 'neutral' ? (p.trend === 'up' ? '+' : '-') + '%' + p.trendPct : '—'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* IHL TİPİ */}
      <Card delay={0.22} accent={T.brown}>
        <SectionTitle color={T.brown}>İHL Tipi Dağılımı (2025)</SectionTitle>
        <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 16, marginTop: -10 }}>Anadolu İmam Hatip, Kız Anadolu İmam Hatip karşılaştırması</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ihlTipiData.map(tip => {
            const pct = ((tip.count / (ihlTipiData[0]?.count || 1)) * 100);
            return (
              <div key={tip.tip} style={{ background: T.bgDeep, border: `1px solid ${T.borderCard}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tip.tip}</p>
                  <div style={{ height: 5, background: T.borderCard, borderRadius: 3, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${T.navy}, ${T.brown})`, borderRadius: 3 }}/>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: T.navy, fontFamily: FONT_DISPLAY, lineHeight: 1 }}>
                    {tip.count.toLocaleString('tr-TR')}
                  </p>
                  <p style={{ fontSize: 10.5, color: T.textMuted }}>%{((tip.count / total) * 100).toFixed(1)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default PuanTuruAnaliz;