import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowLeft, GraduationCap, Building2, BookOpen,
  TrendingUp, TrendingDown, MapPin, School,
} from 'lucide-react';
import { calculateTrend } from '../utils/dataProcessor';

const T = {
  bg:'#faf8f4', bgDeep:'#f4f0e8', bgCard:'#ffffff',
  border:'rgba(28,31,46,0.10)', borderCard:'rgba(28,31,46,0.08)',
  text:'#1c1f2e', textSub:'#4a4e65', textMuted:'#8a8ea8',
  navy:'#1c1f2e', navyMid:'#2d3250',
  brown:'#8b5e3c', brownLight:'#c49a6c', brownPale:'#f0e4d0',
  shadow:'rgba(28,31,46,0.08)', shadowMd:'rgba(28,31,46,0.14)',
};

const YEARS = ['2023','2024','2025'];

/* ─── Divider ─── */
const Divider = ({ color = T.brown, width = '48px' }) => (
  <div style={{ height:2, width, background:`linear-gradient(90deg,${color},transparent)`, borderRadius:1, marginTop:6 }} />
);

/* ─── Stat kart ─── */
const StatCard = ({ label, value, sub, accent, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-20px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.5, delay, ease:[0.22,1,0.36,1] }}
      style={{
        background:T.bgCard, border:`1px solid ${T.borderCard}`,
        borderRadius:14, padding:'18px 20px',
        boxShadow:`0 2px 10px ${T.shadow}`,
      }}
    >
      <p style={{ fontSize:10, fontWeight:700, color:T.textMuted, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6 }}>{label}</p>
      <p style={{ fontSize:36, fontWeight:800, color:accent||T.navy, fontFamily:'"Cormorant Garamond", serif', lineHeight:1, letterSpacing:'-0.02em' }}>{value}</p>
      {sub && <p style={{ fontSize:11.5, color:T.textMuted, marginTop:6 }}>{sub}</p>}
    </motion.div>
  );
};

/* ─── Program tablosu ─── */
const ProgramTable = ({ programs }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-30px' });
  const maxVal = Math.max(...programs.map(p => Math.max(p['2023']||0, p['2024']||0, p['2025']||0)));

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
      style={{
        background:T.bgCard, border:`1px solid ${T.borderCard}`,
        borderRadius:16, overflow:'hidden',
        boxShadow:`0 2px 14px ${T.shadow}`,
      }}
    >
      {/* Table header */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'1fr 80px 80px 80px 80px',
        gap:8, padding:'12px 20px',
        background:T.bgDeep,
        borderBottom:`1px solid ${T.borderCard}`,
        fontSize:10, fontWeight:700, color:T.textMuted,
        letterSpacing:'0.1em', textTransform:'uppercase',
      }}>
        <span>Bölüm Adı</span>
        {YEARS.map(y => <span key={y} style={{ textAlign:'right' }}>{y}</span>)}
        <span style={{ textAlign:'right' }}>Toplam</span>
      </div>

      {programs.map((prog, i) => (
        <ProgramRow key={i} prog={prog} index={i} maxVal={maxVal} />
      ))}
    </motion.div>
  );
};

