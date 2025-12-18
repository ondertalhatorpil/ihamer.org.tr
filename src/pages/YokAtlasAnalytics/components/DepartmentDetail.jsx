import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  School,
  BarChart3,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { MultiLineChart } from './TrendChart';
import Tooltip from './Tooltip';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { getDepartmentCategory, extractCity } from '../utils/dataProcessor';

const DepartmentDetail = ({ data }) => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  
  // Bölüme ait tüm kayıtları filtrele
  const departmentRecords = useMemo(() => {
    return data.filter(d => d.bolum === decodeURIComponent(departmentName));
  }, [data, departmentName]);

  // İstatistikleri hesapla
  const stats = useMemo(() => {
    if (departmentRecords.length === 0) return null;

    const category = getDepartmentCategory(departmentRecords[0].bolum);
    
    // Yıllara göre toplam öğrenci
    const students2023 = departmentRecords.reduce((sum, d) => sum + (d.data2023?.sayi || 0), 0);
    const students2024 = departmentRecords.reduce((sum, d) => sum + (d.data2024?.sayi || 0), 0);
    const students2025 = departmentRecords.reduce((sum, d) => sum + (d.data2025?.sayi || 0), 0);

    // Ortalama oranlar
    const rates2023 = departmentRecords.filter(d => d.data2023).map(d => d.data2023.oran);
    const rates2024 = departmentRecords.filter(d => d.data2024).map(d => d.data2024.oran);
    const rates2025 = departmentRecords.filter(d => d.data2025).map(d => d.data2025.oran);

    const avgRate2023 = rates2023.length > 0 ? (rates2023.reduce((a, b) => a + b, 0) / rates2023.length).toFixed(2) : 0;
    const avgRate2024 = rates2024.length > 0 ? (rates2024.reduce((a, b) => a + b, 0) / rates2024.length).toFixed(2) : 0;
    const avgRate2025 = rates2025.length > 0 ? (rates2025.reduce((a, b) => a + b, 0) / rates2025.length).toFixed(2) : 0;

    // Üniversite tipi bazlı dağılım
    const byType = {
      'Devlet': { count: 0, students: 0 },
      'Vakıf': { count: 0, students: 0 },
      'KKTC': { count: 0, students: 0 }
    };
    
    departmentRecords.forEach(rec => {
      if (byType[rec.universityType]) {
        byType[rec.universityType].count++;
        byType[rec.universityType].students += (rec.data2025?.sayi || 0);
      }
    });

    // Şehir bazlı dağılım
    const byCity = {};
    departmentRecords.forEach(rec => {
      const city = extractCity(rec.universiteName);
      if (!byCity[city]) {
        byCity[city] = { count: 0, students: 0 };
      }
      byCity[city].count++;
      byCity[city].students += (rec.data2025?.sayi || 0);
    });

    return {
      departmentName: departmentRecords[0].bolum,
      category,
      totalUniversities: departmentRecords.length,
      students2023,
      students2024,
      students2025,
      avgRate2023,
      avgRate2024,
      avgRate2025,
      byType,
      byCity
    };
  }, [departmentRecords]);

  // En çok öğrenci alan üniversiteler
  const topUniversities = useMemo(() => {
    return [...departmentRecords]
      .filter(d => d.data2025)
      .sort((a, b) => b.data2025.sayi - a.data2025.sayi)
      .slice(0, 10);
  }, [departmentRecords]);

  // Trend chart data - Top 5 üniversite
  const trendChartData = useMemo(() => {
    const top5 = [...departmentRecords]
      .filter(d => d.data2025)
      .sort((a, b) => b.data2025.sayi - a.data2025.sayi)
      .slice(0, 5);

    return [
      {
        year: '2023',
        ...top5.reduce((acc, uni, idx) => {
          acc[`uni${idx}`] = uni.data2023?.sayi || 0;
          return acc;
        }, {})
      },
      {
        year: '2024',
        ...top5.reduce((acc, uni, idx) => {
          acc[`uni${idx}`] = uni.data2024?.sayi || 0;
          return acc;
        }, {})
      },
      {
        year: '2025',
        ...top5.reduce((acc, uni, idx) => {
          acc[`uni${idx}`] = uni.data2025?.sayi || 0;
          return acc;
        }, {})
      }
    ];
  }, [departmentRecords]);

  const trendChartLines = useMemo(() => {
    const top5 = [...departmentRecords]
      .filter(d => d.data2025)
      .sort((a, b) => b.data2025.sayi - a.data2025.sayi)
      .slice(0, 5);

    return top5.map((uni, idx) => ({
      key: `uni${idx}`,
      name: uni.universiteName.substring(0, 25) + (uni.universiteName.length > 25 ? '...' : '')
    }));
  }, [departmentRecords]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-[2rem] border border-slate-100 m-4">
        <School className="w-16 h-16 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Bölüm bulunamadı</h2>
        <button 
            onClick={() => navigate('/analytics/departments')} 
            className="mt-4 text-[#B38F65] font-medium hover:underline flex items-center gap-2"
        >
            <ArrowLeft size={16} /> Listeye Dön
        </button>
      </div>
    );
  }

  const categoryColor = getCategoryColor(stats.category);

  return (
    <div className="space-y-6 md:space-y-8 pb-12 animate-fade-in w-full overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 pointer-events-none bg-[#B38F65]/20"></div>

        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-[#B38F65] transition-colors mb-6 group relative z-10"
        >
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-[#B38F65]/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">Geri Dön</span>
        </button>

        <div className="relative z-10">
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span 
                        className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: categoryColor }}
                    >
                        {stats.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" /> 2023-2025
                    </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                    {stats.departmentName}
                </h1>
            </div>
        </div>
      </div>

      {/* --- STAT CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Toplam Öğrenci */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-[#B38F65]/10 text-[#B38F65] rounded-2xl">
                    <Users className="w-6 h-6" />
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Toplam İH Öğrenci</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">{formatNumber(stats.students2025)}</div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-[#B38F65] bg-[#B38F65]/10 px-2 py-0.5 rounded-lg">
                        Ort. %{stats.avgRate2025}
                    </span>
                </div>
            </div>
        </div>

        {/* Üniversite Sayısı */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-[#B38F65]/10 text-[#B38F65] rounded-2xl">
                    <School className="w-6 h-6" />
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Üniversite Sayısı</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">{formatNumber(stats.totalUniversities)}</div>
                <div className="text-xs text-slate-400 mt-2">Farklı kurum</div>
            </div>
        </div>

        {/* Gelişim */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-[#B38F65]/10 text-[#B38F65] rounded-2xl">
                    {stats.students2025 >= stats.students2023 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Gelişim (2 Yıl)</div>
                <div className="flex items-baseline gap-2 mt-1">
                    <div className="text-3xl font-bold text-slate-800">
                         {stats.students2025 > stats.students2023 ? '+' : ''}
                         {formatNumber(stats.students2025 - stats.students2023)}
                    </div>
                </div>
                <div className={`text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded-lg
                     ${stats.students2025 >= stats.students2023 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stats.students2023 > 0 
                        ? `%${((stats.students2025 - stats.students2023) / stats.students2023 * 100).toFixed(1)} Değişim` 
                        : 'Yeni'}
                </div>
            </div>
        </div>

        {/* Popüler Şehir */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className="p-3 bg-[#B38F65]/10 text-[#B38F65] rounded-2xl">
                    <MapPin className="w-6 h-6" />
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Popüler Şehir</div>
                <div className="text-xl font-bold text-slate-800 mt-1 truncate" title={Object.entries(stats.byCity).sort((a, b) => b[1].students - a[1].students)[0]?.[0]}>
                    {Object.entries(stats.byCity).sort((a, b) => b[1].students - a[1].students)[0]?.[0] || '-'}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                    En çok tercih edilen il
                </div>
            </div>
        </div>
      </div>

      {/* --- CHARTS & DISTRIBUTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yıllık Gelişim (Text Based) */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#B38F65]" />
                Yıllık Gelişim
            </h3>
            
            <div className="space-y-4">
                {/* Öğrenci Sayısı */}
                <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-3">İH Öğrenci Sayısı</div>
                    <div className="flex justify-between items-center">
                        {[{y:'2023',v:stats.students2023}, {y:'2024',v:stats.students2024}, {y:'2025',v:stats.students2025}].map((d,i) => (
                            <div key={i} className="text-center flex-1">
                                <div className="text-xs text-slate-400 mb-1">{d.y}</div>
                                <div className={`text-lg md:text-xl font-bold ${i===2 ? 'text-[#B38F65]' : 'text-slate-700'}`}>
                                    {formatNumber(d.v)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ortalama Oran */}
                <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-3">Ortalama Oran (%)</div>
                    <div className="flex justify-between items-center">
                         {[{y:'2023',v:stats.avgRate2023}, {y:'2024',v:stats.avgRate2024}, {y:'2025',v:stats.avgRate2025}].map((d,i) => (
                            <div key={i} className="text-center flex-1">
                                <div className="text-xs text-slate-400 mb-1">{d.y}</div>
                                <div className={`text-lg md:text-xl font-bold ${i===2 ? 'text-[#B38F65]' : 'text-slate-700'}`}>
                                    %{d.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Üniversite Türüne Göre Dağılım */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#B38F65]" />
                Üniversite Türüne Göre
            </h3>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(stats.byType).map(([type, data]) => (
                    <div key={type} className="flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-[#B38F65]/5 transition-all">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-xl bg-white shadow-sm">
                            {type === 'Devlet' ? '🏛️' : type === 'Vakıf' ? '🏢' : '🌍'}
                        </div>
                        <h4 className="font-bold text-slate-700 text-sm">{type}</h4>
                        <div className="text-xl font-bold text-[#B38F65] my-1">{formatNumber(data.students)}</div>
                        <div className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">
                            {data.count} Üniv.
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- CHART SECTION (Line Chart) --- */}
      {trendChartLines.length > 0 && (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6">📈 Top 5 Üniversite Trendi</h3>
           <div className="h-[350px] md:h-[400px]">
             {/* Not: MultiLineChart bileşeninin renklerini içeriden veya props ile düzenlemek gerekebilir.
                 Burada genel container stilini güncelledik. */}
             <MultiLineChart 
                data={trendChartData}
                lines={trendChartLines}
                title="Yıllara Göre İH Öğrenci Sayısı"
            />
           </div>
        </div>
      )}

      {/* --- TOP 10 UNIVERSITIES --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                🏆 Top 10 Üniversite
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">En çok öğrenci alan kurumlar</p>
        </div>
        
        {/* 1. MOBILE CARD VIEW */}
        <div className="md:hidden flex flex-col p-4 gap-3 bg-slate-50/50">
            {topUniversities.map((uni, index) => {
                 const change = uni.data2025.sayi - (uni.data2023?.sayi || 0);
                 const badge = getUniversityTypeBadge(uni.universityType);
                 const city = extractCity(uni.universiteName);

                 return (
                    <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${index < 3 ? 'bg-[#B38F65] text-white shadow-md shadow-[#B38F65]/20' : 'bg-slate-100 text-slate-500'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{uni.universiteName}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-500">{city}</span>
                                        <span 
                                            className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                                            style={{ backgroundColor: `${badge.color}10`, color: badge.color, borderColor: `${badge.color}30` }}
                                        >
                                            {badge.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                             <div className="text-center">
                                <div className="text-[10px] text-slate-400">Öğrenci</div>
                                <div className="text-sm font-bold text-[#B38F65]">{formatNumber(uni.data2025.sayi)}</div>
                             </div>
                             <div className="text-center">
                                <div className="text-[10px] text-slate-400">Oran</div>
                                <div className="text-sm font-bold text-slate-700">%{uni.data2025.oran}</div>
                             </div>
                             <div className="text-center">
                                <div className="text-[10px] text-slate-400">Trend</div>
                                <div className={`text-sm font-bold ${change > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {change > 0 ? '+' : ''}{change}
                                </div>
                             </div>
                        </div>
                    </div>
                 )
            })}
        </div>

        {/* 2. DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">Sıra</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Üniversite</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Şehir</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Öğrenci (2025)</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Oran</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trend (3 Yıl)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {topUniversities.map((uni, index) => {
                        const change2023 = uni.data2023 && uni.data2025 ? uni.data2025.sayi - uni.data2023.sayi : null;
                        const badge = getUniversityTypeBadge(uni.universityType);
                        
                        return (
                        <tr key={index} className="hover:bg-[#B38F65]/5 transition-colors">
                            <td className="p-4 text-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs 
                                    ${index < 3 ? 'bg-[#B38F65] text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="font-semibold text-slate-700">{uni.universiteName}</div>
                                <div className="mt-1">
                                    <span 
                                        className="text-[10px] px-2 py-0.5 rounded font-medium border"
                                        style={{ backgroundColor: `${badge.color}15`, color: badge.color, borderColor: `${badge.color}30` }}
                                    >
                                        {badge.label}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-slate-500">
                                {extractCity(uni.universiteName)}
                            </td>
                            <td className="p-4 text-center">
                                <div className="font-bold text-slate-800 text-lg">{formatNumber(uni.data2025.sayi)}</div>
                            </td>
                            <td className="p-4 text-center">
                                <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-medium">
                                    {formatPercent(uni.data2025.oran)}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                {change2023 !== null ? (
                                    <span className={`inline-flex items-center gap-1 text-sm font-bold
                                        ${change2023 > 0 ? 'text-emerald-600' : change2023 < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                        {change2023 > 0 ? <TrendingUp size={14} /> : change2023 < 0 ? <TrendingDown size={14} /> : '•'} 
                                        {Math.abs(change2023)}
                                    </span>
                                ) : '-'}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- ALL UNIVERSITIES LIST --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg md:text-xl font-bold text-slate-800">📋 Tüm Üniversiteler</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Toplam {departmentRecords.length} üniversite listeleniyor</p>
        </div>
        
        {/* 1. MOBILE CARD VIEW (ALL) */}
        <div className="md:hidden flex flex-col p-4 gap-3 bg-slate-50/50">
            {departmentRecords.map((uni, index) => {
                 const badge = getUniversityTypeBadge(uni.universityType);

                 return (
                    <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-2 mb-3">
                             <h4 className="text-sm font-bold text-slate-800">{uni.universiteName}</h4>
                             <span className="self-start px-2 py-0.5 rounded text-[10px] font-bold border"
                                style={{ backgroundColor: `${badge.color}10`, color: badge.color, borderColor: `${badge.color}30` }}>
                                {badge.label}
                             </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                             <div className="text-center p-2 bg-slate-50 rounded-lg">
                                <div className="text-[10px] text-slate-400 mb-0.5">2023</div>
                                <div className="text-xs font-bold text-slate-600">{uni.data2023?.sayi || '-'}</div>
                             </div>
                             <div className="text-center p-2 bg-slate-50 rounded-lg">
                                <div className="text-[10px] text-slate-400 mb-0.5">2024</div>
                                <div className="text-xs font-bold text-slate-600">{uni.data2024?.sayi || '-'}</div>
                             </div>
                             <div className="text-center p-2 bg-[#B38F65]/10 rounded-lg border border-[#B38F65]/20">
                                <div className="text-[10px] text-[#B38F65] mb-0.5">2025</div>
                                <div className="text-sm font-bold text-[#B38F65]">{uni.data2025?.sayi || '-'}</div>
                             </div>
                        </div>
                    </div>
                 )
            })}
        </div>

        {/* 2. DESKTOP TABLE VIEW (ALL) */}
        <div className="hidden md:block overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Üniversite</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">2023</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">2024</th>
                        <th className="p-4 text-xs font-bold text-[#B38F65] uppercase text-center bg-[#B38F65]/5">2025</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {departmentRecords.map((uni, index) => {
                        const badge = getUniversityTypeBadge(uni.universityType);
                        
                        return (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <div className="font-medium text-slate-700">{uni.universiteName}</div>
                                <span className="text-[10px] text-slate-400">{badge.label}</span>
                            </td>
                            <td className="p-4 text-center text-sm text-slate-500 tabular-nums">
                                {uni.data2023 ? `${formatNumber(uni.data2023.sayi)} (%${uni.data2023.oran})` : '-'}
                            </td>
                            <td className="p-4 text-center text-sm text-slate-500 tabular-nums">
                                {uni.data2024 ? `${formatNumber(uni.data2024.sayi)} (%${uni.data2024.oran})` : '-'}
                            </td>
                            <td className="p-4 text-center text-sm font-bold text-slate-800 tabular-nums bg-[#B38F65]/5 border-l border-[#B38F65]/10">
                                {uni.data2025 ? `${formatNumber(uni.data2025.sayi)} (%${uni.data2025.oran})` : '-'}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

// Helper for Category Colors 
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

export default DepartmentDetail;