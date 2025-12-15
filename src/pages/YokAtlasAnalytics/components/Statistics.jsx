import React, { useMemo } from 'react';
import { 
  Map, 
  Users, 
  TrendingUp, 
  Building2, 
  BarChart3, 
  MapPin, 
  Globe 
} from 'lucide-react';
import { getCityStatistics } from '../utils/statistics';
import { formatNumber, formatPercent } from '../utils/helpers';
import { ComparisonBarChart } from './TrendChart';
import StatCard, { StatGrid } from './StatCard';

const Statistics = ({ data }) => {
  // Şehir istatistikleri
  const cityStats = useMemo(() => getCityStatistics(data), [data]);
  
  // Top 20 şehir
  const topCities = useMemo(() => cityStats.slice(0, 20), [cityStats]);
  
  // Chart data - Top 15 şehir
  const topCitiesChartData = useMemo(() => 
    topCities.slice(0, 15).map(city => ({
      name: city.name.length > 15 ? city.name.substring(0, 15) + '...' : city.name,
      value: city.totalStudents2025
    })),
    [topCities]
  );

  const topCitiesRateChartData = useMemo(() => 
    topCities
      .sort((a, b) => parseFloat(b.avgRate2025) - parseFloat(a.avgRate2025))
      .slice(0, 15)
      .map(city => ({
        name: city.name.length > 15 ? city.name.substring(0, 15) + '...' : city.name,
        value: parseFloat(city.avgRate2025)
      })),
    [topCities]
  );

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <BarChart3 className="w-6 h-6 text-blue-500" />
             Detaylı İstatistikler
          </h1>
          <p className="text-slate-500 mt-1">
            Şehir bazlı öğrenci dağılımı ve performans analizleri.
          </p>
        </div>
      </div>

      {/* Şehir İstatistikleri Grid */}
      <StatGrid>
        <StatCard
          title="Toplam Şehir"
          value={formatNumber(cityStats.length)}
          subtitle="Üniversite bulunan il"
          icon={<Map className="w-6 h-6" />}
          color="blue"
        />
        
        <StatCard
          title="En Çok Öğrenci"
          value={topCities[0]?.name || '-'}
          subtitle={`${formatNumber(topCities[0]?.totalStudents2025 || 0)} öğrenci ile`}
          icon={<Users className="w-6 h-6" />}
          color="emerald"
        />
        
        <StatCard
          title="En Yüksek Oran"
          value={cityStats.sort((a, b) => parseFloat(b.avgRate2025) - parseFloat(a.avgRate2025))[0]?.name || '-'}
          subtitle={`Ortalama %${cityStats[0]?.avgRate2025 || 0}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="amber"
        />
        
        <StatCard
          title="En Çok Üniversite"
          value={cityStats.sort((a, b) => b.universities - a.universities)[0]?.name || '-'}
          subtitle={`${cityStats[0]?.universities || 0} üniversite ile`}
          icon={<Building2 className="w-6 h-6" />}
          color="violet"
        />
      </StatGrid>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart - Öğrenci Sayısı */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            Şehirlere Göre Öğrenci Sayısı (Top 15)
          </h3>
          <div className="h-[350px]">
             <ComparisonBarChart 
                data={topCitiesChartData}
                title=""
             />
          </div>
        </div>

        {/* Chart - Ortalama Oran */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            Şehirlere Göre İH Oranı (Top 15)
          </h3>
          <div className="h-[350px]">
            <ComparisonBarChart 
                data={topCitiesRateChartData}
                title=""
            />
          </div>
        </div>
      </div>

      {/* Şehir Detay Tablosu */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
             <h3 className="text-xl font-bold text-slate-800">📋 Şehir Detay Listesi</h3>
             <p className="text-sm text-slate-500 mt-1">En çok öğrenci barındıran ilk 20 şehir</p>
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">Sıra</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Şehir</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Üniversite</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Bölüm</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Toplam Öğrenci (2025)</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ort. Oran</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Veri Kaydı</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {topCities.map((city, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-bold text-xs 
                            ${index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                            {index + 1}
                        </span>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                             <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{city.name}</span>
                        </div>
                    </td>
                    <td className="p-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-medium">
                            {city.universities}
                        </span>
                    </td>
                    <td className="p-4 text-center text-sm text-slate-600">
                        {city.departments}
                    </td>
                    <td className="p-4 text-right">
                        <div className="font-bold text-slate-800 tabular-nums">
                            {formatNumber(city.totalStudents2025)}
                        </div>
                    </td>
                    <td className="p-4 text-right">
                        <div className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block tabular-nums text-sm">
                            {formatPercent(city.avgRate2025)}
                        </div>
                    </td>
                    <td className="p-4 text-center text-sm text-slate-400 tabular-nums">
                        {formatNumber(city.totalRecords)}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Bölgesel Analiz (Türkiye Coğrafi Bölgeleri) */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-blue-100 flex items-center gap-6 relative overflow-hidden">
        {/* Decorative background icon */}
        <Globe className="absolute right-0 bottom-0 w-64 h-64 text-blue-100 -mr-16 -mb-16 opacity-50" />
        
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-3">
                <Globe className="w-6 h-6 text-indigo-600" />
                Bölgesel Dağılım Analizi
            </h2>
            <p className="text-indigo-700/80 leading-relaxed mb-4">
                Türkiye'nin 7 coğrafi bölgesine göre öğrenci dağılımı ve tercih eğilimlerini karşılaştıran detaylı analiz modülü geliştirilme aşamasındadır.
                Bu özellik ile Marmara, İç Anadolu gibi bölgelerin İmam Hatip mezunu yerleştirme performanslarını kıyaslayabileceksiniz.
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-indigo-600 text-xs font-bold shadow-sm border border-indigo-100">
                🚀 Yakında Eklenecek
            </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;