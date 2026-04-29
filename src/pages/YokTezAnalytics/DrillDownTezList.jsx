import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Filter, ChevronDown, SlidersHorizontal, ExternalLink } from 'lucide-react';

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");
  :root{--bg-main:#F9FAFB;--text-primary:#111827;--text-secondary:#6B7280;--border-color:#E5E7EB;--primary-color:#111827;--gold:#c7972f;}
  *{font-family:"Lexend",sans-serif;box-sizing:border-box;}
  body{background-color:var(--bg-main);color:var(--text-primary);-webkit-font-smoothing:antialiased;overflow-x:hidden;margin:0;padding:0;}
  .input-modern{width:100%;background:white;border:1px solid var(--border-color);padding:.875rem 1rem;font-size:.9rem;color:var(--text-primary);border-radius:12px;transition:all .2s ease;font-family:"Lexend",sans-serif;}
  .input-modern:focus{outline:none;border-color:var(--primary-color);}
  .dropdown-container{position:relative;width:100%;}
  .dropdown-modern{position:absolute;top:calc(100% + 4px);left:0;width:100%;background:white;border:1px solid var(--border-color);border-radius:12px;max-height:300px;overflow-y:auto;z-index:9999;box-shadow:0 20px 25px -5px rgba(0,0,0,.1);}
  .dropdown-item{padding:.875rem 1rem;font-size:.9rem;cursor:pointer;border-bottom:1px solid #F3F4F6;}
  .dropdown-item:hover{background:#F3F4F6;}
  .floating-filter-btn{position:fixed;bottom:24px;left:24px;width:56px;height:56px;background:var(--primary-color);color:white;border:none;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,.25);cursor:pointer;z-index:1000;transition:all .3s cubic-bezier(.175,.885,.32,1.275);transform:scale(0) translateY(20px);opacity:0;}
  .floating-filter-btn.visible{transform:scale(1) translateY(0);opacity:1;}
  .floating-filter-btn:hover{transform:scale(1.05);background:black;}
  .filter-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);backdrop-filter:blur(3px);z-index:2000;opacity:0;pointer-events:none;transition:opacity .3s ease;}
  .filter-overlay.open{opacity:1;pointer-events:all;}
  .filter-modal{position:fixed;background:white;z-index:2001;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.2);transition:transform .4s cubic-bezier(.16,1,.3,1);}
  @media(min-width:769px){.filter-modal{top:50%;left:50%;transform:translate(-50%,-40%) scale(.95);width:90%;max-width:760px;max-height:85vh;border-radius:24px;opacity:0;pointer-events:none;}.filter-overlay.open + .filter-modal{transform:translate(-50%,-50%) scale(1);opacity:1;pointer-events:all;}}
  @media(max-width:768px){.filter-modal{left:0;right:0;bottom:0;width:100%;height:85vh;border-radius:24px 24px 0 0;transform:translateY(100%);}.filter-overlay.open + .filter-modal{transform:translateY(0);}.filter-grid-mobile{display:flex;flex-direction:column;gap:1rem;padding-bottom:3rem;}}
  .btn-modern{display:inline-flex;align-items:center;justify-content:center;padding:.6rem 1.25rem;background:white;border:1px solid var(--border-color);color:var(--text-primary);font-weight:500;font-size:.85rem;border-radius:10px;transition:all .2s;cursor:pointer;}
  .btn-modern:hover{background:var(--primary-color);color:white;border-color:var(--primary-color);}
  .yoktez-button{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:linear-gradient(135deg,#ae9242 0%,#c7972f 100%);color:white;border:none;border-radius:10px;font-weight:600;font-size:.8rem;text-decoration:none;box-shadow:0 4px 10px rgba(251,191,36,.3);transition:all .2s;cursor:pointer;}
  .yoktez-button:hover{transform:translateY(-1px);}
  .badge{display:inline-flex;align-items:center;padding:.25rem .6rem;font-size:.7rem;font-weight:600;border-radius:6px;background:#F3F4F6;color:var(--text-secondary);white-space:nowrap;}
  .badge-dark{background:var(--primary-color);color:white;}
  .card-modern{background:white;border:1px solid var(--border-color);border-radius:16px;padding:2rem;transition:all .2s ease;width:100%;}
  @media(max-width:768px){.card-modern{padding:1.25rem;border-radius:12px;}.card-hf{flex-direction:column-reverse;gap:.75rem;}.card-act{align-self:flex-start;margin-bottom:.25rem;width:100%;}.yoktez-button{width:100%;justify-content:center;}.card-grid{grid-template-columns:1fr;gap:1rem;}}
  @media(min-width:769px){.card-hf{flex-direction:row;justify-content:space-between;align-items:flex-start;}.card-act{margin-top:.25rem;}.card-modern:hover{transform:translateY(-2px);box-shadow:0 10px 40px -10px rgba(0,0,0,.08);border-color:#D1D5DB;}.card-grid{grid-template-columns:repeat(3,1fr);}}
  .custom-scrollbar::-webkit-scrollbar{width:6px;}.custom-scrollbar::-webkit-scrollbar-track{background:transparent;}.custom-scrollbar::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:10px;}
  .meta-tag{display:inline-flex;align-items:center;padding:3px 8px;font-size:.7rem;font-weight:500;border-radius:5px;}
  .filter-active-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:20px;font-size:.78rem;font-weight:600;color:#92400E;}
`;

const TL = t=>(t||'').replace(/İ/g,'i').replace(/I/g,'ı').replace(/Ş/g,'ş').replace(/Ğ/g,'ğ').replace(/Ü/g,'ü').replace(/Ö/g,'ö').replace(/Ç/g,'ç').toLowerCase();
const S  = v=>(v==null?'':String(v)).trim();

const HL=({text,hl})=>{
  if(!text)return null;if(!hl?.trim())return<>{text}</>;
  const lt=TL(text),lh=TL(hl);if(!lt.includes(lh))return<>{text}</>;
  const els=[];let li=0,ix=lt.indexOf(lh,li);
  while(ix!==-1){if(ix>li)els.push(text.substring(li,ix));els.push(<span key={ix} className="bg-yellow-300 text-gray-900 rounded-[2px] px-0.5">{text.substring(ix,ix+lh.length)}</span>);li=ix+lh.length;ix=lt.indexOf(lh,li);}
  if(li<text.length)els.push(text.substring(li));return<>{els}</>;
};

const FInput=({label,placeholder,value,onChange,onToggle,isOpen,options,onSelect})=>(
  <div className="dropdown-container">
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="input-modern pr-10"/>
      <div onClick={e=>{e.preventDefault();onToggle();}} className="absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer">
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen?'rotate-180':''}`}/>
      </div>
    </div>
    {isOpen&&options.length>0&&(<div className="dropdown-modern custom-scrollbar">{options.map((opt,i)=>(<div key={i} onClick={()=>onSelect(opt)} className="dropdown-item">{opt}</div>))}</div>)}
  </div>
);

const FSelect=({label,value,onChange,options})=>(
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select value={value} onChange={onChange} className="input-modern appearance-none cursor-pointer pr-10">
        <option value="">Tümü</option>{options.map((opt,i)=><option key={i} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400"/></div>
    </div>
  </div>
);

export default function DrillDownTezList(){
  const navigate=useNavigate();
  const location=useLocation();
  const [allTheses,setAllTheses]=useState([]);
  const [searchTerm,setSearchTerm]=useState('');
  const [expanded,setExpanded]=useState(null);
  const [loading,setLoading]=useState(true);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [showFab,setShowFab]=useState(false);

  // URL params → initial filters
  const params=useMemo(()=>new URLSearchParams(location.search),[location.search]);

  const [filters,setFilters]=useState({
    year:params.get('year')||'',university:params.get('university')||'',department:params.get('department')||'',
    method:params.get('method')||'',language:params.get('language')||'',
    desen:params.get('desen')||'',veriToplama:params.get('veriToplama')||'',
    orneklemMahiyet:params.get('orneklemMahiyet')||'',veriAnaliz:params.get('veriAnaliz')||'',
    konu:params.get('konu')||'',gender:params.get('gender')||'',advisorGender:params.get('advisorGender')||'',
    advisorUnvan:params.get('advisorUnvan')||'',category:params.get('category')||'',tezTuru:params.get('tezTuru')||'',
    sayfa:params.get('sayfa')||''
  });

  const [sd,setSd]=useState({year:'',university:'',department:''});
  const [activeDD,setActiveDD]=useState(null);

  useEffect(()=>{const h=()=>setShowFab(window.scrollY>100);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h);},[]);
  useEffect(()=>{const h=e=>{if(!e.target.closest('.dropdown-container'))setActiveDD(null);};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);

  useEffect(()=>{
    import('./data/tez3.json').then(m=>{setAllTheses(m.default);setLoading(false);}).catch(()=>setLoading(false));
  },[]);

  // Sayfa aralığı parse
  const parsePageRange=(label)=>{
    if(!label)return[null,null];
    const m=label.match(/^(\d+)[–-](\d+)$/);
    if(m)return[parseInt(m[1]),parseInt(m[2])];
    if(label==='601+')return[601,Infinity];
    return[null,null];
  };

  const filtered=useMemo(()=>{
    let r=[...allTheses];
    if(searchTerm){const q=TL(searchTerm);r=r.filter(t=>TL(S(t['Tez Başlığı'])).includes(q)||TL(S(t['Tez Yazarı'])).includes(q)||TL(S(t['Danışman'])).includes(q)||TL(S(t['Üniversite'])).includes(q)||TL(S(t['Araştırmanın Özeti'])).includes(q)||TL(S(t['Araştırma Konusu'])).includes(q));}
    if(filters.year)r=r.filter(t=>S(t['Yıl'])===filters.year);
    if(filters.university)r=r.filter(t=>TL(S(t['Üniversite']))===TL(filters.university));
    if(filters.department)r=r.filter(t=>TL(S(t['Bölüm']))===TL(filters.department));
    if(filters.method)r=r.filter(t=>TL(S(t['Araştırmanın Yöntemi']))===TL(filters.method));
    if(filters.language)r=r.filter(t=>TL(S(t['Araştırma Dili']))===TL(filters.language));
    if(filters.desen)r=r.filter(t=>S(t['_desenNorm'])===filters.desen);
    if(filters.veriToplama)r=r.filter(t=>(t['_veriTopNorm']||[]).includes(filters.veriToplama));
    if(filters.orneklemMahiyet)r=r.filter(t=>S(t['_mahiyetNorm'])===filters.orneklemMahiyet);
    if(filters.veriAnaliz)r=r.filter(t=>S(t['_veriAnalizNorm'])===filters.veriAnaliz);
    if(filters.konu)r=r.filter(t=>S(t['_konuNorm'])===filters.konu);
    if(filters.gender)r=r.filter(t=>S(t['Tez Yazarının Cinsiyeti'])===filters.gender);
    if(filters.advisorGender)r=r.filter(t=>S(t['Danışmanın Cinsiyeti'])===filters.advisorGender);
    if(filters.advisorUnvan)r=r.filter(t=>S(t['Danışman Unvanları']).startsWith(filters.advisorUnvan));
    if(filters.category)r=r.filter(t=>S(t['Kategori'])===filters.category);
    if(filters.tezTuru)r=r.filter(t=>S(t['Tez Türü'])===filters.tezTuru);
    if(filters.sayfa){const[lo,hi]=parsePageRange(filters.sayfa);if(lo!==null)r=r.filter(t=>{const p=parseInt(S(t['Sayfa Sayısı']));return!isNaN(p)&&p>=lo&&p<=hi;});}
    return r;
  },[allTheses,searchTerm,filters]);

  const uniq=k=>[...new Set(allTheses.map(t=>S(t[k])).filter(Boolean))].sort();
  const years=useMemo(()=>[...new Set(allTheses.map(t=>S(t['Yıl'])).filter(Boolean))].sort().reverse(),[allTheses]);
  const universities=useMemo(()=>uniq('Üniversite'),[allTheses]);
  const departments=useMemo(()=>uniq('Bölüm'),[allTheses]);
  const methods=useMemo(()=>uniq('Araştırmanın Yöntemi'),[allTheses]);
  const languages=useMemo(()=>uniq('Araştırma Dili'),[allTheses]);

  const fy=years.filter(y=>y.toString().includes(sd.year));
  const fu=universities.filter(u=>TL(u).includes(TL(sd.university)));
  const fd=departments.filter(d=>TL(d).includes(TL(sd.department)));

  const clearFilters=()=>{setFilters({year:'',university:'',department:'',method:'',language:'',desen:'',veriToplama:'',orneklemMahiyet:'',veriAnaliz:'',konu:'',gender:'',advisorGender:'',advisorUnvan:'',category:'',tezTuru:'',sayfa:''});setSearchTerm('');setSd({year:'',university:'',department:''});setActiveDD(null);setIsModalOpen(false);};

  // Aktif filtre etiketi üst satırda göster
  const activeFilters=Object.entries(filters).filter(([,v])=>v);

  // Page title from active filters
  const getTitle=()=>{
    if(filters.desen)return`Desen: ${filters.desen}`;
    if(filters.veriToplama)return`Veri Toplama: ${filters.veriToplama}`;
    if(filters.orneklemMahiyet)return`Örneklem: ${filters.orneklemMahiyet}`;
    if(filters.veriAnaliz)return`Analiz: ${filters.veriAnaliz}`;
    if(filters.konu)return`Konu: ${filters.konu}`;
    if(filters.year)return`${filters.year} Yılı Tezleri`;
    if(filters.university)return filters.university;
    if(filters.method)return`Yöntem: ${filters.method}`;
    if(filters.language)return`Dil: ${filters.language}`;
    if(filters.sayfa)return`Sayfa: ${filters.sayfa}`;
    if(filters.gender)return`Yazar: ${filters.gender}`;
    if(filters.advisorGender)return`Danışman: ${filters.advisorGender}`;
    return'Doğrudan Tezler';
  };

  const FC=(
    <>
      <FInput label="Yıl" placeholder="Yıl" value={filters.year||sd.year}
        onChange={e=>{setSd({...sd,year:e.target.value});if(activeDD!=='year')setActiveDD('year');}}
        isOpen={activeDD==='year'} onToggle={()=>setActiveDD(p=>p==='year'?null:'year')}
        options={fy} onSelect={val=>{setFilters({...filters,year:val});setSd({...sd,year:''});setActiveDD(null);}}/>
      <FInput label="Üniversite" placeholder="Üniversite" value={filters.university||sd.university}
        onChange={e=>{setSd({...sd,university:e.target.value});if(activeDD!=='uni')setActiveDD('uni');}}
        isOpen={activeDD==='uni'} onToggle={()=>setActiveDD(p=>p==='uni'?null:'uni')}
        options={fu} onSelect={val=>{setFilters({...filters,university:val});setSd({...sd,university:''});setActiveDD(null);}}/>
      <FInput label="Bölüm" placeholder="Bölüm" value={filters.department||sd.department}
        onChange={e=>{setSd({...sd,department:e.target.value});if(activeDD!=='dept')setActiveDD('dept');}}
        isOpen={activeDD==='dept'} onToggle={()=>setActiveDD(p=>p==='dept'?null:'dept')}
        options={fd} onSelect={val=>{setFilters({...filters,department:val});setSd({...sd,department:''});setActiveDD(null);}}/>
      <FSelect label="Araştırma Yöntemi" value={filters.method} onChange={e=>setFilters({...filters,method:e.target.value})} options={methods}/>
      <FSelect label="Araştırma Dili" value={filters.language} onChange={e=>setFilters({...filters,language:e.target.value})} options={languages}/>
      <FSelect label="Kategori" value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})} options={['Doğrudan','Dolaylı']}/>
      <div className="w-full">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Tez Türü</label>
        <div className="relative">
          <select value={filters.tezTuru} onChange={e=>setFilters({...filters,tezTuru:e.target.value})} className="input-modern appearance-none cursor-pointer pr-10">
            <option value="">Tümü</option><option value="Doktora">Doktora</option><option value="Yüksek Lisans">Yüksek Lisans</option>
          </select>
          <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center pointer-events-none"><ChevronDown className="w-4 h-4 text-gray-400"/></div>
        </div>
      </div>
    </>
  );

  if(loading)return null;

  return(
    <div className="min-h-screen pb-10 relative">
      <style>{styles}</style>

      <header className="bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div className="w-full">
              <button onClick={()=>navigate('/tez-analytics/dogrudan-analiz')} className="text-sm font-medium text-gray-500 hover:text-black mb-2 flex items-center gap-1">
                <ArrowRight className="rotate-180 w-4 h-4"/>Analize Dön
              </button>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111827] break-words flex-1">{getTitle()}</h1>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200">{filtered.length}</span>
              </div>
            </div>
          </div>

          {/* Aktif filtre pill'leri */}
          {activeFilters.length>0&&(
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map(([k,v])=>(
                <span key={k} className="filter-active-pill">
                  {v.length>30?v.slice(0,30)+'…':v}
                  <button onClick={()=>setFilters({...filters,[k]:''})} className="ml-1"><X size={12}/></button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-red-500 font-semibold hover:text-red-700 ml-1">Tümünü Temizle</button>
            </div>
          )}

          {/* Desktop filter bar */}
          <div className="hidden lg:block bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="mb-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input type="text" placeholder="Başlık, yazar, konu, özet ara…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none font-medium text-gray-700"/>
            </div>
            <div className="grid grid-cols-4 gap-3">{FC}</div>
            {(activeFilters.length>0||searchTerm)&&(<div className="mt-3 flex justify-end"><button onClick={clearFilters} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1"><X size={16}/>Temizle</button></div>)}
          </div>
          <div className="lg:hidden w-full">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input type="text" placeholder="Tezlerde ara…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none text-sm"/>
            </div>
          </div>
        </div>
      </header>

      <button className={`floating-filter-btn ${showFab?'visible':''}`} onClick={()=>setIsModalOpen(true)}><SlidersHorizontal size={24}/></button>
      <div className={`filter-overlay ${isModalOpen?'open':''}`} onClick={()=>setIsModalOpen(false)}/>
      <div className={`filter-modal ${isModalOpen?'open':''}`}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Filtrele</h3>
          <button onClick={()=>setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} className="text-gray-600"/></button>
        </div>
        <div className="p-5 custom-scrollbar flex-1 overflow-y-auto"><div className="filter-grid-mobile">{FC}</div></div>
        <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
          <button onClick={clearFilters} className="flex-1 py-3 bg-white border border-gray-200 text-red-500 rounded-xl font-medium">Temizle</button>
          <button onClick={()=>setIsModalOpen(false)} className="flex-[2] py-3 bg-[#111827] text-white rounded-xl font-medium">Göster ({filtered.length})</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        {filtered.length===0?(
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Filter className="w-8 h-8 text-gray-400"/></div>
            <h3 className="text-xl font-bold text-gray-900">Sonuç Yok</h3>
            <button onClick={clearFilters} className="mt-4 text-yellow-600 font-medium">Filtreleri Temizle</button>
          </div>
        ):(
          <div className="space-y-4 md:space-y-6">
            {filtered.map((t,index)=>{
              const ozet=S(t['Araştırmanın Özeti'])||S(t['Özet (Türkçe)'])||'';
              const link=S(t['Tez Bağlantı Linki'])||S(t['Tez Dosyası'])||'';
              const unvanDan=S(t['Danışman Unvanları'])?`${S(t['Danışman Unvanları'])} ${S(t['Danışman'])}`:S(t['Danışman']);
              const yazar=S(t['Tez Yazarı'])||S(t['Yazar'])||'';
              return(
                <div key={index} className="card-modern group">
                  <div className="card-hf flex mb-4 md:mb-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                        <span className="badge badge-dark">{t['Tez No']}</span>
                        <span className="badge bg-yellow-50 text-yellow-700 border border-yellow-100">{t['Tez Türü']}</span>
                        <span className="badge bg-orange-50 text-orange-800 border border-orange-100">{t['Yıl']}</span>
                        {S(t['Araştırma Dili'])&&<span className="badge bg-blue-50 text-blue-700 border border-blue-100">{t['Araştırma Dili']}</span>}
                        {S(t['Araştırmanın Yöntemi'])&&<span className="badge bg-purple-50 text-purple-700 border border-purple-100">{t['Araştırmanın Yöntemi']}</span>}
                        {S(t['_veriAnalizNorm'])&&S(t['_veriAnalizNorm'])!=='Belirtilmemiş'&&<span className="badge bg-gray-50 text-gray-600 border border-gray-200">{t['_veriAnalizNorm']}</span>}
                      </div>
                      <h2 className="text-xl font-bold text-justify text-gray-900 leading-snug group-hover:text-[#c7972f] transition-colors break-words">
                        <HL text={t['Tez Başlığı']} hl={searchTerm}/>
                      </h2>
                    </div>
                    <div className="card-act shrink-0">
                      {link&&link!=='İzinsiz'?(
                        <a href={link} target="_blank" rel="noopener noreferrer" className="yoktez-button">
                          <span className="text-xs font-semibold">YÖKTEZ</span><ExternalLink size={14}/>
                        </a>
                      ):<span className="text-xs font-medium text-gray-400 px-2 py-1 bg-gray-100 rounded">Kısıtlı</span>}
                    </div>
                  </div>

                  <div className="grid card-grid md:grid-cols-3 gap-4 md:gap-6 py-4 md:py-6 border-t border-b border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Yazar</p>
                      <p className="font-medium text-gray-900 text-sm md:text-base"><HL text={yazar} hl={searchTerm}/></p>
                      {S(t['Tez Yazarının Cinsiyeti'])&&<span className="text-xs text-gray-400">{t['Tez Yazarının Cinsiyeti']}</span>}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Danışman</p>
                      <p className="font-medium text-gray-900 text-sm md:text-base"><HL text={unvanDan||'—'} hl={searchTerm}/></p>
                      {S(t['Danışmanın Cinsiyeti'])&&<span className="text-xs text-gray-400">{t['Danışmanın Cinsiyeti']}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kurum</p>
                      <p className="font-medium text-gray-900 truncate text-sm md:text-base"><HL text={t['Üniversite']} hl={searchTerm}/></p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">{t['Enstitü']}</p>
                    </div>
                  </div>

                  {/* Araştırma metodoloji bilgileri */}
                  {(S(t['_desenNorm'])||S(t['_veriTopNorm']?.join?.(', '))||S(t['Araştırma Konusu']))&&(
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {S(t['Araştırma Konusu'])&&<span className="meta-tag bg-yellow-50 text-yellow-700">{t['_konuNorm']||t['Araştırma Konusu']}</span>}
                      {S(t['_desenNorm'])&&S(t['_desenNorm'])!=='Belirtilmemiş'&&<span className="meta-tag bg-indigo-50 text-indigo-700">{t['_desenNorm']}</span>}
                      {(t['_veriTopNorm']||[]).map((v,i)=><span key={i} className="meta-tag bg-green-50 text-green-700">{v}</span>)}
                      {S(t['Sayfa Sayısı'])&&<span className="meta-tag bg-gray-100 text-gray-600">{t['Sayfa Sayısı']} sf.</span>}
                    </div>
                  )}

                  {/* Anahtar kelimeler */}
                  {(S(t['1. Anahtar Kelime'])||S(t['2. Anahtar Kelime']))&&(
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {['1. Anahtar Kelime','2. Anahtar Kelime','3. Anahtar Kelime','4. Anahtar Kelime','5. ve Üstü Anahtar Kelimeler']
                        .map(c=>S(t[c])).filter(Boolean).map((kw,i)=>(
                        <span key={i} className="meta-tag bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{kw.trim()}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 md:mt-6 flex items-center justify-between">
                    <div className="text-xs md:text-sm text-gray-400 font-light truncate max-w-[50%]">{t['Bölüm']}</div>
                    {ozet?(
                      <button onClick={()=>setExpanded(expanded===index?null:index)} className="btn-modern py-1.5 px-3 md:py-2 md:px-4 gap-2 text-xs md:text-sm border-gray-200">
                        {expanded===index?<Minus size={14}/>:<Plus size={14}/>}
                        <span>{expanded===index?'Gizle':'Özet'}</span>
                      </button>
                    ):<span className="text-xs text-gray-300 italic">Özet Yok</span>}
                  </div>

                  {expanded===index&&(
                    <div className="mt-6 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      <div className="p-5 md:p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {/* Araştırma detayları */}
                        {(S(t['Araştırmanın Yöntemi'])||S(t['_desenNorm'])||S(t['Araştırma Örneklemi']))&&(
                          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Araştırma Detayları</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {S(t['Araştırmanın Yöntemi'])&&<div><p className="text-xs text-gray-400 mb-0.5">Yöntem</p><p className="text-sm font-medium text-gray-900">{t['Araştırmanın Yöntemi']}</p></div>}
                              {S(t['_desenNorm'])&&S(t['_desenNorm'])!=='Belirtilmemiş'&&<div><p className="text-xs text-gray-400 mb-0.5">Desen</p><p className="text-sm font-medium text-gray-900">{t['_desenNorm']}</p></div>}
                              {S(t['_veriAnalizNorm'])&&S(t['_veriAnalizNorm'])!=='Belirtilmemiş'&&<div className="col-span-2"><p className="text-xs text-gray-400 mb-0.5">Veri Analiz Yöntemi</p><p className="text-sm font-medium text-gray-900">{t['Veri Analiz Yöntemi']}</p></div>}
                              {S(t['Araştırma Örneklemi'])&&<div><p className="text-xs text-gray-400 mb-0.5">Örneklem</p><p className="text-sm font-medium text-gray-900">{t['Araştırma Örneklemi']}</p></div>}
                              {S(t['Örneklem Büyüklüğü'])&&<div><p className="text-xs text-gray-400 mb-0.5">Örneklem Büyüklüğü</p><p className="text-sm font-medium text-gray-900">{t['Örneklem Büyüklüğü']}</p></div>}
                              {S(t['_mahiyetNorm'])&&S(t['_mahiyetNorm'])!=='Belirtilmemiş'&&<div><p className="text-xs text-gray-400 mb-0.5">Örneklem Mahiyeti</p><p className="text-sm font-medium text-gray-900">{t['_mahiyetNorm']}</p></div>}
                              {S(t['Veri Toplama Araçları'])&&<div className="col-span-2"><p className="text-xs text-gray-400 mb-0.5">Veri Toplama Araçları</p><p className="text-sm font-medium text-gray-900">{t['Veri Toplama Araçları']}</p></div>}
                              {S(t['Araştırma Konusu'])&&<div className="col-span-2"><p className="text-xs text-gray-400 mb-0.5">Araştırma Konusu</p><p className="text-sm font-medium text-gray-900">{t['Araştırma Konusu']}</p></div>}
                              {S(t['Sayfa Sayısı'])&&<div><p className="text-xs text-gray-400 mb-0.5">Sayfa Sayısı</p><p className="text-sm font-medium text-gray-900">{t['Sayfa Sayısı']}</p></div>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}