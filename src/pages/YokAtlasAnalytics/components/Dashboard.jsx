import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Users, Building2, BookOpen, 
  MapPin, Info, Award, BarChart3, Calendar, ArrowRight 
} from 'lucide-react';
import { getGeneralStatistics, getTopRecords, getTrendingRecords } from '../utils/statistics';
import { formatNumber, formatPercent } from '../utils/helpers';
import StatCard, { ComparisonStatCard } from './StatCard'; // StatCard bileşenini import ettiğinden emin ol
import Tooltip from './Tooltip';

const Dashboard = ({ data }) => {
  const navigate = useNavigate();

  // İstatistikler
  const stats = useMemo(() => getGeneralStatistics(data), [data]);
  const topByStudents = useMemo(() => getTopRecords(data, 'students', 20, 2025, 10, 0), [data]);
  const topByRate = useMemo(() => getTopRecords(data, 'rate', 10, 2025, 10, 50), [data]);
  const rising = useMemo(() => getTrendingRecords(data, 'rising', 10, 5), [data]);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 ">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Genel Bakış</h1>
        </div>
        <div className="flex items-center gap-2 bg-white text-sm font-medium text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Veri Dönemi(Lisans):</span>
          <span className="text-slate-900 font-bold">2023 - 2025</span>
        </div>
      </div>

      {/* --- KPI CARDS (Üst İstatistikler) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Toplam İH Öğrenci"
          value={formatNumber(stats.stats2025.totalStudents)}
          subtitle={`Ortalama Oran: %${stats.stats2025.averageRate}`}
          trend={stats.stats2025.totalStudents > stats.stats2023.totalStudents ? 'up' : 'down'}
          color="blue"
          tooltipText="2025 yılında yerleşen toplam İmam Hatip mezunu sayısı"
        />
        <StatCard
          icon={<MapPin className="w-6 h-6" />}
          title="Toplam Kayıt"
          value={formatNumber(stats.totalRecords)}
          subtitle={`${formatNumber(stats.validRecords)} aktif veri`}
          color="indigo"
          tooltipText="Analiz edilen toplam program satırı"
        />
        <StatCard
          icon={<Building2 className="w-6 h-6" />}
          title="Üniversite"
          value={formatNumber(stats.uniqueUniversities)}
          subtitle="Aktif kurum"
          color="violet"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Bölüm"
          value={formatNumber(stats.uniqueDepartments)}
          subtitle="Farklı program türü"
          color="emerald"
        />
      </div>

      {/* --- COMPARISON SECTION (Yıl Karşılaştırması) --- */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Dönemsel Performans (2023 vs 2025)
            </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <ComparisonStatCard
                title="Toplam Öğrenci Hacmi"
                current={stats.stats2025.totalStudents}
                previous={stats.stats2023.totalStudents}
            />
            <ComparisonStatCard
                title="Veri Kapsamı (Program)"
                current={stats.stats2025.recordCount}
                previous={stats.stats2023.recordCount}
            />
            <ComparisonStatCard
                title="Ortalama Yerleşme Oranı"
                current={parseFloat(stats.stats2025.averageRate)}
                previous={parseFloat(stats.stats2023.averageRate)}
                unit="%"
            />
        </div>
      </div>

      {/* --- LISTELER (Grid Layout) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* SOL KOLON: En Çok Tercih Edilenler */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        En Çok Tercih Edilenler
                    </h2>
                    <p className="text-sm text-slate-500">Öğrenci sayısına göre sıralı (Top 20)</p>
                </div>
                <button 
                  onClick={() => navigate('/analytics/universities')}
                  className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  Tümü <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topByStudents.map((record, index) => (
                    <div 
                        key={index}
                        onClick={() => navigate(`/analytics/university/${encodeURIComponent(record.universiteName)}`)}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer bg-slate-50/30"
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm
                            ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-500 border border-slate-200'}`}>
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-700 transition-colors">
                                {record.universiteName}
                            </h4>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{record.bolum}</p>
                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-500">
                                {record.universityType}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-slate-800 tabular-nums">{formatNumber(record.data2025.sayi)}</div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Öğrenci</div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* SAĞ KOLON: Trendler ve Yüksek Oranlar */}
        <div className="flex flex-col gap-6 h-[600px]">
            
            {/* Yükselen Trendler */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        Yükselen Trendler
                    </h2>
                    <p className="text-sm text-slate-500">Son 3 yılda en çok artış gösterenler</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {rising.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                             <div className="flex-1 min-w-0 pr-2">
                                <div className="text-sm font-bold text-slate-800 truncate">{record.bolum}</div>
                                <div className="text-xs text-slate-500 truncate">{record.universiteName}</div>
                             </div>
                             <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                +%{record.trendData.percentChange.toFixed(0)}
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* En Yüksek Yoğunluk */}
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-violet-50/30">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-600" />
                        En Yüksek Yoğunluk
                    </h2>
                    <p className="text-sm text-slate-500">Min. 50 kontenjanlı bölümler</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                     {topByRate.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                             <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs font-bold text-slate-400 w-4">{index + 1}</span>
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-slate-800 truncate">{record.universiteName}</div>
                                    <div className="text-xs text-slate-500 truncate">{record.bolum}</div>
                                </div>
                             </div>
                             <div className="text-right pl-2">
                                <div className="text-sm font-bold text-violet-600 tabular-nums">%{record.data2025.oran}</div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;