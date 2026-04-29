import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Users, Building2, BookOpen, Hash,
  TrendingUp, FileText, GraduationCap, SlidersHorizontal, X, Search, BarChart2
} from 'lucide-react';
import {
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

/* ─── Exact Dashboard styles + analytics extras ─── */
const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

  :root {
    --bg-main: #F9FAFB;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --border-color: #E5E7EB;
    --accent-color: #111827;
    --gold: #c7972f;
  }

  * { font-family: "Lexend", sans-serif; box-sizing: border-box; }
  body { background-color: var(--bg-main); color: var(--text-primary); -webkit-font-smoothing: antialiased; }

  .font-display { font-weight: 600; letter-spacing: -0.02em; }
  .font-data    { font-weight: 300; }
  .font-label   { font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.70rem; }
  .border-r-soft { border-right: 1px solid var(--border-color); }
  .border-b-soft { border-bottom: 1px solid var(--border-color); }

  .reveal-up { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  @keyframes revealUp { to { opacity: 1; transform: translateY(0); } }

  .rank-circle  { width: 28px; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.75rem; font-weight: 600; margin-right: 1rem; }
  .rank-1       { background: #111827; color: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .rank-2       { background: #374151; color: white; }
  .rank-3       { background: #4B5563; color: white; }
  .rank-other   { background: #F3F4F6; color: #6B7280; }

  .custom-scrollbar::-webkit-scrollbar       { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #D1D5DB; }

  .badge { display: inline-flex; align-items: center; padding: 0.2rem 0.6rem; background: #F3F4F6; color: #4B5563; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: 1px solid #E5E7EB; }

  .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--text-primary); color: white; padding: 1rem 2rem; border-radius: 12px; font-weight: 500; transition: all 0.2s; border: 1px solid transparent; cursor: pointer; }
  .btn-primary:hover { background: white; color: var(--text-primary); border-color: var(--text-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

  .mini-search-input { width: 100%; padding: 6px 10px 6px 30px; font-size: 0.8rem; border: 1px solid #E5E7EB; border-radius: 6px; background: white; transition: all 0.2s; font-family: "Lexend", sans-serif; }
  .mini-search-input:focus { outline: none; border-color: #111827; box-shadow: 0 0 0 2px rgba(17,24,39,0.05); }

  .stat-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }

  .ap-select { width: 100%; padding: 6px 28px 6px 10px; font-size: 0.8rem; border: 1px solid #E5E7EB; border-radius: 6px; background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center; appearance: none; font-family: "Lexend", sans-serif; color: var(--text-primary); transition: all 0.2s; cursor: pointer; }
  .ap-select:focus { outline: none; border-color: #111827; box-shadow: 0 0 0 2px rgba(17,24,39,0.05); }

  .dt-wrap { overflow-x: auto; border: 1px solid var(--border-color); border-radius: 12px; }
  .dt { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .dt th { background: #111827; color: white; padding: 0.6rem 1rem; text-align: left; font-weight: 600; font-size: 0.70rem; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
  .dt td { padding: 0.6rem 1rem; border-bottom: 1px solid var(--border-color); }
  .dt tr:last-child td { border-bottom: none; }
  .dt tr:nth-child(even) td { background: #F9FAFB; }
  .dt tr:hover td { background: #fefce8; transition: background .1s; }

  .mini-bar-wrap  { display: flex; align-items: center; gap: 8px; min-width: 100px; }
  .mini-bar-track { flex: 1; height: 5px; background: #E5E7EB; border-radius: 3px; }
  .mini-bar-fill  { height: 100%; border-radius: 3px; background: var(--gold); }
  .mini-bar-pct   { font-size: 0.70rem; color: var(--text-secondary); width: 32px; text-align: right; flex-shrink: 0; }

  .gender-grid      { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 700px) { .gender-grid { grid-template-columns: 1fr; } }
  .gender-card      { border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; background: white; }
  .gender-card-head { background: #111827; color: white; padding: 0.55rem 1.25rem; font-size: 0.70rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
  .gender-row       { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1.25rem; border-bottom: 1px solid var(--border-color); }
  .gender-row:last-child { border-bottom: none; }
  .gender-dot       { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .gender-name      { font-size: 0.85rem; font-weight: 500; flex: 1; }
  .gender-num       { font-size: 0.95rem; font-weight: 700; }
  .gender-pct       { font-size: 0.72rem; color: var(--text-secondary); margin-left: 4px; }
  .gender-bar-wrap  { height: 4px; background: #E5E7EB; margin: 0 1.25rem 6px; border-radius: 3px; }
  .gender-bar-fill  { height: 100%; border-radius: 3px; }

  .wc-container { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; padding: 2rem; min-height: 200px; }
  .wc-word { border-radius: 6px; padding: 4px 12px; font-weight: 600; cursor: default; transition: transform .15s, box-shadow .15s; }
  .wc-word:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(0,0,0,.12); }

  .sf-label { font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.70rem; color: var(--text-secondary); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 5px; }
  .sf-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 20px; background: #FEF9C3; color: #92400E; font-size: 0.70rem; font-weight: 600; border: 1px solid #FDE68A; }
  .sf-chip button { background: none; border: none; cursor: pointer; color: #92400E; display: flex; align-items: center; }

  .sec-panel      { background: white; border-bottom: 1px solid var(--border-color); }
  .sec-panel-head { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; }

  .mob-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; }
  .mob-overlay.open { display: block; }
  .mob-drawer { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-radius: 20px 20px 0 0; z-index: 301; max-height: 88vh; overflow-y: auto; transform: translateY(100%); transition: transform .35s cubic-bezier(.16,1,.3,1); padding: 1.5rem; }
  .mob-drawer.open { transform: translateY(0); }

  .no-data { text-align: center; padding: 3rem 1rem; color: var(--text-secondary); font-size: 0.85rem; }
`;

const tr = s => (s == null ? '' : String(s)).trim();
const COLORS = ['#111827', '#c7972f', '#6B7280', '#374151', '#9CA3AF', '#D1D5DB', '#4B5563', '#E5E7EB'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
      <p className="text-xs text-gray-400 uppercase font-medium mb-1">{label || payload[0].name}</p>
      <p className="text-lg font-semibold text-gray-900">{payload[0].value}</p>
    </div>
  );
};

const MiniBar = ({ pct }) => (
  <div className="mini-bar-wrap">
    <div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></div>
    <span className="mini-bar-pct">{pct.toFixed(0)}%</span>
  </div>
);

const RankCircle = ({ i }) => {
  const cls = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
  return <span className={`rank-circle ${cls}`}>{i + 1}</span>;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobOpen, setMobOpen] = useState(false);

  const [f, setF] = useState({
    search: '', category: '', year: '', university: '',
    department: '', tezTuru: '', method: '', language: '',
    advisorUnvan: '', gender: '', advisorGender: ''
  });

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));
  const clearAll = () => setF({ search:'', category:'', year:'', university:'', department:'', tezTuru:'', method:'', language:'', advisorUnvan:'', gender:'', advisorGender:'' });
  const hasFilters = Object.values(f).some(v => v !== '');

  useEffect(() => {
    Promise.all([
      import('./data/tez.json').then(m => m.default),
      import('./data/tez2.json').then(m => m.default)
    ]).then(([d, ind]) => {
      setRawData([
        ...d.map(t => ({ ...t, _cat: tr(t.category) || 'Doğrudan' })),
        ...ind.map(t => ({ ...t, _cat: tr(t.category) || 'Dolaylı' }))
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const data = useMemo(() => {
    let r = rawData;
    if (f.search) { const q = f.search.toLowerCase(); r = r.filter(t => tr(t['Tez Başlığı']).toLowerCase().includes(q) || tr(t['Yazar']).toLowerCase().includes(q) || tr(t['Danışman']).toLowerCase().includes(q) || tr(t['Üniversite']).toLowerCase().includes(q)); }
    if (f.category)      r = r.filter(t => t._cat === f.category);
    if (f.year)          r = r.filter(t => tr(t['Yıl']) === f.year);
    if (f.university)    r = r.filter(t => tr(t['Üniversite']) === f.university);
    if (f.department)    r = r.filter(t => tr(t['Bölüm']) === f.department);
    if (f.tezTuru)       r = r.filter(t => tr(t['Tez Türü']) === f.tezTuru);
    if (f.method)        r = r.filter(t => tr(t['Araştırmanın Yöntemi']) === f.method);
    if (f.language)      r = r.filter(t => tr(t['Araştırma Dili']) === f.language);
    if (f.advisorUnvan)  r = r.filter(t => tr(t['Danışman Unvanları']).startsWith(f.advisorUnvan));
    if (f.gender)        r = r.filter(t => tr(t['Tez Yazarının Cinsiyeti']) === f.gender);
    if (f.advisorGender) r = r.filter(t => tr(t['Danışmanın Cinsiyeti']) === f.advisorGender);
    return r;
  }, [rawData, f]);

  const uniqSorted = k => [...new Set(rawData.map(t => tr(t[k])).filter(Boolean))].sort();
  const years        = useMemo(() => [...new Set(rawData.map(t => tr(t['Yıl'])).filter(Boolean))].sort().reverse(), [rawData]);
  const universities = useMemo(() => uniqSorted('Üniversite'), [rawData]);
  const departments  = useMemo(() => uniqSorted('Bölüm'), [rawData]);
  const methods      = useMemo(() => [...new Set(rawData.map(t => tr(t['Araştırmanın Yöntemi'])).filter(Boolean))].sort(), [rawData]);
  const languages    = useMemo(() => [...new Set(rawData.map(t => tr(t['Araştırma Dili'])).filter(Boolean))].sort(), [rawData]);

  const yearChart   = useMemo(() => { const m = {}; data.forEach(t => { const y = tr(t['Yıl']); if (y) m[y] = (m[y] || 0) + 1; }); return Object.entries(m).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })); }, [data]);
  const langChart   = useMemo(() => { const m = {}; data.forEach(t => { const l = tr(t['Araştırma Dili']) || 'Belirtilmemiş'; m[l] = (m[l] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); }, [data]);
  const methodChart = useMemo(() => { const m = {}; data.forEach(t => { const v = tr(t['Araştırmanın Yöntemi']) || 'Belirtilmemiş'; m[v] = (m[v] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); }, [data]);

  const pageTable = useMemo(() => {
    const bins = [[0,100,'0–100'],[101,200,'101–200'],[201,300,'201–300'],[301,400,'301–400'],[401,500,'401–500'],[501,600,'501–600'],[601,Infinity,'601+']];
    const counts = bins.map(() => 0); let filled = 0;
    data.forEach(t => { const p = parseInt(tr(t['Sayfa Sayısı'])); if (!isNaN(p)) { filled++; for (let i = 0; i < bins.length; i++) if (p >= bins[i][0] && p <= bins[i][1]) { counts[i]++; break; } } });
    return { rows: bins.map(([,,l], i) => ({ label: l, count: counts[i] })).filter(r => r.count > 0), filled };
  }, [data]);

  const genderTable = useMemo(() => {
    const autorG = {}, danG = {};
    data.forEach(t => { const ag = tr(t['Tez Yazarının Cinsiyeti']); if (ag) autorG[ag] = (autorG[ag] || 0) + 1; const dg = tr(t['Danışmanın Cinsiyeti']); if (dg) danG[dg] = (danG[dg] || 0) + 1; });
    return { yazar: Object.entries(autorG).sort((a, b) => b[1] - a[1]), danisman: Object.entries(danG).sort((a, b) => b[1] - a[1]) };
  }, [data]);

  const unvanTable = useMemo(() => {
    const m = {};
    data.forEach(t => { let u = tr(t['Danışman Unvanları']); if (!u) u = 'Belirtilmemiş'; else if (u.startsWith('PROF')) u = 'PROF. DR.'; else if (u.startsWith('YRD')) u = 'YRD. DOÇ. DR.'; else if (u.startsWith('DOÇ')) u = 'DOÇ. DR.'; else if (u.startsWith('DR. ÖĞR')) u = 'DR. ÖĞR. ÜYESİ'; m[u] = (m[u] || 0) + 1; });
    const total = Object.values(m).reduce((a, b) => a + b, 0);
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([unvan, count]) => ({ unvan, count, pct: total ? count / total * 100 : 0 }));
  }, [data]);

  const uniTable  = useMemo(() => { const m = {}; data.forEach(t => { const u = tr(t['Üniversite']); if (u) m[u] = (m[u] || 0) + 1; }); const total = data.length; return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([uni, count]) => ({ uni, count, pct: total ? count / total * 100 : 0 })); }, [data]);
  const deptTable = useMemo(() => { const m = {}; data.forEach(t => { const b = tr(t['Bölüm']); if (b) m[b] = (m[b] || 0) + 1; }); const total = data.length; return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([dept, count]) => ({ dept, count, pct: total ? count / total * 100 : 0 })); }, [data]);
  const sampleTable = useMemo(() => { const m = {}; data.forEach(t => { const s = tr(t['Araştırma Örneklemi']); if (s) m[s] = (m[s] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([tip, count]) => ({ tip, count })); }, [data]);

  const kwData = useMemo(() => {
    const m = {};
    const cols = ['1. Anahtar Kelime','2. Anahtar Kelime','3. Anahtar Kelime','4. Anahtar Kelime','5. ve Üstü Anahtar Kelimeler'];
    data.forEach(t => cols.forEach(c => { const raw = tr(t[c]); if (!raw || raw.toLowerCase() === 'nan') return; raw.split(/[,;\/]/).forEach(kw => { const k = kw.trim(); if (k.length > 1) m[k] = (m[k] || 0) + 1; }); }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([word, freq]) => ({ word, freq }));
  }, [data]);

  const kwMax = kwData[0]?.freq || 1;
  const heroStats = useMemo(() => ({ total: data.length, unis: new Set(data.map(t => tr(t['Üniversite'])).filter(Boolean)).size, advisors: new Set(data.map(t => tr(t['Danışman'])).filter(Boolean)).size, doktora: data.filter(t => tr(t['Tez Türü']) === 'Doktora').length }), [data]);

  /* Panel header – same visual language as Dashboard list headers */
  const PanelHead = ({ icon: Icon, title, sub, count }) => (
    <div className="sec-panel-head">
      <div>
        <h4 className="font-display text-lg flex items-center gap-2 text-yellow-900">
          <Icon size={18} className="text-gray-400" /> {title}
        </h4>
        {sub && <p className="font-label text-gray-400 mt-1">{sub}</p>}
      </div>
      {count != null && (
        <span className="bg-white border border-gray-200 text-xs font-semibold px-2 py-1 rounded-md text-gray-500">
          {count}
        </span>
      )}
    </div>
  );

  /* Filter panel – reused in sidebar + mobile drawer */
  const FilterPanel = () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="sf-label"><Search size={11} /> Genel Arama</p>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="mini-search-input" placeholder="Başlık, yazar, üniversite…" value={f.search} onChange={e => upd('search', e.target.value)} />
        </div>
      </div>
      {[
        { label: 'Kategori', key: 'category', options: ['Doğrudan', 'Dolaylı'] },
        { label: 'Tez Türü', key: 'tezTuru',  options: ['Doktora', 'Yüksek Lisans'] },
      ].map(({ label, key, options }) => (
        <div key={key}>
          <p className="sf-label">{label}</p>
          <select className="ap-select" value={f[key]} onChange={e => upd(key, e.target.value)}>
            <option value="">Tümü</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <div><p className="sf-label">Yıl</p>
        <select className="ap-select" value={f.year} onChange={e => upd('year', e.target.value)}>
          <option value="">Tüm Yıllar</option>{years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div><p className="sf-label">Üniversite</p>
        <select className="ap-select" value={f.university} onChange={e => upd('university', e.target.value)}>
          <option value="">Tüm Üniversiteler</option>{universities.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div><p className="sf-label">Bölüm / ABD</p>
        <select className="ap-select" value={f.department} onChange={e => upd('department', e.target.value)}>
          <option value="">Tüm Bölümler</option>{departments.map(d => <option key={d} value={d}>{d.length > 55 ? d.slice(0,55)+'…' : d}</option>)}
        </select>
      </div>
      {methods.length > 0 && <div><p className="sf-label">Araştırma Yöntemi</p>
        <select className="ap-select" value={f.method} onChange={e => upd('method', e.target.value)}>
          <option value="">Tümü</option>{methods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>}
      {languages.length > 0 && <div><p className="sf-label">Araştırma Dili</p>
        <select className="ap-select" value={f.language} onChange={e => upd('language', e.target.value)}>
          <option value="">Tümü</option>{languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>}
      <div><p className="sf-label">Danışman Unvanı</p>
        <select className="ap-select" value={f.advisorUnvan} onChange={e => upd('advisorUnvan', e.target.value)}>
          <option value="">Tümü</option>
          <option value="PROF">PROF. DR.</option><option value="DOÇ">DOÇ. DR.</option>
          <option value="YRD">YRD. DOÇ. DR.</option><option value="DR. ÖĞR">DR. ÖĞR. ÜYESİ</option><option value="DR.">DR.</option>
        </select>
      </div>
      <div><p className="sf-label">Yazar Cinsiyeti</p>
        <select className="ap-select" value={f.gender} onChange={e => upd('gender', e.target.value)}>
          <option value="">Tümü</option><option value="Erkek">Erkek</option><option value="Kadın">Kadın</option>
        </select>
      </div>
      <div><p className="sf-label">Danışman Cinsiyeti</p>
        <select className="ap-select" value={f.advisorGender} onChange={e => upd('advisorGender', e.target.value)}>
          <option value="">Tümü</option><option value="Erkek">Erkek</option><option value="Kadın">Kadın</option>
        </select>
      </div>
      {hasFilters && (
        <div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {Object.entries(f).filter(([, v]) => v).map(([k, v]) => (
              <span key={k} className="sf-chip">{v.length > 18 ? v.slice(0,18)+'…' : v}<button onClick={() => upd(k,'')}><X size={10}/></button></span>
            ))}
          </div>
          <button onClick={clearAll} className="mt-2 w-full flex items-center justify-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 py-1.5 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
            <X size={12}/> Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div className="h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center">
      <style>{styles}</style>
      <div className="font-label text-gray-400 mb-4 animate-pulse">VERİLER ANALİZ EDİLİYOR</div>
      <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <style>{styles}</style>

      {/* ══ HERO ══ */}
      <section className="border-b-soft bg-white">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
          <div className="col-span-1 md:col-span-6 border-r-soft p-8 md:p-16 flex flex-col justify-between">
            <div>
              <button onClick={() => navigate('/tez-analytics')}
                className="font-label text-gray-400 mb-6 flex items-center gap-1 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer p-0">
                <ArrowRight size={12} className="rotate-180" /> Dashboard'a Dön
              </button>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.95] text-yellow-600 reveal-up">
                Bibliyometrik <br /><span className="text-gray-900">Analiz</span>
              </h2>
            </div>
            <p className="font-data text-lg text-gray-500 max-w-md mt-8 reveal-up delay-100">
              Tezlerin metodolojik, kurumsal ve demografik dağılımını filtreler eşliğinde görselleştirin.
            </p>
          </div>
          <div className="col-span-1 md:col-span-6 grid grid-cols-2 grid-rows-2">
            {[
              { num: heroStats.total,    lbl: 'Toplam Tez',    bg: '#F9FAFB', color: 'text-gray-900',    delay: 'delay-200', borderR: true,  borderB: true },
              { num: heroStats.unis,     lbl: 'Üniversite',    bg: 'white',   color: 'text-[#c7972f]',   delay: 'delay-300', borderR: false, borderB: true },
              { num: heroStats.advisors, lbl: 'Danışman',      bg: 'white',   color: 'text-gray-900',    delay: 'delay-200', borderR: true,  borderB: false },
              { num: heroStats.doktora,  lbl: 'Doktora Tezi',  bg: '#F9FAFB', color: 'text-gray-900',    delay: 'delay-300', borderR: false, borderB: false },
            ].map(({ num, lbl, bg, color, delay, borderR, borderB }, i) => (
              <div key={i} className={`p-8 md:p-10 flex flex-col justify-center reveal-up ${delay} ${borderR ? 'border-r-soft' : ''} ${borderB ? 'border-b-soft' : ''}`}
                style={{ background: bg }}>
                <span className="font-label text-gray-500 mb-3">{lbl}</span>
                <span className={`font-display text-5xl md:text-6xl tracking-tighter ${color}`}>
                  {num.toLocaleString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BODY ══ */}
      <div className="max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row flex-1">

        {/* SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 border-r-soft bg-white sticky top-0 h-screen overflow-y-auto custom-scrollbar">
          <div className="p-5 border-b-soft sticky top-0 bg-white z-10">
            <h4 className="font-display text-lg flex items-center gap-2 text-yellow-900">
              <SlidersHorizontal size={18} className="text-gray-400" /> Filtreler
            </h4>
            <p className="font-label text-gray-400 mt-1">{data.length.toLocaleString('tr-TR')} kayıt</p>
          </div>
          <div className="p-5"><FilterPanel /></div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">

          {/* Şekil 1 */}
          <section className="sec-panel">
            <PanelHead icon={TrendingUp} title="Şekil 1 — Yıllara Göre Tez Dağılımı" sub="Sütun grafik · yıllık akademik üretkenlik trendi" count={`${yearChart.length} yıl`} />
            <div className="p-6 md:p-10">
              {yearChart.length ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearChart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontFamily:'Lexend', fontSize:12, fill:'#9CA3AF' }} dy={10} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill:'#F9FAFB' }} content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Tez Sayısı" fill="#E5E7EB" radius={[4,4,0,0]} activeBar={{ fill:'#c7972f' }} className="cursor-pointer" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <div className="no-data">Filtreye uyan veri yok</div>}
            </div>
          </section>

          {/* Şekil 2 + 3 */}
          <section className="sec-panel border-b-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 border-r-soft">
                <PanelHead icon={FileText} title="Şekil 2 — Araştırma Dili" sub="Pasta grafik · yazım dili dağılımı" />
                <div className="p-6">
                  {langChart.some(d => d.name !== 'Belirtilmemiş') ? (
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie data={langChart} dataKey="value" cx="50%" cy="45%" outerRadius={90} paddingAngle={4} cornerRadius={5} stroke="none">
                            {langChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily:'Lexend', fontSize:'.75rem' }} />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  ) : <div className="no-data">Dil verisi yok</div>}
                </div>
              </div>
              <div className="lg:col-span-7">
                <PanelHead icon={BarChart2} title="Şekil 3 — Araştırma Yöntemi" sub="Pasta grafik · Nitel / Nicel / Karma" />
                <div className="p-6">
                  {methodChart.some(d => d.name !== 'Belirtilmemiş') ? (
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie data={methodChart} dataKey="value" cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={5} cornerRadius={6} stroke="none">
                            {methodChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily:'Lexend', fontSize:'.75rem' }} />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  ) : <div className="no-data">Yöntem verisi yok</div>}
                </div>
              </div>
            </div>
          </section>

          {/* Tablo 1 */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={FileText} title="Tablo 1 — Sayfa Uzunluklarına Göre Dağılım" sub={`${pageTable.filled} tezde sayfa verisi mevcut`} />
            <div className="p-6 md:p-10">
              {pageTable.rows.length ? (
                <div className="dt-wrap"><table className="dt">
                  <thead><tr><th>Sayfa Aralığı</th><th>Tez Sayısı</th><th>Dağılım</th></tr></thead>
                  <tbody>{pageTable.rows.map((r, i) => (
                    <tr key={i}><td className="font-semibold">{r.label}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={pageTable.filled ? r.count/pageTable.filled*100 : 0}/></td></tr>
                  ))}</tbody>
                </table></div>
              ) : <div className="no-data">Sayfa sayısı verisi mevcut değil</div>}
            </div>
          </section>

          {/* Tablo 2 – Cinsiyet */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={Users} title="Tablo 2 — Yazar ve Danışman Cinsiyet Dağılımı" sub="Akademik cinsiyet dengesi analizi" />
            <div className="p-6 md:p-10">
              {(genderTable.yazar.length || genderTable.danisman.length) ? (
                <div className="gender-grid">
                  {[['Tez Yazarı', genderTable.yazar], ['Danışman', genderTable.danisman]].map(([title, rows]) => {
                    const total = rows.reduce((s, [,c]) => s + c, 0);
                    return (
                      <div key={title} className="gender-card">
                        <div className="gender-card-head">{title}</div>
                        {rows.map(([g, c]) => (
                          <div key={g}>
                            <div className="gender-row">
                              <span className="gender-dot" style={{ background: g === 'Erkek' ? '#111827' : '#c7972f' }} />
                              <span className="gender-name">{g}</span>
                              <span className="gender-num">{c}</span>
                              <span className="gender-pct">({total ? (c/total*100).toFixed(0) : 0}%)</span>
                            </div>
                            <div className="gender-bar-wrap">
                              <div className="gender-bar-fill" style={{ width:`${total?c/total*100:0}%`, background: g==='Erkek'?'#111827':'#c7972f' }} />
                            </div>
                          </div>
                        ))}
                        {!rows.length && <div className="p-4 text-sm text-gray-400">Veri yok</div>}
                      </div>
                    );
                  })}
                </div>
              ) : <div className="no-data">Bu filtreler için cinsiyet verisi yok</div>}
            </div>
          </section>

          {/* Tablo 3 */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={GraduationCap} title="Tablo 3 — Danışman Unvan Dağılımı" sub="Akademik unvana göre tez yönetimi" count={`${unvanTable.length} unvan`} />
            <div className="p-6 md:p-10">
              <div className="dt-wrap"><table className="dt">
                <thead><tr><th>#</th><th>Unvan</th><th>Tez Sayısı</th><th>Oran</th></tr></thead>
                <tbody>{unvanTable.map((r, i) => (
                  <tr key={i}><td><RankCircle i={i}/></td><td style={{ fontWeight:i<3?700:400 }}>{r.unvan}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={r.pct}/></td></tr>
                ))}</tbody>
              </table></div>
            </div>
          </section>

          {/* Tablo 4 */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={Building2} title="Tablo 4 — Üniversite ve Enstitü Dağılımı" sub="Kurumsal mensubiyet · ilk 30 · satıra tıklayarak filtrele" count={`${uniTable.length} üniversite`} />
            <div className="p-6 md:p-10">
              <div className="dt-wrap"><table className="dt">
                <thead><tr><th>#</th><th>Üniversite</th><th>Tez</th><th>Oran</th></tr></thead>
                <tbody>{uniTable.slice(0,30).map((r, i) => (
                  <tr key={i} className="cursor-pointer" onClick={() => upd('university', f.university===r.uni?'':r.uni)}>
                    <td><RankCircle i={i}/></td>
                    <td style={{ fontWeight:i<3?700:400, color:f.university===r.uni?'#c7972f':'inherit' }}>{r.uni}</td>
                    <td className="font-bold">{r.count}</td><td><MiniBar pct={r.pct}/></td>
                  </tr>
                ))}</tbody>
              </table></div>
              {uniTable.length > 30 && <p className="text-center text-xs text-gray-400 mt-3">+{uniTable.length-30} üniversite daha — sol panelden filtreleyin</p>}
            </div>
          </section>

          {/* Tablo 5 */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={BookOpen} title="Tablo 5 — Anabilim Dalı / Bölüm Dağılımı" sub="İlahiyat branşlarına göre tez dağılımı · ilk 25" count={`${deptTable.length} bölüm`} />
            <div className="p-6 md:p-10">
              <div className="dt-wrap"><table className="dt">
                <thead><tr><th>#</th><th>Bölüm / ABD</th><th>Tez</th><th>Oran</th></tr></thead>
                <tbody>{deptTable.slice(0,25).map((r, i) => (
                  <tr key={i}><td><RankCircle i={i}/></td><td style={{ fontSize:'.78rem', fontWeight:i<3?700:400 }}>{r.dept}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={r.pct}/></td></tr>
                ))}</tbody>
              </table></div>
            </div>
          </section>

          {/* Tablo 6 */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={Users} title="Tablo 6 — Örneklem Türü ve Büyüklüğü" sub="Araştırılan gruplar matrisi" count={`${sampleTable.length} tür`} />
            <div className="p-6 md:p-10">
              {sampleTable.length ? (
                <div className="dt-wrap"><table className="dt">
                  <thead><tr><th>#</th><th>Örneklem Türü</th><th>Tez Sayısı</th></tr></thead>
                  <tbody>{sampleTable.map((r, i) => (
                    <tr key={i}><td><RankCircle i={i}/></td><td style={{ fontWeight:i<3?700:400 }}>{r.tip}</td><td className="font-bold">{r.count}</td></tr>
                  ))}</tbody>
                </table></div>
              ) : <div className="no-data">Bu filtreler için örneklem verisi yok</div>}
            </div>
          </section>

          {/* Şekil 4 – Kelime bulutu */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={Hash} title="Şekil 4 — Anahtar Kelime Bulutu" sub="Tematik odak görselleştirmesi · boyut = frekans" count={`${kwData.length} terim`} />
            <div className="p-6 md:p-10">
              {kwData.length ? (
                <div className="wc-container">
                  {kwData.slice(0,60).map(({ word, freq }, i) => {
                    const scale = 0.75 + (freq / kwMax) * 1.4;
                    const dark = i % 4 === 0, gold = i % 4 === 1;
                    return (
                      <span key={i} className="wc-word" title={`${word}: ${freq} kez`}
                        style={{ fontSize:`${scale}rem`, background: dark?'#111827':gold?'#c7972f':'#F3F4F6', color:(dark||gold)?'white':'#374151' }}>
                        {word}
                      </span>
                    );
                  })}
                </div>
              ) : <div className="no-data">Bu filtreler için anahtar kelime verisi yok</div>}
            </div>
          </section>

          {/* Tablo 7 */}
          <section className="sec-panel border-b-soft">
            <PanelHead icon={Hash} title="Tablo 7 — Anahtar Kelime Frekans Değerleri" sub="En sık kullanılan kavramlar · ilk 30" />
            <div className="p-6 md:p-10">
              {kwData.length ? (
                <div className="dt-wrap"><table className="dt">
                  <thead><tr><th>#</th><th>Anahtar Kelime</th><th>Frekans</th><th>Görsel</th></tr></thead>
                  <tbody>{kwData.slice(0,30).map((r, i) => (
                    <tr key={i}><td><RankCircle i={i}/></td><td style={{ fontWeight:i<5?700:400 }}>{r.word}</td><td className="font-bold">{r.freq}</td><td><MiniBar pct={kwMax?r.freq/kwMax*100:0}/></td></tr>
                  ))}</tbody>
                </table></div>
              ) : <div className="no-data">Bu filtreler için anahtar kelime verisi yok</div>}
            </div>
          </section>

          {/* FOOTER – identical to Dashboard */}
          <footer className="border-b-soft py-24 bg-[#F9FAFB]">
            <div className="max-w-2xl mx-auto text-center px-6">
              <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight text-yellow-600">
                Tüm koleksiyonu <br /><span className="text-gray-900">keşfedin.</span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('/tez-analytics/all')} className="btn-primary">
                  Tüm Tezlere Git <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/tez-analytics')} className="btn-primary"
                  style={{ background:'#c7972f', borderColor:'#c7972f' }}>
                  Dashboard'a Dön <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* MOBİL FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#111827] text-white rounded-[18px] flex items-center justify-center shadow-xl z-50 lg:hidden"
        onClick={() => setMobOpen(true)}>
        <SlidersHorizontal size={22} />
      </button>
      <div className={`mob-overlay ${mobOpen ? 'open' : ''}`} onClick={() => setMobOpen(false)} />
      <div className={`mob-drawer ${mobOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between mb-5">
          <span className="font-display text-lg text-yellow-900">Filtreler</span>
          <button className="p-2 bg-gray-100 rounded-full" onClick={() => setMobOpen(false)}><X size={18} /></button>
        </div>
        <FilterPanel />
        <div className="h-8" />
        <button className="w-full py-3 bg-[#111827] text-white rounded-xl font-medium font-display" onClick={() => setMobOpen(false)}>
          Sonuçları Göster ({data.length})
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;