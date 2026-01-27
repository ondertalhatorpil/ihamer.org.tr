import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Activity, Users, Building2, School, BookOpen, Search, X } from 'lucide-react';
import { 
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

// --- STYLES (LEXEND / MODERN CLEAN GRID) ---
const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

  :root {
    --bg-main: #F9FAFB;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --border-color: #E5E7EB;
    --accent-color: #111827;
  }

  * {
    font-family: "Lexend", sans-serif;
    box-sizing: border-box;
  }

  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
  }

  /* UTILITY CLASSES */
  .font-display { font-weight: 600; letter-spacing: -0.02em; }
  .font-data { font-weight: 300; }
  .font-label { font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.70rem; }

  .border-r-soft { border-right: 1px solid var(--border-color); }
  .border-b-soft { border-bottom: 1px solid var(--border-color); }

  /* ANIMATIONS */
  .reveal-up {
    animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }

  @keyframes revealUp {
    to { opacity: 1; transform: translateY(0); }
  }

  /* LIST INTERACTION */
  .list-row {
    display: flex;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    min-height: 72px;
    position: relative;
    overflow: hidden;
  }
  
  .list-row:hover {
    background-color: #F8FAFC;
    padding-left: 1.5rem;
  }

  .list-row.highlight-active {
    background-color: #fde047; /* Yellow-300 Fosfor */
    border-color: #eab308;
    box-shadow: inset 0 0 0 1px #ca8a04;
  }

  .list-row:last-child {
    border-bottom: none;
  }

  .rank-circle {
    width: 28px;
    height: 28px;
    min-width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: 1rem;
    transition: all 0.2s;
  }
  
  .rank-1 { background: #111827; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .rank-2 { background: #374151; color: white; }
  .rank-3 { background: #4B5563; color: white; }
  .rank-other { background: #F3F4F6; color: #6B7280; }

  /* SCROLLBAR */
  .custom-scrollbar::-webkit-scrollbar { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
  .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #D1D5DB; }

  /* BADGE */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.6rem;
    background: #F3F4F6;
    color: #4B5563;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid #E5E7EB;
  }

  /* BUTTON */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--text-primary);
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .btn-primary:hover {
    background: white;
    color: var(--text-primary);
    border-color: var(--text-primary);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  /* INPUT SEARCH MINI */
  .mini-search-input {
    width: 100%;
    padding: 6px 10px 6px 30px;
    font-size: 0.8rem;
    border: 1px solid #E5E7EB;
    border-radius: 6px;
    background: white;
    transition: all 0.2s;
  }
  .mini-search-input:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.05);
  }
`;

// --- HELPER COMPONENTS & FUNCTIONS ---

const turkishToLower = (text) => {
  if (!text) return '';
  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
};

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(start + (target - start) * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{display.toLocaleString('tr-TR')}</>;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
        <p className="text-xs text-gray-400 uppercase font-medium mb-1">{label || payload[0].name}</p>
        <p className="text-lg font-semibold text-gray-900">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// --- MAIN COMPONENT ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [directTheses, setDirectTheses] = useState([]);
  const [indirectTheses, setIndirectTheses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Danışman Arama State'leri
  const [advisorSearch, setAdvisorSearch] = useState('');
  const [highlightedAdvisorIndex, setHighlightedAdvisorIndex] = useState(-1);

  useEffect(() => {
    Promise.all([
      import('./data/tez.json').then(m => m.default),
      import('./data/tez2.json').then(m => m.default)
    ])
    .then(([direct, indirect]) => {
      setDirectTheses(direct);
      setIndirectTheses(indirect);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const allTheses = [...directTheses, ...indirectTheses];
    if (!allTheses.length) return null;

    const uniqueUniversities = [...new Set(allTheses.map(t => t['Üniversite']))].filter(Boolean);
    const yearData = Object.entries(allTheses.reduce((acc, t) => {
      const y = t['Yıl']; if (y) acc[y] = (acc[y] || 0) + 1; return acc;
    }, {})).sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }));

    const categoryData = [
      { name: 'Doğrudan', value: directTheses.length, route: '/tez-analytics/filter/category/Doğrudan' },
      { name: 'Dolaylı', value: indirectTheses.length, route: '/tez-analytics/filter/category/Dolaylı' }
    ];

    const getList = (k) => Object.entries(allTheses.reduce((acc, t) => {
      const v = t[k]; if (v) acc[v] = (acc[v] || 0) + 1; return acc;
    }, {})).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

    // --- DANIŞMAN ANALİZİ ---
    const advisorMap = {};
    allTheses.forEach(t => {
      const advName = t['Danışman'];
      if(advName) {
        if(!advisorMap[advName]) {
          advisorMap[advName] = { name: advName, count: 0, thesisIds: [] };
        }
        advisorMap[advName].count += 1;
        advisorMap[advName].thesisIds.push(t['Tez No']);
      }
    });
    
    // En çok tez yönetenden aza doğru sıralama
    const sortedAdvisors = Object.values(advisorMap).sort((a, b) => b.count - a.count);

    return {
      total: allTheses.length,
      uniCount: uniqueUniversities.length,
      categoryData,
      yearData,
      universities: getList('Üniversite'),
      institutes: getList('Enstitü'),
      departments: getList('Bölüm'),
      advisors: sortedAdvisors 
    };
  }, [directTheses, indirectTheses]);

  // --- DANIŞMAN ARAMA VE SCROLL MANTIĞI ---
  useEffect(() => {
    if (!stats || !stats.advisors) return;

    if (advisorSearch.trim() === '') {
      setHighlightedAdvisorIndex(-1);
      return;
    }

    const lowerQuery = turkishToLower(advisorSearch);
    
    // Arama kriterine uyan İLK danışmanı bul (Listedeki sırasına göre)
    // Hem isme bakıyoruz hem de yönettiği tez numaralarına
    const index = stats.advisors.findIndex(adv => 
      turkishToLower(adv.name).includes(lowerQuery) || 
      adv.thesisIds.some(id => id.toString().includes(lowerQuery))
    );

    if (index !== -1) {
      setHighlightedAdvisorIndex(index);
      // DOM elementine erişip ortaya scroll etme
      const element = document.getElementById(`advisor-row-${index}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setHighlightedAdvisorIndex(-1);
    }
  }, [advisorSearch, stats]);

  const handleLinkClick = (e, path) => {
    if (e.ctrlKey || e.metaKey || e.button === 1) return;
    e.preventDefault();
    navigate(path);
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center">
        <style>{styles}</style>
        <div className="font-data text-sm text-gray-400 mb-4 animate-pulse">VERİLER ANALİZ EDİLİYOR</div>
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <style>{styles}</style>

      {/* HERO SECTION */}
      <section className="border-b-soft bg-white">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          <div className="col-span-1 md:col-span-6 border-r-soft p-8 md:p-16 flex flex-col justify-between">
            <div>
              <p className="font-label text-gray-400 mb-6">Veri Görselleştirme Raporu 2026</p>
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-yellow-600 reveal-up">
                Akademik <br/> <span className="text-gray-900">Hafıza</span>
              </h2>
            </div>
            <p className="font-data text-lg text-gray-500 max-w-md mt-8 reveal-up delay-100">
              Türkiye'deki İmam Hatip çalışmaları üzerine yapılan tezlerin nicel dağılımı ve akademik haritası.
            </p>
          </div>
          <div className="col-span-1 md:col-span-6 grid grid-rows-2">
            <div className="border-b-soft p-8 md:p-12 flex flex-col justify-center reveal-up delay-200 bg-[#F9FAFB]">
              <div className="flex items-center gap-3 mb-3">
                 <span className="font-label text-gray-500">Toplam Tez</span>
              </div>
              <span className="font-display text-7xl md:text-8xl text-gray-900 tracking-tighter">
                <AnimatedNumber value={stats.total} />
              </span>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center reveal-up delay-300">
               <div className="flex items-center gap-3 mb-3">
                 <span className="font-label text-gray-500">Farklı Üniversite</span>
              </div>
              <span className="font-display text-7xl md:text-8xl text-[#c7972f] tracking-tighter">
                <AnimatedNumber value={stats.uniCount} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS SECTION */}
      <main className="max-w-[1920px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b-soft">
          
          {/* Chart 1: Category */}
          <div className="lg:col-span-4 border-r-soft p-5 min-h-[400px] flex flex-col bg-white">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-yellow-900 text-2xl">İçerik Türü</h3>
             </div>
             <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={stats.categoryData}
                      cx="50%" cy="50%"
                      innerRadius={80} outerRadius={110}
                      paddingAngle={5}
                      dataKey="value" stroke="none"
                      cornerRadius={8}
                      onClick={(data) => navigate(data.route)}
                      className="cursor-pointer outline-none"
                    >
                      {stats.categoryData.map((entry, index) => (
                        <Cell key={index} fill={index === 0 ? '#111827' : '#c7972f'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="font-display text-3xl text-gray-900">{stats.total}</span>
                   <span className="font-label text-gray-400">Kayıt</span>
                </div>
             </div>
          </div>

          {/* Chart 2: Yıllar (Bar) */}
          <div className="lg:col-span-8 p-10 min-h-[400px] bg-white">
             <div className="flex justify-between items-end mb-10">
               <div>
                  <h3 className="font-display text-yellow-900 text-2xl">Yıllık Gelişim</h3>
                  <p className="text-sm text-gray-500 font-light mt-1">Tezlerin yıllara göre dağılım grafiği</p>
               </div>
             </div>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.yearData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontFamily: 'Lexend', fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#F9FAFB'}} content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#E5E7EB" 
                        radius={[4, 4, 0, 0]}
                        activeBar={{ fill: '#c7972f' }}
                        onClick={(data) => navigate(`/tez-analytics/filter/year/${data.year}`)}
                        className="cursor-pointer transition-all duration-300"
                      />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* LISTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 bg-white border-b-soft">
           {[
             { title: 'Üniversiteler', data: stats.universities, type: 'university', icon: Building2 },
             { title: 'Enstitüler', data: stats.institutes, type: 'institute', icon: School },
             { title: 'Bölümler', data: stats.departments, type: 'department', icon: BookOpen },
             { title: 'Danışmanlar', data: stats.advisors, type: 'advisor', icon: Users } 
           ].map((section, idx) => {
             const Icon = section.icon;
             const isAdvisorSection = section.type === 'advisor';
             
             return (
               <div key={idx} className={`flex flex-col h-[700px] ${idx !== 3 ? 'xl:border-r-soft' : ''} ${idx % 2 === 0 ? 'md:border-r-soft' : ''} border-b-soft xl:border-b-0`}>
                  
                  {/* Sticky Header */}
                  <div className="p-5 border-b-soft backdrop-blur-sm sticky top-0 z-10 flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="font-display text-lg flex items-center gap-2 text-yellow-900">
                             <Icon size={18} className="text-gray-400" />
                             {section.title}
                           </h4>
                           {!isAdvisorSection && <p className="font-label text-gray-400 mt-1">Sıralı Liste</p>}
                        </div>
                        <span className="bg-white border border-gray-200 text-xs font-semibold px-2 py-1 rounded-md text-gray-500">
                           Toplam {section.data.length > 1061 ? 0 : section.data.length}
                        </span>
                     </div>

                     {/* SADECE DANIŞMANLAR İÇİN ARAMA KUTUSU */}
                     {isAdvisorSection && (
                       <div className="relative w-full">
                          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Danışman veya Tez No..."
                            value={advisorSearch}
                            onChange={(e) => setAdvisorSearch(e.target.value)}
                            className="mini-search-input"
                          />
                          {advisorSearch && (
                            <button 
                              onClick={() => setAdvisorSearch('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          )}
                       </div>
                     )}
                  </div>

                  {/* Scrollable List Area */}
                  <div className="overflow-y-auto flex-1 custom-scrollbar bg-white">
                     {section.data.slice(0, 1061).map((item, i) => { // Slice'ı 100'e çıkardım ki arama daha geniş olsun
                       const linkPath = section.type === 'advisor' 
                          ? `/tez-analytics/all?advisor=${encodeURIComponent(item.name)}`
                          : `/tez-analytics/filter/${section.type}/${encodeURIComponent(item.name)}`;

                       const isTop3 = i < 3;
                       const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
                       const isHighlighted = isAdvisorSection && i === highlightedAdvisorIndex;

                       return (
                         <a
                           key={i}
                           id={isAdvisorSection ? `advisor-row-${i}` : undefined} // Scroll için ID ataması
                           href={linkPath}
                           onClick={(e) => handleLinkClick(e, linkPath)}
                           className={`list-row group ${isHighlighted ? 'highlight-active' : ''}`}
                         >
                            {/* Sıralama Dairesi */}
                            <div className={`rank-circle ${rankClass} ${isHighlighted ? 'bg-yellow-600 text-white' : ''}`}>
                               {i + 1}
                            </div>

                            {/* İçerik */}
                            <div className="flex-1 min-w-0 pr-3">
                               <div className="flex items-center justify-between mb-0.5">
                                  <span className={`text-sm truncate pr-2 group-hover:text-black transition-colors ${isTop3 || isHighlighted ? 'font-semibold text-gray-900' : 'font-normal text-gray-600'}`}>
                                    {item.name}
                                  </span>
                               </div>
                               
                               {/* Alt Bilgi */}
                               {isAdvisorSection ? (
                                  <div className={`text-[10px] flex items-center gap-1 truncate ${isHighlighted ? 'text-yellow-800 font-medium' : 'text-gray-400'}`}>
                                     <Activity size={10} />
                                     <span>Tezler: {item.thesisIds.slice(0, 2).join(', ')}{item.thesisIds.length > 2 ? ` ve ${item.thesisIds.length - 2} daha` : ''}</span>
                                  </div>
                               ) : (
                                  <div className="h-4"></div> 
                               )}
                            </div>

                            {/* Sayı Rozeti */}
                            <span className={`badge group-hover:bg-gray-200 group-hover:text-gray-800 transition-colors ${isTop3 ? 'bg-gray-100 text-gray-900 border-gray-300' : ''} ${isHighlighted ? 'bg-yellow-400 text-yellow-900 border-yellow-500' : ''}`}>
                               {item.count}
                            </span>
                            
                            {/* Gizli Ok İkonu */}
                            <ArrowRight size={14} className={`ml-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${isHighlighted ? 'text-yellow-800 opacity-100 translate-x-0' : 'text-gray-300'}`} />
                         </a>
                       );
                     })}
                  </div>
               </div>
             );
           })}
        </div>
      </main>

      {/* FOOTER CTA */}
      <footer className="border-b-soft py-24 bg-[#F9FAFB]">
         <div className="max-w-2xl mx-auto text-center px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight text-yellow-600">
               Tüm koleksiyonu <br/> <span className="text-gray-900">keşfedin.</span>
            </h2>
            <button
               onClick={() => navigate('/tez-analytics/all')}
               className="btn-primary"
            >
               Tüm Tezlere Git <ArrowRight size={18} />
            </button>
         </div>
      </footer>
      {/* deneme */}

    </div>
  );
};

export default Dashboard;