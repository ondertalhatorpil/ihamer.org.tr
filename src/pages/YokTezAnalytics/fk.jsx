import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Filter, ChevronDown, SlidersHorizontal, ExternalLink } from 'lucide-react';

const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

  :root {
    --bg-main: #F8F9FA;
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

  .dropdown-modern {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 200;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  }
  .dropdown-item {
    padding: 1rem 1rem;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--text-primary);
    cursor: pointer;
    transition: background 0.1s;
    border-bottom: 1px solid #F9FAFB;
  }
  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:hover { background: #F3F4F6; }

  .floating-filter-btn {
    position: fixed;
    bottom: 32px;
    left: 24px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    cursor: pointer;
    z-index: 998;
    transition: all 0.3s ease;
  }
  .floating-filter-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 28px rgba(0,0,0,0.3);
  }
  .floating-filter-btn.active {
    background: #ae9242;
    position: fixed;
    top: 240px;
    right: 24px;
    width: 56px;
    height: 56px;
  }

  .desktop-filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 997;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .desktop-filter-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .desktop-filter-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 32px;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  }
  .desktop-filter-panel.open {
    transform: translateY(0);
  }
  .desktop-filter-panel .dropdown-container {
    position: relative;
    z-index: 100;
  }
  .desktop-filter-panel .dropdown-modern {
    position: absolute;
    max-height: 250px;
    z-index: 200;
  }

  .mobile-filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 997;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .mobile-filter-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  .mobile-filter-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-radius: 24px 24px 0 0;
    padding: 24px;
    padding-bottom: 80px;
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: hidden;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
  }
  .mobile-filter-panel.open {
    transform: translateY(0);
  }
  .mobile-filter-panel .dropdown-container {
    position: relative;
    z-index: 100;
  }
  .mobile-filter-panel .dropdown-modern {
    position: absolute;
    max-height: 200px;
    z-index: 200;
  }

  .mobile-close-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
  }
  .mobile-close-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 28px rgba(220, 38, 38, 0.5);
  }

  .yoktez-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
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

  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }

  @media (max-width: 768px) {
    .card-modern { padding: 1.5rem; }
    .card-header-flex { flex-direction: column-reverse; gap: 1rem; }
    .card-action-top { align-self: flex-start; margin-bottom: 0.5rem; }
    .desktop-filters { display: none; }
    .desktop-filter-panel { display: none; }
    .desktop-filter-overlay { display: none; }
    .mobile-filter-panel { display: block; }
    .mobile-filter-overlay { display: block; }
    .mobile-close-btn { display: flex; }
  }

  @media (min-width: 769px) {
    .card-header-flex { flex-direction: row; justify-content: space-between; align-items: flex-start; }
    .card-action-top { margin-top: 0.25rem; }
    .desktop-filters { display: grid; }
    .mobile-filter-panel { display: none !important; }
    .mobile-filter-overlay { display: none !important; }
    .mobile-close-btn { display: none !important; }
  }
