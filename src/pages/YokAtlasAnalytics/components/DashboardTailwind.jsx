import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  BookOpen, 
  MapPin,
  Info,
  Award,
  BarChart3,
  Calendar
} from 'lucide-react';
import { getGeneralStatistics, getTopRecords, getTrendingRecords } from '../utils/statistics';
import { formatNumber, formatPercent } from '../utils/helpers';

const Dashboard = ({ data }) => {
  const navigate = useNavigate();

  // İstatistikleri hesapla
  const stats = useMemo(() => getGeneralStatistics(data), [data]);

  // Top kayıtlar
  const topByStudents = useMemo(() => getTopRecords(data, 'students', 20, 2025, 10, 0), [data]);
  const topByRate = useMemo(() => getTopRecords(data, 'rate', 10, 2025, 10, 50), [data]);

  // Trend verileri
  const rising = useMemo(() => getTrendingRecords(data, 'rising', 10, 5), [data]);
  // const falling = useMemo(() => getTrendingRecords(data, 'falling', 10, 5), [data]); // İstersen kullanabilirsin

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
             Genel Bakış
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            İmam Hatip Lisesi mezunlarının tercih eğilimleri ve istatistikleri.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm shadow-sm font-medium">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>Veri Periyodu: 2023-2025</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Toplam İH Öğrenci"
          value={formatNumber(stats.stats2025.totalStudents)}
          subtitle={`Ortalama Oran: ${stats.stats2025.averageRate}%`}
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
          tooltipText="YÖK Atlas'tan çekilen toplam program kaydı"
        />
        
        <StatCard
          icon={<Building2 className="w-6 h-6" />}
          title="Üniversite"
          value={formatNumber(stats.uniqueUniversities)}
          subtitle="Farklı üniversite"
          color="violet"
          tooltipText="Listelenen toplam üniversite sayısı"
        />
        
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Bölüm"
          value={formatNumber(stats.uniqueDepartments)}
          subtitle="Farklı bölüm türü"
          color="emerald"
          tooltipText="Farklı bölüm/program çeşitliliği"
        />
      </div>

      {/* Comparison Cards - 2023 vs 2025 */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                Dönemsel Karşılaştırma (2023 vs 2025)
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ComparisonCard
                title="Toplam İH Öğrenci Sayısı"
                year2023={stats.stats2023.totalStudents}
                year2025={stats.stats2025.totalStudents}
            />
            
            <ComparisonCard
                title="Veri İçeren Program Sayısı"
                year2023={stats.stats2023.recordCount}
                year2025={stats.stats2025.recordCount}
            />
            
            <ComparisonCard
                title="Ortalama İH Oranı"
                year2023={parseFloat(stats.stats2023.averageRate)}
                year2025={parseFloat(stats.stats2025.averageRate)}
                unit="%"
                isPercentage
            />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Top Lists (Takes 2 columns on large screens) */}
        <div className="xl:col-span-2 space-y-8">
            
            {/* Top 20 Students */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Award className="w-6 h-6 text-amber-500" />
                            En Çok Tercih Edilenler
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Öğrenci sayısına göre Top 20 (Min. 10 öğrenci)
                        </p>
                    </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topByStudents.map((record, index) => (
                    <RankingItem
                        key={index}
                        rank={index + 1}
                        title={record.universiteName}
                        subtitle={record.bolum}
                        primaryValue={formatNumber(record.data2025.sayi)}
                        secondaryValue="Öğrenci"
                        badge={record.universityType}
                        onClick={() => navigate(`/analytics/university/${encodeURIComponent(record.universiteName)}`)}
                    />
                    ))}
                </div>
            </div>

            {/* Trending Up */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                            Yükselen Trendler (Top 10)
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">2023-2025 arası en çok artış gösterenler</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rising.map((record, index) => (
                        <TrendItem
                        key={index}
                        rank={index + 1}
                        title={record.bolum}
                        subtitle={record.universiteName}
                        change={record.trendData.percentChange}
                        students2023={record.data2023?.sayi || 0}
                        students2025={record.data2025?.sayi || 0}
                        type="up"
                        />
                    ))}
                </div>
            </div>

        </div>

        {/* Right Column: High Rate & Info */}
        <div className="space-y-8">
            
            {/* Top Rate List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        En Yüksek Yoğunluk
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Min. 50 kontenjanlı bölümler</p>
                </div>

                <div className="p-2 overflow-y-auto max-h-[600px] custom-scrollbar">
                    {topByRate.map((record, index) => (
                        <div 
                            key={index}
                            onClick={() => navigate(`/analytics/university/${encodeURIComponent(record.universiteName)}`)}
                            className="group flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all cursor-pointer border-b border-slate-50 last:border-0"
                        >
                            <div className="flex-shrink-0 w-8 h-8 bg-white border border-slate-100 text-slate-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-blue-200 group-hover:text-blue-600">
                                {index + 1}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-700 truncate group-hover:text-blue-700">
                                    {record.universiteName}
                                </div>
                                <div className="text-xs text-slate-400 truncate">{record.bolum}</div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-bold text-blue-600">
                                    {formatPercent(record.data2025.oran)}
                                </div>
                                <div className="text-[10px] text-slate-400">{record.data2025.sayi} Öğr.</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Cards */}
            <InfoCard
                title="📌 Veri Notları"
                items={[
                    { label: "Veri Kaynağı", text: "YÖK Atlas (2023-2025)" },
                    { label: "Minimum Kriter", text: "Analizlerde min. 10 öğrenci şartı aranmıştır." },
                    { label: "Trend Analizi", text: "3 yıllık değişim baz alınmıştır." },
                ]}
            />
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS (STYLED) ---

