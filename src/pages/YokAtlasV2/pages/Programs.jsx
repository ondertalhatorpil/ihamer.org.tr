import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Filter, ArrowUpDown, ArrowDown, ArrowUp, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { groupByProgram, calculateTrend, isAcikogretim } from '../utils/dataProcessor';


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
  (str || '').toLocaleLowerCase('tr-TR').trim();

const CAT_STYLES = {
  'Sayısal':       { bg: `${T.navy}10`,        color: T.navy,    border: `${T.navy}25`       },
  'Sözel':         { bg: `${T.brown}10`,        color: T.brown,   border: `${T.brown}25`      },
  'Eşit Ağırlık':  { bg: `${T.brownLight}18`,  color: '#7a4a10', border: `${T.brownLight}40` },
  'Dil':           { bg: 'rgba(28,31,46,0.06)', color: T.textSub, border: 'rgba(28,31,46,0.15)' },
};

const CatBadge = ({ cat }) => {
  const s = CAT_STYLES[cat] || CAT_STYLES['Dil'];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '3px 7px', borderRadius: 6,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap',
    }}>{cat}</span>
  );
};

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
};

/* ─── ANA SAYFA ─── */
const Programs = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortOrder, setSortOrder]               = useState('desc'); // 'desc' | 'asc'
  const [programs, setPrograms]                 = useState([]);

  useEffect(() => {
    if (!data?.length) return;
    const p23 = groupByProgram(data, '2023');
    const p24 = groupByProgram(data, '2024');
    const p25 = groupByProgram(data, '2025');
    const merged = p25.filter(p => !isAcikogretim(p.name, '')).map(p2025 => {
      const p23i = p23.find(p => p.name === p2025.name);
      const p24i = p24.find(p => p.name === p2025.name);
      return {
        ...p2025,
        count2023: p23i?.count || 0,
        count2024: p24i?.count || 0,
        count2025: p2025.count,
        trend: calculateTrend(p2025.count, p24i?.count || 0),
      };
    });
    setPrograms(merged);
  }, [data]);

  const filtered = useMemo(() => {
    const result = programs.filter(p => {
      const query = trNormalize(searchTerm);
      const name  = trNormalize(p.name);
      const ms = !query || name.includes(query);
      const mc = selectedCategory === 'Tümü' || p.category === selectedCategory;
      return ms && mc;
    });

    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.count2025 - a.count2025
        : a.count2025 - b.count2025
    );

    return result;
  }, [programs, searchTerm, selectedCategory, sortOrder]);

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: `1px solid ${T.border}`, borderRadius: 10,
    background: T.bgCard, color: T.text, fontSize: 13,
    outline: 'none', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    transition: 'border-color 0.2s',
  };

  // === WORD DOSYASINA AKTARIM FONKSİYONU ===
  const exportToWord = () => {
    if (!filtered || filtered.length === 0) return;

    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Program Analiz Raporu</title>
            <style>
                body { font-family: 'Arial', sans-serif; color: #1c1f2e; }
                h1 { color: #8b5e3c; text-align: left; border-bottom: 2px solid #f0e4d0; padding-bottom: 10px; font-size: 24px;}
                h2 { color: #1c1f2e; margin-top: 30px; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: middle; }
                th { background-color: #f4f0e8; font-weight: bold; color: #4a4e65; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .summary { background-color: #faf8f4; padding: 15px; border: 1px solid #e5e7eb; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>İHL Mezunları Bölüm Analizi Raporu</h1>
            
            <div class="summary">
                <p><strong>Arama Kriteri:</strong> ${searchTerm ? `"${searchTerm}"` : 'Tümü'}</p>
                <p><strong>Seçilen Alan:</strong> ${selectedCategory}</p>
                <p><strong>Listelenen Bölüm Sayısı:</strong> ${filtered.length.toLocaleString('tr-TR')}</p>
                <p><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
            </div>

            <h2>Bölüm Listesi</h2>
            <table>
                <thead>
                    <tr>
                        <th>Bölüm Adı</th>
                        <th class='text-center'>Alan</th>
                        <th class='text-center'>Üniversite Sayısı</th>
                        <th class='text-right'>2023</th>
                        <th class='text-right'>2024</th>
                        <th class='text-right'>2025</th>
                        <th class='text-center'>Trend (24→25)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    filtered.forEach(prog => {
        let trendText = prog.trend.direction !== 'neutral' ? (prog.trend.direction === 'up' ? '+' : '-') + '%' + prog.trend.percentage : '-';
        htmlContent += `
            <tr>
                <td><strong>${prog.name}</strong></td>
                <td class='text-center'>${prog.category || '-'}</td>
                <td class='text-center'>${prog.universityCount}</td>
                <td class='text-right'>${prog.count2023?.toLocaleString('tr-TR')}</td>
                <td class='text-right'>${prog.count2024?.toLocaleString('tr-TR')}</td>
                <td class='text-right'>${prog.count2025?.toLocaleString('tr-TR')}</td>
                <td class='text-center'>${trendText}</td>
            </tr>
        `;
    });

    htmlContent += `</tbody></table></body></html>`;

    // Blob oluşturup dosyayı indirtme
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bolum_Analiz_Raporu.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // ===========================================

  return (
    <div style={{
      background: T.bg, minHeight: '100vh',
      padding: '36px 5vw 80px',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      color: T.text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap');
        select option { background: ${T.bgCard}; color: ${T.text}; }
      `}</style>

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
        <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-52%)', fontSize: '32vw', fontWeight: 800, color: T.navy, opacity: 0.022, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>B</div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          
          {/* WORD İNDİRME BUTONU BURAYA EKLENDİ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <motion.button onClick={exportToWord} whileHover={{ y: -1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6,
                background: T.brownPale, color: T.brown, border: `1px solid ${T.brown}44`,
                borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                padding: '5px 12px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', transition: 'all 0.2s' }}
            >
              <Download size={13}/> Word Raporu İndir
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 10, fontWeight: 700, color: T.brown, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: T.brown, borderRadius: 1 }} />
            İHL Mezunları · Program Analizi · YÖK Atlas
          </motion.p>

          <div style={{ overflow: 'hidden' }}>
            {'Bölüm'.split('').map((ch, ci) => (
              <motion.span key={ci}
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15 + ci * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em' }}
              >{ch}</motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', paddingLeft: '0.04em', fontSize: 'clamp(52px,9vw,108px)', fontWeight: 800, lineHeight: 0.9, fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: T.navy, letterSpacing: '-0.02em' }}
            >ler</motion.span>
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
            Bölümlere yerleşen İHL mezunu öğrenci sayıları, alan dağılımı ve 3 yıllık karşılaştırmaları.
          </motion.p>

          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,36px)', marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { l: 'Bölüm',        v: programs.length ? programs.length.toLocaleString('tr-TR') : '–', c: T.navy  },
              { l: 'Sayısal',      v: programs.filter(p => p.category === 'Sayısal').length     || '–', c: T.brown },
              { l: 'Sözel',        v: programs.filter(p => p.category === 'Sözel').length       || '–', c: T.navy  },
              { l: 'Eşit Ağırlık', v: programs.filter(p => p.category === 'Eşit Ağırlık').length || '–', c: T.brown },
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
        <div style={{
          background: T.brownPale,
          border: `1px solid ${T.brown}22`, borderLeft: `3px solid ${T.brown}`,
          borderRadius: 12, padding: '14px 18px', marginBottom: 24,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <TrendingUp size={15} color={T.brown} style={{ flexShrink: 0, marginTop: 2 }}/>
          <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.7 }}>
            <strong style={{ color: T.navy }}>3 Yıllık Karşılaştırma</strong> (2023→2025) · Alan bazlı filtreleme ·
            Her bölüme tıklayarak hangi üniversitelerde tercih edildiğini görün
          </div>
        </div>
      </Reveal>

      {/* FILTERS */}
      <Reveal delay={0.1}>
        <div style={{
          background: T.bgCard, border: `1px solid ${T.borderCard}`,
          borderRadius: 14, padding: '20px 22px', marginBottom: 20,
          boxShadow: `0 2px 10px ${T.shadow}`,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>

            {/* Arama */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Bölüm Ara</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} color={T.textMuted} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}/>
                <input
                  type="text"
                  placeholder="Bölüm adı..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 34 }}
                  onFocus={e => e.target.style.borderColor = T.brown}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>
            </div>

            {/* Alan */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Alan</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={inputStyle}
              >
                {['Tümü', 'Sayısal', 'Sözel', 'Eşit Ağırlık', 'Dil'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Sıralama */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Öğrenci Sıralaması
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { value: 'desc', label: 'Çoktan Aza', icon: ArrowDown },
                  { value: 'asc',  label: 'Azdan Çoğa', icon: ArrowUp   },
                ].map(opt => {
                  const Icon = opt.icon;
                  const active = sortOrder === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSortOrder(opt.value)}
                      style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        padding: '9px 10px',
                        border: `1px solid ${active ? T.brown : T.border}`,
                        borderRadius: 10,
                        background: active
                          ? `linear-gradient(135deg, ${T.brownPale}, ${T.brown}18)`
                          : T.bgCard,
                        color: active ? T.brown : T.textMuted,
                        fontSize: 12, fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                        boxShadow: active ? `0 2px 8px ${T.brown}22` : 'none',
                      }}
                    >
                      <Icon size={1} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Aktif filtre badge'leri */}
          {(searchTerm || selectedCategory !== 'Tümü') && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {searchTerm && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: `${T.navy}10`, color: T.navy, border: `1px solid ${T.navy}22` }}>
                  "{searchTerm}"
                </span>
              )}
              {selectedCategory !== 'Tümü' && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: T.brownPale, color: T.brown, border: `1px solid ${T.brown}33` }}>
                  {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>
      </Reveal>

      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, paddingLeft: 2 }}>
        <strong style={{ color: T.text }}>{filtered.length}</strong> bölüm
        <span style={{ marginLeft: 8, color: T.brownLight, fontWeight: 600 }}>
          {sortOrder === 'desc' ? '↓ Çoktan Aza' : '↑ Azdan Çoğa'}
        </span>
      </div>

      {/* TABLE */}
      <Reveal delay={0.14}>
        <div style={{
          background: T.bgCard, border: `1px solid ${T.borderCard}`,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: `0 2px 10px ${T.shadow}`,
        }}>
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '72vh' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {[
                    { l: 'Bölüm Adı',            align: 'left',   minW: 280 },
                    { l: 'Alan',                  align: 'center'            },
                    { l: 'Üniversite',            align: 'center'            },
                    { l: '2023',                  align: 'center'            },
                    { l: '2024',                  align: 'center'            },
                    { l: '2025 ↕',               align: 'center', sortable: true },
                    { l: 'Karşılaştırma 2024→25', align: 'center'            },
                  ].map(h => (
                    <th
                      key={h.l}
                      onClick={h.sortable ? () => setSortOrder(o => o === 'desc' ? 'asc' : 'desc') : undefined}
                      style={{
                        fontSize: 10, fontWeight: 700,
                        color: h.sortable ? T.brown : T.textMuted,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        textAlign: h.align, padding: '12px 14px',
                        whiteSpace: 'nowrap', minWidth: h.minW,
                        position: 'sticky', top: 0, zIndex: 10,
                        background: T.bgDeep,
                        borderBottom: `2px solid ${h.sortable ? T.brown + '44' : T.borderCard}`,
                        boxShadow: '0 2px 8px rgba(28,31,46,0.06)',
                        cursor: h.sortable ? 'pointer' : 'default',
                        userSelect: 'none',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {h.l}
                        {h.sortable && (
                          sortOrder === 'desc'
                            ? <ArrowDown size={10} />
                            : <ArrowUp size={10} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((prog, i) => (
                  <ProgramRow key={i} prog={prog} index={i} navigate={navigate} />
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '56px 0', color: T.textMuted }}>
              <Filter size={36} color={T.borderCard} style={{ margin: '0 auto 12px' }}/>
              <p style={{ fontSize: 14 }}>Filtre kriterlerine uygun bölüm bulunamadı</p>
              {searchTerm && (
                <p style={{ fontSize: 12, marginTop: 6, color: T.brown }}>
                  "{searchTerm}" için sonuç yok — Türkçe karakterleri de deneyebilirsiniz (ö, ü, ş, ç, ğ, ı)
                </p>
              )}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
};

/* ─── PROGRAM SATIRI ─── */
const ProgramRow = ({ prog, index, navigate }) => {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10px' });

  return (
    <motion.tr ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.3) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
      style={{ background: hov ? T.bgDeep : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
    >
      <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}` }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: hov ? T.brown : T.text, transition: 'color 0.15s' }}>
          {prog.name}
        </span>
      </td>
      <td style={{ textAlign: 'center', padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}` }}>
        {prog.category && <CatBadge cat={prog.category} />}
      </td>
      <td style={{ textAlign: 'center', padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}`, fontSize: 13, color: T.textSub }}>
        {prog.universityCount}
      </td>
      <td style={{ textAlign: 'center', padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}`, background: `${T.navy}04`, fontSize: 13, fontWeight: 600, color: T.textSub }}>
        {prog.count2023?.toLocaleString('tr-TR')}
      </td>
      <td style={{ textAlign: 'center', padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}`, background: `${T.brown}04`, fontSize: 13, fontWeight: 600, color: T.textSub }}>
        {prog.count2024?.toLocaleString('tr-TR')}
      </td>
      <td style={{ textAlign: 'center', padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: T.navy, fontFamily: '"Playfair Display", serif' }}>
            {prog.count2025?.toLocaleString('tr-TR')}
          </span>
          <span style={{ fontSize: 10, color: T.textMuted }}>%{prog.percentage}</span>
        </div>
      </td>
      <td style={{ textAlign: 'center', padding: '11px 14px', borderBottom: `1px solid ${T.borderCard}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          {prog.trend.direction === 'up'
            ? <TrendingUp size={12} color="#22a55e"/>
            : prog.trend.direction === 'down'
            ? <TrendingDown size={12} color="#d94040"/>
            : <span style={{ fontSize: 12, color: T.textMuted }}>—</span>}
          {prog.trend.direction !== 'neutral' && (
            <span style={{ fontSize: 12, fontWeight: 700, color: prog.trend.direction === 'up' ? '#22a55e' : '#d94040' }}>
              {prog.trend.direction === 'up' ? '+' : '-'}%{prog.trend.percentage}
            </span>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default Programs;