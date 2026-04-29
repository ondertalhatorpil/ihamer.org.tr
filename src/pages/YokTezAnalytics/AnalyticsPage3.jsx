import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Building2, BookOpen, Hash, TrendingUp, FileText, GraduationCap, SlidersHorizontal, X, Search, BarChart2, Target, Download } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");
  :root{--bg-main:#F9FAFB;--text-primary:#111827;--text-secondary:#6B7280;--border-color:#E5E7EB;--gold:#c7972f;}
  *{font-family:"Lexend",sans-serif;box-sizing:border-box;}
  body{background-color:var(--bg-main);color:var(--text-primary);-webkit-font-smoothing:antialiased;}
  .font-display{font-weight:600;letter-spacing:-0.02em;}.font-data{font-weight:300;}
  .font-label{font-weight:600;text-transform:uppercase;letter-spacing:0.05em;font-size:0.70rem;}
  .border-r-soft{border-right:1px solid var(--border-color);}.border-b-soft{border-bottom:1px solid var(--border-color);}
  .reveal-up{animation:revealUp .8s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(20px);}
  .delay-100{animation-delay:.1s;}.delay-200{animation-delay:.2s;}.delay-300{animation-delay:.3s;}
  @keyframes revealUp{to{opacity:1;transform:translateY(0);}}
  .rank-circle{width:28px;height:28px;min-width:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:.75rem;font-weight:600;margin-right:1rem;}
  .rank-1{background:#111827;color:white;}.rank-2{background:#374151;color:white;}.rank-3{background:#4B5563;color:white;}.rank-other{background:#F3F4F6;color:#6B7280;}
  .custom-scrollbar::-webkit-scrollbar{width:5px;}.custom-scrollbar::-webkit-scrollbar-track{background:transparent;}
  .custom-scrollbar::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:10px;}
  .btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:var(--text-primary);color:white;padding:1rem 2rem;border-radius:12px;font-weight:500;transition:all .2s;border:1px solid transparent;cursor:pointer;font-family:"Lexend",sans-serif;}
  .btn-primary:hover{background:white;color:var(--text-primary);border-color:var(--text-primary);}
  .mini-search-input{width:100%;padding:6px 10px 6px 30px;font-size:.8rem;border:1px solid #E5E7EB;border-radius:6px;background:white;font-family:"Lexend",sans-serif;}
  .mini-search-input:focus{outline:none;border-color:#111827;}
  .ap-select{width:100%;padding:6px 28px 6px 10px;font-size:.8rem;border:1px solid #E5E7EB;border-radius:6px;background:white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 8px center;appearance:none;font-family:"Lexend",sans-serif;color:var(--text-primary);cursor:pointer;}
  .ap-select:focus{outline:none;border-color:#111827;}
  .dt-wrap{overflow-x:auto;border:1px solid var(--border-color);border-radius:12px;}
  .dt{width:100%;border-collapse:collapse;font-size:.82rem;}
  .dt th{background:#111827;color:white;padding:.6rem 1rem;text-align:left;font-weight:600;font-size:.70rem;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
  .dt td{padding:.6rem 1rem;border-bottom:1px solid var(--border-color);}
  .dt tr:last-child td{border-bottom:none;}.dt tr:nth-child(even) td{background:#F9FAFB;}
  .dt-clickable tr:hover td{background:#fefce8;transition:background .1s;cursor:pointer;}
  .dt-active td{background:#fef3c7!important;}
  .mini-bar-wrap{display:flex;align-items:center;gap:8px;min-width:100px;}
  .mini-bar-track{flex:1;height:5px;background:#E5E7EB;border-radius:3px;}
  .mini-bar-fill{height:100%;border-radius:3px;background:var(--gold);}
  .mini-bar-pct{font-size:.70rem;color:var(--text-secondary);width:32px;text-align:right;flex-shrink:0;}
  .gender-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
  @media(max-width:700px){.gender-grid{grid-template-columns:1fr;}}
  .gender-card{border:1px solid var(--border-color);border-radius:12px;overflow:hidden;background:white;}
  .gender-card-head{background:#111827;color:white;padding:.55rem 1.25rem;font-size:.70rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}
  .gender-row{display:flex;align-items:center;gap:.75rem;padding:.65rem 1.25rem;border-bottom:1px solid var(--border-color);cursor:pointer;}
  .gender-row:hover{background:#fefce8;}.gender-row:last-child{border-bottom:none;}
  .gender-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
  .gender-name{font-size:.85rem;font-weight:500;flex:1;}.gender-num{font-size:.95rem;font-weight:700;}
  .gender-pct{font-size:.72rem;color:var(--text-secondary);margin-left:4px;}
  .gender-bar-wrap{height:4px;background:#E5E7EB;margin:0 1.25rem 6px;border-radius:3px;}
  .gender-bar-fill{height:100%;border-radius:3px;}
  .wc-container{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;padding:2rem;min-height:180px;}
  .wc-word{border-radius:6px;padding:4px 12px;font-weight:600;cursor:default;transition:transform .15s,box-shadow .15s;}
  .wc-word:hover{transform:scale(1.08);box-shadow:0 4px 12px rgba(0,0,0,.12);}
  .sf-label{font-weight:600;text-transform:uppercase;letter-spacing:.05em;font-size:.70rem;color:var(--text-secondary);margin-bottom:.4rem;display:flex;align-items:center;gap:5px;}
  .sf-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;background:#FEF9C3;color:#92400E;font-size:.70rem;font-weight:600;border:1px solid #FDE68A;}
  .sf-chip button{background:none;border:none;cursor:pointer;color:#92400E;display:flex;align-items:center;}
  .sec-panel{background:white;border-bottom:1px solid var(--border-color);}
  .sec-panel-head{padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;}
  .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;}
  .mob-overlay.open{display:block;}
  .mob-drawer{position:fixed;bottom:0;left:0;right:0;background:white;border-radius:20px 20px 0 0;z-index:301;max-height:88vh;overflow-y:auto;transform:translateY(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);padding:1.5rem;}
  .mob-drawer.open{transform:translateY(0);}
  .no-data{text-align:center;padding:3rem 1rem;color:var(--text-secondary);font-size:.85rem;}
  .drill-badge{font-size:.68rem;font-weight:700;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:10px;white-space:nowrap;}
`;

const S = v => (v == null ? '' : String(v)).trim();
const COLORS = ['#111827', '#c7972f', '#6B7280', '#374151', '#9CA3AF', '#D1D5DB', '#4B5563', '#c4a97a'];
const CT = ({ active, payload, label }) => { if (!active || !payload?.length) return null; return (<div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl"><p className="text-xs text-gray-400 uppercase font-medium mb-1">{label || payload[0].name}</p><p className="text-lg font-semibold text-gray-900">{payload[0].value}</p></div>); };
const MiniBar = ({ pct }) => (<div className="mini-bar-wrap"><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="mini-bar-pct">{pct.toFixed(0)}%</span></div>);
const RC = ({ i }) => { const c = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'; return <span className={`rank-circle ${c}`}>{i + 1}</span>; };
const PH = ({ icon: Icon, title, sub, count: cnt }) => (<div className="sec-panel-head"><div><h4 className="font-display text-lg flex items-center gap-2 text-yellow-900"><Icon size={18} className="text-gray-400" />{title}</h4>{sub && <p className="font-label text-gray-400 mt-1">{sub}</p>}</div>{cnt != null && <span className="bg-white border border-gray-200 text-xs font-semibold px-2 py-1 rounded-md text-gray-500">{cnt}</span>}</div>);

export default function AnalyticsPage3() {
    const navigate = useNavigate();
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobOpen, setMobOpen] = useState(false);
    const [f, setF] = useState({ search: '', category: '', year: '', university: '', department: '', tezTuru: '', method: '', language: '', advisorUnvan: '', gender: '', advisorGender: '', desen: '', veriToplama: '', orneklem: '', orneklemMahiyet: '', veriAnaliz: '', konu: '' });

    const upd = (k, v) => setF(p => ({ ...p, [k]: p[k] === v ? '' : v }));
    const updD = (k, v) => setF(p => ({ ...p, [k]: v }));
    const clearAll = () => setF({ search: '', category: '', year: '', university: '', department: '', tezTuru: '', method: '', language: '', advisorUnvan: '', gender: '', advisorGender: '', desen: '', veriToplama: '', orneklem: '', orneklemMahiyet: '', veriAnaliz: '', konu: '' });
    const hasF = Object.values(f).some(v => v !== '');

    useEffect(() => { import('./data/tez3.json').then(m => { setRawData(m.default); setLoading(false); }).catch(() => setLoading(false)); }, []);

    const data = useMemo(() => {
        let r = rawData;
        if (f.search) { const q = f.search.toLowerCase(); r = r.filter(t => S(t['Tez Başlığı']).toLowerCase().includes(q) || S(t['Tez Yazarı']).toLowerCase().includes(q) || S(t['Danışman']).toLowerCase().includes(q) || S(t['Üniversite']).toLowerCase().includes(q) || S(t['Araştırmanın Özeti']).toLowerCase().includes(q) || S(t['Araştırma Konusu']).toLowerCase().includes(q)); }
        if (f.category) r = r.filter(t => S(t['Kategori']) === f.category);
        if (f.year) r = r.filter(t => S(t['Yıl']) === f.year);
        if (f.university) r = r.filter(t => S(t['Üniversite']) === f.university);
        if (f.department) r = r.filter(t => S(t['Bölüm']) === f.department);
        if (f.tezTuru) r = r.filter(t => S(t['Tez Türü']) === f.tezTuru);
        if (f.method) r = r.filter(t => S(t['Araştırmanın Yöntemi']).toLowerCase() === f.method.toLowerCase());
        if (f.language) r = r.filter(t => S(t['Araştırma Dili']).toLowerCase() === f.language.toLowerCase());
        if (f.advisorUnvan) r = r.filter(t => S(t['Danışman Unvanları']).startsWith(f.advisorUnvan));
        if (f.gender) r = r.filter(t => S(t['Tez Yazarının Cinsiyeti']) === f.gender);
        if (f.advisorGender) r = r.filter(t => S(t['Danışmanın Cinsiyeti']) === f.advisorGender);
        if (f.desen) r = r.filter(t => S(t['_desenNorm']) === f.desen);
        if (f.veriToplama) r = r.filter(t => (t['_veriTopNorm'] || []).includes(f.veriToplama));
        if (f.orneklem) r = r.filter(t => S(t['Araştırma Örneklemi']).toLowerCase().includes(f.orneklem.toLowerCase()));
        if (f.orneklemMahiyet) r = r.filter(t => S(t['_mahiyetNorm']) === f.orneklemMahiyet);
        if (f.veriAnaliz) r = r.filter(t => S(t['_veriAnalizNorm']) === f.veriAnaliz);
        if (f.konu) r = r.filter(t => S(t['_konuNorm']) === f.konu);
        return r;
    }, [rawData, f]);

    const uniq = k => [...new Set(rawData.map(t => S(t[k])).filter(Boolean))].sort();
    const years = useMemo(() => [...new Set(rawData.map(t => S(t['Yıl'])).filter(Boolean))].sort().reverse(), [rawData]);
    const methods = useMemo(() => uniq('Araştırmanın Yöntemi'), [rawData]);
    const languages = useMemo(() => uniq('Araştırma Dili'), [rawData]);
    const universities = useMemo(() => uniq('Üniversite'), [rawData]);
    const departments = useMemo(() => uniq('Bölüm'), [rawData]);
    const desenList = useMemo(() => [...new Set(rawData.map(t => S(t['_desenNorm'])).filter(v => v && v !== 'Belirtilmemiş'))].sort(), [rawData]);
    const vtList = useMemo(() => { const s = new Set(); rawData.forEach(t => (t['_veriTopNorm'] || []).forEach(v => s.add(v))); return [...s].sort(); }, [rawData]);
    const mahList = useMemo(() => [...new Set(rawData.map(t => S(t['_mahiyetNorm'])).filter(v => v && v !== 'Belirtilmemiş'))].sort(), [rawData]);
    const vaList = useMemo(() => [...new Set(rawData.map(t => S(t['_veriAnalizNorm'])).filter(v => v && v !== 'Belirtilmemiş'))].sort(), [rawData]);
    const konuList = useMemo(() => [...new Set(rawData.map(t => S(t['_konuNorm'])).filter(v => v && v !== 'Belirtilmemiş'))].sort(), [rawData]);

    /* Grouped tables */
    const mkNorm = (key, total) => { const m = {}; data.forEach(t => { const v = S(t[key]) || 'Belirtilmemiş'; m[v] = (m[v] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: total ? count / total * 100 : 0 })); };
    const mkVt = (total) => { const m = {}; data.forEach(t => { (t['_veriTopNorm'] || []).forEach(v => { m[v] = (m[v] || 0) + 1; }); }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: total ? count / total * 100 : 0 })); };

    const yearChart = useMemo(() => { const m = {}; data.forEach(t => { const y = S(t['Yıl']); if (y) m[y] = (m[y] || 0) + 1; }); return Object.entries(m).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })); }, [data]);
    const mkPie = key => { const m = {}; data.forEach(t => { const v = S(t[key]).trim() || 'Belirtilmemiş'; m[v] = (m[v] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); };
    const mkPieVt = () => { const m = {}; data.forEach(t => { (t['_veriTopNorm'] || []).forEach(v => { m[v] = (m[v] || 0) + 1; }); }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); };

    const langChart = useMemo(() => mkPie('Araştırma Dili'), [data]);
    const methodChart = useMemo(() => mkPie('Araştırmanın Yöntemi'), [data]);
    const desenChart = useMemo(() => mkPie('_desenNorm'), [data]);
    const vaChart = useMemo(() => mkPie('_veriAnalizNorm'), [data]);
    const vtChart = useMemo(() => mkPieVt(), [data]);
    const konuChart = useMemo(() => mkPie('_konuNorm'), [data]);

    // === BETİMSEL GRUPLAMA MANTIĞI ===
    const groupedDesenChart = useMemo(() => {
        return desenChart.reduce((acc, curr) => {
            if (curr.name === 'Belirtilmemiş') return acc;
            const isBetimsel = curr.name.toLowerCase().includes('betimsel');
            const targetName = isBetimsel ? 'Betimsel (Gruplandırılmış)' : curr.name;
            const existing = acc.find(item => item.name === targetName);
            if (existing) { existing.value += curr.value; } else { acc.push({ ...curr, name: targetName }); }
            return acc;
        }, []).sort((a, b) => b.value - a.value); 
    }, [desenChart]);

    const groupedDesenNorm = useMemo(() => {
        const rawDesenNorm = mkNorm('_desenNorm', data.length);
        return rawDesenNorm.reduce((acc, curr) => {
            const isBetimsel = curr.label.toLowerCase().includes('betimsel');
            const targetLabel = isBetimsel ? 'Betimsel (Gruplandırılmış)' : curr.label;
            const existing = acc.find(item => item.label === targetLabel);
            if (existing) {
                existing.count += curr.count;
                if (existing.pct !== undefined && curr.pct !== undefined) existing.pct += curr.pct; 
            } else { acc.push({ ...curr, label: targetLabel }); }
            return acc;
        }, []).sort((a, b) => b.count - a.count); 
    }, [data]);

    const pageRows = useMemo(() => { const bins = [[0, 100, '0–100'], [101, 200, '101–200'], [201, 300, '201–300'], [301, 400, '301–400'], [401, 500, '401–500'], [501, 600, '501–600'], [601, Infinity, '601+']]; const counts = bins.map(() => 0); let filled = 0; data.forEach(t => { const p = parseInt(S(t['Sayfa Sayısı'])); if (!isNaN(p)) { filled++; for (let i = 0; i < bins.length; i++)if (p >= bins[i][0] && p <= bins[i][1]) { counts[i]++; break; } } }); return { rows: bins.map(([, , l], i) => ({ label: l, count: counts[i] })).filter(r => r.count > 0), filled }; }, [data]);

    const genderTable = useMemo(() => { const aG = {}, dG = {}; data.forEach(t => { const ag = S(t['Tez Yazarının Cinsiyeti']); if (ag) aG[ag] = (aG[ag] || 0) + 1; const dg = S(t['Danışmanın Cinsiyeti']); if (dg) dG[dg] = (dG[dg] || 0) + 1; }); return { yazar: Object.entries(aG).sort((a, b) => b[1] - a[1]), danisman: Object.entries(dG).sort((a, b) => b[1] - a[1]) }; }, [data]);
    const unvanTable = useMemo(() => { const m = {}; data.forEach(t => { let u = S(t['Danışman Unvanları']); if (!u) u = 'Belirtilmemiş'; else if (u.startsWith('PROF')) u = 'PROF. DR.'; else if (u.startsWith('YRD')) u = 'YRD. DOÇ. DR.'; else if (u.startsWith('DOÇ')) u = 'DOÇ. DR.'; else if (u.startsWith('DR. ÖĞR')) u = 'DR. ÖĞR. ÜYESİ'; m[u] = (m[u] || 0) + 1; }); const tot = Object.values(m).reduce((a, b) => a + b, 0); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([unvan, count]) => ({ unvan, count, pct: tot ? count / tot * 100 : 0 })); }, [data]);
    const uniTable = useMemo(() => { const m = {}; data.forEach(t => { const u = S(t['Üniversite']); if (u) m[u] = (m[u] || 0) + 1; }); const tot = data.length; return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([uni, count]) => ({ uni, count, pct: tot ? count / tot * 100 : 0 })); }, [data]);
    const deptTable = useMemo(() => { const m = {}; data.forEach(t => { const b = S(t['Bölüm']); if (b) m[b] = (m[b] || 0) + 1; }); const tot = data.length; return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([dept, count]) => ({ dept, count, pct: tot ? count / tot * 100 : 0 })); }, [data]);

    const kwData = useMemo(() => { const m = {};['1. Anahtar Kelime', '2. Anahtar Kelime', '3. Anahtar Kelime', '4. Anahtar Kelime', '5. ve Üstü Anahtar Kelimeler'].forEach(c => data.forEach(t => { const raw = S(t[c]); if (!raw || raw.toLowerCase() === 'nan') return; raw.split(/[,;\/]/).forEach(kw => { const k = kw.trim(); if (k.length > 1) m[k] = (m[k] || 0) + 1; }); })); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([word, freq]) => ({ word, freq })); }, [data]);
    const kwMax = kwData[0]?.freq || 1;
    const hero = useMemo(() => ({ total: data.length, unis: new Set(data.map(t => S(t['Üniversite'])).filter(Boolean)).size, advisors: new Set(data.map(t => S(t['Danışman'])).filter(Boolean)).size, doktora: data.filter(t => S(t['Tez Türü']) === 'Doktora').length }), [data]);

    /* DrillDown: navigate to tez list with URL param */
    const drill = (filterKey, filterVal) => {
        const p = new URLSearchParams({ [filterKey]: filterVal });
        navigate(`/tez-analytics/dogrudan-tezler?${p.toString()}`);
    };

    /* Grouped Table Component */
    const GT = ({ rows, fk, activeVal, hasPct = true }) => (
        <div className="dt-wrap"><table className={`dt dt-clickable`}>
            <thead><tr><th>#</th><th>Grup</th><th>Tez</th>{hasPct && <th>Oran</th>}</tr></thead>
            <tbody>{rows.map((r, i) => (
                <tr key={i} className={activeVal === r.label ? 'dt-active' : ''} onClick={() => { upd(fk, r.label); drill(fk, r.label); }}>
                    <td><RC i={i} /></td>
                    <td style={{ fontWeight: i < 3 ? 700 : 400, color: activeVal === r.label ? '#c7972f' : 'inherit' }}>{r.label}</td>
                    <td className="font-bold">{r.count}</td>
                    {hasPct && <td><MiniBar pct={r.pct} /></td>}
                </tr>
            ))}</tbody>
        </table></div>
    );

    const FP = () => (
        <div className="flex flex-col gap-4">
            <div><p className="sf-label"><Search size={11} /> Genel Arama</p>
                <div className="relative"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="mini-search-input" placeholder="Başlık, yazar, konu…" value={f.search} onChange={e => updD('search', e.target.value)} /></div></div>
            {[{ l: 'Kategori', k: 'category', o: ['Doğrudan', 'Dolaylı'] }, { l: 'Tez Türü', k: 'tezTuru', o: ['Doktora', 'Yüksek Lisans'] }].map(({ l, k, o }) => (
                <div key={k}><p className="sf-label">{l}</p><select className="ap-select" value={f[k]} onChange={e => updD(k, e.target.value)}><option value="">Tümü</option>{o.map(x => <option key={x} value={x}>{x}</option>)}</select></div>
            ))}
            <div><p className="sf-label">Araştırma Dili</p><select className="ap-select" value={f.language} onChange={e => updD('language', e.target.value)}><option value="">Tümü</option>{languages.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
            <div><p className="sf-label">Araştırma Yöntemi</p><select className="ap-select" value={f.method} onChange={e => updD('method', e.target.value)}><option value="">Tümü</option>{methods.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><p className="sf-label">Yıl</p><select className="ap-select" value={f.year} onChange={e => updD('year', e.target.value)}><option value="">Tüm Yıllar</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div><p className="sf-label">Üniversite</p><select className="ap-select" value={f.university} onChange={e => updD('university', e.target.value)}><option value="">Tüm Üniversiteler</option>{universities.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
            <div><p className="sf-label">Araştırma Deseni</p><select className="ap-select" value={f.desen} onChange={e => updD('desen', e.target.value)}><option value="">Tümü</option>{desenList.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><p className="sf-label">Veri Toplama Aracı</p><select className="ap-select" value={f.veriToplama} onChange={e => updD('veriToplama', e.target.value)}><option value="">Tümü</option>{vtList.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
            <div><p className="sf-label">Örneklem Mahiyeti</p><select className="ap-select" value={f.orneklemMahiyet} onChange={e => updD('orneklemMahiyet', e.target.value)}><option value="">Tümü</option>{mahList.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><p className="sf-label">Veri Analiz Yöntemi</p><select className="ap-select" value={f.veriAnaliz} onChange={e => updD('veriAnaliz', e.target.value)}><option value="">Tümü</option>{vaList.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
            <div><p className="sf-label">Araştırma Konusu</p><select className="ap-select" value={f.konu} onChange={e => updD('konu', e.target.value)}><option value="">Tümü</option>{konuList.map(k => <option key={k} value={k}>{k.length > 45 ? k.slice(0, 45) + '…' : k}</option>)}</select></div>
            <div><p className="sf-label">Danışman Unvanı</p><select className="ap-select" value={f.advisorUnvan} onChange={e => updD('advisorUnvan', e.target.value)}><option value="">Tümü</option><option value="PROF">PROF. DR.</option><option value="DOÇ">DOÇ. DR.</option><option value="YRD">YRD. DOÇ. DR.</option><option value="DR. ÖĞR">DR. ÖĞR. ÜYESİ</option></select></div>
            <div><p className="sf-label">Yazar Cinsiyeti</p><select className="ap-select" value={f.gender} onChange={e => updD('gender', e.target.value)}><option value="">Tümü</option><option value="Erkek">Erkek</option><option value="Kadın">Kadın</option></select></div>
            <div><p className="sf-label">Danışman Cinsiyeti</p><select className="ap-select" value={f.advisorGender} onChange={e => updD('advisorGender', e.target.value)}><option value="">Tümü</option><option value="Erkek">Erkek</option><option value="Kadın">Kadın</option></select></div>
            {hasF && (<div><div className="flex flex-wrap gap-1.5 mt-1">{Object.entries(f).filter(([, v]) => v).map(([k, v]) => (<span key={k} className="sf-chip">{v.length > 18 ? v.slice(0, 18) + '…' : v}<button onClick={() => updD(k, '')}><X size={10} /></button></span>))}</div><button onClick={clearAll} className="mt-2 w-full flex items-center justify-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 py-1.5 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"><X size={12} />Filtreleri Temizle</button></div>)}
        </div>
    );

    // === WORD DOSYASINA AKTARIM FONKSİYONU ===
    const exportToWord = () => {
        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Tez Analiz Raporu</title>
                <style>
                    body { font-family: 'Arial', sans-serif; color: #111827; }
                    h1 { color: #c7972f; text-align: center; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; }
                    h3 { color: #111827; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin-top: 30px; font-size: 16px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                    th, td { border: 1px solid #D1D5DB; padding: 8px; text-align: left; vertical-align: middle; }
                    th { background-color: #F3F4F6; font-weight: bold; }
                    .mini-bar-wrap { display: none; } /* Grafik bar'larını gizle, sadece rakamlar kalsın */
                </style>
            </head>
            <body>
                <h1>Doğrudan Tez Analiz Raporu</h1>
                <p><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                <p><strong>Uygulanan Filtre Sayısı:</strong> ${Object.values(f).filter(v => v !== '').length}</p>
                <p><strong>Görüntülenen Toplam Tez:</strong> ${data.length}</p>
        `;

        // Sayfadaki tüm sec-panel sınıflı alanları (grafik+tablo bloklarını) tarar
        document.querySelectorAll('.sec-panel').forEach(sec => {
            const title = sec.querySelector('h4')?.innerText;
            const table = sec.querySelector('table');
            
            // Başlık ve tablo varsa HTML formatında ekler
            if (title && table) {
                htmlContent += `<h3>${title}</h3>`;
                htmlContent += `<table>${table.innerHTML}</table>`;
            }
        });

        htmlContent += `</body></html>`;

        // UTF-8 formatında Blob oluşturup indirtme işlemi
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Tez_Analiz_Raporu.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    // =======================================

    if (loading) return (<div className="h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center"><style>{styles}</style><div className="font-label text-gray-400 mb-4 animate-pulse">VERİLER ANALİZ EDİLİYOR</div><div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>);

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
            <style>{styles}</style>
            {/* HERO */}
            <section className="border-b-soft bg-white">
                <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
                    <div className="col-span-1 md:col-span-6 border-r-soft p-8 md:p-16 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <button onClick={() => navigate('/tez-analytics')} className="font-label text-gray-400 flex items-center gap-1 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer p-0"><ArrowRight size={12} className="rotate-180" />Dashboard'a Dön</button>
                                
                                {/* WORD İNDİRME BUTONU BURAYA EKLENDİ */}
                                <button onClick={exportToWord} className="font-label text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer">
                                    <Download size={14} /> Word Raporu İndir
                                </button>
                                
                            </div>
                            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] text-yellow-600 reveal-up">Doğrudan <br /><span className="text-gray-900">Analizler</span></h2>
                        </div>
                        <p className="font-data text-lg text-gray-500 max-w-md mt-8 reveal-up delay-100">35 tezin gruplandırılmış analizi. Tablolara tıklayarak ilgili tezlere gidin.</p>
                    </div>
                    <div className="col-span-1 md:col-span-6 grid grid-cols-2 grid-rows-2">
                        {[{ num: hero.total, lbl: 'Toplam Tez', bg: '#F9FAFB', color: 'text-gray-900', delay: 'delay-200', bR: true, bB: true }, { num: hero.unis, lbl: 'Üniversite', bg: 'white', color: 'text-[#c7972f]', delay: 'delay-300', bR: false, bB: true }, { num: hero.advisors, lbl: 'Danışman', bg: 'white', color: 'text-gray-900', delay: 'delay-200', bR: true, bB: false }, { num: hero.doktora, lbl: 'Doktora Tezi', bg: '#F9FAFB', color: 'text-gray-900', delay: 'delay-300', bR: false, bB: false }]
                            .map(({ num, lbl, bg, color, delay, bR, bB }, i) => (
                                <div key={i} className={`p-8 md:p-10 flex flex-col justify-center reveal-up ${delay} ${bR ? 'border-r-soft' : ''} ${bB ? 'border-b-soft' : ''}`} style={{ background: bg }}>
                                    <span className="font-label text-gray-500 mb-3">{lbl}</span>
                                    <span className={`font-display text-5xl md:text-6xl tracking-tighter ${color}`}>{num.toLocaleString('tr-TR')}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            <div className="max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row flex-1">
                {/* SIDEBAR */}
                <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 border-r-soft bg-white sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                    <div className="p-5 border-b-soft sticky top-0 bg-white z-10">
                        <h4 className="font-display text-lg flex items-center gap-2 text-yellow-900"><SlidersHorizontal size={18} className="text-gray-400" />Filtreler</h4>
                        <p className="font-label text-gray-400 mt-1">{data.length} kayıt · tıkla → tezlere git</p>
                    </div>
                    <div className="p-5"><FP /></div>
                </aside>

                <main className="flex-1 min-w-0">

                    {/* ŞEKİL 1 – YIL */}
                    <section className="sec-panel">
                        <PH icon={TrendingUp} title="Şekil 1 — Yıllara Göre Tez Dağılımı" sub="Çubuğa tıkla → o yılın tezleri" count={`${yearChart.length} yıl`} />
                        <div className="p-6 md:p-10"><div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={yearChart}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                    <YAxis hide /><Tooltip cursor={{ fill: '#F9FAFB' }} content={<CT />} />
                                    <Bar dataKey="count" name="Tez Sayısı" fill="#E5E7EB" radius={[4, 4, 0, 0]} activeBar={{ fill: '#c7972f' }} className="cursor-pointer" onClick={d => drill('year', d.year)} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div></div>
                    </section>

                    {/* ŞEKİL 2+3 – DİL & YÖNTEM */}
                    <section className="sec-panel border-b-soft">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            <div className="lg:col-span-5 border-r-soft">
                                <PH icon={FileText} title="Şekil 2 — Araştırma Dili" sub="Satıra tıkla → tezlere git" />
                                <div className="p-6">
                                    <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><RechartsPie><Pie data={langChart} dataKey="value" cx="50%" cy="45%" outerRadius={70} paddingAngle={4} cornerRadius={5} stroke="none">{langChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.72rem' }} /></RechartsPie></ResponsiveContainer></div>
                                    <div className="dt-wrap mt-3"><table className={`dt dt-clickable`}><thead><tr><th>Dil</th><th>Tez</th><th>Oran</th></tr></thead>
                                        <tbody>{langChart.map((r, i) => (<tr key={i} className={f.language === r.name ? 'dt-active' : ''} onClick={() => { upd('language', r.name); drill('language', r.name); }}><td style={{ fontWeight: i < 2 ? 700 : 400, color: f.language === r.name ? '#c7972f' : 'inherit' }}>{r.name}</td><td className="font-bold">{r.value}</td><td><MiniBar pct={data.length ? r.value / data.length * 100 : 0} /></td></tr>))}</tbody>
                                    </table></div>
                                </div>
                            </div>
                            <div className="lg:col-span-7">
                                <PH icon={BarChart2} title="Şekil 3 — Araştırma Yöntemi" sub="Satıra tıkla → tezlere git" />
                                <div className="p-6">
                                    <div className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><RechartsPie><Pie data={methodChart} dataKey="value" cx="50%" cy="45%" innerRadius={45} outerRadius={75} paddingAngle={5} cornerRadius={6} stroke="none">{methodChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.72rem' }} /></RechartsPie></ResponsiveContainer></div>
                                    <div className="dt-wrap mt-3"><table className={`dt dt-clickable`}><thead><tr><th>Yöntem</th><th>Tez</th><th>Oran</th></tr></thead>
                                        <tbody>{methodChart.map((r, i) => (<tr key={i} className={f.method === r.name ? 'dt-active' : ''} onClick={() => { upd('method', r.name); drill('method', r.name); }}><td style={{ fontWeight: i < 2 ? 700 : 400, color: f.method === r.name ? '#c7972f' : 'inherit' }}>{r.name}</td><td className="font-bold">{r.value}</td><td><MiniBar pct={data.length ? r.value / data.length * 100 : 0} /></td></tr>))}</tbody>
                                    </table></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TABLO 1 – DESEN (GRUPLU) */}
                    <section className="sec-panel border-b-soft">
                        <PH
                            icon={BarChart2}
                            title="Tablo 1 — Araştırma Deseni"
                            sub="Gruplandırılmış · satıra tıkla → tezlere git"
                            count={`${groupedDesenNorm.length} desen`}
                        />
                        <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Sol Taraf: Pasta Grafik */}
                                <div className="h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie data={groupedDesenChart} dataKey="value" cx="50%" cy="45%" innerRadius={50} outerRadius={85} paddingAngle={4} cornerRadius={6} stroke="none">
                                                {groupedDesenChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip content={<CT />} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.70rem' }} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>

                                {/* Sağ Taraf: Kaydırılabilir Tablo */}
                                <div className="max-h-[240px] overflow-y-auto pr-2">
                                    <GT rows={groupedDesenNorm} fk="desen" activeVal={f.desen} />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* TABLO 2 – VERİ TOPLAMA */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={FileText} title="Tablo 2 — Veri Toplama Araçları" sub="Normalize gruplar: görüşme, ölçek, anket, gözlem, doküman · satıra tıkla" count={`${vtChart.length} grup`} />
                        <div className="p-6 md:p-10"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-[260px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={vtChart} layout="vertical" margin={{ left: 10, right: 40 }}><XAxis type="number" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 11, fill: '#9CA3AF' }} /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 11, fill: '#111827', fontWeight: 600 }} width={140} /><Tooltip content={<CT />} /><Bar dataKey="value" name="Tez" radius={[0, 4, 4, 0]}>{vtChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer></div>
                            <GT rows={mkVt(data.length)} fk="veriToplama" activeVal={f.veriToplama} />
                        </div></div>
                    </section>

                    {/* TABLO 3 – ÖRNEKLEM MAHİYETİ */}
                    <section className="sec-panel border-b-soft">
                        <PH
                            icon={Users}
                            title="Tablo 3 — Örneklem Mahiyeti"
                            sub="Gruplandırılmış örnekleme yöntemleri · satıra tıkla → tezlere git"
                            count={`${mahList.length} grup`}
                        />
                        <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Sol Taraf: Pasta Grafik */}
                                <div className="h-[240px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie data={mkNorm('_mahiyetNorm', data.length).filter(r => r.label !== 'Belirtilmemiş').map(r => ({ name: r.label, value: r.count }))} dataKey="value" cx="50%" cy="45%" outerRadius={80} paddingAngle={3} cornerRadius={4} stroke="none">
                                                {mahList.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip content={<CT />} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.70rem' }} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>

                                {/* Sağ Taraf: Kaydırılabilir Tablo */}
                                <div className="max-h-[240px] overflow-y-auto pr-2">
                                    <GT rows={mkNorm('_mahiyetNorm', data.length)} fk="orneklemMahiyet" activeVal={f.orneklemMahiyet} />
                                </div>

                            </div>
                        </div>
                    </section>
                    
                    {/* TABLO 4 – VERİ ANALİZ YÖNTEMİ */}
                    <section className="sec-panel border-b-soft">
                        <PH
                            icon={BarChart2}
                            title="Tablo 4 — Veri Analiz Yöntemi"
                            sub="MAXQDA, SPSS, NVivo vb. · satıra tıkla → tezlere git"
                            count={`${vaList.length} grup`}
                        />
                        <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Sol Taraf: Çubuk Grafik */}
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={vaChart.filter(d => d.name !== 'Belirtilmemiş')} layout="vertical" margin={{ left: 10, right: 40 }}>
                                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 11, fill: '#9CA3AF' }} />
                                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 10, fill: '#111827', fontWeight: 600 }} width={180} />
                                            <Tooltip content={<CT />} />
                                            <Bar dataKey="value" name="Tez" radius={[0, 4, 4, 0]}>
                                                {vaChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Sağ Taraf: Kaydırılabilir Tablo */}
                                <div className="max-h-[300px] overflow-y-auto pr-2">
                                    <GT rows={mkNorm('_veriAnalizNorm', data.length)} fk="veriAnaliz" activeVal={f.veriAnaliz} />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* TABLO 5 – ARAŞTIRMA KONUSU */}
                    <section className="sec-panel border-b-soft">
                        <PH
                            icon={Target}
                            title="Tablo 5 — Araştırma Konusu"
                            sub="Gruplandırılmış tematik kategoriler · satıra tıkla → tezlere git"
                            count={`${konuList.length} grup`}
                        />
                        <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Sol Taraf: Grafik */}
                                <div className="h-[360px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={konuChart.filter(d => d.name !== 'Belirtilmemiş')} layout="vertical" margin={{ left: 10, right: 40 }}>
                                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 11, fill: '#9CA3AF' }} />
                                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 10, fill: '#111827', fontWeight: 600 }} width={190} />
                                            <Tooltip content={<CT />} />
                                            <Bar dataKey="value" name="Tez" radius={[0, 4, 4, 0]}>
                                                {konuChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Sağ Taraf: Kaydırılabilir Tablo */}
                                <div className="max-h-[360px] overflow-y-auto pr-2">
                                    <GT rows={mkNorm('_konuNorm', data.length)} fk="konu" activeVal={f.konu} />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* TABLO 6 – SAYFA UZUNLUĞU */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={FileText} title="Tablo 6 — Sayfa Uzunlukları" sub={`${pageRows.filled} tezde veri mevcut · satıra tıkla → o aralıktaki tezlere git`} />
                        <div className="p-6 md:p-10">{pageRows.rows.length ? (
                            <div className="dt-wrap"><table className="dt dt-clickable">
                                <thead><tr><th>Sayfa Aralığı</th><th>Tez Sayısı</th><th>Dağılım</th><th>Tezlere Git</th></tr></thead>
                                <tbody>{pageRows.rows.map((r, i) => (<tr key={i} onClick={() => drill('sayfa', r.label)}><td className="font-semibold">{r.label}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={pageRows.filled ? r.count / pageRows.filled * 100 : 0} /></td><td><span className="drill-badge">→ {r.count} tez</span></td></tr>))}</tbody>
                            </table></div>
                        ) : <div className="no-data">Sayfa sayısı verisi yok</div>}</div>
                    </section>

                    {/* TABLO 7 – CİNSİYET */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={Users} title="Tablo 7 — Cinsiyet Dağılımı" sub="Satıra tıkla → o cinsiyetin tezlerine git" />
                        <div className="p-6 md:p-10">{(genderTable.yazar.length || genderTable.danisman.length) ? (
                            <div className="gender-grid">
                                {[['Tez Yazarı', genderTable.yazar, 'gender'], ['Danışman', genderTable.danisman, 'advisorGender']].map(([title, rows, fkey]) => {
                                    const tot = rows.reduce((s, [, c]) => s + c, 0);
                                    return (<div key={title} className="gender-card"><div className="gender-card-head">{title}</div>
                                        {rows.map(([g, c]) => (<div key={g} onClick={() => drill(fkey, g)}>
                                            <div className="gender-row"><span className="gender-dot" style={{ background: g === 'Erkek' ? '#111827' : '#c7972f' }} /><span className="gender-name">{g}</span><span className="gender-num">{c}</span><span className="gender-pct">({tot ? (c / tot * 100).toFixed(0) : 0}%)</span></div>
                                            <div className="gender-bar-wrap"><div className="gender-bar-fill" style={{ width: `${tot ? c / tot * 100 : 0}%`, background: g === 'Erkek' ? '#111827' : '#c7972f' }} /></div>
                                        </div>))}
                                    </div>);
                                })}
                            </div>
                        ) : <div className="no-data">Cinsiyet verisi yok</div>}</div>
                    </section>

                    {/* TABLO 8 – DANIŞMAN UNVAN */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={GraduationCap} title="Tablo 8 — Danışman Unvan Dağılımı" sub="Satıra tıkla → tezlere git" count={`${unvanTable.length} unvan`} />
                        <div className="p-6 md:p-10"><div className="dt-wrap"><table className="dt dt-clickable">
                            <thead><tr><th>#</th><th>Unvan</th><th>Tez Sayısı</th><th>Oran</th></tr></thead>
                            <tbody>{unvanTable.map((r, i) => (<tr key={i} onClick={() => drill('advisorUnvan', r.unvan)}><td><RC i={i} /></td><td style={{ fontWeight: i < 3 ? 700 : 400 }}>{r.unvan}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={r.pct} /></td></tr>))}</tbody>
                        </table></div></div>
                    </section>

                    {/* TABLO 9 – ÜNİVERSİTE */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={Building2} title="Tablo 9 — Üniversite Dağılımı" sub="Satıra tıkla → o üniversitenin tezlerine git" count={`${uniTable.length} üniversite`} />
                        <div className="p-6 md:p-10">
                            {/* Scroll kapsayıcısı eklendi */}
                            <div className="max-h-[360px] overflow-y-auto pr-2">
                                <div className="dt-wrap">
                                    <table className="dt dt-clickable relative">
                                        {/* Başlığın yukarıda sabit kalması için sticky sınıfları eklendi */}
                                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                                            <tr><th>#</th><th>Üniversite</th><th>Tez</th><th>Oran</th></tr>
                                        </thead>
                                        <tbody>
                                            {uniTable.map((r, i) => (
                                                <tr key={i} className={f.university === r.uni ? 'dt-active' : ''} onClick={() => { upd('university', r.uni); drill('university', r.uni); }}>
                                                    <td><RC i={i} /></td>
                                                    <td style={{ fontWeight: i < 3 ? 700 : 400, color: f.university === r.uni ? '#c7972f' : 'inherit' }}>{r.uni}</td>
                                                    <td className="font-bold">{r.count}</td>
                                                    <td><MiniBar pct={r.pct} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TABLO 10 – BÖLÜM */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={BookOpen} title="Tablo 10 — Anabilim Dalı / Bölüm" sub="Satıra tıkla → tezlere git" count={`${deptTable.length} bölüm`} />
                        <div className="p-6 md:p-10">
                            {/* Scroll kapsayıcısı eklendi */}
                            <div className="max-h-[360px] overflow-y-auto pr-2">
                                <div className="dt-wrap">
                                    <table className="dt dt-clickable relative">
                                        {/* Başlığın yukarıda sabit kalması için sticky sınıfları eklendi */}
                                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                                            <tr><th>#</th><th>Bölüm / ABD</th><th>Tez</th><th>Oran</th></tr>
                                        </thead>
                                        <tbody>
                                            {deptTable.map((r, i) => (
                                                <tr key={i} className={f.department === r.dept ? 'dt-active' : ''} onClick={() => { upd('department', r.dept); drill('department', r.dept); }}>
                                                    <td><RC i={i} /></td>
                                                    <td style={{ fontSize: '.78rem', fontWeight: i < 3 ? 700 : 400, color: f.department === r.dept ? '#c7972f' : 'inherit' }}>{r.dept}</td>
                                                    <td className="font-bold">{r.count}</td>
                                                    <td><MiniBar pct={r.pct} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ŞEKİL 4 – ANAHTAR KELİME BULUTU */}
                    <section className="sec-panel border-b-soft">
                        <PH
                            icon={Hash}
                            title="Şekil 4 — Anahtar Kelime Bulutu"
                            sub="Boyut = frekans"
                            count={`${kwData.filter(r => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş").length} terim`}
                        />
                        <div className="p-6 md:p-10">
                            {kwData.filter(r => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş").length ? (
                                <div className="wc-container">
                                    {kwData
                                        .filter(r => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş")
                                        .slice(0, 60)
                                        .map(({ word, freq }, i) => {
                                            const sc = 0.75 + (freq / kwMax) * 1.5;
                                            const dk = i % 4 === 0, gd = i % 4 === 1;
                                            return (
                                                <span
                                                    key={i}
                                                    className="wc-word"
                                                    title={`${word}: ${freq} kez`}
                                                    style={{
                                                        fontSize: `${sc}rem`,
                                                        background: dk ? '#111827' : gd ? '#c7972f' : '#F3F4F6',
                                                        color: (dk || gd) ? 'white' : '#374151'
                                                    }}
                                                >
                                                    {word}
                                                </span>
                                            );
                                        })}
                                </div>
                            ) : (
                                <div className="no-data">Anahtar kelime verisi yok</div>
                            )}
                        </div>
                    </section>

                    {/* TABLO 11 – ANAHTAR KELİME FREKANS */}
                    <section className="sec-panel border-b-soft">
                        <PH icon={Hash} title="Tablo 11 — Anahtar Kelime Frekans" sub="En sık kullanılan kavramlar" />
                        <div className="p-6 md:p-10">
                            <div className="dt-wrap">
                                <table className="dt">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Anahtar Kelime</th>
                                            <th>Frekans</th>
                                            <th>Görsel</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kwData
                                            .filter((r) => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş")
                                            .slice(0, 17)
                                            .map((r, i) => (
                                                <tr key={i}>
                                                    <td><RC i={i} /></td>
                                                    <td style={{ fontWeight: i < 5 ? 700 : 400 }}>{r.word}</td>
                                                    <td className="font-bold">{r.freq}</td>
                                                    <td><MiniBar pct={kwMax ? (r.freq / kwMax) * 100 : 0} /></td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="border-b-soft py-24 bg-[#F9FAFB]">
                        <div className="max-w-2xl mx-auto text-center px-6">
                            <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight text-yellow-600">Tüm koleksiyonu <br /><span className="text-gray-900">keşfedin.</span></h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={() => navigate('/tez-analytics/dogrudan-tezler')} className="btn-primary">Tüm Tezleri Görüntüle <ArrowRight size={18} /></button>
                                <button onClick={() => navigate('/tez-analytics/analiz')} className="btn-primary" style={{ background: '#c7972f', borderColor: '#c7972f' }}>Geniş Analiz <ArrowRight size={18} /></button>
                                <button onClick={() => navigate('/tez-analytics')} className="btn-primary" style={{ background: 'white', color: '#111827', borderColor: '#E5E7EB' }}>Dashboard <ArrowRight size={18} /></button>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            {/* MOBİL FAB */}
            <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#111827] text-white rounded-[18px] flex items-center justify-center shadow-xl z-50 lg:hidden" onClick={() => setMobOpen(true)}><SlidersHorizontal size={22} /></button>
            <div className={`mob-overlay ${mobOpen ? 'open' : ''}`} onClick={() => setMobOpen(false)} />
            <div className={`mob-drawer ${mobOpen ? 'open' : ''}`}>
                <div className="flex items-center justify-between mb-5"><span className="font-display text-lg text-yellow-900">Filtreler</span><button className="p-2 bg-gray-100 rounded-full" onClick={() => setMobOpen(false)}><X size={18} /></button></div>
                <FP /><div className="h-8" />
                <button className="w-full py-3 bg-[#111827] text-white rounded-xl font-medium" onClick={() => setMobOpen(false)}>Sonuçları Göster ({data.length})</button>
            </div>
        </div>
    );
}