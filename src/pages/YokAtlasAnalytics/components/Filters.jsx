import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Percent,
  Users,
  Building2,
  MapPin,
  BookOpen
} from 'lucide-react';
import { extractCity, getDepartmentCategory } from '../utils/dataProcessor';

const Filters = ({ data, onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    universityType: [],
    year: 2025,
    minRate: 0,
    maxRate: 100,
    minStudents: 0,
    categories: [],
    cities: [],
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Unique değerleri çıkar
  const uniqueCities = [...new Set(data.map(d => extractCity(d.universiteName)))].sort();
  const uniqueCategories = [...new Set(data.map(d => getDepartmentCategory(d.bolum)))].sort();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (key, value) => {
    const currentValues = filters[key];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleFilterChange(key, newValues);
  };

  const resetFilters = () => {
    const defaultFilters = {
      searchTerm: '',
      universityType: [],
      year: 2025,
      minRate: 0,
      maxRate: 100,
      minStudents: 0,
      categories: [],
      cities: []
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.universityType.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.cities.length > 0) count++;
    if (filters.minRate > 0) count++;
    if (filters.maxRate < 100) count++;
    if (filters.minStudents > 0) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Üst Bar: Arama ve Temel Kontroller */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Arama Kutusu */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Üniversite veya bölüm ara..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>

        {/* Yıl Seçimi */}
        <div className="relative w-full md:w-48">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Calendar className="w-5 h-5" />
          </div>
          <select 
            value={filters.year} 
            onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
            className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 appearance-none shadow-sm cursor-pointer"
          >
            <option value={2025}>2025 Verisi</option>
            <option value={2024}>2024 Verisi</option>
            <option value={2023}>2023 Verisi</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Genişletme ve Sıfırlama Butonları */}
        <div className="flex gap-2">
          <button 
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-sm border
              ${isExpanded 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="w-4 h-4" />
            <span>Filtreler</span>
            {activeFilterCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                {activeFilterCount()}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>

          {activeFilterCount() > 0 && (
            <button 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors shadow-sm" 
              onClick={resetFilters}
              title="Filtreleri Temizle"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Gelişmiş Filtreler Paneli */}
      {isExpanded && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm animate-fade-in-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            
            {/* Üniversite Tipi */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" /> Üniversite Tipi
              </h4>
              <div className="space-y-2">
                {['Devlet', 'Vakıf', 'KKTC'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.universityType.includes(type)}
                        onChange={() => handleCheckboxChange('universityType', type)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400"
                      />
                      <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* İH Oranı Aralığı */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Percent className="w-4 h-4 text-violet-500" /> İH Oranı (%)
              </h4>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.minRate}
                        onChange={(e) => handleFilterChange('minRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all"
                        placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                </div>
                <span className="text-slate-300 font-medium">-</span>
                <div className="relative flex-1">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={filters.maxRate}
                        onChange={(e) => handleFilterChange('maxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition-all"
                        placeholder="100"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                </div>
              </div>
            </div>

            {/* Min. Öğrenci */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" /> Min. Öğrenci
              </h4>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={filters.minStudents}
                  onChange={(e) => handleFilterChange('minStudents', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">Öğrenci</span>
              </div>
            </div>

            {/* Kategoriler */}
            <div className="space-y-3 lg:col-span-1">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> Bölüm Kategorisi
              </h4>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                {uniqueCategories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={() => handleCheckboxChange('categories', category)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-amber-500 checked:bg-amber-500"
                        />
                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 truncate" title={category}>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Şehirler */}
            <div className="space-y-3 lg:col-span-1">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" /> Şehir (İlk 20)
              </h4>
              <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                {uniqueCities.slice(0, 20).map(city => (
                  <label key={city} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={filters.cities.includes(city)}
                            onChange={() => handleCheckboxChange('cities', city)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white checked:border-rose-500 checked:bg-rose-500"
                        />
                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{city}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;