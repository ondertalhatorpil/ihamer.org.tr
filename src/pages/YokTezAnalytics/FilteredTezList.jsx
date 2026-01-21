import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Filter, ChevronDown, SlidersHorizontal, ExternalLink } from 'lucide-react';

// --- STYLES (SHARED DESIGN SYSTEM) ---
const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

  :root {
    --bg-main: #F9FAFB;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --border-color: #E5E7EB;
    --primary-color: #111827;
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

  /* INPUTS */
  .input-modern {
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--text-primary);
    border-radius: 12px;
    transition: all 0.2s ease;
  }
  .input-modern:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
  }

  /* DROPDOWNS - TAM BOY GÖRÜNÜM */
  .dropdown-modern {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    max-height: 400px; /* Listeler uzun */
    overflow-y: auto;
    z-index: 9999; /* En üstte */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .dropdown-item {
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: background 0.1s;
    border-bottom: 1px solid #F3F4F6;
  }
  .dropdown-item:hover { background: #F3F4F6; }

  /* FLOATING FILTER BUTTON */
  .floating-filter-btn {
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 56px;
    height: 56px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: scale(0);
    opacity: 0;
  }
  
  .floating-filter-btn.visible {
    transform: scale(1);
    opacity: 1;
  }

  .floating-filter-btn:hover {
    transform: scale(1.1);
    background: #000;
  }

  /* MODAL / OVERLAY SİSTEMİ */
  .filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    z-index: 2000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .filter-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .filter-modal {
    position: fixed;
    background: white;
    z-index: 2001;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  /* Masaüstü Modal */
  @media (min-width: 769px) {
    .filter-modal {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -40%) scale(0.95);
      width: 90%;
      max-width: 800px;
      max-height: 85vh;
      border-radius: 24px;
      opacity: 0;
      pointer-events: none;
    }
    .filter-overlay.open + .filter-modal {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
      pointer-events: all;
    }
  }

  /* Mobil Modal (Bottom Sheet) */
  @media (max-width: 768px) {
    .filter-modal {
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 24px 24px 0 0;
      max-height: 90vh;
      transform: translateY(100%);
    }
    .filter-overlay.open + .filter-modal {
      transform: translateY(0);
    }
  }

  /* BUTTONS */
  .btn-modern {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.25rem;
    background: white;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.85rem;
    border-radius: 10px;
    transition: all 0.2s;
    cursor: pointer;
    text-decoration: none;
  }
  .btn-modern:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: var(--text-secondary);
    transition: all 0.2s;
    background: #F3F4F6;
    text-decoration: none;
  }
  .btn-icon:hover { background: #E5E7EB; color: var(--text-primary); }

  /* YÖKTEZ GRADIENT BUTTON */
  .yoktez-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 13px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .yoktez-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.5);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  /* BADGES */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 6px;
    background: #F3F4F6;
    color: var(--text-secondary);
  }
  .badge-dark { background: var(--primary-color); color: white; }

  /* CARDS */
  .card-modern {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .card-modern:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
    border-color: #D1D5DB;
  }

  /* SCROLLBAR */
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }

  @media (max-width: 768px) {
    .card-modern { padding: 1.5rem; }
    .card-header-flex { flex-direction: column-reverse; gap: 1rem; }
    .card-action-top { align-self: flex-start; margin-bottom: 0.5rem; }
    /* Mobilde üstteki statik filtreyi gizle */
    .static-filter-bar { display: none; }
  }

  @media (min-width: 769px) {
    .card-header-flex { flex-direction: row; justify-content: space-between; align-items: flex-start; }
    .card-action-top { margin-top: 0.25rem; }
    .static-filter-bar { display: block; }
  }
