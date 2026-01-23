import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  School,
  Search,
  ChevronRight
} from 'lucide-react';
import { getUniversityStatistics } from '../utils/statistics';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { TrendIndicator } from './TrendChart';

const UniversityList = ({ data }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('students');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); 

  const universities = useMemo(() => getUniversityStatistics(data), [data]);

  const filteredAndSorted = useMemo(() => {
    let filtered = universities;

    if (searchTerm) {
        const lowerTerm = searchTerm.toLocaleLowerCase('tr');
        filtered = filtered.filter(u => 
            u.name.toLocaleLowerCase('tr').includes(lowerTerm) ||
            u.city.toLocaleLowerCase('tr').includes(lowerTerm)
        );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(u => u.type === selectedType);
    }

    // Sıralama
    return [...filtered].sort((a, b) => {
      let compareA, compareB;

      switch(sortBy) {
        case 'name': compareA = a.name; compareB = b.name; break;
        case 'students': compareA = a.totalStudents2025; compareB = b.totalStudents2025; break;
        case 'rate': compareA = parseFloat(a.avgRate2025) || 0; compareB = parseFloat(b.avgRate2025) || 0; break;
        case 'departments': compareA = a.departmentCount; compareB = b.departmentCount; break;
        default: return 0;
      }

      if (typeof compareA === 'string') {
        return sortOrder === 'asc' 
          ? compareA.localeCompare(compareB, 'tr')
          : compareB.localeCompare(compareA, 'tr');
      } else {
        return sortOrder === 'asc' ? compareA - compareB : compareB - compareA;
      }
    });
  }, [universities, selectedType, sortBy, sortOrder, searchTerm]);

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
      
      <div className="flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                        <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    Üniversiteler
                </h1>
                <p className="text-slate-500 mt-1 text-xs md:text-sm ml-1">
                    Toplam <span className="font-bold text-[#B38F65]">{filteredAndSorted.length}</span> kurum
                </p>
            </div>

            <div className="bg-white border border-slate-100 p-1 rounded-xl flex overflow-x-auto no-scrollbar shadow-sm w-full md:w-auto">
                {['all', 'Devlet', 'Vakıf', 'KKTC'].map(type => {
                    const isActive = selectedType === type;
                    const label = type === 'all' ? 'Tümü' : type;
                    return (
                        <button 
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap
                            ${isActive 
                                ? 'bg-[#B38F65] text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Üniversite veya şehir ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B38F65]/50 focus:border-[#B38F65] transition-all shadow-sm"
            />
        </div>
      </div>

    <div className="md:hidden flex flex-col gap-3">
        {filteredAndSorted.map((uni, index) => {
            const badge = getUniversityTypeBadge(uni.type);
            return (
                <div 
                    key={index}
                    onClick={() => navigate(`/analytics/university/${encodeURIComponent(uni.name)}`)}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                >
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                                <School size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{uni.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-medium">
                                        {uni.city}
                                    </span>
                                    <span 
                                        className="text-[10px] px-2 py-0.5 rounded text-white font-bold"
                                        style={{ backgroundColor: "#B38F65" }}
                                    >
                                        {badge.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 w-5 h-5 shrink-0" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-50">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400 mb-0.5">Bölüm</div>
                            <div className="text-sm font-bold text-slate-700">{uni.departmentCount}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400 mb-0.5">Öğrenci</div>
                            <div className="text-sm font-bold text-[#B38F65]">{formatNumber(uni.totalStudents2025)}</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400 mb-0.5">Ort. %</div>
                            <div className="text-sm font-bold text-slate-700">%{uni.avgRate2025}</div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* 2. MASAÜSTÜ GÖRÜNÜM (Table - Sadece desktopta görünür) */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
            <table className="w-full text-left border-collapse relative">
            
            <thead className="sticky top-0 z-20">
                <tr className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                  {[
                    { id: 'name', label: 'Üniversite Adı', align: 'left' },
                    { id: 'type', label: 'Tip', align: 'center' },
                    { id: 'city', label: 'Şehir', align: 'left' },
                    { id: 'departments', label: 'Bölüm', align: 'center' },
                    { id: 'rate', label: 'Ort. Oran', align: 'right' },
                    { id: 'trend', label: 'Trend', align: 'right' },
                  ].map((col) => (
                    <th 
                        key={col.id}
                        onClick={() => col.id !== 'type' && col.id !== 'city' && col.id !== 'trend' && handleSort(col.id)} 
                        className={`p-5 text-xs font-bold text-slate-500 uppercase tracking-wider 
                            ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                            ${col.id !== 'type' && col.id !== 'city' && col.id !== 'trend' ? 'cursor-pointer hover:bg-slate-50 hover:text-[#B38F65] transition-colors group select-none' : ''}
                        `}
                    >
                        <div className={`flex items-center gap-2 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                            {col.label}
                            {col.id !== 'type' && col.id !== 'city' && col.id !== 'trend' && getSortIcon(col.id)}
                        </div>
                    </th>
                  ))}
                </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50">
                {filteredAndSorted.map((uni, index) => {
                    const badge = getUniversityTypeBadge(uni.type);
                    return (
                    <tr 
                        key={index}
                        onClick={() => navigate(`/analytics/university/${encodeURIComponent(uni.name)}`)} 
                        className="hover:bg-[#B38F65]/5 transition-colors cursor-pointer group"
                    >
                        <td className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-[#B38F65] group-hover:shadow-sm transition-all">
                                    <School className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm group-hover:text-[#B38F65] transition-colors line-clamp-1">
                                        {uni.name}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-5 text-center">
                            <span 
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-block whitespace-nowrap"
                                style={{ 
                                    backgroundColor: "#B38F65", 
                                    color: "white",
                                    borderColor: `${badge.color}20`
                                }}
                            >
                                {badge.label}
                            </span>
                        </td>
                        <td className="p-5">
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B38F65] transition-colors" />
                                {uni.city}
                            </div>
                        </td>
                        <td className="p-5 text-center">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-sm font-bold tabular-nums">
                                {uni.departmentCount}
                            </span>
                        </td>
                        
                        <td className="p-5 text-right">
                            <div className="font-medium text-slate-600 tabular-nums">
                                {formatPercent(uni.avgRate2025)}
                            </div>
                        </td>
                        <td className="p-5 text-right">
                             <div className="flex justify-end">
                                <TrendIndicator 
                                    data2023={{ oran: parseFloat(uni.avgRate2023) }}
                                    data2024={{ oran: parseFloat(uni.avgRate2024) }}
                                    data2025={{ oran: parseFloat(uni.avgRate2025) }}
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

      {filteredAndSorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Sonuç Bulunamadı</h3>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                  Arama kriterlerinize uygun üniversite bulunamadı. Lütfen filtreleri kontrol edin.
              </p>
              <button 
                  onClick={() => { setSelectedType('all'); setSearchTerm(''); }}
                  className="mt-6 px-6 py-2.5 bg-[#B38F65]/10 text-[#B38F65] rounded-xl text-sm font-bold hover:bg-[#B38F65]/20 transition-colors"
              >
                  Filtreleri Temizle
              </button>
          </div>
      )}
    </div>
  );
};

export default UniversityList;