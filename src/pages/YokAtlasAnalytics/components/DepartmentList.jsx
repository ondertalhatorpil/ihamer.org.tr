import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  Filter,
  TrendingUp,
  TrendingDown,
  LayoutGrid
} from 'lucide-react';
import { getDepartmentStatistics } from '../utils/statistics';
import { formatNumber, formatPercent } from '../utils/helpers';

const DepartmentList = ({ data }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('students'); // students (default), name, rate, universities
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Bölüm istatistiklerini hesapla
  const departments = useMemo(() => getDepartmentStatistics(data), [data]);

  // Kategorileri çıkar
  const categories = useMemo(() => {
    const cats = [...new Set(departments.map(d => d.category))];
    return cats.sort();
  }, [departments]);

  // Filtrele ve sırala
  const filteredAndSorted = useMemo(() => {
    let filtered = departments;

    // Kategori filtreleme
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    // Sıralama
    const sorted = [...filtered].sort((a, b) => {
      let compareA, compareB;

      switch(sortBy) {
        case 'name':
          compareA = a.name;
          compareB = b.name;
          break;
        case 'students':
          compareA = a.totalStudents2025;
          compareB = b.totalStudents2025;
          break;
        case 'rate':
          compareA = parseFloat(a.avgRate2025) || 0;
          compareB = parseFloat(b.avgRate2025) || 0;
          break;
        case 'universities':
          compareA = a.universityCount;
          compareB = b.universityCount;
          break;
        default:
          return 0;
      }

      if (typeof compareA === 'string') {
        return sortOrder === 'asc' 
          ? compareA.localeCompare(compareB, 'tr')
          : compareB.localeCompare(compareA, 'tr');
      } else {
        return sortOrder === 'asc'
          ? compareA - compareB
          : compareB - compareA;
      }
    });

    return sorted;
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
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-slate-300" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" /> 
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <BookOpen className="w-6 h-6 text-blue-500" />
             Bölümler
             <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                {filteredAndSorted.length} kayıt
             </span>
          </h1>
          <p className="text-slate-500 mt-1">
            Tüm bölümlerin performans ve dağılım istatistikleri.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter className="w-3 h-3" /> Kategori Filtrele
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border
              ${selectedCategory === 'all' 
                ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            onClick={() => setSelectedCategory('all')}
          >
            Tümü
          </button>
          
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const color = getCategoryColor(cat);
            const count = departments.filter(d => d.category === cat).length;
            
            return (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border flex items-center gap-2
                  ${isSelected ? 'text-white shadow-md transform scale-105' : 'bg-white hover:bg-slate-50'}`}
                style={{
                    backgroundColor: isSelected ? color : 'white',
                    borderColor: isSelected ? color : '#e2e8f0', // slate-200
                    color: isSelected ? 'white' : '#475569', // slate-600
                }}
              >
                {cat}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full 
                    ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Table Content */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                    onClick={() => handleSort('name')} 
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                >
                    <div className="flex items-center gap-2">
                        Bölüm {getSortIcon('name')}
                    </div>
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kategori
                </th>
                <th 
                    onClick={() => handleSort('universities')} 
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors text-center"
                >
                    <div className="flex items-center justify-center gap-2">
                        Üniversite {getSortIcon('universities')}
                    </div>
                </th>
                <th 
                    onClick={() => handleSort('students')} 
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                    <div className="flex items-center justify-end gap-2">
                        Öğrenci (2025) {getSortIcon('students')}
                    </div>
                </th>
                <th 
                    onClick={() => handleSort('rate')} 
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                    <div className="flex items-center justify-end gap-2">
                        Ort. Oran (2025) {getSortIcon('rate')}
                    </div>
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Trend
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {filteredAndSorted.map((dept, index) => {
                    // Trend hesaplama (basit versiyon)
                    const rate2023 = parseFloat(dept.avgRate2023) || 0;
                    const rate2025 = parseFloat(dept.avgRate2025) || 0;
                    const change = rate2025 - rate2023;
                    
                    return (
                    <tr 
                        key={index} 
                        onClick={() => navigate(`/analytics/department/${encodeURIComponent(dept.name)}`)}
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-white group-hover:text-blue-500 transition-colors shadow-sm">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                    {dept.name}
                                </span>
                            </div>
                        </td>
                        <td className="p-4">
                            <span 
                                className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                                style={{ 
                                    backgroundColor: `${getCategoryColor(dept.category)}10`, // %10 opacity
                                    color: getCategoryColor(dept.category),
                                    borderColor: `${getCategoryColor(dept.category)}30`
                                }}
                            >
                                {dept.category}
                            </span>
                        </td>
                        <td className="p-4 text-center">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-sm font-medium">
                                {dept.universityCount}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="font-bold text-slate-800 text-lg tabular-nums">
                                {formatNumber(dept.totalStudents2025)}
                            </div>
                        </td>
                        <td className="p-4 text-right">
                            <div className="font-medium text-slate-600 tabular-nums">
                                {formatPercent(dept.avgRate2025)}
                            </div>
                        </td>
                        <td className="p-4 text-right">
                            <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
                                ${change > 0 ? 'bg-emerald-50 text-emerald-600' : change < 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                                {change > 0 ? <TrendingUp className="w-3 h-3" /> : change < 0 ? <TrendingDown className="w-3 h-3" /> : '•'}
                                {change !== 0 && `%${Math.abs(change).toFixed(1)}`}
                            </div>
                        </td>
                    </tr>
                    );
                })}
            </tbody>
            </table>
        </div>
        
        {filteredAndSorted.length === 0 && (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Sonuç Bulunamadı</h3>
                <p className="text-slate-500 mt-1">Seçili kategori kriterlerine uygun bölüm bulunmamaktadır.</p>
                <button 
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                    Filtreleri Temizle
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

// Renk Yardımcısı (Diğer dosyalarda varsa import edilebilir, yoksa burada kalsın)
function getCategoryColor(category) {
  const colors = {
    'Mühendislik': '#3b82f6', // blue-500
    'Sağlık Bilimleri': '#10b981', // emerald-500
    'İlahiyat': '#8b5cf6', // violet-500
    'Eğitim': '#f59e0b', // amber-500
    'Sosyal Bilimler': '#06b6d4', // cyan-500
    'Hukuk': '#ef4444', // red-500
    'İşletme/İktisat': '#ec4899', // pink-500
    'Mimarlık/Tasarım': '#14b8a6', // teal-500
    'Diğer': '#6b7280' // gray-500
  };
  return colors[category] || '#6b7280';
}

export default DepartmentList;