`;

const turkishToLower = (text) => {
  if (!text) return '';
  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
};

// --- BİLEŞENLER (Dışarıda Tanımlı) ---

const FilterInput = ({ label, placeholder, value, onChange, onFocus, onToggle, isOpen, options, onSelect }) => (
  <div className="dropdown-container relative w-full">
    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className="input-modern pr-10"
      />
      <div 
        onClick={(e) => {
          e.preventDefault();
          onToggle();
        }}
        className="absolute right-0 top-0 h-full w-12 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-r-xl transition-colors"
      >
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
    </div>
    {isOpen && options.length > 0 && (
      <div className="dropdown-modern custom-scrollbar">
        {options.map((opt, i) => (
          <div 
            key={i}
            onClick={() => onSelect(opt)}
            className="dropdown-item"
          >
            {opt}
          </div>
        ))}
      </div>
    )}
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="input-modern appearance-none cursor-pointer pr-10"
      >
        <option value="">Tümü</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  </div>
);

const FilteredTezList = () => {
  const { filterType, filterValue } = useParams();
  const navigate = useNavigate();
  
  const [allTheses, setAllTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedThesis, setExpandedThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal & Floating Btn State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  
  // Filtreler için tek state
  const [filters, setFilters] = useState({
    year: '', university: '', institute: '', department: '', type: '', category: ''
  });

  const [searchDropdown, setSearchDropdown] = useState({
    year: '', university: '', institute: '', department: ''
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      // Mobilde her zaman göster, Masaüstünde 150px inince göster
      if (window.innerWidth < 768) {
        setShowFloatingBtn(true);
      } else {
        setShowFloatingBtn(window.scrollY > 150);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    Promise.all([
      import('./data/tez.json').then(m => m.default),
      import('./data/tez2.json').then(m => m.default)
    ])
      .then(([direct, indirect]) => {
        const enrichedDirect = direct.map(t => ({ ...t, category: 'Doğrudan' }));
        const enrichedIndirect = indirect.map(t => ({ ...t, category: 'Dolaylı' }));
        setAllTheses([...enrichedDirect, ...enrichedIndirect]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Veri hatası:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...allTheses];

    // 1. URL Filtreleme (Sayfa Açılışındaki Temel Filtre)
    if (filterType && filterValue) {
      const decodedValue = decodeURIComponent(filterValue);
      switch(filterType) {
        case 'university': result = result.filter(t => turkishToLower(t['Üniversite']) === turkishToLower(decodedValue)); break;
        case 'institute': result = result.filter(t => turkishToLower(t['Enstitü']) === turkishToLower(decodedValue)); break;
        case 'department': result = result.filter(t => turkishToLower(t['Bölüm']) === turkishToLower(decodedValue)); break;
        case 'year': result = result.filter(t => t['Yıl'] === decodedValue); break;
        case 'type': result = result.filter(t => t['Tez Türü'] === decodedValue); break;
        case 'category':
          if (decodedValue === 'Doğrudan Literatür') result = result.filter(t => t.category === 'Doğrudan');
          else if (decodedValue === 'Dolaylı Literatür') result = result.filter(t => t.category === 'Dolaylı');
          break;
      }
    }

    // 2. Arama
    if (searchTerm) {
      const searchLower = turkishToLower(searchTerm);
      result = result.filter(thesis => 
        turkishToLower(thesis['Tez Başlığı']).includes(searchLower) ||
        turkishToLower(thesis['Yazar']).includes(searchLower) ||
        turkishToLower(thesis['Danışman']).includes(searchLower) ||
        turkishToLower(thesis['Üniversite']).includes(searchLower) ||
        turkishToLower(thesis['Özet (Türkçe)']).includes(searchLower)
      );
    }

    // 3. Kullanıcının Eklediği Ek Filtreler (filters state)
    if (filters.year) result = result.filter(t => t['Yıl'] === filters.year);
    if (filters.university) result = result.filter(t => turkishToLower(t['Üniversite']) === turkishToLower(filters.university));
    if (filters.institute) result = result.filter(t => turkishToLower(t['Enstitü']) === turkishToLower(filters.institute));
    if (filters.department) result = result.filter(t => turkishToLower(t['Bölüm']) === turkishToLower(filters.department));
    if (filters.type) result = result.filter(t => t['Tez Türü'] === filters.type);
    if (filters.category) result = result.filter(t => t.category === filters.category);

    setFilteredTheses(result);
  }, [allTheses, filterType, filterValue, searchTerm, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };

  const uniqueYears = useMemo(() => [...new Set(allTheses.map(t => t['Yıl']))].filter(Boolean).sort().reverse(), [allTheses]);
  const uniqueUniversities = useMemo(() => [...new Set(allTheses.map(t => t['Üniversite']))].filter(Boolean).sort(), [allTheses]);
  const uniqueInstitutes = useMemo(() => [...new Set(allTheses.map(t => t['Enstitü']))].filter(Boolean).sort(), [allTheses]);
  const uniqueDepartments = useMemo(() => [...new Set(allTheses.map(t => t['Bölüm']))].filter(Boolean).sort(), [allTheses]);

  const filteredYears = uniqueYears.filter(year => year.toString().includes(searchDropdown.year));
  const filteredUniversities = uniqueUniversities.filter(u => turkishToLower(u).includes(turkishToLower(searchDropdown.university)));
  const filteredInstitutes = uniqueInstitutes.filter(i => turkishToLower(i).includes(turkishToLower(searchDropdown.institute)));
  const filteredDepartments = uniqueDepartments.filter(d => turkishToLower(d).includes(turkishToLower(searchDropdown.department)));

  const getFilterTitle = () => {
    if (!filterType || !filterValue) return 'Filtrelenmiş Tezler';
    const decoded = decodeURIComponent(filterValue);
    if (filterType === 'year') return `${decoded} Yılı Tezler`;
    return decoded;
  };

  const clearFilters = () => {
    setFilters({ year: '', university: '', institute: '', department: '', type: '', category: '' });
    setSearchTerm('');
    setSearchDropdown({ year: '', university: '', institute: '', department: '' });
    setActiveDropdown(null);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.year || filters.university || filters.institute || filters.department || filters.type || filters.category || searchTerm;
  }, [filters, searchTerm]);

  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <style>{styles}</style>

      {/* HEADER (Sticky Değil - İsteğe Göre) */}
      <header className="bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <button 
                onClick={() => navigate('/tez-analytics')} 
                className="text-sm font-medium text-gray-500 hover:text-black mb-2 flex items-center gap-1"
              >
                 <ArrowRight className="rotate-180 w-4 h-4" /> Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827]">
                {getFilterTitle()}
              </h1>
            </div>
            <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-black font-bold">{filteredTheses.length}</span> kayıt listelendi
            </div>
          </div>

          {/* STATİK FİLTRE BAR (Sadece Masaüstü - Sayfa başında görünür) */}
          <div className="static-filter-bar bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
             <div className="mb-4 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Başlık, yazar veya özet ara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium text-gray-700"
                />
             </div>

             <div className="grid grid-cols-5 gap-3">
                <FilterInput 
                  placeholder="Yıl Seç"
                  value={filters.year || searchDropdown.year}
                  onChange={(e) => {
                    setSearchDropdown({...searchDropdown, year: e.target.value});
                    if(activeDropdown !== 'static-year') toggleDropdown('static-year');
                  }}
                  isOpen={activeDropdown === 'static-year'}
                  onToggle={() => toggleDropdown('static-year')}
                  options={filteredYears}
                  onSelect={(val) => {
                    setFilters({...filters, year: val});
                    setSearchDropdown({...searchDropdown, year: ''});
                  }}
                />
                
                <FilterInput 
                  placeholder="Üniversite Seç"
                  value={filters.university || searchDropdown.university}
                  onChange={(e) => {
                    setSearchDropdown({...searchDropdown, university: e.target.value});
                    if(activeDropdown !== 'static-uni') toggleDropdown('static-uni');
                  }}
                  isOpen={activeDropdown === 'static-uni'}
                  onToggle={() => toggleDropdown('static-uni')}
                  options={filteredUniversities}
                  onSelect={(val) => {
                    setFilters({...filters, university: val});
                    setSearchDropdown({...searchDropdown, university: ''});
                  }}
                />

                <FilterInput 
                  placeholder="Enstitü Seç"
                  value={filters.institute || searchDropdown.institute}
                  onChange={(e) => {
                    setSearchDropdown({...searchDropdown, institute: e.target.value});
                    if(activeDropdown !== 'static-inst') toggleDropdown('static-inst');
                  }}
                  isOpen={activeDropdown === 'static-inst'}
                  onToggle={() => toggleDropdown('static-inst')}
                  options={filteredInstitutes}
                  onSelect={(val) => {
                    setFilters({...filters, institute: val});
                    setSearchDropdown({...searchDropdown, institute: ''});
                  }}
                />

                <FilterInput 
                  placeholder="Bölüm Seç"
                  value={filters.department || searchDropdown.department}
                  onChange={(e) => {
                    setSearchDropdown({...searchDropdown, department: e.target.value});
                    if(activeDropdown !== 'static-dept') toggleDropdown('static-dept');
                  }}
                  isOpen={activeDropdown === 'static-dept'}
                  onToggle={() => toggleDropdown('static-dept')}
                  options={filteredDepartments}
                  onSelect={(val) => {
                    setFilters({...filters, department: val});
                    setSearchDropdown({...searchDropdown, department: ''});
                  }}
                />

                <div className="relative dropdown-container top-2">
                   <select
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                      className="input-modern appearance-none cursor-pointer pr-10"
                   >
                      <option value="">Tüm Türler</option>
                      <option value="Yüksek Lisans">Yüksek Lisans</option>
                      <option value="Doktora">Doktora</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
             </div>
             
             {hasActiveFilters && (
               <div className="mt-4 flex justify-end">
                 <button onClick={clearFilters} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1">
                   <X size={16} /> Temizle
                 </button>
               </div>
             )}
          </div>

        </div>
      </header>

      {/* FLOATING ACTION BUTTON */}
      <button 
        className={`floating-filter-btn ${showFloatingBtn ? 'visible' : ''}`}
        onClick={() => setIsModalOpen(true)}
        title="Filtreleme ve Arama"
      >
        <SlidersHorizontal size={24} />
      </button>

      {/* MODAL / OVERLAY */}
      <div className={`filter-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)} />
      <div className={`filter-modal custom-scrollbar ${isModalOpen ? 'open' : ''}`}>
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h3 className="text-xl font-bold text-gray-900">Filtreleme & Arama</h3>
          <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
           {/* Arama */}
           <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2">ARAMA</label>
              <div className="mb-4 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Başlık, yazar veya özet ara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium text-gray-700"
                />
             </div>
           </div>

           {/* Filtreler */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FilterInput 
                placeholder="Yıl Seç"
                value={filters.year || searchDropdown.year}
                onChange={(e) => {
                  setSearchDropdown({...searchDropdown, year: e.target.value});
                  if(activeDropdown !== 'modal-year') toggleDropdown('modal-year');
                }}
                isOpen={activeDropdown === 'modal-year'}
                onToggle={() => toggleDropdown('modal-year')}
                options={filteredYears}
                onSelect={(val) => {
                  setFilters({...filters, year: val});
                  setSearchDropdown({...searchDropdown, year: ''});
                }}
              />

              <FilterInput 
                placeholder="Üniversite Seç"
                value={filters.university || searchDropdown.university}
                onChange={(e) => {
                  setSearchDropdown({...searchDropdown, university: e.target.value});
                  if(activeDropdown !== 'modal-uni') toggleDropdown('modal-uni');
                }}
                isOpen={activeDropdown === 'modal-uni'}
                onToggle={() => toggleDropdown('modal-uni')}
                options={filteredUniversities}
                onSelect={(val) => {
                  setFilters({...filters, university: val});
                  setSearchDropdown({...searchDropdown, university: ''});
                }}
              />

              <FilterInput 
                placeholder="Enstitü Seç"
                value={filters.institute || searchDropdown.institute}
                onChange={(e) => {
                  setSearchDropdown({...searchDropdown, institute: e.target.value});
                  if(activeDropdown !== 'modal-inst') toggleDropdown('modal-inst');
                }}
                isOpen={activeDropdown === 'modal-inst'}
                onToggle={() => toggleDropdown('modal-inst')}
                options={filteredInstitutes}
                onSelect={(val) => {
                  setFilters({...filters, institute: val});
                  setSearchDropdown({...searchDropdown, institute: ''});
                }}
              />

              <FilterInput 
                placeholder="Bölüm Seç"
                value={filters.department || searchDropdown.department}
                onChange={(e) => {
                  setSearchDropdown({...searchDropdown, department: e.target.value});
                  if(activeDropdown !== 'modal-dept') toggleDropdown('modal-dept');
                }}
                isOpen={activeDropdown === 'modal-dept'}
                onToggle={() => toggleDropdown('modal-dept')}
                options={filteredDepartments}
                onSelect={(val) => {
                  setFilters({...filters, department: val});
                  setSearchDropdown({...searchDropdown, department: ''});
                }}
              />
           </div>

           <div className="relative dropdown-container">
               <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="input-modern appearance-none cursor-pointer pr-10"
               >
                  <option value="">Tüm Türler</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

           {(hasActiveFilters || searchTerm) && (
              <button 
                onClick={clearFilters} 
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <X size={18} /> Filtreleri Temizle
              </button>
           )}
        </div>
      </div>

      {/* LİSTE */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {filteredTheses.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sonuç bulunamadı</h3>
            <p className="text-gray-500 mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            <button onClick={clearFilters} className="mt-6 text-yellow-600 font-medium hover:underline">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTheses.map((thesis, index) => (
              <div key={index} className="card-modern group">
                <div className="card-header-flex flex mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge badge-dark">#{thesis['Tez No']}</span>
                      <span className={`badge ${thesis.category === 'Doğrudan' ? 'bg-gray-200 text-gray-800' : 'bg-white border border-gray-200'}`}>
                        {thesis.category}
                      </span>
                      <span className="badge bg-yellow-50 text-yellow-700 border border-yellow-100">{thesis['Tez Türü']}</span>
                      <span className="badge bg-orange-50 text-orange-800 border border-orange-100">{thesis['Yıl']}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-snug group-hover:text-yellow-700 transition-colors">
                      {thesis['Tez Başlığı']}
                    </h2>
                  </div>
                  
                  <div className="card-action-top shrink-0">
                    {thesis['Tez Dosyası'] && thesis['Tez Dosyası'] !== 'İzinsiz' ? (
                      <a href={thesis['Tez Dosyası']} target="_blank" rel="noopener noreferrer"
                        className="yoktez-button"
                        title="YÖKTEZ'DE GÖRÜNTÜLE">
                         <span className="text-xs font-semibold">YÖKTEZ'DE GÖRÜNTÜLE</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 px-2 py-1 bg-gray-100 rounded">Kısıtlı</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Yazar</p>
                    <p className="font-medium text-gray-900">{thesis['Yazar']}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Danışman</p>
                    <p className="font-medium text-gray-900">{thesis['Danışman'] || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kurum</p>
                    <p className="font-medium text-gray-900 truncate">{thesis['Üniversite']}</p>
                    <p className="text-sm text-gray-500 truncate">{thesis['Enstitü']}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-400 font-light truncate max-w-[60%]">{thesis['Bölüm']}</div>

                  {thesis['Özet (Türkçe)'] ? (
                    <button onClick={() => setExpandedThesis(expandedThesis === index ? null : index)}
                      className="btn-modern py-2 px-4 gap-2 text-sm border-gray-200 hover:shadow-sm">
                      {expandedThesis === index ? <Minus size={16}/> : <Plus size={16}/>}
                      <span>{expandedThesis === index ? 'Özeti Gizle' : 'Tez Özeti'}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300 italic">Özet Yok</span>
                  )}
                </div>

                {expandedThesis === index && (
                  <div className="mt-8 bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-yellow-600 rounded-full"></span> Türkçe Özet
                      </h4>
                      <p className="text-gray-700 text-justify leading-relaxed font-light text-[0.95rem]">{thesis['Özet (Türkçe)']}</p>
                    </div>
                    {thesis['Özet (İngilizce)'] && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-1 h-4 bg-orange-500 rounded-full"></span> English Abstract
                        </h4>
                        <p className="text-gray-600 text-justify leading-relaxed font-light text-[0.95rem] italic">{thesis['Özet (İngilizce)']}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FilteredTezList;