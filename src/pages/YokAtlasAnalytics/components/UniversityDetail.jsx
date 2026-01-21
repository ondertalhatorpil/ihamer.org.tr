import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  School,
  BarChart3,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { ComparisonBarChart } from './TrendChart';
import Tooltip from './Tooltip';
import { formatNumber, formatPercent } from '../utils/helpers';
import { getDepartmentCategory } from '../utils/dataProcessor';

const UniversityDetail = ({ data }) => {
  const { universityName } = useParams();
  const navigate = useNavigate();
  
  // Üniversiteye ait tüm kayıtları filtrele
  // DÜZENLEME: (AÇIKÖĞRETİM) filtresi buraya eklendi.
  // Böylece tüm istatistikler ve listeler otomatik olarak güncellendi.
  const universityRecords = useMemo(() => {
    return data.filter(d => 
      d.universiteName === decodeURIComponent(universityName) && 
      d.data2025 &&
      !d.bolum.includes('(AÇIKÖĞRETİM)') // <-- FİLTRE BURADA
    );
  }, [data, universityName]);

  // İstatistikleri hesapla
  const stats = useMemo(() => {
    if (universityRecords.length === 0) return null;

    const record = universityRecords[0];
    
    // Yıllara göre toplam öğrenci
    const students2023 = universityRecords.reduce((sum, d) => sum + (d.data2023?.sayi || 0), 0);
    const students2024 = universityRecords.reduce((sum, d) => sum + (d.data2024?.sayi || 0), 0);
    const students2025 = universityRecords.reduce((sum, d) => sum + (d.data2025?.sayi || 0), 0);

    // Ortalama oranlar
    const rates2023 = universityRecords.filter(d => d.data2023).map(d => d.data2023.oran);
    const rates2024 = universityRecords.filter(d => d.data2024).map(d => d.data2024.oran);
    const rates2025 = universityRecords.filter(d => d.data2025).map(d => d.data2025.oran);

    const avgRate2023 = rates2023.length > 0 ? (rates2023.reduce((a, b) => a + b, 0) / rates2023.length).toFixed(2) : 0;
    const avgRate2024 = rates2024.length > 0 ? (rates2024.reduce((a, b) => a + b, 0) / rates2024.length).toFixed(2) : 0;
    const avgRate2025 = rates2025.length > 0 ? (rates2025.reduce((a, b) => a + b, 0) / rates2025.length).toFixed(2) : 0;

    // Kategori bazlı dağılım
    const byCategory = {};
    universityRecords.forEach(rec => {
      const cat = getDepartmentCategory(rec.bolum);
      if (!byCategory[cat]) {
        byCategory[cat] = { count: 0, students: 0 };
      }
      byCategory[cat].count++;
      byCategory[cat].students += (rec.data2025?.sayi || 0);
    });

    return {
      universityName: record.universiteName,
      universityType: record.universityType,
      totalDepartments: universityRecords.length,
      students2023,
      students2024,
      students2025,
      avgRate2023,
      avgRate2024,
      avgRate2025,
      byCategory
    };
  }, [universityRecords]);

  // En çok öğrenci alan bölümler
  // universityRecords zaten filtrelendiği için burada ekstra filtreye gerek yok.
  // Direkt en yüksek 10 taneyi alacaktır.
  const topDepartments = useMemo(() => {
    return [...universityRecords]
      .filter(d => d.data2025)
      .sort((a, b) => b.data2025.sayi - a.data2025.sayi)
      .slice(0, 10);
  }, [universityRecords]);

  // Kategori chart data
  const categoryChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.byCategory)
      .map(([name, data]) => ({ name, value: data.students }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-[2rem] border border-slate-100 m-4">
        <School className="w-16 h-16 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Üniversite bulunamadı veya veri yok</h2>
        <button 
            onClick={() => navigate('/analytics/universities')} 
            className="mt-4 text-[#B38F65] font-medium hover:underline flex items-center gap-2"
        >
            <ArrowLeft size={16} /> Listeye Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-12 animate-fade-in w-full overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
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
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#B38F65] text-white shadow-sm shadow-[#B38F65]/30">
                        {stats.universityType}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" /> 2023-2025
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        <MapPinIcon city={stats.universityName} />
                    </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                    {stats.universityName}
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

        {/* Toplam Bölüm */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-[#B38F65]/10 text-[#B38F65] rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Toplam Bölüm</div>
            <div className="text-3xl font-bold text-slate-800 mt-1">{formatNumber(stats.totalDepartments)}</div>
            <div className="text-xs text-slate-400 mt-2">Aktif program sayısı</div>
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

        {/* Popüler Bölüm */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-[#B38F65]/10 text-[#B38F65] rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">En Popüler Alan</div>
            <div className="text-xl font-bold text-slate-800 mt-1 truncate" title={Object.entries(stats.byCategory).sort((a, b) => b[1].students - a[1].students)[0]?.[0]}>
              {Object.entries(stats.byCategory).sort((a, b) => b[1].students - a[1].students)[0]?.[0] || '-'}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              En çok öğrenci alan kategori
            </div>
          </div>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yıllık Gelişim */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#B38F65]" />
            Yıllık Gelişim
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-3">Öğrenci Sayısı</div>
                <div className="flex justify-between items-center">
                    {[{y:'2023',v:stats.students2023}, {y:'2024',v:stats.students2024}, {y:'2025',v:stats.students2025}].map((d,i) => (
                        <div key={i} className="text-center flex-1">
                            <div className="text-xs text-slate-400 mb-1">{d.y}</div>
                            <div className={`text-lg md:text-xl font-bold ${i===2 ? 'text-[#B38F65]' : 'text-slate-700'}`}>{formatNumber(d.v)}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase mb-3">Ortalama Oran (%)</div>
                <div className="flex justify-between items-center">
                    {[{y:'2023',v:stats.avgRate2023}, {y:'2024',v:stats.avgRate2024}, {y:'2025',v:stats.avgRate2025}].map((d,i) => (
                        <div key={i} className="text-center flex-1">
                            <div className="text-xs text-slate-400 mb-1">{d.y}</div>
                            <div className={`text-lg md:text-xl font-bold ${i===2 ? 'text-[#B38F65]' : 'text-slate-700'}`}>%{d.v}</div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Kategori Dağılımı */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <School className="w-5 h-5 text-[#B38F65]" />
            Kategori Dağılımı
          </h3>
          <div className="flex-1 min-h-[250px]">
            <ComparisonBarChart data={categoryChartData} title="" />
          </div>
        </div>
      </div>

      {/* --- TOP 10 DEPARTMENTS SECTION --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            🏆 En Çok Tercih Edilenler
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Bu üniversitede en çok öğrenci alan 10 bölüm</p>
        </div>

        {/* 1. MOBILE CARD VIEW (TOP 10) */}
        <div className="md:hidden flex flex-col p-4 gap-3 bg-slate-50/50">
            {topDepartments.map((dept, index) => {
                 const change = dept.data2025.sayi - (dept.data2023?.sayi || 0);
                 const category = getDepartmentCategory(dept.bolum);
                 const categoryColor = getCategoryColor(category);

                 return (
                    <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${index < 3 ? 'bg-[#B38F65] text-white shadow-md shadow-[#B38F65]/20' : 'bg-slate-100 text-slate-500'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{dept.bolum}</h4>
                                    <span 
                                        className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border"
                                        style={{ backgroundColor: `${categoryColor}10`, color: categoryColor, borderColor: `${categoryColor}20` }}
                                    >
                                        {category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                             <div className="text-center">
                                <div className="text-[10px] text-slate-400">Öğrenci</div>
                                <div className="text-sm font-bold text-[#B38F65]">{formatNumber(dept.data2025.sayi)}</div>
                             </div>
                             <div className="text-center">
                                <div className="text-[10px] text-slate-400">Oran</div>
                                <div className="text-sm font-bold text-slate-700">%{dept.data2025.oran}</div>
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

        {/* 2. DESKTOP TABLE VIEW (TOP 10) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center w-16">Sıra</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Bölüm</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Öğrenci (2025)</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Oran</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Kategori</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Trend (2 Yıl)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topDepartments.map((dept, index) => {
                const change2023 = dept.data2023 && dept.data2025 ? dept.data2025.sayi - dept.data2023.sayi : null;
                const category = getDepartmentCategory(dept.bolum);
                const categoryColor = getCategoryColor(category);
                
                return (
                  <tr key={index} className="hover:bg-[#B38F65]/5 transition-colors">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs 
                        ${index < 3 ? 'bg-[#B38F65] text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{dept.bolum}</td>
                    <td className="p-4 text-center font-bold text-slate-800">{formatNumber(dept.data2025.sayi)}</td>
                    <td className="p-4 text-center text-sm font-medium text-slate-600">%{dept.data2025.oran}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold border inline-block"
                        style={{ backgroundColor: `${categoryColor}10`, color: categoryColor, borderColor: `${categoryColor}20` }}>
                        {category}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                       {change2023 !== null ? (
                        <span className={`inline-flex items-center gap-1 text-sm font-bold ${change2023 > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {change2023 > 0 ? <TrendingUp size={14} /> : change2023 < 0 ? <TrendingDown size={14} /> : ''} 
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

      {/* --- ALL DEPARTMENTS SECTION --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">📋 Tüm Bölümler</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Toplam {universityRecords.length} bölüm listeleniyor</p>
        </div>
        
        {/* 1. MOBILE CARD VIEW (ALL) */}
        <div className="md:hidden flex flex-col p-4 gap-3 bg-slate-50/50">
            {universityRecords.map((dept, index) => {
                 const category = getDepartmentCategory(dept.bolum);
                 const categoryColor = getCategoryColor(category);

                 return (
                    <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-2 mb-3">
                             <h4 className="text-sm font-bold text-slate-800">{dept.bolum}</h4>
                             <span className="self-start px-2 py-0.5 rounded text-[10px] font-bold border"
                                style={{ backgroundColor: `${categoryColor}10`, color: categoryColor, borderColor: `${categoryColor}20` }}>
                                {category}
                             </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                             <div className="text-center p-2 bg-slate-50 rounded-lg">
                                <div className="text-[10px] text-slate-400 mb-0.5">2023</div>
                                <div className="text-xs font-bold text-slate-600">{dept.data2023?.sayi || '-'}</div>
                             </div>
                             <div className="text-center p-2 bg-slate-50 rounded-lg">
                                <div className="text-[10px] text-slate-400 mb-0.5">2024</div>
                                <div className="text-xs font-bold text-slate-600">{dept.data2024?.sayi || '-'}</div>
                             </div>
                             <div className="text-center p-2 bg-[#B38F65]/10 rounded-lg border border-[#B38F65]/20">
                                <div className="text-[10px] text-[#B38F65] mb-0.5">2025</div>
                                <div className="text-sm font-bold text-[#B38F65]">{dept.data2025?.sayi || '-'}</div>
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
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Bölüm</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Kategori</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">2023</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">2024</th>
                <th className="p-4 text-xs font-bold text-[#B38F65] uppercase text-center bg-[#B38F65]/5">2025</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {universityRecords.map((dept, index) => {
                const category = getDepartmentCategory(dept.bolum);
                const categoryColor = getCategoryColor(category);
                
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">{dept.bolum}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 rounded-lg text-xs font-bold border inline-block"
                        style={{ backgroundColor: `${categoryColor}10`, color: categoryColor, borderColor: `${categoryColor}20` }}>
                        {category}
                      </span>
                    </td>
                    <td className="p-4 text-center text-sm text-slate-500 tabular-nums">
                      {dept.data2023 ? `${formatNumber(dept.data2023.sayi)} (%${dept.data2023.oran})` : '-'}
                    </td>
                    <td className="p-4 text-center text-sm text-slate-500 tabular-nums">
                      {dept.data2024 ? `${formatNumber(dept.data2024.sayi)} (%${dept.data2024.oran})` : '-'}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-slate-800 tabular-nums bg-[#B38F65]/5 border-l border-[#B38F65]/10">
                      {dept.data2025 ? `${formatNumber(dept.data2025.sayi)} (%${dept.data2025.oran})` : '-'}
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

// Basit İkon Bileşeni (MapPin yerine kullanılabilir)
const MapPinIcon = ({ city }) => (
    <>
        <School className="w-3.5 h-3.5" /> 
        Türkiye
    </>
);

// Kategori Renkleri
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

export default UniversityDetail;