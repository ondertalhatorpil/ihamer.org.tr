import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Layers,
  Search,
  ChevronRight
} from 'lucide-react';
import { getDepartmentStatistics } from '../utils/statistics';
import { formatNumber, formatPercent } from '../utils/helpers';
import { TrendIndicator } from './TrendChart';

const DepartmentList = ({ data }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('students'); 
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); // Arama için state

  // İstatistikleri hesapla
  const departments = useMemo(() => getDepartmentStatistics(data), [data]);

  // Kategorileri çıkar ve sırala
  const categories = useMemo(() => {
    const cats = [...new Set(departments.map(d => d.category))];
    return cats.sort();
  }, [departments]);

  // Filtreleme ve Sıralama
  const filteredAndSorted = useMemo(() => {
    let filtered = departments;

    // Arama Filtresi
    if (searchTerm) {
        const lowerTerm = searchTerm.toLocaleLowerCase('tr');
        filtered = filtered.filter(d => 
            d.name.toLocaleLowerCase('tr').includes(lowerTerm)
        );
    }

    // Kategori Filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Sıralama
    return [...filtered].sort((a, b) => {
      let compareA, compareB;
      switch(sortBy) {
        case 'name': compareA = a.name; compareB = b.name; break;
        case 'students': compareA = a.totalStudents2025; compareB = b.totalStudents2025; break;
        case 'rate': compareA = parseFloat(a.avgRate2025) || 0; compareB = parseFloat(b.avgRate2025) || 0; break;
        case 'universities': compareA = a.universityCount; compareB = b.universityCount; break;
        default: return 0;
      }
      return sortOrder === 'asc' 
        ? (typeof compareA === 'string' ? compareA.localeCompare(compareB, 'tr') : compareA - compareB)
        : (typeof compareA === 'string' ? compareB.localeCompare(compareA, 'tr') : compareB - compareA);
    });
  }, [departments, selectedCategory, sortBy, sortOrder, searchTerm]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 opacity-50" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-[#B38F65]" /> 
      : <ArrowDown className="w-3.5 h-3.5 text-[#B38F65]" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in w-full max-w-full overflow-hidden">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col gap-6">
        
        {/* Üst Satır: Başlık ve İstatistik */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    Bölümler
                </h1>
                <p className="text-slate-500 mt-1 text-xs md:text-sm ml-1">
                    Toplam <span className="font-bold text-[#B38F65]">{filteredAndSorted.length}</span> program listeleniyor
                </p>
            </div>
        </div>

        {/* Arama Çubuğu */}
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Bölüm adı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B38F65]/50 focus:border-[#B38F65] transition-all shadow-sm"
            />
        </div>

        {/* Kategori Filtreleri (Scrollable) */}
        <div className="w-full overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                    <Filter className="w-3.5 h-3.5" /> Kategori:
                </div>
                
                <button 
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap
                    ${selectedCategory === 'all' 
                        ? 'bg-[#B38F65] text-white shadow-md' 
                        : 'bg-white text-slate-500 hover:text-[#B38F65] hover:bg-[#B38F65]/5 border border-slate-200'
                    }`}
                >
                    Tümü
                </button>

                {categories.map(cat => {
                    const isSelected = selectedCategory === cat;
                    // Kategori renklerini şimdilik nötr veya Gold tonlarında tutabiliriz
                    // Veya getCategoryColor fonksiyonunu kullanmaya devam edebilirsin.
                    const color = getCategoryColor(cat); 
                    
                    return (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap flex items-center gap-2
                        ${isSelected 
                            ? 'shadow-md text-white border-transparent' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        style={isSelected ? { backgroundColor: color || '#B38F65' } : {}}
                    >
                        {cat}
                        {isSelected && <Layers className="w-3 h-3 opacity-80" />}
                    </button>
                    );
                })}
            </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}

      {/* 1. MOBİL GÖRÜNÜM (Card List - Sadece Mobilde) */}
      <div className="md:hidden flex flex-col gap-3">
        {filteredAndSorted.map((dept, index) => {
            const categoryColor = getCategoryColor(dept.category);
            return (
                <div 
                    key={index}
                    onClick={() => navigate(`/analytics/department/${encodeURIComponent(dept.name)}`)}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                >
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{dept.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span 
                                        className="text-[10px] px-2 py-0.5 rounded font-bold border"
                                        style={{ 
                                            backgroundColor: `${categoryColor}10`,
                                            color: categoryColor,
                                            borderColor: `${categoryColor}20`
                                        }}
                                    >
                                        {dept.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 w-5 h-5 shrink-0" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-50">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400 mb-0.5">Üniversite</div>
                            <div className="text-sm font-bold text-slate-700">{dept.universityCount}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400 mb-0.5">Öğrenci</div>
                            <div className="text-sm font-bold text-[#B38F65]">{formatNumber(dept.totalStudents2025)}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400 mb-0.5">Ort. %</div>
                            <div className="text-sm font-bold text-slate-700">%{dept.avgRate2025}</div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* 2. MASAÜSTÜ GÖRÜNÜM (Table - Sadece Desktopta) */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
            <table className="w-full text-left border-collapse relative">
            
            <thead className="sticky top-0 z-20">
                <tr className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                 {[
                    { id: 'name', label: 'Bölüm Adı', align: 'left' },
                    { id: 'category', label: 'Kategori', align: 'center' },
                    { id: 'universities', label: 'Üniversite', align: 'center' },
                    { id: 'students', label: 'Öğrenci (2025)', align: 'right' },
                    { id: 'rate', label: 'Ort. Oran', align: 'right' },
                    { id: 'trend', label: 'Trend', align: 'right' },
                 ].map((col) => (
                    <th 
                        key={col.id}
                        onClick={() => col.id !== 'category' && col.id !== 'trend' && handleSort(col.id)} 
                        className={`p-5 text-xs font-bold text-slate-500 uppercase tracking-wider 
                            ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                            ${col.id !== 'category' && col.id !== 'trend' ? 'cursor-pointer hover:bg-slate-50 hover:text-[#B38F65] transition-colors group select-none' : ''}
                        `}
                    >
                        <div className={`flex items-center gap-2 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                            {col.label}
                            {col.id !== 'category' && col.id !== 'trend' && getSortIcon(col.id)}
                        </div>
                    </th>
                 ))}
                </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
                {filteredAndSorted.map((dept, index) => {
                    const categoryColor = getCategoryColor(dept.category);
                    
                    return (
                    <tr 
                        key={index} 
                        onClick={() => navigate(`/analytics/department/${encodeURIComponent(dept.name)}`)}
                        className="hover:bg-[#B38F65]/5 transition-colors cursor-pointer group"
                    >
                        <td className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-[#B38F65] group-hover:shadow-sm transition-all">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-800 text-sm group-hover:text-[#B38F65] transition-colors line-clamp-1">
                                    {dept.name}
                                </span>
                            </div>
                        </td>
                        <td className="p-5 text-center">
                            <span 
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-block whitespace-nowrap"
                                style={{ 
                                    backgroundColor: `${categoryColor}10`,
                                    color: categoryColor,
                                    borderColor: `${categoryColor}20`
                                }}
                            >
                                {dept.category}
                            </span>
                        </td>
                        <td className="p-5 text-center">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-sm font-bold tabular-nums">
                                {dept.universityCount}
                            </span>
                        </td>
                        <td className="p-5 text-right">
                            <div className="font-bold text-slate-800 text-base tabular-nums tracking-tight">
                                {formatNumber(dept.totalStudents2025)}
                            </div>
                        </td>
                        <td className="p-5 text-right">
                            <div className="font-medium text-slate-600 tabular-nums">
                                {formatPercent(dept.avgRate2025)}
                            </div>
                        </td>
                        <td className="p-5 text-right">
                             <div className="flex justify-end">
                                <TrendIndicator 
                                    data2023={{ oran: parseFloat(dept.avgRate2023) }}
                                    data2024={{ oran: parseFloat(dept.avgRate2024) }}
                                    data2025={{ oran: parseFloat(dept.avgRate2025) }}
                                    type="oran"
                                />
                             </div>
                        </td>
                    </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
      </div>
        
      {/* Empty State */}
      {filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Kayıt Bulunamadı</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                  Arama veya filtreleme kriterlerinize uygun bölüm bulunmamaktadır.
              </p>
              <button 
                  onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
                  className="mt-6 px-6 py-2.5 bg-[#B38F65]/10 text-[#B38F65] rounded-xl text-sm font-bold hover:bg-[#B38F65]/20 transition-colors"
              >
                  Filtreleri Temizle
              </button>
          </div>
      )}
    </div>
  );
};

// Renk Yardımcısı - Uyumlu renk paleti
function getCategoryColor(category) {
  const colors = {
    'Mühendislik': '#3b82f6', 
    'Sağlık Bilimleri': '#10b981', 
    'İlahiyat': '#8b5cf6', 
    'Eğitim': '#f59e0b', 
    'Sosyal Bilimler': '#06b6d4', 
    'Hukuk': '#ef4444', 
    'İşletme/İktisat': '#ec4899', 
    'Mimarlık/Tasarım': '#14b8a6', 
    'Diğer': '#6b7280' 
  };
  return colors[category] || '#6b7280';
}

export default DepartmentList;