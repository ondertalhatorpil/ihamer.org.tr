import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Minus, Square, LayoutGrid, Database, Activity } from 'lucide-react';
import { 
  PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

// --- STYLES (LEXEND / MODERN CLEAN GRID) ---
const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

  :root {
    --bg-main: #F9FAFB;      /* Cool Gray 50 */
    --text-primary: #111827; /* Gray 900 */
    --text-secondary: #6B7280; /* Gray 500 */
    --border-color: #E5E7EB; /* Gray 200 */
    --accent-color: #111827; /* Primary Accent */
    --chart-primary: #111827;
    --chart-secondary: #E5E7EB;
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

  /* UTILITY CLASSES FOR FONT WEIGHTS (Mapping old logic to Lexend) */
  .font-display { font-weight: 600; letter-spacing: -0.02em; } /* Old Serif */
  .font-data { font-weight: 300; } /* Old Mono */
  .font-label { font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }

  /* GRID SYSTEM */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    border-bottom: 1px solid var(--border-color);
  }
  
  .border-r-soft { border-right: 1px solid var(--border-color); }
  .border-b-soft { border-bottom: 1px solid var(--border-color); }
  .border-t-soft { border-top: 1px solid var(--border-color); }

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

  /* MARQUEE */
  .marquee-wrap {
    overflow: hidden;
    white-space: nowrap;
    background: var(--text-primary);
    color: white;
    padding: 0.75rem 0;
  }
  .marquee-content {
    display: inline-block;
    animation: marquee 30s linear infinite;
    font-weight: 300;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* LIST INTERACTION */
  .list-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.2s ease;
    background: white;
  }

  .list-link:hover {
    background-color: #F3F4F6;
    padding-left: 1.75rem;
  }

  .list-link:hover .icon-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .icon-arrow {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.2s ease;
    color: var(--text-secondary);
  }

  /* BADGE */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.6rem;
    background: #F3F4F6;
    color: var(--text-secondary);
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
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

  /* SCROLLBAR */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

// --- HELPER COMPONENTS ---

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
      { name: 'Doğrudan', value: directTheses.length, route: '/tez-analytics/filter/category/Doğrudan Literatür' },
      { name: 'Dolaylı', value: indirectTheses.length, route: '/tez-analytics/filter/category/Dolaylı Literatür' }
    ];

    const doktora = allTheses.filter(t => t['Tez Türü'] === 'Doktora').length;
    const typeData = [
      { name: 'Doktora', value: doktora, route: '/tez-analytics/filter/type/Doktora' },
      { name: 'Yüksek Lisans', value: allTheses.length - doktora, route: '/tez-analytics/filter/type/Yüksek Lisans' }
    ];

    const getList = (k) => Object.entries(allTheses.reduce((acc, t) => {
      const v = t[k]; if (v) acc[v] = (acc[v] || 0) + 1; return acc;
    }, {})).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

    return {
      total: allTheses.length,
      uniCount: uniqueUniversities.length,
      categoryData,
      typeData,
      yearData,
      universities: getList('Üniversite'),
      institutes: getList('Enstitü'),
      departments: getList('Bölüm')
    };
  }, [directTheses, indirectTheses]);

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

      {/* MARQUEE BAR */}
      <div className="marquee-wrap">
        <div className="marquee-content">
          İMAM HATİP AKADEMİK VERİ ANALİZİ • 2026 RAPORU • İHAMER VERİTABANI • GÜNCEL İSTATİSTİKLER • AKADEMİK ÜRETİM ENDEKSİ • 
          İMAM HATİP AKADEMİK VERİ ANALİZİ • 2026 RAPORU • İHAMER VERİTABANI • GÜNCEL İSTATİSTİKLER • AKADEMİK ÜRETİM ENDEKSİ •
        </div>
      </div>

      {/* HEADER */}
      <header className="border-b-soft bg-white">
        <div className="max-w-[1920px] mx-auto grid grid-cols-12">
          <div className="col-span-6 md:col-span-4 border-r-soft p-6 md:p-8">
            <h1 className="font-display text-2xl tracking-tight">İhamer<span className="text-gray-400">.Analitik</span></h1>
          </div>
          <div className="col-span-6 md:col-span-8 p-6 md:p-8 flex items-center justify-end">
            <button 
              onClick={() => navigate('/')} 
              className="text-xs font-medium text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="border-b-soft bg-white">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          {/* Sol: Büyük Yazı */}
          <div className="col-span-1 md:col-span-6 border-r-soft p-8 md:p-16 flex flex-col justify-between">
            <div>
              <p className="font-label text-gray-400 mb-6">Veri Görselleştirme Raporu 2026</p>
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-gray-900 reveal-up">
                Akademik <br/> <span className="text-gray-300">Hafıza</span>
              </h2>
            </div>
            <p className="font-data text-lg text-gray-500 max-w-md mt-8 reveal-up delay-100">
              Türkiye'deki İmam Hatip çalışmaları üzerine yapılan tezlerin nicel dağılımı ve akademik haritası.
            </p>
          </div>
          
          {/* Sağ: Sayılar */}
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
              <span className="font-display text-7xl md:text-8xl text-gray-400 tracking-tighter">
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
          <div className="lg:col-span-4 border-r-soft p-10 min-h-[400px] flex flex-col bg-white">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl">İçerik Türü</h3>
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
                        <Cell key={index} fill={index === 0 ? '#111827' : '#E5E7EB'} />
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
             
             {/* Legend */}
             <div className="mt-6 flex justify-center gap-6">
                {stats.categoryData.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
                      <span className="text-sm font-medium text-gray-600">{item.name}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Chart 2: Yıllar (Bar) */}
          <div className="lg:col-span-8 p-10 min-h-[400px] bg-white">
             <div className="flex justify-between items-end mb-10">
               <div>
                  <h3 className="font-display text-2xl">Yıllık Gelişim</h3>
                  <p className="text-sm text-gray-500 font-light mt-1">Tezlerin yıllara göre dağılım grafiği</p>
               </div>
             </div>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.yearData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontFamily: 'Lexend', fontSize: 12, fill: '#9CA3AF' }}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip cursor={{fill: '#F9FAFB'}} content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#E5E7EB" 
                        radius={[4, 4, 0, 0]}
                        activeBar={{ fill: '#111827' }}
                        onClick={(data) => navigate(`/tez-analytics/filter/year/${data.year}`)}
                        className="cursor-pointer transition-all duration-300"
                      />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>

        {/* LISTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white">
           {[
             { title: 'Üniversiteler', data: stats.universities, type: 'university' },
             { title: 'Enstitüler', data: stats.institutes, type: 'institute' },
             { title: 'Bölümler', data: stats.departments, type: 'department' }
           ].map((section, idx) => (
             <div key={idx} className={`border-b-soft ${idx !== 2 ? 'md:border-r-soft' : ''}`}>
                <div className="p-6 border-b-soft bg-gray-50/50">
                   <h4 className="font-display text-lg">{section.title}</h4>
                   <p className="font-label text-gray-400 mt-1">En Yüksek Kayıtlar</p>
                </div>
                <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                   {section.data.map((item, i) => (
                     <a
                       key={i}
                       href={`/tez-analytics/filter/${section.type}/${encodeURIComponent(item.name)}`}
                       onClick={(e) => handleLinkClick(e, `/tez-analytics/filter/${section.type}/${encodeURIComponent(item.name)}`)}
                       className="list-link group"
                     >
                        <div className="flex items-center gap-4 min-w-0">
                           <span className={`
                              font-data text-xs w-6 h-6 flex items-center justify-center rounded-full 
                              ${i < 3 ? 'bg-gray-900 text-white font-medium' : 'bg-gray-100 text-gray-500'}
                           `}>
                              {i + 1}
                           </span>
                           <span className="text-sm text-gray-700 font-light truncate pr-4 group-hover:text-black group-hover:font-normal transition-all">
                              {item.name}
                           </span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="badge">{item.count}</span>
                           <ArrowUpRight size={16} className="icon-arrow" />
                        </div>
                     </a>
                   ))}
                </div>
             </div>
           ))}
        </div>
      </main>

      {/* FOOTER CTA */}
      <footer className="border-b-soft py-24 bg-[#F9FAFB]">
         <div className="max-w-2xl mx-auto text-center px-6">
            <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight text-gray-900">
               Tüm koleksiyonu <br/> <span className="text-gray-400">keşfedin.</span>
            </h2>
            <button
               onClick={() => navigate('/tez-analytics/all')}
               className="btn-primary"
            >
               Veritabanına Git <ArrowRight size={18} />
            </button>
            <div className="mt-16 font-label text-gray-400">
               © 2026 İHAMER Analitik Merkezi • İstanbul
            </div>
         </div>
      </footer>

    </div>
  );
};

export default Dashboard;