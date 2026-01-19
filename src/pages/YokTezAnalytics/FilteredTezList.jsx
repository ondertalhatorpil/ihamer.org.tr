import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Filter } from 'lucide-react';

// --- STYLES (LEXEND FONT & MODERN CLEAN LOOK) ---
const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");

  :root {
    --bg-main: #F8F9FA;      /* Çok hafif gri, göz yormayan zemin */
    --text-primary: #111827; /* Tam siyah değil, yumuşak koyu gri */
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

  /* INPUT STYLES - Lexend'e uygun yuvarlatılmış köşeler */
  .input-modern {
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--text-primary);
    border-radius: 12px;
    transition: all 0.2s ease;
  }
  .input-modern:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px rgba(17, 24, 39, 0.05);
  }
  .input-modern::placeholder {
    color: #9CA3AF;
    font-weight: 300;
  }

  /* DROPDOWN MENU */
  .dropdown-modern {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    max-height: 280px;
    overflow-y: auto;
    z-index: 50;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .dropdown-item {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--text-primary);
    cursor: pointer;
    transition: background 0.1s;
  }
  .dropdown-item:hover {
    background: #F3F4F6;
  }

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
  }
  .btn-icon:hover {
    background: #E5E7EB;
    color: var(--text-primary);
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
  .badge-dark {
    background: var(--primary-color);
    color: white;
  }

  /* CARD */
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
`;

const turkishToLower = (text) => {
  if (!text) return '';
  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
};

const FilteredTezList = () => {
  const { filterType, filterValue } = useParams();
  const navigate = useNavigate();
  const [allTheses, setAllTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedThesis, setExpandedThesis] = useState(null);
  const [loading, setLoading] = useState(true);

  const [additionalFilters, setAdditionalFilters] = useState({
    year: '', university: '', institute: '', department: '', type: ''
  });

  const [showDropdown, setShowDropdown] = useState({
    year: false, university: false, institute: false, department: false, type: false
  });

  const [searchDropdown, setSearchDropdown] = useState({
    year: '', university: '', institute: '', department: '', type: ''
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
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...allTheses];

    if (filterType && filterValue) {
      const decodedValue = decodeURIComponent(filterValue);
      switch (filterType) {
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

    if (additionalFilters.year) result = result.filter(t => t['Yıl'] === additionalFilters.year);
    if (additionalFilters.university) result = result.filter(t => turkishToLower(t['Üniversite']) === turkishToLower(additionalFilters.university));
    if (additionalFilters.institute) result = result.filter(t => turkishToLower(t['Enstitü']) === turkishToLower(additionalFilters.institute));
    if (additionalFilters.department) result = result.filter(t => turkishToLower(t['Bölüm']) === turkishToLower(additionalFilters.department));
    if (additionalFilters.type) result = result.filter(t => t['Tez Türü'] === additionalFilters.type);

    setFilteredTheses(result);
  }, [allTheses, filterType, filterValue, searchTerm, additionalFilters]);

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
  const uniqueDepartments = useMemo(() => [...new Set(allTheses.map(t => t['Bölüm']))].filter(Boolean).sort(), [allTheses]);

  const filteredYears = uniqueYears.filter(year => year.toString().includes(searchDropdown.year));
  const filteredUniversities = uniqueUniversities.filter(uni => turkishToLower(uni).includes(turkishToLower(searchDropdown.university)));
  const filteredDepartments = uniqueDepartments.filter(dept => turkishToLower(dept).includes(turkishToLower(searchDropdown.department)));

  const getFilterTitle = () => {
    if (!filterType || !filterValue) return 'Tüm Koleksiyon';
    const decoded = decodeURIComponent(filterValue);
    if (filterType === 'year') return `${decoded} Yılı Tezler`;
    return decoded;
  };

  const clearFilters = () => {
    setAdditionalFilters({ year: '', university: '', institute: '', department: '', type: '' });
    setSearchTerm('');
    setSearchDropdown({ year: '', university: '', institute: '', department: '', type: '' });
  };

  if (loading) return null;

  const FilterInput = ({ placeholder, value, onChange, onFocus, show, options, onSelect }) => (
    <div className="relative dropdown-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className="input-modern"
      />
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
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
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

          {/* FILTER BAR */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Başlık, yazar veya özet ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent border-none outline-none font-medium text-gray-700"
                />
              </div>
              <div className="md:col-span-8 flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <FilterInput
                    placeholder="Yıl"
                    value={additionalFilters.year || searchDropdown.year}
                    onChange={(e) => {
                      setSearchDropdown({ ...searchDropdown, year: e.target.value });
                      setShowDropdown({ ...showDropdown, year: true });
                    }}
                    onFocus={() => setShowDropdown({ ...showDropdown, year: true })}
                    show={showDropdown.year}
                    options={filteredYears}
                    onSelect={(val) => {
                      setAdditionalFilters({ ...additionalFilters, year: val });
                      setShowDropdown({ ...showDropdown, year: false });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <FilterInput
                    placeholder="Üniversite"
                    value={additionalFilters.university || searchDropdown.university}
                    onChange={(e) => {
                      setSearchDropdown({ ...searchDropdown, university: e.target.value });
                      setShowDropdown({ ...showDropdown, university: true });
                    }}
                    onFocus={() => setShowDropdown({ ...showDropdown, university: true })}
                    show={showDropdown.university}
                    options={filteredUniversities}
                    onSelect={(val) => {
                      setAdditionalFilters({ ...additionalFilters, university: val });
                      setShowDropdown({ ...showDropdown, university: false });
                    }}
                  />
                </div>
                {(additionalFilters.year || additionalFilters.university || searchTerm) && (
                  <button onClick={clearFilters} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-medium text-sm transition-colors">
                    Temizle
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* LIST */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {filteredTheses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Filter className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Sonuç bulunamadı</h3>
            <p className="text-gray-500 mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
            <button onClick={clearFilters} className="mt-6 text-yellow-800 font-medium hover:underline">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTheses.map((thesis, index) => (
              <div
                key={index}
                className="card-modern group"
              >
                {/* Header: Title & Meta */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge badge-dark">Tez No: {thesis['Tez No']}</span>
                      <span className={`badge ${thesis.category === 'Doğrudan' ? 'bg-gray-200 text-gray-800' : 'bg-white border border-gray-200'}`}>
                        {thesis.category}
                      </span>
                      <span className="badge bg-blue-50 text-blue-700">{thesis['Tez Türü']}</span>
                      <span className="badge bg-orange-50 text-orange-800">{thesis['Yıl']}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-yellow-800 transition-colors">
                      {thesis['Tez Başlığı']}
                    </h2>
                  </div>

                  {/* Expand Button (Mobile optimized location) */}
                  {thesis['Özet (Türkçe)'] && (
                    <button
                      onClick={() => setExpandedThesis(expandedThesis === index ? null : index)}
                      className="btn-icon bg-gray-50 shrink-0 self-start mt-1"
                      title={expandedThesis === index ? "Kapat" : "Detay"}
                    >
                      {expandedThesis === index ? <Minus size={20} /> : <Plus size={20} />}
                    </button>
                  )}
                </div>

                {/* Metadata Grid */}
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

                {/* Footer Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-400 font-light">
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
                    <span className="text-xs bg-gray-100 text-gray-400 px-3 py-2 rounded-lg font-medium">
                      Erişim Kısıtlı
                    </span>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedThesis === index && (
                  <div className="mt-8 bg-gray-50 rounded-xl p-6 md:p-8 animate-fade-in border border-gray-100">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-yellow-800 rounded-full"></span>
                        Türkçe Özet
                      </h4>
                      <p className="text-gray-700 leading-relaxed font-light text-[0.95rem]">
                        {thesis['Özet (Türkçe)']}
                      </p>
                    </div>

                    {thesis['Özet (İngilizce)'] && (
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                          English Abstract
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

      <footer className="py-12 text-center text-gray-400 text-sm font-light">
        © 2026 İHAMER - İmam Hatip Araştırmaları Merkezi
      </footer>
    </div>
  );
};

export default FilteredTezList;