import React, { useMemo } from 'react';
import StatCard, { StatGrid, ComparisonStatCard } from './StatCard';
import Tooltip from './Tooltip';
import { YearlyTrendChart, ComparisonBarChart } from './TrendChart';
import { getGeneralStatistics, getTopRecords, getTrendingRecords } from '../utils/statistics';
import { formatNumber, formatPercent, getTrendIcon, getUniversityTypeBadge } from '../utils/helpers';

const Dashboard = ({ data }) => {
  // Genel istatistikleri hesapla
  const stats = useMemo(() => getGeneralStatistics(data), [data]);
  
  // Top 20 kayıtları al (SADECE SAYI BAZLI, minimum 10 öğrenci)
  const topByStudents = useMemo(() => getTopRecords(data, 'students', 20, 2025, 10, 0), [data]);
  
  // En yüksek oran için minimum 10 öğrenci VE minimum 50 kontenjan
  const topByRate = useMemo(() => getTopRecords(data, 'rate', 10, 2025, 10, 50), [data]);
  
  // Trend verileri (minimum 5 öğrenci, max %500 değişim)
  const rising = useMemo(() => getTrendingRecords(data, 'rising', 10, 5), [data]);
  const falling = useMemo(() => getTrendingRecords(data, 'falling', 10, 5), [data]);

  // Yıllara göre karşılaştırma için chart data
  const yearComparisonData = [
    { name: '2023', students: stats.stats2023.totalStudents, avgRate: parseFloat(stats.stats2023.averageRate) },
    { name: '2024', students: stats.stats2024.totalStudents, avgRate: parseFloat(stats.stats2024.averageRate) },
    { name: '2025', students: stats.stats2025.totalStudents, avgRate: parseFloat(stats.stats2025.averageRate) }
  ];

  // Üniversite tipi dağılımı için chart data
  const typeDistributionData = [
    { name: 'Devlet', value: stats.byType.Devlet },
    { name: 'Vakıf', value: stats.byType.Vakıf },
    { name: 'KKTC', value: stats.byType.KKTC }
  ];

  return (
    <div className="space-y-8 pb-10">     

      {/* Ana İstatistikler Grid */}
      {/* Not: StatCard bileşenini de daha sonra düzenleyeceğiz ama şimdilik container'ı hazırladım */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={
            <Tooltip className="z-999" text="2025 yılında üniversitelere yerleşen toplam İmam Hatip mezunu öğrenci sayısı.">
              Toplam İH Öğrenci (2025)
            </Tooltip>
          }
          value={formatNumber(stats.stats2025.totalStudents)}
          subtitle={`Ortalama oran: ${stats.stats2025.averageRate}%`}
          icon="👥"
          color="bg-blue-600" // CSS variable yerine Tailwind class
        />
        
        <StatCard
          title={
            <Tooltip text="YÖK Atlas'tan çekilen toplam program kaydı sayısı.">
              Toplam Kayıt
            </Tooltip>
          }
          value={formatNumber(stats.totalRecords)}
          subtitle={`${formatNumber(stats.validRecords)} aktif kayıt`}
          icon="📁"
          color="bg-indigo-500"
        />
        
        <StatCard
          title={
            <Tooltip text="Devlet, Vakıf ve KKTC üniversitelerinin toplamı.">
              Üniversite
            </Tooltip>
          }
          value={formatNumber(stats.uniqueUniversities)}
          subtitle="Farklı üniversite"
          icon="🏛️"
          color="bg-emerald-500"
        />
        
        <StatCard
          title={
            <Tooltip text="Üniversitelerde açılan farklı bölüm/program sayısı.">
              Bölüm
            </Tooltip>
          }
          value={formatNumber(stats.uniqueDepartments)}
          subtitle="Farklı bölüm"
          icon="📚"
          color="bg-amber-500"
        />
      </div>

      {/* Yıllık Karşılaştırma Bölümü */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">📈 Yıllara Göre Gelişim</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Detaylı Rapor &rarr;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
          <ComparisonStatCard
            title="Toplam İH Öğrenci Sayısı"
            current={stats.stats2025.totalStudents}
            previous={stats.stats2023.totalStudents}
          />
          
          <ComparisonStatCard
            title="Veri İçeren Program Sayısı"
            current={stats.stats2025.recordCount}
            previous={stats.stats2023.recordCount}
          />
          
          <ComparisonStatCard
            title="Ortalama İH Oranı"
            current={parseFloat(stats.stats2025.averageRate)}
            previous={parseFloat(stats.stats2023.averageRate)}
            unit="%"
          />
        </div>
      </div>

      {/* Üniversite Tipi Dağılımı - 3'lü Grid + Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf: Kartlar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
                <h2 className="text-xl font-bold text-slate-800 mb-6">🏫 Dağılım (2025)</h2>
                <div className="space-y-4">
                    <StatCard
                        title="Devlet"
                        value={formatNumber(stats.byType.Devlet)}
                        subtitle={`${stats.stats2025.recordCount > 0 ? ((stats.byType.Devlet / stats.stats2025.recordCount) * 100).toFixed(1) : 0}%`}
                        icon="🏛️"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Vakıf"
                        value={formatNumber(stats.byType.Vakıf)}
                        subtitle={`${stats.stats2025.recordCount > 0 ? ((stats.byType.Vakıf / stats.stats2025.recordCount) * 100).toFixed(1) : 0}%`}
                        icon="🏢"
                        color="bg-violet-500"
                    />
                    <StatCard
                        title="KKTC"
                        value={formatNumber(stats.byType.KKTC)}
                        subtitle={`${stats.stats2025.recordCount > 0 ? ((stats.byType.KKTC / stats.stats2025.recordCount) * 100).toFixed(1) : 0}%`}
                        icon="🌍"
                        color="bg-orange-500"
                    />
                </div>
             </div>
        </div>
        
        {/* Sağ Taraf: Grafik */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
             <h2 className="text-xl font-bold text-slate-800 mb-4">Kurum Tipine Göre Grafik</h2>
             <div className="flex-1 min-h-[300px]">
                <ComparisonBarChart 
                    data={typeDistributionData}
                    title="Üniversite Tipine Göre Kayıt Dağılımı"
                />
             </div>
        </div>
      </div>

      {/* Top 20 Listeler */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* En Çok İH Öğrencisi */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Tooltip text="2025 verilerine göre sıralanmıştır.">
                         🏆 En Çok Tercih Edilenler
                        </Tooltip>
                    </h3>
                    <p className="text-sm text-slate-500">Öğrenci sayısına göre Top 20</p>
                </div>
                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">•••</button>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[500px] p-2 custom-scrollbar">
              {topByStudents.map((record, index) => (
                <div key={index} className="group flex items-center gap-4 p-4 hover:bg-blue-50/50 rounded-xl transition-all duration-200 border-b border-slate-50 last:border-0">
                  <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-sm
                    ${index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 truncate">{record.universiteName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                            {record.universityType}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{record.bolum}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-slate-800 text-lg">{formatNumber(record.data2025.sayi)}</div>
                    <div className="text-xs font-medium text-slate-400">Öğrenci</div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* En Yüksek Oran */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Tooltip text="Sadece 50+ kontenjanı olan bölümler baz alınmıştır.">
                         📊 En Yüksek Yoğunluk
                        </Tooltip>
                    </h3>
                    <p className="text-sm text-slate-500">İH Mezunu Oranına Göre (Min. 50 Kont.)</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] p-2 custom-scrollbar">
              {topByRate.map((record, index) => (
                <div key={index} className="group flex items-center gap-4 p-4 hover:bg-violet-50/50 rounded-xl transition-all duration-200 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 truncate">{record.universiteName}</h4>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{record.bolum}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-violet-600 text-lg">{formatPercent(record.data2025.oran)}</div>
                    <div className="text-xs font-medium text-slate-400">{record.data2025.sayi} Öğrenci</div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Trend Analizleri - Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yükselenler */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-600 p-1 rounded">📈</span> Yükseliş Trendi (Top 10)
             </h3>
             <div className="space-y-3">
              {rising.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-medium text-slate-800 truncate text-sm">{record.universiteName}</div>
                    <div className="text-xs text-slate-500 truncate">{record.bolum}</div>
                  </div>
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-sm font-bold">
                    +{record.trendData.percentChange.toFixed(0)}%
                  </span>
                </div>
              ))}
             </div>
          </div>

          {/* Düşenler */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 p-1 rounded">📉</span> Düşüş Trendi (Top 10)
             </h3>
             <div className="space-y-3">
              {falling.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-medium text-slate-800 truncate text-sm">{record.universiteName}</div>
                    <div className="text-xs text-slate-500 truncate">{record.bolum}</div>
                  </div>
                  <span className="flex items-center gap-1 bg-rose-100 text-rose-700 px-2 py-1 rounded-lg text-sm font-bold">
                    {record.trendData.percentChange.toFixed(0)}%
                  </span>
                </div>
              ))}
             </div>
          </div>
      </div>

      {/* Bilgi Notları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">📌 Veri Notları</h3>
          <ul className="space-y-2 text-sm text-blue-700/80 list-disc list-inside">
            <li>Veriler <strong>YÖK Atlas</strong> (2023-2025) kaynağından alınmıştır.</li>
            <li>Listelerde minimum <strong>10 öğrenci</strong> kriteri uygulanmıştır.</li>
            <li>İH Oranı: O bölüme yerleşen toplam öğrenci içindeki paydır.</li>
          </ul>
        </div>
        
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">⚠️ Uyarılar</h3>
          <ul className="space-y-2 text-sm text-amber-700/80 list-disc list-inside">
            <li>Küçük kontenjanlı bölümlerde yüksek oranlar (örn: %100) yanıltıcı olabilir.</li>
            <li>Büyük şehirlerdeki sayısal yükseklik, üniversite çokluğundan kaynaklanır.</li>
            <li>Trend analizi son 3 yılın ortalamasına göre hesaplanır.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;