`;

const turkishToLower = (text) => {
  if (!text) return '';
  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
};

const AllThesesPage = () => {
  const navigate = useNavigate();
  
  const [allTheses, setAllTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedThesis, setExpandedThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [filters, setFilters] = useState({
    year: '', university: '', institute: '', department: '', type: '', category: ''
  });

  const [searchDropdown, setSearchDropdown] = useState({
    year: '', university: '', institute: '', department: ''
  });

  useEffect(() => {
    Promise.all([
      import('./data/tez.json').then(m => m.default),
      import('./data/tez2.json').then(m => m.default)
    ])
      .then(([direct, indirect]) => {
        const enrichedDirect = direct.map(t => ({ ...t, category: 'Doğrudan' }));
        const enrichedIndirect = indirect.map(t => ({ ...t, category: 'Dolaylı' }));
        setAllTheses([...enrichedDirect, ...enrichedIndirect]);
        setFilteredTheses([...enrichedDirect, ...enrichedIndirect]);
        setLoading(false);
      })
      .catch(err => {
        console.error('JSON yükleme hatası:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...allTheses];

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

    if (filters.year) result = result.filter(t => t['Yıl'] === filters.year);
    if (filters.university) result = result.filter(t => turkishToLower(t['Üniversite']) === turkishToLower(filters.university));
    if (filters.institute) result = result.filter(t => turkishToLower(t['Enstitü']) === turkishToLower(filters.institute));
    if (filters.department) result = result.filter(t => turkishToLower(t['Bölüm']) === turkishToLower(filters.department));
    if (filters.type) result = result.filter(t => t['Tez Türü'] === filters.type);
    if (filters.category) result = result.filter(t => t.category === filters.category);

    setFilteredTheses(result);
  }, [searchTerm, filters, allTheses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniqueYears = useMemo(() => [...new Set(allTheses.map(t => t['Yıl']))].filter(Boolean).sort().reverse(), [allTheses]);
  const uniqueUniversities = useMemo(() => [...new Set(allTheses.map(t => t['Üniversite']))].filter(Boolean).sort(), [allTheses]);
  const uniqueInstitutes = useMemo(() => [...new Set(allTheses.map(t => t['Enstitü']))].filter(Boolean).sort(), [allTheses]);
  const uniqueDepartments = useMemo(() => [...new Set(allTheses.map(t => t['Bölüm']))].filter(Boolean).sort(), [allTheses]);

  const filteredYears = uniqueYears.filter(y => y.toString().includes(searchDropdown.year));
  const filteredUniversities = uniqueUniversities.filter(u => turkishToLower(u).includes(turkishToLower(searchDropdown.university)));
  const filteredInstitutes = uniqueInstitutes.filter(i => turkishToLower(i).includes(turkishToLower(searchDropdown.institute)));
  const filteredDepartments = uniqueDepartments.filter(d => turkishToLower(d).includes(turkishToLower(searchDropdown.department)));

  const clearFilters = () => {
    setFilters({ year: '', university: '', institute: '', department: '', type: '', category: '' });
    setSearchTerm('');
    setSearchDropdown({ year: '', university: '', institute: '', department: '' });
    setActiveDropdown(null);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.year || filters.university || filters.institute || filters.department || filters.type || filters.category || searchTerm;
  }, [filters, searchTerm]);

  const toggleDropdown = (key) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };

  if (loading) return null;

  const FilterInput = ({ label, placeholder, filterKey, options }) => (
    <div className="dropdown-container relative">
      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={filters[filterKey] || searchDropdown[filterKey] || ''}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchDropdown({...searchDropdown, [filterKey]: newValue});
            if(!newValue && filters[filterKey]) {
              setFilters({...filters, [filterKey]: ''});
            }
            if(activeDropdown !== filterKey && newValue) {
              toggleDropdown(filterKey);
            }
          }}
          onFocus={() => { 
            if(activeDropdown !== filterKey && (filters[filterKey] || searchDropdown[filterKey])) {
              toggleDropdown(filterKey); 
            }
          }}
          className="input-modern pr-10"
        />
        <div 
          onClick={() => toggleDropdown(filterKey)}
          className="absolute right-0 top-0 h-full w-12 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-r-xl transition-colors"
        >
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeDropdown === filterKey ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {activeDropdown === filterKey && options.length > 0 && (
        <div className="dropdown-modern custom-scrollbar">
          {options.map((opt, i) => (
            <div 
              key={i}
              onClick={() => {
                setFilters({...filters, [filterKey]: opt});
                setSearchDropdown({...searchDropdown, [filterKey]: ''});
                setActiveDropdown(null);
              }}
              className="dropdown-item"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const FilterSelect = ({ label, filterKey, options }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={filters[filterKey]}
          onChange={(e) => setFilters({...filters, [filterKey]: e.target.value})}
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

  return (
    <div className="min-h-screen pb-20">
      <style>{styles}</style>

      <header className="sticky top-0 z-40 bg-[#F8F9FA]/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <button onClick={() => navigate('/tez-analytics')} className="text-sm font-medium text-gray-500 hover:text-black mb-2 flex items-center gap-1">
                <ArrowRight className="rotate-180 w-4 h-4" /> Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827]">Tüm Tezler</h1>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500">TOPLAM</span>
              <span className="text-sm font-bold text-black">{allTheses.length}</span>
              <span className="w-px h-4 bg-gray-200"></span>
              <span className="text-xs text-gray-500">GÖSTERİLEN</span>
              <span className="text-sm font-bold text-black">{filteredTheses.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Başlık, yazar, danışman, üniversite veya özet ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent border-none outline-none font-medium text-gray-700"
              />
            </div>

            <div className="desktop-filters grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-100">
              <FilterInput label="Yıl" placeholder="Yıl seç" filterKey="year" options={filteredYears} />
              <FilterInput label="Üniversite" placeholder="Üniversite seç" filterKey="university" options={filteredUniversities} />
              <FilterInput label="Enstitü" placeholder="Enstitü seç" filterKey="institute" options={filteredInstitutes} />
              <FilterInput label="Bölüm" placeholder="Bölüm seç" filterKey="department" options={filteredDepartments} />
              <FilterSelect label="Tez Türü" filterKey="type" options={['Yüksek Lisans', 'Doktora']} />
              <FilterSelect label="Kategori" filterKey="category" options={['Doğrudan', 'Dolaylı']} />
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                  <X size={16} /> Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        className={`floating-filter-btn ${isFilterOpen ? 'active' : ''}`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {isFilterOpen ? <X size={24} /> : <SlidersHorizontal size={24} />}
      </button>

      <div className={`desktop-filter-overlay ${isFilterOpen ? 'open' : ''}`} onClick={() => setIsFilterOpen(false)} />
      <div className={`desktop-filter-panel custom-scrollbar ${isFilterOpen ? 'open' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Filtreleme Seçenekleri</h3>
            <button onClick={() => setIsFilterOpen(false)} className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={28} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <FilterInput label="Yıl" placeholder="Yıl seç" filterKey="year" options={filteredYears} />
            <FilterInput label="Üniversite" placeholder="Üniversite seç" filterKey="university" options={filteredUniversities} />
            <FilterInput label="Enstitü" placeholder="Enstitü seç" filterKey="institute" options={filteredInstitutes} />
            <FilterInput label="Bölüm" placeholder="Bölüm seç" filterKey="department" options={filteredDepartments} />
            <FilterSelect label="Tez Türü" filterKey="type" options={['Yüksek Lisans', 'Doktora']} />
            <FilterSelect label="Kategori" filterKey="category" options={['Doğrudan', 'Dolaylı']} />
          </div>
          
          {hasActiveFilters && (
            <div className="mt-8 flex justify-center">
              <button onClick={clearFilters} className="bg-red-50 text-red-600 px-8 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                <X size={18} /> Tüm Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`mobile-filter-overlay ${isFilterOpen ? 'open' : ''}`} onClick={() => setIsFilterOpen(false)} />
      <div className={`mobile-filter-panel custom-scrollbar ${isFilterOpen ? 'open' : ''}`}>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-1">Filtreleme Seçenekleri</h3>
          <p className="text-sm text-gray-500">Filtreleri seçin ve kapat butonuna basın</p>
        </div>

        <div className="space-y-6">
          <FilterInput label="Yıl" placeholder="Yıl seç" filterKey="year" options={filteredYears} />
          <FilterInput label="Üniversite" placeholder="Üniversite seç" filterKey="university" options={filteredUniversities} />
          <FilterInput label="Enstitü" placeholder="Enstitü seç" filterKey="institute" options={filteredInstitutes} />
          <FilterInput label="Bölüm" placeholder="Bölüm seç" filterKey="department" options={filteredDepartments} />
          <FilterSelect label="Tez Türü" filterKey="type" options={['Yüksek Lisans', 'Doktora']} />
          <FilterSelect label="Kategori" filterKey="category" options={['Doğrudan', 'Dolaylı']} />
          
          {hasActiveFilters && (
            <button onClick={clearFilters} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
              <X size={16} /> Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      <button 
        className="mobile-close-btn"
        onClick={() => setIsFilterOpen(false)}
        style={{ display: isFilterOpen ? 'flex' : 'none' }}
      >
        <X size={28} />
      </button>

      <main className="max-w-7xl mx-auto px-6 py-8">
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
                        <span>YÖKTEZ'DE GÖRÜNTÜLE</span>
                        <ExternalLink size={16} />
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

export default AllThesesPage;








<FilterSelect 
label="Kategori" 
value={filters.category}
onChange={(e) => setFilters({...filters, category: e.target.value})}
options={['Doğrudan', 'Dolaylı']} 
/>