const ProgramRow = ({ prog, index, maxVal }) => {
  const [hov, setHov] = [false, () => {}];
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-10px' });

  const total = YEARS.reduce((s, y) => s + (prog[y]||0), 0);
  const barW  = maxVal > 0 ? (total / maxVal) * 100 : 0;

  const trend = prog['2024'] > 0 || prog['2025'] > 0
    ? calculateTrend(prog['2025']||0, prog['2024']||0)
    : null;

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, x:-10 }}
      animate={inView ? { opacity:1, x:0 } : {}}
      transition={{ duration:0.4, delay:Math.min(index*0.03, 0.5), ease:[0.22,1,0.36,1] }}
      style={{
        display:'grid',
        gridTemplateColumns:'1fr 80px 80px 80px 80px',
        gap:8, padding:'13px 20px',
        borderBottom:`1px solid ${T.borderCard}`,
        background:'transparent',
        alignItems:'center',
        transition:'background 0.18s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = T.bgDeep}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Program adı + mini bar */}
      <div style={{ minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:500, color:T.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:5 }}>
          {prog.name}
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex:1, height:3, background:T.borderCard, borderRadius:2, overflow:'hidden', maxWidth:180 }}>
            <motion.div
              initial={{ width:0 }}
              animate={inView ? { width:`${barW}%` } : {}}
              transition={{ duration:0.8, delay:Math.min(index*0.03,0.5)+0.2, ease:[0.22,1,0.36,1] }}
              style={{ height:'100%', borderRadius:2, background:`linear-gradient(90deg, ${T.brown}, ${T.brownLight})` }}
            />
          </div>
          {trend && (
            <span style={{
              fontSize:10, fontWeight:700, display:'flex', alignItems:'center', gap:2,
              color: trend.direction==='up'?'#22a55e':trend.direction==='down'?'#d94040':T.textMuted,
            }}>
              {trend.direction==='up' ? <TrendingUp size={10}/> : trend.direction==='down' ? <TrendingDown size={10}/> : null}
              {trend.direction!=='flat' ? `${trend.direction==='up'?'+':'-'}%${trend.percentage}` : '—'}
            </span>
          )}
        </div>
      </div>

      {/* Yıllık sayılar */}
      {YEARS.map(y => (
        <span key={y} style={{
          textAlign:'right', fontSize:15, fontWeight:700, lineHeight:1,
          color: prog[y] ? T.navy : T.borderCard,
          fontFamily:'"Cormorant Garamond", serif',
        }}>
          {prog[y] || '—'}
        </span>
      ))}

      {/* Toplam */}
      <span style={{
        textAlign:'right', fontSize:18, fontWeight:800, lineHeight:1,
        color:T.brown, fontFamily:'"Cormorant Garamond", serif',
      }}>
        {total}
      </span>
    </motion.div>
  );
};

