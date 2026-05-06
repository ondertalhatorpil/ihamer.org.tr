import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Building2, BookOpen, Hash, TrendingUp, FileText, GraduationCap, SlidersHorizontal, X, Search, BarChart2, Target, Download, ChevronDown,  } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");
  :root{--bg-main:#F9FAFB;--text-primary:#111827;--text-secondary:#6B7280;--border-color:#E5E7EB;--primary-color:#111827;--gold:#c7972f;}
  *{font-family:"Lexend",sans-serif;box-sizing:border-box;}
  body{background-color:var(--bg-main);color:var(--text-primary);-webkit-font-smoothing:antialiased;}
  
  .font-display{font-weight:600;letter-spacing:-0.02em;}
  .font-data{font-weight:300;}
  .border-r-soft{border-right:1px solid var(--border-color);}
  .border-b-soft{border-bottom:1px solid var(--border-color);}
  
  .reveal-up{animation:revealUp .8s cubic-bezier(.16,1,.3,1) forwards;opacity:0;transform:translateY(20px);}
  .delay-100{animation-delay:.1s;}.delay-200{animation-delay:.2s;}.delay-300{animation-delay:.3s;}
  @keyframes revealUp{to{opacity:1;transform:translateY(0);}}
  
  .rank-circle{width:28px;height:28px;min-width:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:.75rem;font-weight:600;margin-right:1rem;}
  .rank-1{background:#111827;color:white;}.rank-2{background:#374151;color:white;}.rank-3{background:#4B5563;color:white;}.rank-other{background:#F3F4F6;color:#6B7280;}
  .custom-scrollbar::-webkit-scrollbar{width:8px;}.custom-scrollbar::-webkit-scrollbar-track{background:transparent;}.custom-scrollbar::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:10px;}
  .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:#94A3B8;}
  
  .btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:var(--text-primary);color:white;padding:1rem 2rem;border-radius:12px;font-weight:500;transition:all .2s;border:1px solid transparent;cursor:pointer;font-family:"Lexend",sans-serif;}
  .btn-primary:hover{background:white;color:var(--text-primary);border-color:var(--text-primary);}

  .input-modern{width:100%;background:white;border:1px solid var(--border-color);padding:.875rem 1rem;font-size:.9rem;color:var(--text-primary);border-radius:12px;transition:all .2s ease;font-family:"Lexend",sans-serif;}
  .input-modern:focus{outline:none;border-color:var(--primary-color);}
  .dropdown-container{position:relative;width:100%;}
  .dropdown-modern{position:absolute;top:calc(100% + 4px);left:0;width:100%;background:white;border:1px solid var(--border-color);border-radius:12px;max-height:300px;overflow-y:auto;z-index:9999;box-shadow:0 20px 25px -5px rgba(0,0,0,.1);}
  .dropdown-item{padding:.875rem 1rem;font-size:.9rem;cursor:pointer;border-bottom:1px solid #F3F4F6;}
  .dropdown-item:hover{background:#F3F4F6;}
  
  .floating-filter-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:var(--primary-color);color:white;border:none;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,.25);cursor:pointer;z-index:1000;transition:all .3s cubic-bezier(.175,.885,.32,1.275);transform:scale(0) translateY(20px);opacity:0;}
  @media(min-width:1024px){.floating-filter-btn{display:none;}}
  .floating-filter-btn.visible{transform:scale(1) translateY(0);opacity:1;}
  .floating-filter-btn:hover{transform:scale(1.05);background:black;}
  .filter-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);backdrop-filter:blur(3px);z-index:2000;opacity:0;pointer-events:none;transition:opacity .3s ease;}
  .filter-overlay.open{opacity:1;pointer-events:all;}
  .filter-modal{position:fixed;background:white;z-index:2001;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.2);transition:transform .4s cubic-bezier(.16,1,.3,1);}
  @media(min-width:1024px){.filter-modal{display:none;}}
  @media(max-width:1023px){
      .filter-modal{left:0;right:0;bottom:0;width:100%;height:85vh;border-radius:24px 24px 0 0;transform:translateY(100%);}
      .filter-overlay.open + .filter-modal{transform:translateY(0);}
      .filter-grid-mobile{display:flex;flex-direction:column;gap:1rem;padding-bottom:3rem;}
  }

  .dt-wrap{overflow-x:auto;border:1px solid var(--border-color);border-radius:12px; background:white;}
  .dt{width:100%;border-collapse:collapse;font-size:.875rem;}
  .dt th{background:#111827;color:white;padding:.8rem 1.2rem; text-align:left;font-weight:500;font-size:.75rem;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
  .dt td{padding:.8rem 1.2rem; border-bottom:1px solid var(--border-color);}
  .dt tr:last-child td{border-bottom:none;}.dt tr:nth-child(even) td{background:#F9FAFB;}
  .dt-clickable tr:hover td{background:#fefce8;transition:background .1s;cursor:pointer;}
  .dt-active td{background:#fef3c7!important;}
  .mini-bar-wrap{display:flex;align-items:center;gap:8px;min-width:120px;}
  .mini-bar-track{flex:1;height:6px;background:#E5E7EB;border-radius:3px;}
  .mini-bar-fill{height:100%;border-radius:3px;background:var(--gold);}
  .mini-bar-pct{font-size:.75rem;color:var(--text-secondary);width:36px;text-align:right;flex-shrink:0;}
  
  .gender-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;}
  @media(max-width:700px){.gender-grid{grid-template-columns:1fr;}}
  .gender-card{border:1px solid var(--border-color);border-radius:12px;overflow:hidden;background:white;}
  .gender-card-head{background:#111827;color:white;padding:.75rem 1.5rem;font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;}
  .gender-row{display:flex;align-items:center;gap:1rem;padding:.85rem 1.5rem;border-bottom:1px solid var(--border-color);cursor:pointer;}
  .gender-row:hover{background:#fefce8;}.gender-row:last-child{border-bottom:none;}
  .gender-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
  .gender-name{font-size:.95rem;font-weight:500;flex:1;}.gender-num{font-size:1.05rem;font-weight:700;}
  .gender-pct{font-size:.8rem;color:var(--text-secondary);margin-left:6px;}
  .gender-bar-wrap{height:6px;background:#E5E7EB;margin:0 1.5rem 10px;border-radius:3px;}
  .gender-bar-fill{height:100%;border-radius:3px;}
  
  .wc-container{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:center;padding:3rem;min-height:220px;}
  .wc-word{border-radius:8px;padding:6px 16px;font-weight:600;cursor:default;transition:transform .15s,box-shadow .15s;}
  .wc-word:hover{transform:scale(1.08);box-shadow:0 4px 12px rgba(0,0,0,.12);}
  
  .filter-active-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:20px;font-size:.78rem;font-weight:600;color:#92400E;}
  .filter-active-pill button{background:none;border:none;cursor:pointer;color:#92400E;display:flex;align-items:center;}
  .sec-panel{background:white;border-bottom:1px solid var(--border-color); padding-bottom: 1rem;}
  .sec-panel-head{padding:1.5rem 2rem;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;}
  .no-data{text-align:center;padding:3rem 1rem;color:var(--text-secondary);font-size:.9rem;}
  .drill-badge{font-size:.75rem;font-weight:600;background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:10px;white-space:nowrap;}
`;

const S = v => (v == null ? '' : String(v)).trim();
const TL = t => (t || '').replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ş/g, 'ş').replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
const COLORS = ['#111827', '#c7972f', '#6B7280', '#374151', '#9CA3AF', '#D1D5DB', '#4B5563', '#c4a97a'];

const CT = ({ active, payload, label }) => { if (!active || !payload?.length) return null; return (<div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl"><p className="text-xs text-gray-400 uppercase font-medium mb-1">{label || payload[0].name}</p><p className="text-lg font-semibold text-gray-900">{payload[0].value}</p></div>); };
const MiniBar = ({ pct }) => (<div className="mini-bar-wrap"><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></div><span className="mini-bar-pct">{pct.toFixed(0)}%</span></div>);
const RC = ({ i }) => { const c = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other'; return <span className={`rank-circle ${c}`}>{i + 1}</span>; };
const PH = ({ icon: Icon, title, sub, count: cnt }) => (<div className="sec-panel-head"><div><h4 className="font-display text-xl flex items-center gap-2 text-yellow-900"><Icon size={20} className="text-gray-400" />{title}</h4>{sub && <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider font-medium">{sub}</p>}</div>{cnt != null && <span className="bg-gray-50 border border-gray-200 text-sm font-semibold px-3 py-1.5 rounded-lg text-gray-600 shadow-sm">{cnt}</span>}</div>);

const FInput = ({ label, placeholder, value, onChange, onToggle, isOpen, options, onSelect }) => (
    <div className="dropdown-container">
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="input-modern pr-10" />
        <div onClick={e => { e.preventDefault(); onToggle(); }} className="absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && options.length > 0 && (<div className="dropdown-modern custom-scrollbar">{options.map((opt, i) => (<div key={i} onClick={() => onSelect(opt)} className="dropdown-item">{opt}</div>))}</div>)}
    </div>
);

const FSelect = ({ label, value, onChange, options }) => (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select value={value} onChange={onChange} className="input-modern appearance-none cursor-pointer pr-10">
          <option value="">Tümü</option>{options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400" /></div>
      </div>
    </div>
);

// === VERİ ANALİZİ GRUPLAMA FONKSİYONU ===
const getVeriAnalizGrup = (val) => {
    const v = String(val || '').toLocaleLowerCase('tr-TR');
    if (!v || v === 'nan' || v === 'belirtilmemiş') return 'Belirtilmemiş';

    const isNitel = v.includes('içerik') || v.includes('tematik') || v.includes('maxqda') || v.includes('nvivo') || v.includes('söylem') || v.includes('nitel') || v.includes('kodlama') || v.includes('doküman') || v.includes('tarihsel');
    const isNicel = v.includes('spss') || v.includes('t-test') || v.includes('t test') || v.includes('anova') || v.includes('korelasyon') || v.includes('regresyon') || v.includes('kruskal') || v.includes('mann') || v.includes('faktör') || v.includes('ki-kare') || v.includes('nicel') || v.includes('istatistiksel') || v.includes('bağımsız örneklem') || v.includes('varyans') || v.includes('momentler') || v.includes('yapısal eşitlik');
    const isBetimsel = v.includes('betimsel') || v.includes('frekans') || v.includes('yüzde') || v.includes('aritmetik ortalama') || v.includes('standart sapma') || v.includes('tanımlayıcı');

    if (isNitel && isNicel) return 'Karma Analiz (Nitel ve Nicel)';
    if (isNicel) return 'İstatistiksel Analizler (SPSS, ANOVA, Korelasyon vb.)';
    if (isNitel) return 'İçerik, Tematik ve Doküman Analizi';
    if (isBetimsel) return 'Betimsel Analiz';

    return 'Diğer Analiz Yöntemleri';
};

// === ÖRNEKLEM GRUPLAMA FONKSİYONU ===
const getOrneklemGrup = (val) => {
    const v = S(val).toLocaleLowerCase('tr-TR');
    if (!v || v === 'nan' || v.includes('belirtilmemiş')) return 'Belirtilmemiş';
    if (v.includes('doküman') || v.includes('eser') || v.includes('kitap') || v.includes('rapor') || v.includes('müfredat') || v.includes('belge') || v.includes('arşiv')) return 'Doküman / Eser / Materyal';

    let group = '';
    if (v.includes('i̇hl') || v.includes('ihl') || v.includes('imam hatip lisesi')) group += 'İHL ';
    else if (v.includes('i̇ho') || v.includes('iho') || v.includes('imam hatip ortaokulu')) group += 'İHO ';
    else if (v.includes('ortaokul')) group += 'Ortaokul ';
    else if (v.includes('lise')) group += 'Lise ';
    else if (v.includes('lisans') || v.includes('yüksek lisans') || v.includes('üniversite')) group += 'Üniversite/Lisans ';
    else if (v.includes('akademisyen') || v.includes('araştırma görevlisi') || v.includes('öğretim elemanı')) return 'Akademisyenler';

    const isOgrenci = v.includes('öğrenci') || v.includes('öğrenciler');
    const isOgretmen = v.includes('öğretmen');
    const isVeli = v.includes('veli') || v.includes('anne') || v.includes('baba');
    const isIdareci = v.includes('idareci') || v.includes('müdür') || v.includes('yönetici');
    const isMezun = v.includes('mezun');

    if (isMezun) return group ? `${group.trim()} Mezunları` : 'Mezunlar';
    if (isOgrenci && isOgretmen && isVeli) return group ? `${group.trim()} Öğrenci, Öğretmen ve Velileri` : 'Öğrenci, Öğretmen ve Veliler';
    if (isOgrenci && isOgretmen && isIdareci) return group ? `${group.trim()} Öğrenci, Öğretmen ve İdarecileri` : 'Öğrenci, Öğretmen ve İdareciler';
    if (isOgrenci && isOgretmen) return group ? `${group.trim()} Öğrencileri ve Öğretmenleri` : 'Öğrenciler ve Öğretmenler';
    if (isOgrenci && isVeli) return group ? `${group.trim()} Öğrencileri ve Velileri` : 'Öğrenciler ve Veliler';
    if (isOgretmen && isIdareci) return group ? `${group.trim()} Öğretmenleri ve İdarecileri` : 'Öğretmenler ve İdareciler';
    if (isOgretmen && isVeli) return group ? `${group.trim()} Öğretmenleri ve Velileri` : 'Öğretmenler ve Veliler';
    if (isOgrenci) return group ? `${group.trim()} Öğrencileri` : 'Öğrenciler';
    if (isOgretmen) return group ? `${group.trim()} Öğretmenleri` : 'Öğretmenler';
    if (isIdareci) return group ? `${group.trim()} İdarecileri` : 'İdareciler';
    if (isVeli) return group ? `${group.trim()} Velileri` : 'Veliler';
    
    if (v.includes('stk') || v.includes('kurum') || v.includes('meb') || v.includes('diyanet')) return 'Kurum / Kuruluş / STK';
    return group.trim() ? `${group.trim()} (Genel)` : 'Diğer';
};

// === DESEN GRUPLAMA FONKSİYONU ===
const getDesenGrup = (val) => {
    const v = String(val || '').toLocaleLowerCase('tr-TR');
    if (!v || v === 'nan' || v === 'belirtilmemiş') return 'Belirtilmemiş';
    if (v.includes('karma') || v.includes('sıralı') || v.includes('ardışık') || v.includes('çeşitleme') || v.includes('yakınsayan') || v.includes('gömülü') || v.includes('mixed')) return 'Karma Yöntem';
    if (v.includes('ilişkisel') || v.includes('korelasyon')) return 'İlişkisel (Korelasyonel)';
    if (v.includes('deneysel') || v.includes('kontrol gruplu')) return 'Deneysel / Yarı Deneysel';
    if (v.includes('durum') || v.includes('vaka')) return 'Durum Çalışması (Vaka)';
    if (v.includes('fenomenolo') || v.includes('olgubilim')) return 'Fenomenolojik (Olgubilim)';
    if (v.includes('tarama') || v.includes('betimsel') || v.includes('survey') || v.includes('alan araştırması') || v.includes('analitik')) return 'Tarama (Betimsel)';
    if (v.includes('tarihsel') || v.includes('sözlü tarih')) return 'Tarihsel Araştırma';
    if (v.includes('doküman') || v.includes('metin')) return 'Doküman İncelemesi';
    if (v.includes('eylem')) return 'Eylem Araştırması';
    return 'Diğer Desenler';
};

// === YENİ KONU GRUPLAMA FONKSİYONU ===
const getKonuGrup = (val) => {
    const v = String(val || '').toLocaleLowerCase('tr-TR');
    if (!v || v === 'nan' || v === 'belirtilmemiş') return 'Belirtilmemiş';

    if (v.includes('arapça') || v.includes('yabancı dil') || v.includes('ingilizce') || v.includes('dil öğren')) return 'Dil Öğretimi (Arapça, Yabancı Dil)';
    if (v.includes('hafızlık') || v.includes('kur\'an') || v.includes('tefsir') || v.includes('hadis') || v.includes('siyer') || v.includes('akaid') || v.includes('fıkıh') || v.includes('kelam') || v.includes('peygamber')) return 'Temel İslam Bilimleri ve Hafızlık';
    if (v.includes('teknoloj') || v.includes('dijital') || v.includes('medya') || v.includes('siber') || v.includes('internet') || v.includes('eba') || v.includes('bilgisayar') || v.includes('sosyal ağ')) return 'Teknoloji, Medya ve Dijitalleşme';
    if (v.includes('göçmen') || v.includes('suriyel') || v.includes('mülteci') || v.includes('engelli') || v.includes('kapsayıcı') || v.includes('yabancı uyruklu')) return 'Göç, Özel Eğitim ve Kapsayıcılık';
    if (v.includes('spor') || v.includes('beden') || v.includes('fiziksel') || v.includes('sağlık') || v.includes('obezite')) return 'Spor, Sağlık ve Beden Eğitimi';
    if (v.includes('yönetim') || v.includes('liderlik') || v.includes('müdür') || v.includes('idare') || v.includes('örgütsel') || v.includes('okul iklimi') || v.includes('okul terk') || v.includes('itibar') || v.includes('vizyon') || v.includes('denetim')) return 'Eğitim Yönetimi ve Kurumsal Yapı';
    if (v.includes('psikoloj') || v.includes('tutum') || v.includes('kaygı') || v.includes('stres') || v.includes('öfke') || v.includes('zorbalık') || v.includes('iyi oluş') || v.includes('tükenmişlik') || v.includes('motivasyon') || v.includes('bağlanma') || v.includes('davranış') || v.includes('algı') || v.includes('şiddet') || v.includes('memnuniyet') || v.includes('öz yeterlik') || v.includes('beklenti') || v.includes('kimlik')) return 'Psikoloji, Tutum ve Davranışlar';
    if (v.includes('müfredat') || v.includes('ders kitabı') || v.includes('materyal') || v.includes('yöntem') || v.includes('stem') || v.includes('program') || v.includes('öğretim') || v.includes('oyun') || v.includes('etkinlik') || v.includes('model')) return 'Eğitim Programları ve Öğretim Yöntemleri';
    if (v.includes('tarih') || v.includes('politika') || v.includes('felsefe') || v.includes('sosyoloj') || v.includes('ekonomi')) return 'Eğitim Tarihi, Felsefesi ve Politikası';
    if (v.includes('akademik') || v.includes('başarı') || v.includes('sınav') || v.includes('lgs') || v.includes('yks')) return 'Akademik Başarı ve Sınavlar';
    if (v.includes('din') || v.includes('ahlak') || v.includes('deizm') || v.includes('maneviyat') || v.includes('değer') || v.includes('inanç') || v.includes('dindarlık') || v.includes('dkab') || v.includes('imam hatip')) return 'Din Eğitimi, Ahlak ve Değerler';

    return 'Diğer Konular';
};

export default function AnalyticsPage() {
    const navigate = useNavigate();
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFab, setShowFab] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sd, setSd] = useState({ year: '', university: '', department: '' });
    const [activeDD, setActiveDD] = useState(null);
    const [f, setF] = useState({ search: '', category: '', year: '', university: '', department: '', tezTuru: '', method: '', language: '', advisorUnvan: '', gender: '', advisorGender: '', desen: '', veriToplama: '', orneklem: '', orneklemMahiyet: '', veriAnaliz: '', konu: '' });

    const updD = (k, v) => setF(p => ({ ...p, [k]: v }));
    const upd = (k, v) => setF(p => ({ ...p, [k]: p[k] === v ? '' : v }));
    const clearAll = () => setF({ search: '', category: '', year: '', university: '', department: '', tezTuru: '', method: '', language: '', advisorUnvan: '', gender: '', advisorGender: '', desen: '', veriToplama: '', orneklem: '', orneklemMahiyet: '', veriAnaliz: '', konu: '' });
    const hasF = Object.values(f).some(v => v !== '');

    useEffect(() => { const h = () => setShowFab(window.scrollY > 100); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
    useEffect(() => { const h = e => { if (!e.target.closest('.dropdown-container')) setActiveDD(null); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
    useEffect(() => { import('./data/tez4.json').then(m => { setRawData(m.default); setLoading(false); }).catch(() => setLoading(false)); }, []);

    const data = useMemo(() => {
        let r = rawData;
        if (f.search) { const q = TL(f.search); r = r.filter(t => TL(S(t['Tez Başlığı'])).includes(q) || TL(S(t['Tez Yazarı'])).includes(q) || TL(S(t['Danışman'])).includes(q) || TL(S(t['Üniversite'])).includes(q) || TL(S(t['Araştırmanın Özeti'])).includes(q) || TL(S(t['Araştırma Konusu'])).includes(q)); }
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
        if (f.desen) r = r.filter(t => getDesenGrup(t['Araştırmanın Desen Seçimi'] || t['_desenNorm']) === f.desen);
        if (f.veriToplama) r = r.filter(t => (t['_veriTopNorm'] || []).includes(f.veriToplama));
        if (f.orneklem) r = r.filter(t => getOrneklemGrup(t['Araştırma Örneklemi']) === f.orneklem);
        if (f.orneklemMahiyet) r = r.filter(t => S(t['_mahiyetNorm']) === f.orneklemMahiyet);
        
        // FİLTRELEME İÇİN VERİ ANALİZ GRUBUNU KULLAN
        if (f.veriAnaliz) r = r.filter(t => getVeriAnalizGrup(t['Veri Analizi Yöntemi'] || t['_veriAnalizNorm']) === f.veriAnaliz);
        
        if (f.konu) r = r.filter(t => getKonuGrup(t['Araştırma Konusu'] || t['_konuNorm']) === f.konu);
        return r;
    }, [rawData, f]);

    const uniq = k => [...new Set(rawData.map(t => S(t[k])).filter(Boolean))].sort();
    const years = useMemo(() => [...new Set(rawData.map(t => S(t['Yıl'])).filter(Boolean))].sort().reverse(), [rawData]);
    const methods = useMemo(() => uniq('Araştırmanın Yöntemi'), [rawData]);
    const languages = useMemo(() => uniq('Araştırma Dili'), [rawData]);
    const universities = useMemo(() => uniq('Üniversite'), [rawData]);
    const departments = useMemo(() => uniq('Bölüm'), [rawData]);
    const desenList = useMemo(() => { const s = new Set(); rawData.forEach(t => s.add(getDesenGrup(t['Araştırmanın Desen Seçimi'] || t['_desenNorm']))); return [...s].filter(v => v !== 'Belirtilmemiş').sort(); }, [rawData]);
    const vtList = useMemo(() => { const s = new Set(); rawData.forEach(t => (t['_veriTopNorm'] || []).forEach(v => s.add(v))); return [...s].sort(); }, [rawData]);
    const mahList = useMemo(() => [...new Set(rawData.map(t => S(t['_mahiyetNorm'])).filter(v => v && v !== 'Belirtilmemiş'))].sort(), [rawData]);
    
    // DROPDOWN İÇİN VERİ ANALİZİ LİSTESİ
    const vaList = useMemo(() => {
        const s = new Set();
        rawData.forEach(t => s.add(getVeriAnalizGrup(t['Veri Analizi Yöntemi'] || t['_veriAnalizNorm'])));
        return [...s].filter(v => v !== 'Belirtilmemiş').sort();
    }, [rawData]);
    
    const konuList = useMemo(() => {
        const s = new Set();
        rawData.forEach(t => s.add(getKonuGrup(t['Araştırma Konusu'] || t['_konuNorm'])));
        return [...s].filter(v => v !== 'Belirtilmemiş').sort();
    }, [rawData]);
    
    const orneklemGrupList = useMemo(() => { const s = new Set(); rawData.forEach(t => s.add(getOrneklemGrup(t['Araştırma Örneklemi']))); return [...s].filter(v => v !== 'Belirtilmemiş').sort(); }, [rawData]);

    const fy = years.filter(y => y.toString().includes(sd.year));
    const fu = universities.filter(u => TL(u).includes(TL(sd.university)));
    const fd = departments.filter(d => TL(d).includes(TL(sd.department)));

    const mkNorm = (key, total) => { const m = {}; data.forEach(t => { const v = S(t[key]) || 'Belirtilmemiş'; m[v] = (m[v] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: total ? count / total * 100 : 0 })); };
    const mkVt = (total) => { const m = {}; data.forEach(t => { (t['_veriTopNorm'] || []).forEach(v => { m[v] = (m[v] || 0) + 1; }); }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: total ? count / total * 100 : 0 })); };

    const yearChart = useMemo(() => { const m = {}; data.forEach(t => { const y = S(t['Yıl']); if (y) m[y] = (m[y] || 0) + 1; }); return Object.entries(m).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })); }, [data]);
    const mkPie = key => { const m = {}; data.forEach(t => { const v = S(t[key]).trim() || 'Belirtilmemiş'; m[v] = (m[v] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); };
    const mkPieVt = () => { const m = {}; data.forEach(t => { (t['_veriTopNorm'] || []).forEach(v => { m[v] = (m[v] || 0) + 1; }); }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })); };

    const langChart = useMemo(() => mkPie('Araştırma Dili'), [data]);
    const methodChart = useMemo(() => mkPie('Araştırmanın Yöntemi'), [data]);
    const vtChart = useMemo(() => mkPieVt(), [data]);

    const groupedDesenNorm = useMemo(() => {
        const m = {};
        data.forEach(t => {
            const rawDesen = t['Araştırmanın Desen Seçimi'] || t['_desenNorm']; 
            const grup = getDesenGrup(rawDesen);
            if (grup !== 'Belirtilmemiş') m[grup] = (m[grup] || 0) + 1;
        });
        const tot = data.length;
        return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: tot ? (count / tot) * 100 : 0 }));
    }, [data]);

    const groupedDesenChart = useMemo(() => {
        return groupedDesenNorm.map(item => ({ name: item.label, value: item.count }));
    }, [groupedDesenNorm]);

    const groupedOrneklemTable = useMemo(() => {
        const m = {}; 
        data.forEach(t => { 
            const grp = getOrneklemGrup(t['Araştırma Örneklemi']); 
            if (grp !== 'Belirtilmemiş') m[grp] = (m[grp] || 0) + 1; 
        });
        const tot = data.length; 
        return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: tot ? (count / tot) * 100 : 0 }));
    }, [data]);

    // === GRAFİK VE TABLO İÇİN VERİ ANALİZİ GRUPLAMASI ===
    const groupedVaNorm = useMemo(() => {
        const m = {};
        data.forEach(t => {
            const rawVa = t['Veri Analizi Yöntemi'] || t['_veriAnalizNorm']; 
            const grup = getVeriAnalizGrup(rawVa);
            if (grup !== 'Belirtilmemiş') {
                m[grup] = (m[grup] || 0) + 1;
            }
        });
        const tot = data.length;
        return Object.entries(m)
            .sort((a, b) => b[1] - a[1])
            .map(([label, count]) => ({ label, count, pct: tot ? (count / tot) * 100 : 0 }));
    }, [data]);

    const groupedVaChart = useMemo(() => {
        return groupedVaNorm.map(item => ({
            name: item.label,
            value: item.count
        }));
    }, [groupedVaNorm]);

    const groupedKonuNorm = useMemo(() => {
        const m = {};
        data.forEach(t => {
            const rawKonu = t['Araştırma Konusu'] || t['_konuNorm']; 
            const grup = getKonuGrup(rawKonu);
            if (grup !== 'Belirtilmemiş') {
                m[grup] = (m[grup] || 0) + 1;
            }
        });
        const tot = data.length;
        return Object.entries(m)
            .sort((a, b) => b[1] - a[1])
            .map(([label, count]) => ({ label, count, pct: tot ? (count / tot) * 100 : 0 }));
    }, [data]);

    const groupedKonuChart = useMemo(() => {
        return groupedKonuNorm.map(item => ({
            name: item.label,
            value: item.count
        }));
    }, [groupedKonuNorm]);

    const pageRows = useMemo(() => { const bins = [[0, 100, '0–100'], [101, 200, '101–200'], [201, 300, '201–300'], [301, 400, '301–400'], [401, 500, '401–500'], [501, 600, '501–600'], [601, Infinity, '601+']]; const counts = bins.map(() => 0); let filled = 0; data.forEach(t => { const p = parseInt(S(t['Sayfa Sayısı'])); if (!isNaN(p)) { filled++; for (let i = 0; i < bins.length; i++)if (p >= bins[i][0] && p <= bins[i][1]) { counts[i]++; break; } } }); return { rows: bins.map(([, , l], i) => ({ label: l, count: counts[i] })).filter(r => r.count > 0), filled }; }, [data]);

    const genderTable = useMemo(() => { const aG = {}, dG = {}; data.forEach(t => { const ag = S(t['Tez Yazarının Cinsiyeti']); if (ag) aG[ag] = (aG[ag] || 0) + 1; const dg = S(t['Danışmanın Cinsiyeti']); if (dg) dG[dg] = (dG[dg] || 0) + 1; }); return { yazar: Object.entries(aG).sort((a, b) => b[1] - a[1]), danisman: Object.entries(dG).sort((a, b) => b[1] - a[1]) }; }, [data]);
    const unvanTable = useMemo(() => { const m = {}; data.forEach(t => { let u = S(t['Danışman Unvanları']); if (!u) u = 'Belirtilmemiş'; else if (u.startsWith('PROF')) u = 'PROF. DR.'; else if (u.startsWith('YRD')) u = 'YRD. DOÇ. DR.'; else if (u.startsWith('DOÇ')) u = 'DOÇ. DR.'; else if (u.startsWith('DR. ÖĞR')) u = 'DR. ÖĞR. ÜYESİ'; m[u] = (m[u] || 0) + 1; }); const tot = Object.values(m).reduce((a, b) => a + b, 0); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([unvan, count]) => ({ unvan, count, pct: tot ? count / tot * 100 : 0 })); }, [data]);
    const uniTable = useMemo(() => { const m = {}; data.forEach(t => { const u = S(t['Üniversite']); if (u) m[u] = (m[u] || 0) + 1; }); const tot = data.length; return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([uni, count]) => ({ uni, count, pct: tot ? count / tot * 100 : 0 })); }, [data]);
    const deptTable = useMemo(() => { const m = {}; data.forEach(t => { const b = S(t['Bölüm']); if (b) m[b] = (m[b] || 0) + 1; }); const tot = data.length; return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([dept, count]) => ({ dept, count, pct: tot ? count / tot * 100 : 0 })); }, [data]);

    const kwData = useMemo(() => { const m = {};['1. Anahtar Kelime', '2. Anahtar Kelime', '3. Anahtar Kelime', '4. Anahtar Kelime', '5. ve Üstü Anahtar Kelimeler'].forEach(c => data.forEach(t => { const raw = S(t[c]); if (!raw || raw.toLowerCase() === 'nan' || raw.toLowerCase() === 'belirtilmemiş') return; raw.split(/[,;\/]/).forEach(kw => { const k = kw.trim(); if (k.length > 1) m[k] = (m[k] || 0) + 1; }); })); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([word, freq]) => ({ word, freq })); }, [data]);
    const kwMax = kwData[0]?.freq || 1;
    const hero = useMemo(() => ({ total: data.length, unis: new Set(data.map(t => S(t['Üniversite'])).filter(Boolean)).size, advisors: new Set(data.map(t => S(t['Danışman'])).filter(Boolean)).size, doktora: data.filter(t => S(t['Tez Türü']) === 'Doktora').length }), [data]);

    const drill = (filterKey, filterVal) => {
        const activeParams = new URLSearchParams();
        Object.entries(f).forEach(([k, v]) => { if (v) activeParams.append(k, v); });
        activeParams.set(filterKey, filterVal);
        navigate(`/tez-analytics/dogrudan-tezler2?${activeParams.toString()}`);
    };

    const GT = ({ rows, fk, activeVal, hasPct = true }) => (
        <div className="dt-wrap"><table className={`dt dt-clickable`}>
            <thead><tr><th>#</th><th>Grup</th><th>Tez</th>{hasPct && <th>Oran</th>}</tr></thead>
            <tbody>{rows.map((r, i) => (
                <tr key={i} className={activeVal === r.label ? 'dt-active' : ''} onClick={() => { upd(fk, r.label); drill(fk, r.label); }}>
                    <td><RC i={i} /></td>
                    <td style={{ fontWeight: i < 3 ? 600 : 400, color: activeVal === r.label ? '#c7972f' : 'inherit' }}>{r.label}</td>
                    <td className="font-bold">{r.count}</td>
                    {hasPct && <td><MiniBar pct={r.pct} /></td>}
                </tr>
            ))}</tbody>
        </table></div>
    );

    const FP = () => (
        <div className="flex flex-col gap-5">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Genel Arama</label>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="input-modern pl-10" placeholder="Başlık, yazar, konu…" value={f.search} onChange={e => updD('search', e.target.value)} />
                </div>
            </div>
            {[{ l: 'Kategori', k: 'category', o: ['Doğrudan', 'Dolaylı'] }, { l: 'Tez Türü', k: 'tezTuru', o: ['Doktora', 'Yüksek Lisans'] }].map(({ l, k, o }) => (
                <FSelect key={k} label={l} value={f[k]} onChange={e => updD(k, e.target.value)} options={o} />
            ))}
            <FInput label="Yıl" placeholder="Yıl Seçin" value={f.year || sd.year} onChange={e => { setSd({ ...sd, year: e.target.value }); if (activeDD !== 'year') setActiveDD('year'); }} isOpen={activeDD === 'year'} onToggle={() => setActiveDD(p => p === 'year' ? null : 'year')} options={fy} onSelect={val => { updD('year', val); setSd({ ...sd, year: '' }); setActiveDD(null); }} />
            <FInput label="Üniversite" placeholder="Üniversite Ara" value={f.university || sd.university} onChange={e => { setSd({ ...sd, university: e.target.value }); if (activeDD !== 'uni') setActiveDD('uni'); }} isOpen={activeDD === 'uni'} onToggle={() => setActiveDD(p => p === 'uni' ? null : 'uni')} options={fu} onSelect={val => { updD('university', val); setSd({ ...sd, university: '' }); setActiveDD(null); }} />
            <FInput label="Bölüm / ABD" placeholder="Bölüm Ara" value={f.department || sd.department} onChange={e => { setSd({ ...sd, department: e.target.value }); if (activeDD !== 'dept') setActiveDD('dept'); }} isOpen={activeDD === 'dept'} onToggle={() => setActiveDD(p => p === 'dept' ? null : 'dept')} options={fd} onSelect={val => { updD('department', val); setSd({ ...sd, department: '' }); setActiveDD(null); }} />

            <FSelect label="Araştırma Dili" value={f.language} onChange={e => updD('language', e.target.value)} options={languages} />
            <FSelect label="Araştırma Yöntemi" value={f.method} onChange={e => updD('method', e.target.value)} options={methods} />
            <FSelect label="Araştırma Deseni" value={f.desen} onChange={e => updD('desen', e.target.value)} options={desenList} />
            <FSelect label="Veri Toplama Aracı" value={f.veriToplama} onChange={e => updD('veriToplama', e.target.value)} options={vtList} />
            <FSelect label="Örneklem Mahiyeti" value={f.orneklemMahiyet} onChange={e => updD('orneklemMahiyet', e.target.value)} options={mahList} />
            <FSelect label="Araştırma Örneklemi" value={f.orneklem} onChange={e => updD('orneklem', e.target.value)} options={orneklemGrupList} />
            <FSelect label="Veri Analiz Yöntemi" value={f.veriAnaliz} onChange={e => updD('veriAnaliz', e.target.value)} options={vaList} />
            <FSelect label="Araştırma Konusu" value={f.konu} onChange={e => updD('konu', e.target.value)} options={konuList} />
            <FSelect label="Danışman Unvanı" value={f.advisorUnvan} onChange={e => updD('advisorUnvan', e.target.value)} options={['PROF. DR.', 'DOÇ. DR.', 'YRD. DOÇ. DR.', 'DR. ÖĞR. ÜYESİ', 'DR.']} />
            <FSelect label="Yazar Cinsiyeti" value={f.gender} onChange={e => updD('gender', e.target.value)} options={['Erkek', 'Kadın']} />
            <FSelect label="Danışman Cinsiyeti" value={f.advisorGender} onChange={e => updD('advisorGender', e.target.value)} options={['Erkek', 'Kadın']} />

            {hasF && (
                <div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(f).filter(([, v]) => v).map(([k, v]) => (
                            <span key={k} className="filter-active-pill">
                                {v.length > 18 ? v.slice(0, 18) + '…' : v}
                                <button onClick={() => updD(k, '')}><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <button onClick={clearAll} className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 py-2.5 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">
                        <X size={16} /> Filtreleri Temizle
                    </button>
                </div>
            )}
        </div>
    );

    // === METİN VE TABLO ODAKLI WORD İHRACAT FONKSİYONU ===
    const exportToWord = () => {
        if (!data || data.length === 0) return;

        let htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Bibliyometrik Analiz Raporu</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; line-height: 1.5;}
                    h1 { color: #c7972f; text-align: center; border-bottom: 2px solid #E5E7EB; padding-bottom: 12px; font-size: 26px; margin-bottom: 24px;}
                    h2 { color: #111827; margin-top: 36px; font-size: 18px; border-bottom: 2px solid #c7972f; padding-bottom: 6px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
                    th, td { border: 1px solid #E5E7EB; padding: 10px; text-align: left; vertical-align: middle; }
                    th { background-color: #111827; color: white; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px;}
                    tr:nth-child(even) { background-color: #F9FAFB; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .summary { background-color: #F9FAFB; padding: 20px; border: 1px solid #E5E7EB; margin-bottom: 24px; border-radius: 8px; font-size: 14px;}
                    .stat-box-container { text-align: center; margin-bottom: 30px; }
                    .stat-box { display: inline-block; width: 22%; padding: 15px 10px; margin: 1%; background: #ffffff; border: 1px solid #E5E7EB; text-align: center; border-radius: 8px;}
                    .stat-val { font-size: 26px; font-weight: bold; color: #c7972f; margin-bottom: 4px;}
                    .stat-val.dark { color: #111827; }
                    .stat-lbl { font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;}
                </style>
            </head>
            <body>
                <h1>Bibliyometrik Analiz Raporu</h1>
                
                <div class="summary">
                    <p style="margin: 0 0 8px 0;"><strong>Arama Kriteri:</strong> ${f.search ? `"${f.search}"` : 'Tümü'}</p>
                    <p style="margin: 0 0 8px 0;"><strong>Aktif Filtreler:</strong> ${Object.entries(f).filter(([k,v])=>v&&k!=='search').map(([k,v])=>`${k}: ${v}`).join(' | ') || 'Yok'}</p>
                    <p style="margin: 0;"><strong>Rapor Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                </div>

                <div class="stat-box-container">
                    <div class="stat-box"><div class="stat-val dark">${hero.total.toLocaleString('tr-TR')}</div><div class="stat-lbl">Toplam Tez</div></div>
                    <div class="stat-box"><div class="stat-val">${hero.unis.toLocaleString('tr-TR')}</div><div class="stat-lbl">Üniversite</div></div>
                    <div class="stat-box"><div class="stat-val dark">${hero.advisors.toLocaleString('tr-TR')}</div><div class="stat-lbl">Danışman</div></div>
                    <div class="stat-box"><div class="stat-val">${hero.doktora.toLocaleString('tr-TR')}</div><div class="stat-lbl">Doktora Tezi</div></div>
                </div>
        `;

        const generateTable = (title, dataArray, keyName, valName) => {
            if(!dataArray || dataArray.length === 0) return '';
            let t = `<h2>${title}</h2><table><thead><tr><th>${keyName}</th><th class='text-right'>${valName}</th><th class='text-right'>Oran (%)</th></tr></thead><tbody>`;
            const totalVal = dataArray.reduce((acc, curr) => acc + (curr.value || curr.count || curr.freq || 0), 0);
            
            dataArray.forEach((item, index) => {
                let name = item.name || item.label || item.uni || item.dept || item.unvan || item.word || item.year;
                let count = item.value || item.count || item.freq || 0;
                let pct = totalVal ? ((count / totalVal) * 100).toFixed(1) : 0;
                
                let style = index < 3 ? 'font-weight: bold; color: #c7972f;' : 'font-weight: normal;';
                
                t += `<tr><td><span style="${style}">${name}</span></td><td class='text-right'><strong>${count.toLocaleString('tr-TR')}</strong></td><td class='text-right'>%${pct}</td></tr>`;
            });
            t += `</tbody></table>`;
            return t;
        };

        htmlContent += generateTable('Yıllara Göre Tez Dağılımı', yearChart, 'Yıl', 'Tez Sayısı');
        htmlContent += generateTable('Araştırma Dili', langChart, 'Dil', 'Tez Sayısı');
        htmlContent += generateTable('Araştırma Yöntemi', methodChart, 'Yöntem', 'Tez Sayısı');
        htmlContent += generateTable('Araştırma Deseni', groupedDesenNorm, 'Desen', 'Tez Sayısı');
        htmlContent += generateTable('Veri Toplama Araçları', mkVt(data.length), 'Araç', 'Tez Sayısı');
        htmlContent += generateTable('Örneklem Mahiyeti', mkNorm('_mahiyetNorm', data.length), 'Mahiyet', 'Tez Sayısı');
        htmlContent += generateTable('Araştırma Örneklemi (Çalışma Grubu)', groupedOrneklemTable, 'Örneklem', 'Tez Sayısı');
        
        // GÜNCELLENEN VERİ ANALİZ TABLOSU
        htmlContent += generateTable('Veri Analiz Yöntemi', groupedVaNorm, 'Yöntem', 'Tez Sayısı');
        
        htmlContent += generateTable('Araştırma Konusu', groupedKonuNorm, 'Konu', 'Tez Sayısı');
        
        if (pageRows.rows.length) {
            htmlContent += `<h2>Sayfa Uzunlukları</h2><table><thead><tr><th>Sayfa Aralığı</th><th class='text-right'>Tez Sayısı</th></tr></thead><tbody>`;
            pageRows.rows.forEach(r => {
                htmlContent += `<tr><td><strong>${r.label}</strong></td><td class='text-right'><strong>${r.count.toLocaleString('tr-TR')}</strong></td></tr>`;
            });
            htmlContent += `</tbody></table>`;
        }

        htmlContent += `<h2>Cinsiyet Dağılımı (Tez Yazarı)</h2><table><thead><tr><th>Cinsiyet</th><th class='text-right'>Sayı</th></tr></thead><tbody>`;
        genderTable.yazar.forEach(([g, c]) => { htmlContent += `<tr><td><strong>${g}</strong></td><td class='text-right'><strong>${c.toLocaleString('tr-TR')}</strong></td></tr>`; });
        htmlContent += `</tbody></table>`;
        
        htmlContent += `<h2>Cinsiyet Dağılımı (Danışman)</h2><table><thead><tr><th>Cinsiyet</th><th class='text-right'>Sayı</th></tr></thead><tbody>`;
        genderTable.danisman.forEach(([g, c]) => { htmlContent += `<tr><td><strong>${g}</strong></td><td class='text-right'><strong>${c.toLocaleString('tr-TR')}</strong></td></tr>`; });
        htmlContent += `</tbody></table>`;

        htmlContent += generateTable('Danışman Unvan Dağılımı', unvanTable, 'Unvan', 'Tez Sayısı');
        htmlContent += generateTable('Üniversite Dağılımı', uniTable, 'Üniversite', 'Tez Sayısı');
        htmlContent += generateTable('Anabilim Dalı / Bölüm', deptTable, 'Bölüm / ABD', 'Tez Sayısı');
        htmlContent += generateTable('Anahtar Kelime Frekans (İlk 50)', kwData.slice(0,50), 'Anahtar Kelime', 'Frekans');

        htmlContent += `</body></html>`;

        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Bibliyometrik_Analiz_Raporu.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) return (<div className="h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center"><style>{styles}</style><div className="font-label text-gray-400 mb-4 animate-pulse">VERİLER ANALİZ EDİLİYOR</div><div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" /></div>);

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
            <style>{styles}</style>
            
            <section className="border-b-soft bg-white">
                <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
                    <div className="col-span-1 md:col-span-6 border-r-soft p-8 md:p-16 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <button onClick={() => navigate('/tez-analytics')} className="font-label text-gray-400 flex items-center gap-1 hover:text-gray-700 transition-colors bg-transparent border-none cursor-pointer p-0"><ArrowRight size={12} className="rotate-180" />Dashboard'a Dön</button>
                                
                                <button onClick={exportToWord} className="font-label text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer">
                                    <Download size={14} /> Word Raporu İndir
                                </button>
                            </div>
                            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] text-yellow-600 reveal-up">Bibliyometrik <br /><span className="text-gray-900">Analiz</span></h2>
                        </div>
                        <p className="font-data text-lg text-gray-500 max-w-md mt-8 reveal-up delay-100">{data.length} tezin gruplandırılmış analizi. Tablolardaki verilere tıklayarak ilgili tezlere gidebilirsiniz.</p>
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
                <aside className="hidden lg:flex flex-col w-[300px] flex-shrink-0 border-r-soft bg-white sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                    <div className="p-6 border-b-soft sticky top-0 bg-white z-10">
                        <h4 className="font-display text-lg flex items-center gap-2 text-yellow-900"><SlidersHorizontal size={20} className="text-gray-400" />Filtreler</h4>
                        <p className="font-label text-gray-400 mt-2">{data.length} kayıt listeleniyor</p>
                    </div>
                    <div className="p-6"><FP /></div>
                </aside>

                <main className="flex-1 min-w-0 bg-white">
                    <section className="sec-panel">
                        <PH icon={TrendingUp} title="Şekil 1 — Yıllara Göre Tez Dağılımı" sub="Sütuna tıkla → o yılın tezlerine git" count={`${yearChart.length} yıl`} />
                        <div className="p-6 md:p-10"><div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={yearChart} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#6B7280' }} dy={12} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 12, fill: '#9CA3AF' }} />
                                    <Tooltip cursor={{ fill: '#F9FAFB' }} content={<CT />} />
                                    <Bar dataKey="count" name="Tez Sayısı" fill="#E5E7EB" radius={[6, 6, 0, 0]} activeBar={{ fill: '#c7972f' }} className="cursor-pointer" onClick={d => drill('year', d.year)} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div></div>
                    </section>

                    <section className="sec-panel border-b-soft">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            <div className="lg:col-span-5 border-r-soft">
                                <PH icon={FileText} title="Şekil 2 — Araştırma Dili" sub="Satıra tıkla → tezlere git" />
                                <div className="p-6 md:p-8">
                                    <div className="h-[280px] mb-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPie><Pie data={langChart} dataKey="value" cx="50%" cy="50%" outerRadius={90} paddingAngle={4} cornerRadius={5} stroke="none">{langChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip content={<CT />} /><Legend iconType="circle" iconSize={10} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.85rem', paddingTop: '20px' }} /></RechartsPie>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="dt-wrap"><table className={`dt dt-clickable`}><thead><tr><th>Dil</th><th>Tez</th><th>Oran</th></tr></thead>
                                        <tbody>{langChart.map((r, i) => (<tr key={i} className={f.language === r.name ? 'dt-active' : ''} onClick={() => { upd('language', r.name); drill('language', r.name); }}><td style={{ fontWeight: i < 2 ? 600 : 400, color: f.language === r.name ? '#c7972f' : 'inherit' }}>{r.name}</td><td className="font-bold">{r.value}</td><td><MiniBar pct={data.length ? r.value / data.length * 100 : 0} /></td></tr>))}</tbody>
                                    </table></div>
                                </div>
                            </div>
                            <div className="lg:col-span-7">
                                <PH icon={BarChart2} title="Şekil 3 — Araştırma Yöntemi" sub="Satıra tıkla → tezlere git" />
                                <div className="p-6 md:p-8">
                                    <div className="h-[280px] mb-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPie><Pie data={methodChart} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} cornerRadius={6} stroke="none">{methodChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip content={<CT />} /><Legend iconType="circle" iconSize={10} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.85rem', paddingTop: '20px' }} /></RechartsPie>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="dt-wrap"><table className={`dt dt-clickable`}><thead><tr><th>Yöntem</th><th>Tez</th><th>Oran</th></tr></thead>
                                        <tbody>{methodChart.map((r, i) => (<tr key={i} className={f.method === r.name ? 'dt-active' : ''} onClick={() => { upd('method', r.name); drill('method', r.name); }}><td style={{ fontWeight: i < 2 ? 600 : 400, color: f.method === r.name ? '#c7972f' : 'inherit' }}>{r.name}</td><td className="font-bold">{r.value}</td><td><MiniBar pct={data.length ? r.value / data.length * 100 : 0} /></td></tr>))}</tbody>
                                    </table></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="sec-panel border-b-soft bg-white">
                        <PH icon={BarChart2} title="Tablo 1 — Araştırma Deseni" sub="Gruplandırılmış araştırma desenleri · satıra tıkla → tezlere git" count={`${groupedDesenNorm.length} ana grup`} />
                        <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                <div className="lg:col-span-5 h-[380px] flex items-center justify-center bg-gray-50/50 rounded-2xl border border-gray-100 p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie data={groupedDesenChart} dataKey="value" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} cornerRadius={8} stroke="none">
                                                {groupedDesenChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip content={<CT />} cursor={{ fill: '#F9FAFB' }} />
                                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.71rem', paddingTop: '20px' }} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                                <div className="lg:col-span-7 h-full">
                                    <div className="max-h-[380px] overflow-y-auto pr-3 custom-scrollbar rounded-xl shadow-sm border border-gray-100">
                                        <GT rows={groupedDesenNorm} fk="desen" activeVal={f.desen} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="sec-panel border-b-soft bg-gray-50/50">
                        <PH icon={FileText} title="Tablo 2 — Veri Toplama Araçları" sub="Satıra tıkla → tezlere git" count={`${vtChart.length} grup`} />
                        <div className="p-6 md:p-10 flex flex-col gap-8">
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={vtChart} layout="vertical" margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#9CA3AF' }} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#111827', fontWeight: 500 }} width={220} />
                                        <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CT />} />
                                        <Bar dataKey="value" name="Tez" radius={[0, 6, 6, 0]}>{vtChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar shadow-sm rounded-xl"><GT rows={mkVt(data.length)} fk="veriToplama" activeVal={f.veriToplama} /></div>
                        </div>
                    </section>

                    <section className="sec-panel border-b-soft">
                        <PH icon={Users} title="Tablo 3 — Örneklem Mahiyeti" sub="Gruplandırılmış örnekleme yöntemleri · satıra tıkla → tezlere git" count={`${mahList.length} grup`} />
                        <div className="p-6 md:p-10"><div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-5 h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPie>
                                        <Pie data={mkNorm('_mahiyetNorm', data.length).filter(r => r.label !== 'Belirtilmemiş').map(r => ({ name: r.label, value: r.count }))} dataKey="value" cx="50%" cy="50%" outerRadius={110} paddingAngle={3} cornerRadius={4} stroke="none">
                                            {mahList.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip content={<CT />} /><Legend iconType="circle" iconSize={10} wrapperStyle={{ fontFamily: 'Lexend', fontSize: '.85rem', paddingTop: '20px' }} />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            </div>
                            <div className="lg:col-span-7 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar"><GT rows={mkNorm('_mahiyetNorm', data.length)} fk="orneklemMahiyet" activeVal={f.orneklemMahiyet} /></div>
                        </div></div>
                    </section>

                    <section className="sec-panel border-b-soft">
                        <PH icon={Users} title="Tablo 4 — Araştırma Örneklemi (Çalışma Grubu)" sub="Okul türü ve hedef kitle kombinasyonlarına göre gruplandırıldı · satıra tıkla → tezlere git" count={`${groupedOrneklemTable.length} ana grup`} />
                        <div className="p-6 md:p-10"><div className="max-h-[450px] overflow-y-auto pr-3 custom-scrollbar shadow-sm rounded-xl"><GT rows={groupedOrneklemTable} fk="orneklem" activeVal={f.orneklem} /></div></div>
                    </section>
                    
                    {/* GÜNCELLENEN TABLO 5 */}
                    <section className="sec-panel border-b-soft bg-gray-50/50">
                        <PH icon={BarChart2} title="Tablo 5 — Veri Analiz Yöntemi" sub="Gruplandırılmış veri analiz yöntemleri · satıra tıkla → tezlere git" count={`${groupedVaNorm.length} grup`} />
                        <div className="p-6 md:p-10 flex flex-col gap-8">
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={groupedVaChart.filter(d => d.name !== 'Belirtilmemiş')} layout="vertical" margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#9CA3AF' }} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#111827', fontWeight: 500 }} width={260} />
                                        <Tooltip cursor={{ fill: '#F3F4F6' }} content={<CT />} />
                                        <Bar dataKey="value" name="Tez" radius={[0, 6, 6, 0]}>{groupedVaChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar shadow-sm rounded-xl"><GT rows={groupedVaNorm} fk="veriAnaliz" activeVal={f.veriAnaliz} /></div>
                        </div>
                    </section>

                    <section className="sec-panel border-b-soft">
                        <PH icon={Target} title="Tablo 6 — Araştırma Konusu" sub="Gruplandırılmış tematik kategoriler · satıra tıkla → tezlere git" count={`${groupedKonuNorm.length} ana grup`} />
                        <div className="p-6 md:p-10 flex flex-col gap-8">
                            <div className="h-[450px]"> 
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={groupedKonuChart} layout="vertical" margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#9CA3AF' }} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 13, fill: '#111827', fontWeight: 500 }} width={300} />
                                        <Tooltip cursor={{ fill: '#F9FAFB' }} content={<CT />} />
                                        <Bar dataKey="value" name="Tez" radius={[0, 6, 6, 0]}>{groupedKonuChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto pr-3 custom-scrollbar shadow-sm rounded-xl"><GT rows={groupedKonuNorm} fk="konu" activeVal={f.konu} /></div>
                        </div>
                    </section>

                    <section className="sec-panel border-b-soft bg-gray-50/50">
                        <PH icon={FileText} title="Tablo 7 — Sayfa Uzunlukları" sub={`${pageRows.filled} tezde veri mevcut · satıra tıkla → o aralıktaki tezlere git`} />
                        <div className="p-6 md:p-10">{pageRows.rows.length ? (
                            <div className="dt-wrap shadow-sm"><table className="dt dt-clickable">
                                <thead><tr><th>Sayfa Aralığı</th><th>Tez Sayısı</th><th>Dağılım</th><th>Tezlere Git</th></tr></thead>
                                <tbody>{pageRows.rows.map((r, i) => (<tr key={i} onClick={() => drill('sayfa', r.label)}><td className="font-semibold">{r.label}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={pageRows.filled ? r.count / pageRows.filled * 100 : 0} /></td><td><span className="drill-badge">→ {r.count} tez</span></td></tr>))}</tbody>
                            </table></div>
                        ) : <div className="no-data">Sayfa sayısı verisi yok</div>}</div>
                    </section>

                    <section className="sec-panel border-b-soft">
                        <PH icon={Users} title="Tablo 8 — Cinsiyet Dağılımı" sub="Satıra tıkla → o cinsiyetin tezlerine git" />
                        <div className="p-6 md:p-10">{(genderTable.yazar.length || genderTable.danisman.length) ? (
                            <div className="gender-grid">
                                {[['Tez Yazarı', genderTable.yazar, 'gender'], ['Danışman', genderTable.danisman, 'advisorGender']].map(([title, rows, fkey]) => {
                                    const tot = rows.reduce((s, [, c]) => s + c, 0);
                                    return (<div key={title} className="gender-card shadow-sm"><div className="gender-card-head">{title}</div>
                                        {rows.map(([g, c]) => (<div key={g} onClick={() => drill(fkey, g)}>
                                            <div className="gender-row"><span className="gender-dot" style={{ background: g === 'Erkek' ? '#111827' : '#c7972f' }} /><span className="gender-name">{g}</span><span className="gender-num">{c}</span><span className="gender-pct">({tot ? (c / tot * 100).toFixed(0) : 0}%)</span></div>
                                            <div className="gender-bar-wrap"><div className="gender-bar-fill" style={{ width: `${tot ? c / tot * 100 : 0}%`, background: g === 'Erkek' ? '#111827' : '#c7972f' }} /></div>
                                        </div>))}
                                    </div>);
                                })}
                            </div>
                        ) : <div className="no-data">Cinsiyet verisi yok</div>}</div>
                    </section>

                    <section className="sec-panel border-b-soft bg-gray-50/50">
                        <PH icon={GraduationCap} title="Tablo 9 — Danışman Unvan Dağılımı" sub="Satıra tıkla → tezlere git" count={`${unvanTable.length} unvan`} />
                        <div className="p-6 md:p-10"><div className="dt-wrap shadow-sm"><table className="dt dt-clickable">
                            <thead><tr><th>#</th><th>Unvan</th><th>Tez Sayısı</th><th>Oran</th></tr></thead>
                            <tbody>{unvanTable.map((r, i) => (<tr key={i} onClick={() => drill('advisorUnvan', r.unvan)}><td><RC i={i} /></td><td style={{ fontWeight: i < 3 ? 600 : 400 }}>{r.unvan}</td><td className="font-bold">{r.count}</td><td><MiniBar pct={r.pct} /></td></tr>))}</tbody>
                        </table></div></div>
                    </section>

                    <section className="sec-panel border-b-soft">
                        <PH icon={Building2} title="Tablo 10 — Üniversite Dağılımı" sub="Satıra tıkla → o üniversitenin tezlerine git" count={`${uniTable.length} üniversite`} />
                        <div className="p-6 md:p-10">
                            <div className="max-h-[500px] overflow-y-auto pr-3 custom-scrollbar rounded-xl shadow-sm">
                                <div className="dt-wrap border-none">
                                    <table className="dt dt-clickable relative">
                                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                                            <tr><th>#</th><th>Üniversite</th><th>Tez</th><th>Oran</th></tr>
                                        </thead>
                                        <tbody>
                                            {uniTable.map((r, i) => (
                                                <tr key={i} className={f.university === r.uni ? 'dt-active' : ''} onClick={() => { upd('university', r.uni); drill('university', r.uni); }}>
                                                    <td><RC i={i} /></td>
                                                    <td style={{ fontWeight: i < 3 ? 600 : 400, color: f.university === r.uni ? '#c7972f' : 'inherit' }}>{r.uni}</td>
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

                    <section className="sec-panel border-b-soft bg-gray-50/50">
                        <PH icon={BookOpen} title="Tablo 11 — Anabilim Dalı / Bölüm" sub="Satıra tıkla → tezlere git" count={`${deptTable.length} bölüm`} />
                        <div className="p-6 md:p-10">
                            <div className="max-h-[500px] overflow-y-auto pr-3 custom-scrollbar rounded-xl shadow-sm">
                                <div className="dt-wrap border-none">
                                    <table className="dt dt-clickable relative">
                                        <thead className="sticky top-0 bg-white shadow-sm z-10">
                                            <tr><th>#</th><th>Bölüm / ABD</th><th>Tez</th><th>Oran</th></tr>
                                        </thead>
                                        <tbody>
                                            {deptTable.map((r, i) => (
                                                <tr key={i} className={f.department === r.dept ? 'dt-active' : ''} onClick={() => { upd('department', r.dept); drill('department', r.dept); }}>
                                                    <td><RC i={i} /></td>
                                                    <td style={{ fontWeight: i < 3 ? 600 : 400, color: f.department === r.dept ? '#c7972f' : 'inherit' }}>{r.dept}</td>
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

                    <section className="sec-panel border-b-soft">
                        <PH
                            icon={Hash}
                            title="Şekil 4 — Anahtar Kelime Bulutu"
                            sub="Boyut = frekans"
                            count={`${kwData.filter(r => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş").length} terim`}
                        />
                        <div className="p-6 md:p-10">
                            {kwData.filter(r => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş").length ? (
                                <div className="wc-container bg-gray-50 rounded-2xl border border-gray-100">
                                    {kwData
                                        .filter(r => r.word && r.word.trim().toLowerCase() !== "belirtilmemiş")
                                        .slice(0, 60)
                                        .map(({ word, freq }, i) => {
                                            const sc = 0.85 + (freq / kwMax) * 1.6; 
                                            const dk = i % 4 === 0, gd = i % 4 === 1;
                                            return (
                                                <span
                                                    key={i}
                                                    className="wc-word"
                                                    title={`${word}: ${freq} kez`}
                                                    style={{
                                                        fontSize: `${sc}rem`,
                                                        background: dk ? '#111827' : gd ? '#c7972f' : 'white',
                                                        color: (dk || gd) ? 'white' : '#374151',
                                                        border: (!dk && !gd) ? '1px solid #E5E7EB' : 'none'
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

                    <section className="sec-panel border-b-soft bg-gray-50/50">
                        <PH icon={Hash} title="Tablo 12 — Anahtar Kelime Frekans" sub="En sık kullanılan kavramlar" />
                        <div className="p-6 md:p-10">
                            <div className="dt-wrap shadow-sm">
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
                                            .slice(0, 20) 
                                            .map((r, i) => (
                                                <tr key={i}>
                                                    <td><RC i={i} /></td>
                                                    <td style={{ fontWeight: i < 5 ? 600 : 400 }}>{r.word}</td>
                                                    <td className="font-bold">{r.freq}</td>
                                                    <td><MiniBar pct={kwMax ? (r.freq / kwMax) * 100 : 0} /></td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* MOBİL FAB */}
            <button className={`floating-filter-btn ${showFab ? 'visible' : ''}`} onClick={() => setIsModalOpen(true)}>
                <SlidersHorizontal size={22} />
            </button>
            <div className={`filter-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)} />
            <div className={`filter-modal ${isModalOpen ? 'open' : ''}`}>
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <span className="font-display text-lg text-yellow-900">Filtreler</span>
                    <button className="p-2 bg-gray-100 rounded-full" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                </div>
                <div className="p-5 custom-scrollbar flex-1 overflow-y-auto">
                    <div className="filter-grid-mobile">
                        <FP />
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
                    <button onClick={clearAll} className="flex-1 py-3 bg-white border border-gray-200 text-red-500 rounded-xl font-medium">Temizle</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-[2] py-3 bg-[#111827] text-white rounded-xl font-medium">Göster ({data.length})</button>
                </div>
            </div>
        </div>
    );
}