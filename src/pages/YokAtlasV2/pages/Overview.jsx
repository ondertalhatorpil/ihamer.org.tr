import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, TrendingUp, TrendingDown, Info, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TurkeyMap from '../components/TurkeyMap';
import {
  calculateTotalIHLStudents,
  groupByCity,
  groupByUniversity,
  groupByProgram,
  calculateTrend,
  isAcikogretim,
  normalizeProgramName
} from '../utils/dataProcessor';

const Overview = ({ data }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data || !data.length) return;

    // İstatistikleri hesapla
    const calculateStats = () => {
      const ihl2023 = calculateTotalIHLStudents(data, '2023');
      const ihl2024 = calculateTotalIHLStudents(data, '2024');
      const ihl2025 = calculateTotalIHLStudents(data, '2025');

      const total2023 = data.filter(r => r.year === '2023').reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);
      const total2024 = data.filter(r => r.year === '2024').reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);
      const total2025 = data.filter(r => r.year === '2025').reduce((s, r) => s + (r.toplam_yerlesen || 0), 0);

      const uniqueUniversities = new Set(data.map(r => r.university_name)).size;

      // Program sayısını normalize ederek hesapla (parantez içi temizlenir)
      const normalizedPrograms = new Set(
        data.map(r => normalizeProgramName(r.program_name))
      );
      const uniquePrograms = normalizedPrograms.size;

      // Şehir bazlı veriler
      const citiesData = groupByCity(data, '2025');
      const topCitiesByCount = citiesData.sort((a, b) => b.count - a.count).slice(0, 15);
      const topCitiesByPercentage = citiesData.sort((a, b) => b.percentage - a.percentage).slice(0, 15);

      // Üniversite bazlı veriler
      const universitiesData = groupByUniversity(data, '2025');
      const topUniversities = universitiesData
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Program bazlı veriler (Açıköğretim hariç)
      const programsData = groupByProgram(data, '2025')
        .filter(p => !isAcikogretim(p.name, ''));
      const topPrograms = programsData
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalStudents: {
          2023: ihl2023,
          2024: ihl2024,
          2025: ihl2025
        },
        totalAll: {
          2023: total2023,
          2024: total2024,
          2025: total2025
        },
        percentages: {
          2023: total2023 > 0 ? ((ihl2023 / total2023) * 100).toFixed(2) : 0,
          2024: total2024 > 0 ? ((ihl2024 / total2024) * 100).toFixed(2) : 0,
          2025: total2025 > 0 ? ((ihl2025 / total2025) * 100).toFixed(2) : 0
        },
        uniqueUniversities,
        uniquePrograms,
        topCitiesByCount,
        topCitiesByPercentage,
        topUniversities,
        topPrograms,
        citiesData
      };
    };

    const calculated = calculateStats();
    setStats(calculated);
    setLoading(false);
  }, [data]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const trend2425 = calculateTrend(stats.totalStudents[2025], stats.totalStudents[2024]);
  const trend2324 = calculateTrend(stats.totalStudents[2024], stats.totalStudents[2023]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Başlık */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Genel Bakış</h1>
        <p className="mt-2 text-gray-600">İmam Hatip Lisesi mezunlarının üniversite yerleşim istatistikleri</p>
      </motion.div>

      {/* Üst İstatistik Kartları */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Öğrenci */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam İHL Öğrencisi (2025)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalStudents[2025].toLocaleString('tr-TR')}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {trend2425.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${trend2425.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  %{trend2425.percentage}
                </span>
                <span className="text-sm text-gray-500">2024'e göre</span>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          {/* Bilgi Kutusu */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              2025 yılında toplam {stats.totalAll[2025].toLocaleString('tr-TR')} öğrenciden
              {' '}{stats.totalStudents[2025].toLocaleString('tr-TR')} tanesi İHL mezunudur.
            </p>
          </div>
        </div>

        {/* Üniversite Sayısı */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Üniversite Sayısı</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.uniqueUniversities}
              </p>
              <p className="text-sm text-gray-500 mt-2">Farklı üniversite</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Program Sayısı */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Program Sayısı</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.uniquePrograms}
              </p>
              <p className="text-sm text-gray-500 mt-2">Farklı program</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <GraduationCap className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Genel Oran */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Genel Oran (2025)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                %{stats.percentages[2025]}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-gray-500">2024: %{stats.percentages[2024]}</span>
                <span className="text-gray-500">2023: %{stats.percentages[2023]}</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Yıllara Göre Oranlar */}
      <motion.div variants={itemVariants} className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Yıllara Göre İHL Mezunu Oranı</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['2023', '2024', '2025'].map((year) => (
            <div key={year} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-900">{year}</span>
                <span className="text-2xl font-bold text-primary-600">
                  %{stats.percentages[year]}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {stats.totalStudents[year].toLocaleString('tr-TR')} / {stats.totalAll[year].toLocaleString('tr-TR')} öğrenci
              </div>
              {year !== '2023' && (
                <div className="mt-2 flex items-center gap-1">
                  {(() => {
                    const prevYear = String(Number(year) - 1);
                    const trend = calculateTrend(
                      parseFloat(stats.percentages[year]),
                      parseFloat(stats.percentages[prevYear])
                    );
                    return (
                      <>
                        {trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {trend.direction === 'up' ? '+' : '-'}%{trend.percentage}
                        </span>
                        <span className="text-sm text-gray-500">önceki yıla göre</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* En Çok Tercih Edilen Bölümler ve Üniversiteler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* En Çok Tercih Edilen Bölümler */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">En Çok Tercih Edilen 10 Bölüm (2025)</h2>
          <div className="space-y-2">
            {stats.topPrograms.map((program, index) => (
              <div
                key={index}
                onClick={() => navigate(`/programs/v2/${encodeURIComponent(program.name)}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors truncate">{program.name}</p>
                    <p className="text-sm text-gray-500">{program.universityCount} üniversite</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-gray-900">{program.count}</p>
                  <p className="text-sm text-gray-500">%{program.percentage}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">* Açıköğretim dahil değildir</p>
        </motion.div>

        {/* En Yüksek Öğrenci Yoğunluğu (Üniversiteler) */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">En Yüksek Öğrenci Yoğunluğu (2025)</h2>
          <div className="space-y-2">
            {stats.topUniversities.map((univ, index) => (
              <div
                key={index}
                onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ.name)}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors truncate">{univ.name}</p>
                    <p className="text-sm text-gray-500">{univ.city} • {univ.programCount} program</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-gray-900">{univ.count}</p>
                  <p className="text-sm text-gray-500">%{univ.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Şehir Bazlı Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* En Çok Öğrenci Sayısı (Şehir) */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">En Çok Öğrenci Sayısı (İlk 15 Şehir)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.topCitiesByCount}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="city"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => value.toLocaleString('tr-TR')}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* En Yüksek Oran (Şehir) */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">En Yüksek Oran (İlk 15 Şehir)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.topCitiesByPercentage
              .filter(city => city.city !== 'BOSNA-HERSEK')
              .slice(0, 15)
            }>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="city"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => `%${value}`}
              />
              <Bar dataKey="percentage" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Türkiye Haritası */}
      <motion.div variants={itemVariants} className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary-600" />
          Şehir Bazlı Dağılım Haritası (2025)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Harita üzerinde bir şehre geldiğinizde o şehirdeki İHL mezunu öğrenci sayısını görebilirsiniz.
          Şehre tıklayarak o ildeki üniversiteleri görüntüleyebilirsiniz.
        </p>
        <TurkeyMap citiesData={stats.citiesData} data={data} />
      </motion.div>
    </motion.div>
  );
};

export default Overview;