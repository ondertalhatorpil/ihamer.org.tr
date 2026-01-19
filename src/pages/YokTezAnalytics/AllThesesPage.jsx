import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';

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

  /* INPUTS & DROPDOWNS */
  .input-modern {
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
    color: var(--text-primary);
    border-radius: 10px;
    transition: all 0.2s;
  }
  .input-modern:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
  }

  .dropdown-modern {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    max-height: 240px;
    overflow-y: auto;
    z-index: 50;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-item {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: var(--text-primary);
    cursor: pointer;
    border-bottom: 1px solid #F3F4F6;
  }
  .dropdown-item:hover { background: #F9FAFB; }

  /* BUTTONS */
  .btn-modern {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    background: white;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: 10px;
    transition: all 0.2s;
    cursor: pointer;
    text-decoration: none; /* Link alt çizgisini kaldır */
  }
  .btn-modern:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  .btn-filter-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    color: var(--text-primary);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1rem;
  }
  .btn-filter-toggle:hover, .btn-filter-toggle.active {
    background: #F3F4F6;
    border-color: #D1D5DB;
  }

  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: var(--text-secondary);
    background: #F3F4F6;
    transition: all 0.2s;
  }
  .btn-icon:hover { background: #E5E7EB; color: var(--text-primary); }

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
    box-shadow: 0 12px 30px -10px rgba(0,0,0,0.06);
    border-color: #D1D5DB;
  }

  /* BADGES */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 6px;
    background: #F3F4F6;
    color: var(--text-secondary);
  }

  /* SCROLLBAR */
  .custom-scrollbar::-webkit-scrollbar { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }

  /* RESPONSIVE FILTER ANIMATION */
  .filter-container {
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, margin 0.4s ease;
  }

  /* Mobile: Hidden by default */
  @media (max-width: 768px) {
    .filter-container {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
    }
    .filter-container.open {
      max-height: 800px; /* Yeterince büyük bir değer */
      opacity: 1;
      margin-top: 1rem;
    }
    .desktop-only { display: none; }
    .mobile-only { display: flex; }
  }

  /* Desktop: Always visible */
  @media (min-width: 769px) {
    .filter-container {
      max-height: none !important;
      opacity: 1 !important;
      overflow: visible;
      margin-top: 0;
    }
    .desktop-only { display: block; }
    .mobile-only { display: none; }
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false); // Mobil filtre durumu

  const [filters, setFilters] = useState({
    year: '',
    university: '',
    institute: '',
    department: '',
    type: ''
  });

  const [showDropdown, setShowDropdown] = useState({
    year: false,
    university: false,
    institute: false,
    department: false,
    type: false
  });

  const [searchDropdown, setSearchDropdown] = useState({
    year: '',
    university: '',
    institute: '',
    department: '',
    type: ''
  });

  useEffect(() => {
    Promise.all([
      import('./data/tez.json').then(m => m.default),
      import('./data/tez2.json').then(m => m.default)
    ])
      .then(([direct, indirect]) => {
        const enrichedDirect = direct.map(t => ({ ...t, category: 'Doğrudan' }));
        const enrichedIndirect = indirect.map(t => ({ ...t, category: 'Dolaylı' }));
        const combined = [...enrichedDirect, ...enrichedIndirect];
        setAllTheses(combined);
        setFilteredTheses(combined);
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

    setFilteredTheses(result);
  }, [searchTerm, filters, allTheses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown({ university: false, institute: false, department: false, year: false, type: false });
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
    setFilters({ year: '', university: '', institute: '', department: '', type: '' });
    setSearchTerm('');
    setSearchDropdown({ year: '', university: '', institute: '', department: '', type: '' });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.year || filters.university || filters.institute || filters.department || filters.type;
  }, [filters]);

  if (loading) return null;

  const FilterInput = ({ placeholder, value, onChange, onFocus, show, options, onSelect }) => (
    <div className="relative dropdown-container">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          className="input-modern pr-8"
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {show && options.length > 0 && (
        <div className="dropdown-modern custom-scrollbar">
          {options.map((opt, i) => (
            <div key={i} onClick={() => onSelect(opt)} className="dropdown-item">
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <style>{styles}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#F9FAFB]/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <button
                onClick={() => navigate('/tez-analytics')}
                className="text-xs font-medium text-gray-500 hover:text-black mb-2 flex items-center gap-1"
              >
                ← DASHBOARD
              </button>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111827]">
                Tüm Tezler
              </h1>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500">TOPLAM</span>
              <span className="text-sm font-bold text-black">{allTheses.length}</span>
              <span className="w-px h-4 bg-gray-200"></span>
              <span className="text-xs text-gray-500">GÖSTERİLEN</span>
              <span className="text-sm font-bold text-black">{filteredTheses.length}</span>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            {/* Main Search (Her Zaman Görünür) */}
            <div className="mb-4 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tez başlığı, yazar, danışman veya özet içinde arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 rounded-xl outline-none transition-all font-medium text-gray-800"
              />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              className={`btn-filter-toggle mobile-only ${isMobileFiltersOpen ? 'active' : ''}`}
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <SlidersHorizontal size={18} />
              {isMobileFiltersOpen ? 'Filtreleri Gizle' : 'Filtreleme Seçenekleri'}
              {hasActiveFilters && !isMobileFiltersOpen && (
                <span className="ml-auto bg-blue-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Aktif</span>
              )}
            </button>

            {/* Filters Grid (Mobil'de animasyonlu açılır) */}
            <div className={`filter-container ${isMobileFiltersOpen ? 'open' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                <FilterInput
                  placeholder="Yıl"
                  value={filters.year || searchDropdown.year}
                  onChange={(e) => {
                    setSearchDropdown({ ...searchDropdown, year: e.target.value });
                    setShowDropdown({ ...showDropdown, year: true });
                  }}
                  onFocus={() => setShowDropdown({ ...showDropdown, year: true })}
                  show={showDropdown.year}
                  options={filteredYears}
                  onSelect={(val) => {
                    setFilters({ ...filters, year: val });
                    setShowDropdown({ ...showDropdown, year: false });
                  }}
                />

                <FilterInput
                  placeholder="Üniversite"
                  value={filters.university || searchDropdown.university}
                  onChange={(e) => {
                    setSearchDropdown({ ...searchDropdown, university: e.target.value });
                    setShowDropdown({ ...showDropdown, university: true });
                  }}
                  onFocus={() => setShowDropdown({ ...showDropdown, university: true })}
                  show={showDropdown.university}
                  options={filteredUniversities}
                  onSelect={(val) => {
                    setFilters({ ...filters, university: val });
                    setShowDropdown({ ...showDropdown, university: false });
                  }}
                />

                <FilterInput
                  placeholder="Enstitü"
                  value={filters.institute || searchDropdown.institute}
                  onChange={(e) => {
                    setSearchDropdown({ ...searchDropdown, institute: e.target.value });
                    setShowDropdown({ ...showDropdown, institute: true });
                  }}
                  onFocus={() => setShowDropdown({ ...showDropdown, institute: true })}
                  show={showDropdown.institute}
                  options={filteredInstitutes}
                  onSelect={(val) => {
                    setFilters({ ...filters, institute: val });
                    setShowDropdown({ ...showDropdown, institute: false });
                  }}
                />

                <FilterInput
                  placeholder="Bölüm"
                  value={filters.department || searchDropdown.department}
                  onChange={(e) => {
                    setSearchDropdown({ ...searchDropdown, department: e.target.value });
                    setShowDropdown({ ...showDropdown, department: true });
                  }}
                  onFocus={() => setShowDropdown({ ...showDropdown, department: true })}
                  show={showDropdown.department}
                  options={filteredDepartments}
                  onSelect={(val) => {
                    setFilters({ ...filters, department: val });
                    setShowDropdown({ ...showDropdown, department: false });
                  }}
                />

                {/* Type Select */}
                <div className="relative">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="input-modern appearance-none cursor-pointer"
                  >
                    <option value="">Tüm Türler</option>
                    <option value="Yüksek Lisans">Yüksek Lisans</option>
                    <option value="Doktora">Doktora</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Clear Button */}
              {(filters.year || filters.university || filters.institute || filters.department || filters.type || searchTerm) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    <X size={16} /> Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* THESIS LIST */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredTheses.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sonuç bulunamadı</h3>
            <p className="text-gray-500 mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTheses.map((thesis, index) => (
              <div
                key={index}
                className="card-modern group"
              >
                {/* Header: Badges & Title */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-gray-900 text-white">#{thesis['Tez No']}</span>
                      <span className={`badge ${thesis.category === 'Doğrudan' ? 'bg-gray-200 text-gray-800' : 'bg-white border border-gray-200'}`}>
                        {thesis.category}
                      </span>
                      <span className="badge bg-blue-50 text-green-700 border border-blue-100">{thesis['Tez Türü']}</span>
                      <span className="badge bg-orange-50 text-orange-800 border border-orange-100">{thesis['Yıl']}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-snug group-hover:text-yellow-800 transition-colors">
                      {thesis['Tez Başlığı']}
                    </h2>
                  </div>
                  {/* Abstract Toggle */}
                  {thesis['Özet (Türkçe)'] && (
                    <button
                      onClick={() => setExpandedThesis(expandedThesis === index ? null : index)}
                      className="btn-icon shrink-0 mt-1"
                      title={expandedThesis === index ? "Özeti Kapat" : "Özeti Göster"}
                    >
                      {expandedThesis === index ? <Minus size={20} /> : <Plus size={20} />}
                    </button>
                  )}
                </div>

                {/* Info Grid */}
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
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Üniversite</p>
                    <p className="font-medium text-gray-900">{thesis['Üniversite']}</p>
                    <p className="text-sm text-gray-500 truncate">{thesis['Enstitü']}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600 font-light truncate max-w-[60%]">
                    {thesis['Bölüm']}
                  </div>
                  {thesis['Tez Dosyası'] && thesis['Tez Dosyası'] !== 'İzinsiz' ? (
                    <a
                      href={thesis['Tez Dosyası']}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="btn-modern py-2 text-sm gap-2 hover:translate-x-1 transition-transform"
                    >
                      YÖKTEZ Kaydı <ArrowRight size={16} />
                    </a>

                  ) : (
                    <span className="text-xs font-medium text-gray-400 px-3 py-2 bg-gray-50 rounded-lg">
                      Erişim Kısıtlı
                    </span>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedThesis === index && (
                  <div className="mt-8 bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100 animate-fade">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-yellow-800 rounded-full"></span> Türkçe Özet
                      </h4>
                      <p className="text-gray-700 leading-relaxed font-light text-[0.95rem]">
                        {thesis['Özet (Türkçe)']}
                      </p>
                    </div>
                    {thesis['Özet (İngilizce)'] && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-1 h-4 bg-yellow-500 rounded-full"></span> English Abstract
                        </h4>
                        <p className="text-gray-600 leading-relaxed font-light text-[0.95rem] italic">
                          {thesis['Özet (İngilizce)']}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 mt-12 py-12 text-center text-gray-400 text-sm font-light">
        © 2026 İHAMER - İmam Hatip Araştırmaları Merkezi
      </footer>
    </div>
  );
};

export default AllThesesPage;