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
  Calendar
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
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Bölüm bulunamadı</h2>
            <button onClick={() => navigate('/analytics')} className="mt-4 text-blue-600 hover:underline">
                Anasayfaya Dön
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 pointer-events-none"></div>

        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
            <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Geri Dön</span>
        </button>

        <div className="relative">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span 
                            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                            style={{ backgroundColor: getCategoryColor(stats.category) }}
                        >
                            {stats.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                            <Calendar className="w-3 h-3" /> 2023-2025 Dönemi
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                        {stats.departmentName}
                    </h1>
                </div>
            </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                </div>
                <Tooltip text="2025 yılında bu bölüme yerleşen toplam İH mezunu öğrenci sayısı">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:text-blue-500 cursor-help border border-transparent hover:border-slate-100">?</div>
                </Tooltip>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Toplam İH Öğrenci (2025)</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">{formatNumber(stats.students2025)}</div>
                <div className="text-xs font-medium text-blue-600 mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded">
                    Ortalama Oran: {formatPercent(stats.avgRate2025)}
                </div>
            </div>
        </div>

        {/* University Count Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <School className="w-6 h-6" />
                </div>
                <Tooltip text="Bu bölümün bulunduğu üniversite sayısı">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:text-violet-500 cursor-help border border-transparent hover:border-slate-100">?</div>
                </Tooltip>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Üniversite Sayısı</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">{formatNumber(stats.totalUniversities)}</div>
                <div className="text-xs text-slate-400 mt-1">Farklı kurum</div>
            </div>
        </div>

        {/* Growth Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl transition-colors
                    ${stats.students2025 >= stats.students2023 
                        ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' 
                        : 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'}`}>
                    {stats.students2025 >= stats.students2023 
                        ? <TrendingUp className="w-6 h-6" /> 
                        : <TrendingDown className="w-6 h-6" />}
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">Gelişim (2023-2025)</div>
                <div className="flex items-baseline gap-2 mt-1">
                    <div className="text-3xl font-bold text-slate-800">
                         {stats.students2025 > stats.students2023 ? '+' : ''}
                         {formatNumber(stats.students2025 - stats.students2023)}
                    </div>
                </div>
                <div className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded
                     ${stats.students2025 >= stats.students2023 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {stats.students2023 > 0 
                        ? `%${((stats.students2025 - stats.students2023) / stats.students2023 * 100).toFixed(1)}` 
                        : 'Yeni'}
                </div>
            </div>
        </div>

        {/* Popular City Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                </div>
            </div>
            <div>
                <div className="text-sm font-medium text-slate-500">En Popüler Şehir</div>
                <div className="text-3xl font-bold text-slate-800 mt-1 truncate" title={Object.entries(stats.byCity).sort((a, b) => b[1].students - a[1].students)[0]?.[0]}>
                    {Object.entries(stats.byCity).sort((a, b) => b[1].students - a[1].students)[0]?.[0] || '-'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                    {formatNumber(Object.entries(stats.byCity).sort((a, b) => b[1].students - a[1].students)[0]?.[1].students || 0)} öğrenci ile
                </div>
            </div>
        </div>
      </div>

      {/* Yearly Progress & Type Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yearly Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                Yıllık Gelişim Analizi
            </h3>
            
            <div className="space-y-6">
                {/* Students Count Progress */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">İH Öğrenci Sayısı</span>
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                        
                        {[
                            { year: '2023', val: stats.students2023 },
                            { year: '2024', val: stats.students2024 },
                            { year: '2025', val: stats.students2025 }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
                                <div className="text-xs text-slate-400 font-medium mb-1">{item.year}</div>
                                <div className={`text-lg font-bold ${idx === 2 ? 'text-blue-600' : 'text-slate-700'}`}>
                                    {formatNumber(item.val)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rate Progress */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Ortalama İH Oranı</span>
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                        
                        {[
                            { year: '2023', val: stats.avgRate2023 },
                            { year: '2024', val: stats.avgRate2024 },
                            { year: '2025', val: stats.avgRate2025 }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
                                <div className="text-xs text-slate-400 font-medium mb-1">{item.year}</div>
                                <div className={`text-lg font-bold ${idx === 2 ? 'text-violet-600' : 'text-slate-700'}`}>
                                    %{item.val}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Type Distribution */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" />
                Üniversite Türüne Göre (2025)
            </h3>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(stats.byType).map(([type, data]) => (
                    <div key={type} className="flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 text-lg
                            ${type === 'Devlet' ? 'bg-blue-100 text-blue-600' : 
                              type === 'Vakıf' ? 'bg-violet-100 text-violet-600' : 'bg-orange-100 text-orange-600'}`}>
                            {type === 'Devlet' ? '🏛️' : type === 'Vakıf' ? '🏢' : '🌍'}
                        </div>
                        <h4 className="font-bold text-slate-700">{type}</h4>
                        <div className="text-2xl font-bold text-slate-800 my-1">{formatNumber(data.students)}</div>
                        <div className="text-xs text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
                            {data.count} üniversite
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Charts Section */}
      {trendChartLines.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6">📈 Top 5 Üniversite Trendi</h3>
           <div className="h-[400px]">
             <MultiLineChart 
                data={trendChartData}
                lines={trendChartLines}
                title="Yıllara Göre İH Öğrenci Sayısı"
            />
           </div>
        </div>
      )}

      {/* Top 10 Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h2 className="text-xl font-bold text-slate-800">🏆 Top 10 Üniversite</h2>
                <p className="text-sm text-slate-500 mt-1">En çok İH öğrencisi alan üniversiteler</p>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">Sıra</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Üniversite</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Şehir</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">İH Öğrenci (2025)</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Oran</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trend (3 Yıl)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {topUniversities.map((uni, index) => {
                        const change2023 = uni.data2023 && uni.data2025
                        ? uni.data2025.sayi - uni.data2023.sayi
                        : null;
                        const badge = getUniversityTypeBadge(uni.universityType);
                        
                        return (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="p-4 text-center">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-bold text-xs 
                                    ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {index + 1}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                    {uni.universiteName}
                                </div>
                                <div className="mt-1">
                                    <span 
                                        className="text-[10px] px-2 py-0.5 rounded font-medium border"
                                        style={{ 
                                            backgroundColor: `${badge.color}15`, // %10 opacity
                                            color: badge.color,
                                            borderColor: `${badge.color}30`
                                        }}
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
                                        {change2023 > 0 ? <TrendingUp className="w-4 h-4" /> : change2023 < 0 ? <TrendingDown className="w-4 h-4" /> : '•'} 
                                        {Math.abs(change2023)}
                                    </span>
                                ) : (
                                    <span className="text-slate-300">-</span>
                                )}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      {/* All Universities Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">📋 Tüm Üniversiteler</h2>
            <p className="text-sm text-slate-500 mt-1">Bu bölümün bulunduğu tüm üniversitelerin listesi ({departmentRecords.length})</p>
        </div>
        
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Üniversite</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">2023</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">2024</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center bg-blue-50/50">2025</th>
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
                                {uni.data2023 
                                    ? `${formatNumber(uni.data2023.sayi)} (%${uni.data2023.oran})`
                                    : <span className="text-slate-300">-</span>
                                }
                            </td>
                            <td className="p-4 text-center text-sm text-slate-500 tabular-nums">
                                {uni.data2024 
                                    ? `${formatNumber(uni.data2024.sayi)} (%${uni.data2024.oran})`
                                    : <span className="text-slate-300">-</span>
                                }
                            </td>
                            <td className="p-4 text-center text-sm font-bold text-slate-800 tabular-nums bg-blue-50/30">
                                {uni.data2025 
                                    ? `${formatNumber(uni.data2025.sayi)} (%${uni.data2025.oran})`
                                    : <span className="text-slate-300">-</span>
                                }
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

// Helper for Category Colors (Hex codes to match inline styles for strict color coding)
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

export default DepartmentDetail;