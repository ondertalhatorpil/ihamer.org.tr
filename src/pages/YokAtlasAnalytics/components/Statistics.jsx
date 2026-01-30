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
    <div className="space-y-6 md:space-y-8 pb-10 animate-fade-in w-full overflow-x-hidden">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col gap-2">
         <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                 <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             Detaylı İstatistikler
         </h1>
         <p className="text-slate-500 text-xs md:text-sm ml-1 md:ml-0">
            Şehir bazlı öğrenci dağılımı ve performans analizleri.
         </p>
      </div>

      {/* --- ŞEHİR İSTATİSTİKLERİ GRID --- */}
      <StatGrid>
        <StatCard
          title="En Çok Öğrenci"
          value={topCities[2]?.name || '-'}
          subtitle={`%21.99 öğrenci ile`}
          icon={<Users className="w-6 h-6" />}
          color="custom" customColor="#B38F65"
        />
        
        <StatCard
          title="En Yüksek Oran"
          value={cityStats.sort((a, b) => parseFloat(b.avgRate2025) - parseFloat(a.avgRate2025))[0]?.name || '-'}
          subtitle={`Ortalama %${cityStats[0]?.avgRate2025 || 0}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="custom" customColor="#B38F65"
        />
        
        <StatCard
          title="En Çok Üniversite"
          value={cityStats.sort((a, b) => b.universities - a.universities)[0]?.name || '-'}
          icon={<Building2 className="w-6 h-6" />}
          color="custom" customColor="#B38F65"
        />
      </StatGrid>

      {/* --- CHARTS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart - Öğrenci Sayısı */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B38F65]" />
            Şehirlere Göre Öğrenci (Top 15)
          </h3>
          <div className="h-[300px] md:h-[350px]">
             <ComparisonBarChart 
                data={topCitiesChartData}
                title=""
             />
          </div>
        </div>

        {/* Chart - Ortalama Oran */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B38F65]" />
            Şehirlere Göre İH Oranı (Top 15)
          </h3>
          <div className="h-[300px] md:h-[350px]">
            <ComparisonBarChart 
                data={topCitiesRateChartData}
                title=""
            />
          </div>
        </div>
      </div>

      {/* --- ŞEHİR DETAY LİSTESİ --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <h3 className="text-lg md:text-xl font-bold text-slate-800">📋 Şehir Detay Listesi</h3>
           <p className="text-xs md:text-sm text-slate-500 mt-1">En çok öğrenci barındıran ilk 20 şehir</p>
        </div>
        
        {/* 1. MOBİL KART GÖRÜNÜMÜ */}
        <div className="md:hidden flex flex-col p-4 gap-3 bg-slate-50/50">
            {topCities.map((city, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${index < 3 ? 'bg-[#B38F65] text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                 {index + 1}
                             </div>
                             <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                 <MapPin className="w-4 h-4 text-[#B38F65]" />
                                 {city.name}
                             </div>
                         </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <div className="text-[10px] text-slate-400">Öğrenci</div>
                            <div className="text-sm font-bold text-[#B38F65]">{formatNumber(city.totalStudents2025)}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <div className="text-[10px] text-slate-400">Ort. Oran</div>
                            <div className="text-sm font-bold text-slate-700">%{city.avgRate2025}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <div className="text-[10px] text-slate-400">Üniversite</div>
                            <div className="text-sm font-bold text-slate-700">{city.universities}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl text-center">
                            <div className="text-[10px] text-slate-400">Bölüm</div>
                            <div className="text-sm font-bold text-slate-700">{city.departments}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 2. MASAÜSTÜ TABLO GÖRÜNÜMÜ */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
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
                <tr key={index} className="hover:bg-[#B38F65]/5 transition-colors">
                    <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs 
                            ${index < 3 ? 'bg-[#B38F65] text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                            {index + 1}
                        </span>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-slate-300" />
                             <span className="font-bold text-slate-700">{city.name}</span>
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
                        <div className="font-medium text-[#B38F65] bg-[#B38F65]/10 px-2 py-1 rounded inline-block tabular-nums text-sm">
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

      {/* --- BÖLGESEL ANALİZ (COMING SOON) --- */}
      <div className="bg-gradient-to-br from-[#B38F65]/5 to-slate-50 rounded-[2rem] p-6 md:p-8 border border-[#B38F65]/20 flex items-center gap-6 relative overflow-hidden">
        {/* Dekoratif İkon */}
        <Globe className="absolute right-0 bottom-0 w-48 h-48 md:w-64 md:h-64 text-[#B38F65]/10 -mr-10 -mb-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-[#B38F65]" />
                Bölgesel Dağılım Analizi
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                Türkiye'nin 7 coğrafi bölgesine göre öğrenci dağılımı ve tercih eğilimlerini karşılaştıran detaylı analiz modülü geliştirilme aşamasındadır.
                Bu özellik ile Marmara, İç Anadolu gibi bölgelerin İmam Hatip mezunu yerleştirme performanslarını kıyaslayabileceksiniz.
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[#B38F65] text-xs font-bold shadow-sm border border-[#B38F65]/20">
                🚀 Yakında Eklenecek
            </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;