/* ─── Yıl özeti kartları ─── */
const YearSummaryRow = ({ data: yearData }) => (
  <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:24 }}>
    {YEARS.map((y, i) => {
      const total = yearData[y] || 0;
      const prevTotal = i > 0 ? (yearData[YEARS[i-1]]||0) : null;
      const trend = prevTotal !== null ? calculateTrend(total, prevTotal) : null;
      return (
        <div key={y} style={{
          background: i===2 ? `linear-gradient(135deg, ${T.navy}, ${T.navyMid})` : T.bgCard,
          border:`1px solid ${i===2 ? 'transparent' : T.borderCard}`,
          borderRadius:13, padding:'16px 18px',
          boxShadow: i===2 ? `0 6px 24px ${T.navy}33` : `0 2px 8px ${T.shadow}`,
        }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6,
            color: i===2 ? 'rgba(255,255,255,0.55)' : T.textMuted }}>{y}</p>
          <p style={{ fontSize:32, fontWeight:800, lineHeight:1,
            fontFamily:'"Cormorant Garamond", serif',
            color: i===2 ? '#fff' : T.navy }}>
            {total || '—'}
          </p>
          {trend && total > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:8 }}>
              {trend.direction==='up'
                ? <TrendingUp size={11} color={i===2?'#6ee7a0':'#22a55e'}/>
                : <TrendingDown size={11} color={i===2?'#fca5a5':'#d94040'}/>}
              <span style={{ fontSize:11, fontWeight:700,
                color: i===2 ? (trend.direction==='up'?'#6ee7a0':'#fca5a5') : (trend.direction==='up'?'#22a55e':'#d94040') }}>
                {trend.direction==='up'?'+':'-'}%{trend.percentage}
              </span>
              <span style={{ fontSize:10, color: i===2?'rgba(255,255,255,0.35)':T.textMuted }}>önceki yıla göre</span>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

/* ════════════════════════════════════════════════════════
   ANA SAYFA — SchoolDetail
   Route: /schools/:schoolName/:univName
════════════════════════════════════════════════════════ */
const SchoolDetail = ({ data }) => {
  const { schoolName, univName } = useParams();
  const navigate = useNavigate();

  const school = decodeURIComponent(schoolName);
  const univ   = decodeURIComponent(univName);

  /* ─── Şehir: "(Ankara - Çankaya)" → "Ankara" ─── */
  const cityMatch = school.match(/\(([^-\)]+)/);
  const schoolCity = cityMatch?.[1]?.trim() || '';
  const schoolShortName = school.split('(')[0].trim();

  /* ─── Bölüm × yıl matrisi ─── */
  const { programs, yearTotals } = useMemo(() => {
    if (!data?.length) return { programs:[], yearTotals:{} };

    const progMap  = {};
    const yearTots = { '2023':0, '2024':0, '2025':0 };

    data
      .filter(r => r.university_name === univ)
      .forEach(record => {
        const yr  = record.year;
        if (!YEARS.includes(yr)) return;

        // imam_hatip_liseler içinde bu liseyi bul
        const arr = record.imam_hatip_liseler;
        if (!arr || !Array.isArray(arr)) return;

        const schools = [];
        arr.forEach(item => {
          if (item.lise !== undefined) schools.push(item);
          else if (Array.isArray(item.imam_hatip_liseler))
            item.imam_hatip_liseler.forEach(s => schools.push(s));
        });

        // Bu kayıttaki lise eşleşiyor mu?
        const match = schools.find(s => (s.lise||s.okul_adi||'') === school);
        if (!match || !(match.yerlesen > 0)) return;

        const progName = record.program_name || 'Bilinmiyor';
        if (!progMap[progName]) progMap[progName] = { name:progName, '2023':0, '2024':0, '2025':0 };
        progMap[progName][yr] += match.yerlesen;
        yearTots[yr] += match.yerlesen;
      });

    const sorted = Object.values(progMap).sort((a, b) => {
      const ta = YEARS.reduce((s,y) => s+(a[y]||0), 0);
      const tb = YEARS.reduce((s,y) => s+(b[y]||0), 0);
      return tb - ta;
    });

    return { programs:sorted, yearTotals:yearTots };
  }, [data, univ, school]);

  const grandTotal = YEARS.reduce((s,y) => s+(yearTotals[y]||0), 0);

  if (!data?.length) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
        <p style={{ color:T.textMuted }}>Veriler yükleniyor…</p>
      </div>
    );
  }

  return (
    <div style={{ background:T.bg, minHeight:'100vh', fontFamily:'"DM Sans", system-ui, sans-serif', color:T.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;0,800;1,700;1,800&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* ══ HERO HEADER ══ */}
      <div style={{
        background:`linear-gradient(140deg, ${T.navy} 0%, ${T.navyMid} 60%, #243561 100%)`,
        padding:'40px 5vw 48px', position:'relative', overflow:'hidden',
      }}>
        {/* Desen */}
        <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none',
          backgroundImage:`linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize:'40px 40px' }} />
        <div style={{ position:'absolute', right:'-2%', top:'50%', transform:'translateY(-52%)',
          fontSize:'28vw', fontWeight:800, color:'#fff', opacity:0.025,
          fontFamily:'"Cormorant Garamond", serif', fontStyle:'italic',
          lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
          {schoolShortName[0]}
        </div>
        <div style={{ position:'absolute', bottom:0, left:'5%', right:'5%', height:1,
          background:`linear-gradient(90deg, transparent, ${T.brownLight}55, transparent)` }} />

        <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto' }}>
          {/* Geri butonu */}
          <button onClick={() => navigate(-1)}
            style={{
              display:'flex', alignItems:'center', gap:7, marginBottom:28,
              background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.15)',
              borderRadius:10, padding:'7px 14px', cursor:'pointer', color:'rgba(255,255,255,0.72)',
              fontSize:12, fontWeight:600, letterSpacing:'0.04em',
              transition:'background 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.09)'}
          >
            <ArrowLeft size={14}/> Geri Dön
          </button>

          {/* Breadcrumb */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            <span style={{ fontSize:10, fontWeight:700, color:T.brownLight, letterSpacing:'0.18em', textTransform:'uppercase',
              display:'flex', alignItems:'center', gap:7 }}>
              <School size={11}/>
              İmam Hatip Lisesi Detayı
            </span>
            <span style={{ color:'rgba(255,255,255,0.25)', fontSize:12 }}>›</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:500 }}
              onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ)}`)}
              style={{ cursor:'pointer', fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:500,
                textDecoration:'underline', textUnderlineOffset:3 }}>
              {univ}
            </span>
          </div>

          {/* Lise adı */}
          <h1 style={{
            fontSize:'clamp(22px,3.5vw,44px)', fontWeight:800,
            fontFamily:'"Cormorant Garamond", serif', fontStyle:'italic',
            color:'#fff', lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:10,
          }}>
            {schoolShortName}
          </h1>
          {schoolCity && (
            <p style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>
              <MapPin size={12}/>{schoolCity}
            </p>
          )}

          {/* Alt çizgi */}
          <div style={{ height:2, width:64, background:`linear-gradient(90deg, ${T.brownLight}, transparent)`, borderRadius:1, marginBottom:20 }} />

          {/* Üniversite badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:9,
            background:'rgba(255,255,255,0.09)', border:'1px solid rgba(255,255,255,0.14)',
            borderRadius:12, padding:'10px 16px',
          }}>
            <Building2 size={14} color={T.brownLight}/>
            <div>
              <p style={{ fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:2 }}>Üniversite</p>
              <p style={{ fontSize:14, fontWeight:600, color:'#fff', lineHeight:1 }}>{univ}</p>
            </div>
          </div>

          {/* Grand total badge */}
          <div style={{ marginTop:20, display:'flex', gap:20 }}>
            {[
              { label:'Toplam Yerleşen (Tüm Yıllar)', value:grandTotal, color:T.brownLight },
              { label:'Aktif Bölüm', value:programs.length, color:'rgba(255,255,255,0.7)' },
            ].map((s,i) => (
              <div key={i} style={{ borderLeft:`2px solid rgba(255,255,255,0.12)`, paddingLeft:14 }}>
                <p style={{ fontSize:9, color:'rgba(255,255,255,0.38)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>{s.label}</p>
                <p style={{ fontSize:30, fontWeight:800, color:s.color, fontFamily:'"Cormorant Garamond", serif', lineHeight:1 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ İÇERİK ══ */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'36px 5vw 80px' }}>

        {grandTotal === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <GraduationCap size={48} color={T.borderCard} style={{ margin:'0 auto 16px', display:'block' }}/>
            <h2 style={{ fontSize:20, fontWeight:700, color:T.textMuted, marginBottom:8 }}>Veri Bulunamadı</h2>
            <p style={{ fontSize:14, color:T.textMuted, lineHeight:1.7 }}>
              <strong style={{ color:T.navy }}>{schoolShortName}</strong> isimli liseden{' '}
              <strong style={{ color:T.navy }}>{univ}</strong>'e yerleşim verisi bulunamadı.
            </p>
            <button onClick={() => navigate(-1)}
              style={{ marginTop:24, display:'inline-flex', alignItems:'center', gap:6,
                padding:'9px 20px', borderRadius:10,
                background:T.navy, color:'#fff', border:'none', cursor:'pointer',
                fontSize:13, fontWeight:600 }}>
              <ArrowLeft size={14}/> Geri Dön
            </button>
          </div>
        ) : (
          <>
            {/* ── Yıllık özet ── */}
            <div style={{ marginBottom:10 }}>
              <p style={{ fontSize:10, fontWeight:700, color:T.brown, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:6, display:'flex', alignItems:'center', gap:7 }}>
                <TrendingUp size={11} color={T.brown}/>
                Yıllık Yerleşim Özeti
              </p>
              <Divider/>
            </div>
            <YearSummaryRow data={yearTotals} />

            {/* ── Bölüm tablosu ── */}
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:10, fontWeight:700, color:T.brown, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:6, display:'flex', alignItems:'center', gap:7 }}>
                <BookOpen size={11} color={T.brown}/>
                Bölüm Bazlı Dağılım
              </p>
              <Divider/>
              <p style={{ fontSize:12, color:T.textMuted, marginTop:10, marginBottom:16 }}>
                <strong style={{ color:T.text }}>{programs.length}</strong> farklı bölüme yerleşim · tüm yıllar dahil
              </p>
            </div>

            <ProgramTable programs={programs} />
          </>
        )}
      </div>
    </div>
  );
};

export default SchoolDetail;