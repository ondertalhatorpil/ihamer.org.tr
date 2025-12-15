import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  School 
} from 'lucide-react';
import { getUniversityStatistics } from '../utils/statistics';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { TrendIndicator } from './TrendChart';

const UniversityList = ({ data }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('students'); // students (default), name, rate, departments
  const [sortOrder, setSortOrder] = useState('desc'); // desc (default for numbers)
  const [selectedType, setSelectedType] = useState('all'); // all, Devlet, Vakıf, KKTC

  // Üniversite istatistiklerini hesapla
  const universities = useMemo(() => getUniversityStatistics(data), [data]);

  // Filtrele ve sırala
  const filteredAndSorted = useMemo(() => {
    let filtered = universities;

    // Tip filtreleme
    if (selectedType !== 'all') {
      filtered = filtered.filter(u => u.type === selectedType);
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
        case 'departments':
          compareA = a.departmentCount;
          compareB = b.departmentCount;
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
  }, [universities, selectedType, sortBy, sortOrder]);

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

  // Tip filtre butonları için yardımcı fonksiyon
  const getTypeColorClass = (type) => {
    switch(type) {
      case 'Devlet': return 'bg-blue-600 border-blue-600 text-white';
      case 'Vakıf': return 'bg-violet-600 border-violet-600 text-white';
      case 'KKTC': return 'bg-amber-500 border-amber-500 text-white';
      default: return 'bg-slate-800 border-slate-800 text-white';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <Building2 className="w-6 h-6 text-blue-500" />
             Üniversiteler
             <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                {filteredAndSorted.length} kurum
             </span>
          </h1>
          <p className="text-slate-500 mt-1">
            Üniversitelerin İmam Hatip mezunu yerleştirme performansları.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter className="w-3 h-3" /> Kurum Türü Filtrele
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'Devlet', 'Vakıf', 'KKTC'].map(type => {
            const count = type === 'all' 
                ? universities.length 
                : universities.filter(u => u.type === type).length;
            
            const isActive = selectedType === type;
            const label = type === 'all' ? 'Tümü' : type;

            return (
              <button 
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border flex items-center gap-2
                  ${isActive 
                    ? `${getTypeColorClass(type)} shadow-md transform scale-105` 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                {label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full 
                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100" onClick={() => navigate(`/analytics/university/${encodeURIComponent(uni.name)}`)}>
                <th 
                    onClick={() => handleSort('name')} 
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        Üniversite {getSortIcon('name')}
                    </div>
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Tip
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Şehir
                </th>
                <th 
                    onClick={() => handleSort('departments')} 
                    className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors text-center"
                >
                    <div className="flex items-center justify-center gap-2">
                        Bölüm {getSortIcon('departments')}
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
                {filteredAndSorted.map((uni, index) => {
                    const badge = getUniversityTypeBadge(uni.type);
                    
                    return (
                    <tr 
                        key={index}
                        onClick={() => navigate(`/analytics/university/${encodeURIComponent(uni.name)}`)} 
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-white group-hover:text-blue-500 transition-colors shadow-sm">
                                    <School className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1" title={uni.name}>
                                    {uni.name}
                                </span>
                            </div>
                        </td>
                        <td className="p-4 text-center">
                            <span 
                                className="px-2 py-0.5 rounded text-[10px] font-bold border inline-block whitespace-nowrap"
                                style={{ 
                                    backgroundColor: `${badge.color}15`, // %15 opacity
                                    color: badge.color,
                                    borderColor: `${badge.color}30`
                                }}
                            >
                                {badge.label}
                            </span>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                {uni.city}
                            </div>
                        </td>
                        <td className="p-4 text-center">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-sm font-medium">
                                {uni.departmentCount}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="font-bold text-slate-800 text-lg tabular-nums">
                                {formatNumber(uni.totalStudents2025)}
                            </div>
                        </td>
                        <td className="p-4 text-right">
                            <div className="font-medium text-slate-600 tabular-nums">
                                {formatPercent(uni.avgRate2025)}
                            </div>
                        </td>
                        <td className="p-4 text-right">
                             <TrendIndicator 
                                data2023={{ oran: parseFloat(uni.avgRate2023) }}
                                data2024={{ oran: parseFloat(uni.avgRate2024) }}
                                data2025={{ oran: parseFloat(uni.avgRate2025) }}
                                type="oran"
                            />
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
                <p className="text-slate-500 mt-1">Seçili filtrelere uygun üniversite bulunmamaktadır.</p>
                <button 
                    onClick={() => setSelectedType('all')}
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

export default UniversityList;