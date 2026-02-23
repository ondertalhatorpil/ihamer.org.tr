import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Building2, BookOpen, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculateTrend, categorizePuanTuru, normalizeProgramName } from '../utils/dataProcessor';

const UniversityDetail = ({ data }) => {
  const { universityName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(universityName);

  const [universityData, setUniversityData] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasAcikogretim = (name) => {
    return name.includes('ATATÜRK ÜNİVERSİTESİ') ||
      name.includes('ANADOLU ÜNİVERSİTESİ') ||
      name.includes('İSTANBUL ÜNİVERSİTESİ');
  };

  useEffect(() => {
    if (!data || !data.length) return;

    const univRecords = data.filter(r => r.university_name === decodedName);

    if (univRecords.length === 0) {
      setLoading(false);
      return;
    }

    const calculateYearData = (year) => {
      const yearRecords = univRecords.filter(r => r.year === year);
      const totalIHL = yearRecords.reduce((sum, r) => {
        return sum + (r.imam_hatip_lise_tipi?.reduce((s, tip) => s + (tip.yerlesen || 0), 0) || 0);
      }, 0);
      const totalStudents = yearRecords.reduce((sum, r) => sum + (r.toplam_yerlesen || 0), 0);
      return {
        year,
        ihlCount: totalIHL,
        totalStudents,
        percentage: totalStudents > 0 ? ((totalIHL / totalStudents) * 100).toFixed(2) : 0
      };
    };

    const data2023 = calculateYearData('2023');
    const data2024 = calculateYearData('2024');
    const data2025 = calculateYearData('2025');

    const programMap = {};

    ['2025', '2024', '2023'].forEach(year => {
      univRecords.filter(r => r.year === year).forEach(record => {
        const normalizedName = normalizeProgramName(record.program_name);
        const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => s + (tip.yerlesen || 0), 0) || 0;

        if (!programMap[normalizedName]) {
          programMap[normalizedName] = {
            name: normalizedName,
            count2023: 0, total2023: 0,
            count2024: 0, total2024: 0,
            count2025: 0, total2025: 0,
            puanTuru: record.puan_turu
          };
        }

        programMap[normalizedName][`count${year}`] += ihlCount;
        programMap[normalizedName][`total${year}`] += record.toplam_yerlesen || 0;
      });
    });

    const programs = Object.values(programMap).map(prog => ({
      ...prog,
      percentage2023: prog.total2023 > 0 ? ((prog.count2023 / prog.total2023) * 100).toFixed(2) : 0,
      percentage2024: prog.total2024 > 0 ? ((prog.count2024 / prog.total2024) * 100).toFixed(2) : 0,
      percentage2025: prog.total2025 > 0 ? ((prog.count2025 / prog.total2025) * 100).toFixed(2) : 0,
      trend: calculateTrend(prog.count2025, prog.count2024),
      category: categorizePuanTuru(prog.puanTuru)
    }));

    const categoryData = programs.reduce((acc, prog) => {
      const cat = prog.category;
      if (!acc[cat]) acc[cat] = { category: cat, count: 0, total: 0 };
      acc[cat].count += prog.count2025;
      acc[cat].total += prog.total2025;
      return acc;
    }, {});

    const categories = Object.values(categoryData).map(cat => ({
      ...cat,
      percentage: cat.total > 0 ? ((cat.count / cat.total) * 100).toFixed(2) : 0
    }));

    setUniversityData({
      name: decodedName,
      type: univRecords[0]?.university_type || 'Devlet',
      city: univRecords[0]?.city || '',
      yearlyData: [data2023, data2024, data2025],
      data2023, data2024, data2025,
      programCount: programs.length,
      topPrograms: programs.sort((a, b) => b.count2025 - a.count2025).slice(0, 10),
      allPrograms: programs.sort((a, b) => a.name.localeCompare(b.name)),
      categories: categories.sort((a, b) => b.count - a.count)
    });

    setLoading(false);
  }, [data, decodedName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!universityData) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Üniversite bulunamadı</p>
        <button
          onClick={() => navigate('/universities/v2')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Üniversitelere Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Geri Butonu */}
      <button
        onClick={() => navigate('/universities/v2')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Üniversitelere Dön</span>
      </button>

      {/* Başlık */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{universityData.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${universityData.type === 'Devlet' ? 'bg-blue-100 text-blue-700' : ''}
            ${universityData.type === 'Vakıf' ? 'bg-purple-100 text-purple-700' : ''}
            ${universityData.type === 'KKTC' ? 'bg-orange-100 text-orange-700' : ''}
          `}>
            {universityData.type}
          </span>
        </div>
        <p className="text-gray-600">{universityData.city}</p>

        {hasAcikogretim(universityData.name) && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-900 font-medium">Açık Öğretim Lisans Bölümleri Dahildir</p>
          </div>
        )}
      </div>

      {/* Üç Yıllık Tablo */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Son Üç Yıl İstatistikleri</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Yıl</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">İHL Öğrenci</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Toplam Öğrenci</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Oran</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Değişim</th>
              </tr>
            </thead>
            <tbody>
              {universityData.yearlyData.map((yearData, index) => {
                const prevYearData = index > 0 ? universityData.yearlyData[index - 1] : null;
                const trend = prevYearData ? calculateTrend(yearData.ihlCount, prevYearData.ihlCount) : null;
                return (
                  <tr key={yearData.year} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{yearData.year}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {yearData.ihlCount.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {yearData.totalStudents.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-blue-600">
                      %{yearData.percentage}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {trend && (
                        <div className="flex items-center justify-end gap-1">
                          {trend.direction === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : trend.direction === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : null}
                          <span className={`text-sm font-medium ${
                            trend.direction === 'up' ? 'text-green-600' :
                            trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                            %{trend.percentage}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yıllık Trend Grafiği */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">İHL Öğrenci Sayısı Trendi</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={universityData.yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => value.toLocaleString('tr-TR')}
            />
            <Line
              type="monotone"
              dataKey="ihlCount"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', r: 6 }}
              name="İHL Öğrenci Sayısı"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alan Dağılımı */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Alan Dağılımı (2025)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={universityData.categories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Bar yAxisId="left" dataKey="count" fill="#0ea5e9" name="Öğrenci Sayısı" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="percentage" fill="#8b5cf6" name="Oran (%)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Program Sayısı */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Toplam Program Sayısı</p>
            <p className="text-3xl font-bold text-gray-900">{universityData.programCount}</p>
            <p className="text-sm text-gray-600 mt-1">farklı bölümde İHL mezunu var</p>
          </div>
        </div>
      </div>

      {/* En Çok Tercih Edilen 10 Bölüm */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">En Çok Tercih Edilen 10 Bölüm (2025)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Bölüm</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">2025 Sayı</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Oran</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody>
              {universityData.topPrograms.map((prog, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                    {prog.name}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">{prog.count2025}</td>
                  <td className="py-3 px-4 text-right text-blue-600 font-medium">%{prog.percentage2025}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {prog.trend.direction === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : prog.trend.direction === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className={`text-sm font-medium ${
                        prog.trend.direction === 'up' ? 'text-green-600' :
                        prog.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {prog.trend.direction === 'up' ? '+' : prog.trend.direction === 'down' ? '-' : ''}
                        %{prog.trend.percentage}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tüm Bölümler */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tüm Bölümler</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Bölüm</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">2023</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">2024</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">2025</th>
              </tr>
            </thead>
            <tbody>
              {universityData.allPrograms.map((prog, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                    {prog.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-900">{prog.count2023 || '-'}</span>
                      {prog.count2023 > 0 && <span className="text-xs text-gray-500">%{prog.percentage2023}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-900">{prog.count2024 || '-'}</span>
                      {prog.count2024 > 0 && <span className="text-xs text-gray-500">%{prog.percentage2024}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-900">{prog.count2025}</span>
                      <span className="text-xs text-gray-500">%{prog.percentage2025}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UniversityDetail;