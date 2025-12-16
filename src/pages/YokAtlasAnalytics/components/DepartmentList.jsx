import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Layers
} from 'lucide-react';
import { getDepartmentStatistics } from '../utils/statistics';
import { formatNumber, formatPercent } from '../utils/helpers';
import { TrendIndicator } from './TrendChart'; // TrendIndicator'ı import ettiğinden emin ol

const DepartmentList = ({ data }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('students'); 
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

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
  }, [departments, selectedCategory, sortBy, sortOrder]);

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
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> 
      : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* --- HEADER & FILTER SECTION --- */}
      <div className="flex flex-col gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        
        {/* Başlık ve Sayaç */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              Bölümler
            </h1>
            <p className="text-slate-500 mt-2 text-sm ml-1">
              Listelenen toplam <span className="font-bold text-slate-800">{filteredAndSorted.length}</span> bölüm
            </p>
          </div>
        </div>

        {/* Kategori Filtreleri (Scrollable) */}
        <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                    <Filter className="w-3.5 h-3.5" /> Kategori:
                </div>
                
                <button 
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap
                    ${selectedCategory === 'all' 
                        ? 'bg-slate-800 text-white shadow-md ring-1 ring-slate-800' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100'
                    }`}
                >
                    Tümü
                </button>

                {categories.map(cat => {
                    const isSelected = selectedCategory === cat;
                    const color = getCategoryColor(cat);
                    
                    return (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap flex items-center gap-2
                        ${isSelected ? 'shadow-md ring-1 ring-white/20 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        style={isSelected ? { backgroundColor: color, borderColor: color } : {}}
                    >
                        {cat}
                        {isSelected && <Layers className="w-3 h-3 opacity-80" />}
                    </button>
                    );
                })}
            </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
            <table className="w-full text-left border-collapse relative">
            
            {/* Sticky Header */}
            <thead className="sticky top-0 z-20">
                <tr className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
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
                            ${col.id !== 'category' && col.id !== 'trend' ? 'cursor-pointer hover:bg-slate-50 hover:text-blue-600 transition-colors group' : ''}
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
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                        <td className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
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
                             <TrendIndicator 
                                data2023={{ oran: parseFloat(dept.avgRate2023) }}
                                data2024={{ oran: parseFloat(dept.avgRate2024) }}
                                data2025={{ oran: parseFloat(dept.avgRate2025) }}
                                type="oran"
                            />
                        </td>
                    </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
        
        {/* Empty State */}
        {filteredAndSorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Kayıt Bulunamadı</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                    Seçili kategori kriterlerine uygun bölüm bulunmamaktadır.
                </p>
                <button 
                    onClick={() => setSelectedCategory('all')}
                    className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                >
                    Filtreleri Temizle
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

// Renk Yardımcısı
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