const StatCard = ({ icon, title, value, subtitle, trend, color = "blue", tooltipText }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3.5 rounded-2xl transition-colors duration-300 ${colorStyles[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
              trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend === 'up' ? 'Artış' : 'Azalış'}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
             <span className="text-sm font-medium text-slate-500">{title}</span>
             {tooltipText && (
              <Tooltip text={tooltipText}>
                <Info className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 cursor-help" />
              </Tooltip>
             )}
        </div>
        <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
        <div className="text-xs font-medium text-slate-400 mt-1">{subtitle}</div>
      </div>
    </div>
  );
};

const ComparisonCard = ({ title, year2023, year2025, unit = '', isPercentage = false }) => {
  const change = year2025 - year2023;
  const percentChange = year2023 > 0 ? ((change / year2023) * 100).toFixed(1) : 0;
  const isPositive = change > 0;

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-colors">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">{title}</h3>
      <div className="flex items-center justify-between px-2">
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1 font-medium">2023</div>
          <div className="text-lg font-bold text-slate-600">{formatNumber(year2023)}{unit}</div>
        </div>
        
        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full text-[10px] font-bold
            ${isPositive ? 'bg-white text-emerald-600 shadow-sm' : 'bg-white text-rose-500 shadow-sm'}`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>%{Math.abs(percentChange)}</span>
        </div>

        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1 font-medium">2025</div>
          <div className="text-2xl font-bold text-slate-800">{formatNumber(year2025)}{unit}</div>
        </div>
      </div>
    </div>
  );
};

const RankingItem = ({ rank, title, subtitle, primaryValue, secondaryValue, badge, onClick }) => {
  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (rank === 2) return 'bg-slate-200 text-slate-600 border-slate-300';
    if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-white border-slate-200 text-slate-500';
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className={`flex-shrink-0 w-10 h-10 border ${getRankColor(rank)} rounded-xl flex items-center justify-center font-bold text-sm shadow-sm`}>
        {rank}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
          {title}
        </div>
        <div className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</div>
        <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-medium border
            ${badge === 'Devlet' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
              badge === 'Vakıf' ? 'bg-violet-50 text-violet-700 border-violet-100' : 
              'bg-orange-50 text-orange-700 border-orange-100'}`}>
          {badge}
        </span>
      </div>

      <div className="text-right pl-2">
        <div className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
          {primaryValue}
        </div>
        <div className="text-xs font-medium text-slate-400">{secondaryValue}</div>
      </div>
    </div>
  );
};

const TrendItem = ({ rank, title, subtitle, change, students2023, students2025, type }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="text-xs font-bold text-slate-400 w-5">#{rank}</div>
        <div className="min-w-0">
            <div className="text-sm font-bold text-slate-800 truncate">{title}</div>
            <div className="text-xs text-slate-500 truncate">{subtitle}</div>
        </div>
      </div>

      <div className="text-right pl-4">
        <div className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold mb-1">
          <TrendingUp className="w-3 h-3 mr-1" />
          %{change.toFixed(0)}
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          {students2023} ➔ {students2025}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, items }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
             <div>
                <div className="text-xs font-bold text-slate-700">{item.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{item.text}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tooltip Component
const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

export default Dashboard;