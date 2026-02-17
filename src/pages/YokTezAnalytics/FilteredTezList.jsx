import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Plus, Minus, ArrowRight, Filter, ChevronDown, SlidersHorizontal, ExternalLink, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

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
    overflow-x: hidden;
    margin: 0;
    padding: 0;
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

  /* DROPDOWNS */
  .dropdown-container {
    position: relative;
    width: 100%;
  }

  .dropdown-modern {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 9999;
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
    bottom: 24px;
    left: 24px;
    width: 56px;
    height: 56px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scale(0) translateY(20px);
    opacity: 0;
  }
  
  .floating-filter-btn.visible {
    transform: scale(1) translateY(0);
    opacity: 1;
  }

  .floating-filter-btn:hover {
    transform: scale(1.05);
    background: black;
  }

  /* EXCEL EXPORT BUTTON */
  .excel-export-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    cursor: pointer;
    transition: all 0.2s;
  }
  .excel-export-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }
  .excel-export-btn:active {
    transform: translateY(0);
  }

  /* MODAL / OVERLAY SİSTEMİ */
  .filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(3px);
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
    display: flex;
    flex-direction: column;
    box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

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

  @media (max-width: 768px) {
    .filter-modal {
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 90vh;
      border-radius: 24px 24px 0 0;
      transform: translateY(100%);
    }
    .filter-overlay.open + .filter-modal {
      transform: translateY(0);
    }
    .filter-grid-mobile {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 3rem;
    }
    .excel-export-btn {
      width: 100%;
      justify-content: center;
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

  /* YÖKTEZ GRADIENT BUTTON */
  .yoktez-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #ae9242 0%, #c7972f 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.8rem;
    text-decoration: none;
    box-shadow: 0 4px 10px rgba(251, 191, 36, 0.3);
    transition: all 0.2s;
  }
  .yoktez-button:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #ae9246 0%, #c7976f 100%);
  }

  /* BADGES */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.6rem;
    font-size: 0.7rem;
    font-weight: 600;
    border-radius: 6px;
    background: #F3F4F6;
    color: var(--text-secondary);
    white-space: nowrap;
  }
  .badge-dark { background: var(--primary-color); color: white; }

  /* CARDS */
  .card-modern {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
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
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

  @media (max-width: 768px) {
    .card-modern { 
      padding: 1.25rem;
      border-radius: 12px;
    }
    .card-header-flex { 
      flex-direction: column-reverse;
      gap: 0.75rem; 
    }
    .card-action-top { 
      align-self: flex-start; 
      margin-bottom: 0.25rem; 
      width: 100%;
    }
    .yoktez-button {
      width: 100%;
      justify-content: center;
    }
    .static-filter-bar { display: none; }
    .card-grid-mobile {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  @media (min-width: 769px) {
    .card-header-flex { flex-direction: row; justify-content: space-between; align-items: flex-start; }
    .card-action-top { margin-top: 0.25rem; }
    .static-filter-bar { display: block; }
    .card-grid-mobile {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

// --- YARDIMCI FONKSİYONLAR ---

const turkishToLower = (text) => {
  if (!text) return '';
  return text.replace(/İ/g, 'i').replace(/I/g, 'ı').replace(/Ş/g, 'ş')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç').toLowerCase();
};

const HighlightedText = ({ text, highlight }) => {
  if (!text) return null;
  if (!highlight || highlight.trim() === '') return <>{text}</>;

  const lowerText = turkishToLower(text);
  const lowerHighlight = turkishToLower(highlight);

  if (!lowerText.includes(lowerHighlight)) return <>{text}</>;

  const elements = [];
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerHighlight, lastIndex);

  while (index !== -1) {
    if (index > lastIndex) {
      elements.push(text.substring(lastIndex, index));
    }
    elements.push(
      <span key={`${index}-${lastIndex}`} className="bg-yellow-300 text-gray-900 rounded-[2px] px-0.5 box-decoration-clone">
        {text.substring(index, index + lowerHighlight.length)}
      </span>
    );
    lastIndex = index + lowerHighlight.length;
    index = lowerText.indexOf(lowerHighlight, lastIndex);
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return <>{elements}</>;
};

// --- FİLTRE BİLEŞENLERİ ---

const FilterInput = ({ label, placeholder, value, onChange, onFocus, onToggle, isOpen, options, onSelect }) => (
  <div className="dropdown-container w-full">
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
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
        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-r-xl transition-colors"
      >
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
  <div className="w-full">
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="input-modern appearance-none cursor-pointer pr-10"
      >
        <option value="">Seçiniz</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center pointer-events-none">
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

  const [filters, setFilters] = useState({
    year: '', university: '', institute: '', department: '', type: '', category: ''
  });

  const [searchDropdown, setSearchDropdown] = useState({
    year: '', university: '', institute: '', department: ''
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

    // 1. URL Filtreleme
    if (filterType && filterValue) {
      const decodedValue = decodeURIComponent(filterValue);
      switch (filterType) {
        case 'university': result = result.filter(t => turkishToLower(t['Üniversite']) === turkishToLower(decodedValue)); break;
        case 'institute': result = result.filter(t => turkishToLower(t['Enstitü']) === turkishToLower(decodedValue)); break;
        case 'department': result = result.filter(t => turkishToLower(t['Bölüm']) === turkishToLower(decodedValue)); break;
        case 'year': result = result.filter(t => t['Yıl'] === decodedValue); break;
        case 'type': result = result.filter(t => t['Tez Türü'] === decodedValue); break;
        case 'category':
          if (decodedValue.includes('Doğrudan')) result = result.filter(t => t.category === 'Doğrudan');
          else if (decodedValue.includes('Dolaylı')) result = result.filter(t => t.category === 'Dolaylı');
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

    // 3. Ek Filtreler
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
    setIsModalOpen(false);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.year || filters.university || filters.institute || filters.department || filters.type || filters.category || searchTerm;
  }, [filters, searchTerm]);

  // EXCEL EXPORT FONKSİYONU
  const exportToExcel = () => {
    const excelData = filteredTheses.map((thesis, index) => ({
      'Sıra': index + 1,
      'Tez No': thesis['Tez No'],
      'Kategori': thesis.category,
      'Tez Başlığı': thesis['Tez Başlığı'],
      'Yazar': thesis['Yazar'],
      'Danışman': thesis['Danışman'] || '—',
      'Üniversite': thesis['Üniversite'],
      'Enstitü': thesis['Enstitü'],
      'Bölüm': thesis['Bölüm'],
      'Tez Türü': thesis['Tez Türü'],
      'Yıl': thesis['Yıl'],
      'Tez Dosyası': thesis['Tez Dosyası'] || 'Kısıtlı'
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    const columnWidths = [
      { wch: 6 },   // Sıra
      { wch: 12 },  // Tez No
      { wch: 10 },  // Kategori
      { wch: 60 },  // Tez Başlığı
      { wch: 25 },  // Yazar
      { wch: 25 },  // Danışman
      { wch: 35 },  // Üniversite
      { wch: 35 },  // Enstitü
      { wch: 35 },  // Bölüm
      { wch: 15 },  // Tez Türü
      { wch: 8 },   // Yıl
      { wch: 60 }   // Tez Dosyası
    ];
    ws['!cols'] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tezler');

    // Dosya adı oluştur
    let fileName = getFilterTitle().replace(/[/:*?"<>|]/g, '_');
    fileName += `_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  // ORTAK FİLTRE İÇERİĞİ (HEADER & MODAL İÇİN)
  const FilterContent = (
    <>
      <FilterInput
        label="Yıl"
        placeholder="Yıl"
        value={filters.year || searchDropdown.year}
        onChange={(e) => {
          setSearchDropdown({ ...searchDropdown, year: e.target.value });
          if (activeDropdown !== 'year') toggleDropdown('year');
        }}
        isOpen={activeDropdown === 'year'}
        onToggle={() => toggleDropdown('year')}
        options={filteredYears}
        onSelect={(val) => {
          setFilters({ ...filters, year: val });
          setSearchDropdown({ ...searchDropdown, year: '' });
          setActiveDropdown(null);
        }}
      />
      <FilterInput
        label="Üniversite"
        placeholder="Üniversite"
        value={filters.university || searchDropdown.university}
        onChange={(e) => {
          setSearchDropdown({ ...searchDropdown, university: e.target.value });
          if (activeDropdown !== 'uni') toggleDropdown('uni');
        }}
        isOpen={activeDropdown === 'uni'}
        onToggle={() => toggleDropdown('uni')}
        options={filteredUniversities}
        onSelect={(val) => {
          setFilters({ ...filters, university: val });
          setSearchDropdown({ ...searchDropdown, university: '' });
          setActiveDropdown(null);
        }}
      />
      <FilterInput
        label="Enstitü"
        placeholder="Enstitü"
        value={filters.institute || searchDropdown.institute}
        onChange={(e) => {
          setSearchDropdown({ ...searchDropdown, institute: e.target.value });
          if (activeDropdown !== 'inst') toggleDropdown('inst');
        }}
        isOpen={activeDropdown === 'inst'}
        onToggle={() => toggleDropdown('inst')}
        options={filteredInstitutes}
        onSelect={(val) => {
          setFilters({ ...filters, institute: val });
          setSearchDropdown({ ...searchDropdown, institute: '' });
          setActiveDropdown(null);
        }}
      />
      <FilterInput
        label="Bölüm"
        placeholder="Bölüm"
        value={filters.department || searchDropdown.department}
        onChange={(e) => {
          setSearchDropdown({ ...searchDropdown, department: e.target.value });
          if (activeDropdown !== 'dept') toggleDropdown('dept');
        }}
        isOpen={activeDropdown === 'dept'}
        onToggle={() => toggleDropdown('dept')}
        options={filteredDepartments}
        onSelect={(val) => {
          setFilters({ ...filters, department: val });
          setSearchDropdown({ ...searchDropdown, department: '' });
          setActiveDropdown(null);
        }}
      />
      <FilterSelect
        label="Kategori"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        options={['Doğrudan', 'Dolaylı']}
      />
      <div className="w-full">
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Tez Türü</label>
        <div className="relative">
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="input-modern appearance-none cursor-pointer pr-10">
            <option value="">Tümü</option>
            <option value="Yüksek Lisans">Yüksek Lisans</option>
            <option value="Doktora">Doktora</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </>
  );

  if (loading) return null;

  return (
    <div className="min-h-screen pb-20">
      <style>{styles}</style>

      {/* HEADER */}
      <header className="bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="w-full">
              <button
                onClick={() => navigate('/tez-analytics')}
                className="text-sm font-medium text-gray-500 hover:text-black mb-2 flex items-center gap-1"
              >
                <ArrowRight className="rotate-180 w-4 h-4" /> Dashboard
              </button>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111827] break-words flex-1">
                  {getFilterTitle()}
                </h1>

                {/* MOBİL EXCEL BUTONU */}
                <button
                  onClick={exportToExcel}
                  className="excel-export-btn md:hidden shrink-0"
                  title="Excel İndir"
                >
                  <div className="excel-icon">E</div>
                </button>

                <span className="md:hidden text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 shrink-0">
                  {filteredTheses.length}
                </span>
              </div>
            </div>

            {/* DESKTOP EXCEL VE KAYIT SAYISI */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <button
                onClick={exportToExcel}
                className="excel-export-btn"
                title="Filtrelenmiş tezleri Excel'e aktar"
              >
                <div className="excel-icon excel-icon-full">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm10-9h-2v2h-2v-2h-2v2h-2v2h2v2h2v-2h2v2h2v-2h-2v-2z" />
                  </svg>
                </div>
                <span>Excel</span>
              </button>

              <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <span className="text-black font-bold">{filteredTheses.length}</span> kayıt
              </div>
            </div>
          </div>

          {/* STATİK FİLTRE BAR (SADECE MASAÜSTÜ) */}
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

            <div className="grid grid-cols-6 gap-3">
              {FilterContent}
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1">
                  <X size={16} /> Temizle
                </button>
              </div>
            )}
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="lg:hidden w-full mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Bu listede ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none text-sm"
              />
            </div>
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
      <div className={`filter-modal ${isModalOpen ? 'open' : ''}`}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Filtrele</h3>
          <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} className="text-gray-600" /></button>
        </div>
        <div className="p-5 custom-scrollbar flex-1 overflow-y-auto">
          <div className="filter-grid-mobile">
            {FilterContent}
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
          <button onClick={clearFilters} className="flex-1 py-3 bg-white border border-gray-200 text-red-500 rounded-xl font-medium">Temizle</button>
          <button onClick={() => setIsModalOpen(false)} className="flex-[2] py-3 bg-[#111827] text-white rounded-xl font-medium">Sonuçları Göster ({filteredTheses.length})</button>
        </div>
      </div>

      {/* LİSTE */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-10">
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
          <div className="space-y-4 md:space-y-6">
            {filteredTheses.map((thesis, index) => (
              <div key={index} className="card-modern group">
                <div className="card-header-flex flex mb-4 md:mb-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                      <span className="badge badge-dark">{thesis['Tez No']}</span>
                      <span className={`badge ${thesis.category === 'Doğrudan' ? 'bg-gray-200 text-gray-800' : 'bg-white border border-gray-200'}`}>
                        {thesis.category}
                      </span>
                      <span className="badge bg-yellow-50 text-yellow-700 border border-yellow-100">{thesis['Tez Türü']}</span>
                      <span className="badge bg-orange-50 text-orange-800 border border-orange-100">{thesis['Yıl']}</span>
                    </div>
                    <h2 className="text-xl md:text-xl font-bold text-justify text-gray-900 leading-snug group-hover:text-[#c7972f] transition-colors break-words">
                      <HighlightedText text={thesis['Tez Başlığı']} highlight={searchTerm} />
                    </h2>
                  </div>

                  <div className="card-action-top shrink-0">
                    {thesis['Tez Dosyası'] && thesis['Tez Dosyası'] !== 'İzinsiz' ? (
                      <a
                        href={thesis['Tez Dosyası']}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="yoktez-button"
                        title="YÖKTEZ'DE GÖRÜNTÜLE"
                      >
                        <span className="text-xs font-semibold">YÖKTEZ'DE GÖRÜNTÜLE</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 px-2 py-1 bg-gray-100 rounded">Kısıtlı</span>
                    )}
                  </div>
                </div>

                <div className="grid card-grid-mobile md:grid-cols-3 gap-4 md:gap-6 py-4 md:py-6 border-t border-b border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Yazar</p>
                    <p className="font-medium text-gray-900 text-sm md:text-base">
                      <HighlightedText text={thesis['Yazar']} highlight={searchTerm} />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Danışman</p>
                    <p className="font-medium text-gray-900 text-sm md:text-base">
                      <HighlightedText text={thesis['Danışman'] || '—'} highlight={searchTerm} />
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Kurum</p>
                    <p className="font-medium text-gray-900 truncate text-sm md:text-base">
                      <HighlightedText text={thesis['Üniversite']} highlight={searchTerm} />
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">{thesis['Enstitü']}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 flex items-center justify-between">
                  <div className="text-xs md:text-sm text-gray-400 font-light truncate max-w-[50%]">{thesis['Bölüm']}</div>

                  {thesis['Özet (Türkçe)'] ? (
                    <button onClick={() => setExpandedThesis(expandedThesis === index ? null : index)}
                      className="btn-modern py-1.5 px-3 md:py-2 md:px-4 gap-2 text-xs md:text-sm border-gray-200 hover:shadow-sm">
                      {expandedThesis === index ? <Minus size={14} /> : <Plus size={14} />}
                      <span>{expandedThesis === index ? 'Gizle' : 'Özet'}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300 italic">Özet Yok</span>
                  )}
                </div>

                {expandedThesis === index && (
                  <div className="mt-6 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-5 md:p-8 max-h-[350px] overflow-y-auto custom-scrollbar">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 top-0 bg-gray-50 z-10 flex items-center gap-2 pb-2">
                          <span className="w-1 h-4 bg-yellow-600 rounded-full"></span> Türkçe Özet
                        </h4>
                        <p className="text-gray-700 text-justify leading-relaxed font-light text-sm md:text-[0.95rem]">
                          <HighlightedText text={thesis['Özet (Türkçe)']} highlight={searchTerm} />
                        </p>
                      </div>
                      {thesis['Özet (İngilizce)'] && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                          <h4 className="text-sm font-bold text-gray-900 mb-3 top-0 bg-gray-50 z-10 flex items-center gap-2 pb-2">
                            <span className="w-1 h-4 bg-orange-500 rounded-full"></span> English Abstract
                          </h4>
                          <p className="text-gray-600 text-justify leading-relaxed font-light text-sm md:text-[0.95rem]">{thesis['Özet (İngilizce)']}</p>
                        </div>
                      )}
                    </div>
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