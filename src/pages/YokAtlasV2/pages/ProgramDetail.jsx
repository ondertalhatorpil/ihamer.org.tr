import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Building2, TrendingUp, TrendingDown, Info, X, School, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateTrend, normalizeProgramName } from '../utils/dataProcessor';

const ProgramDetail = ({ data }) => {
  const { programName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(programName);

  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  useEffect(() => {
    if (!data || !data.length) return;

    const programRecords = data.filter(r => {
      const normalizedRecordName = normalizeProgramName(r.program_name);
      return normalizedRecordName === decodedName;
    });

    if (programRecords.length === 0) {
      setLoading(false);
      return;
    }

    const calculateYearData = (year) => {
      const yearRecords = programRecords.filter(r => r.year === year);
      const totalIHL = yearRecords.reduce((sum, r) => {
        return sum + (r.imam_hatip_lise_tipi?.reduce((s, tip) => s + (tip.yerlesen || 0), 0) || 0);
      }, 0);
      const totalStudents = yearRecords.reduce((sum, r) => sum + (r.toplam_yerlesen || 0), 0);
      const universityCount = new Set(yearRecords.map(r => r.university_name)).size;
      return {
        year, ihlCount: totalIHL, totalStudents, universityCount,
        percentage: totalStudents > 0 ? ((totalIHL / totalStudents) * 100).toFixed(2) : 0
      };
    };

    const data2023 = calculateYearData('2023');
    const data2024 = calculateYearData('2024');
    const data2025 = calculateYearData('2025');

    const univMap = {};
    programRecords.filter(r => r.year === '2025').forEach(record => {
      const univName = record.university_name;
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => s + (tip.yerlesen || 0), 0) || 0;
      if (!univMap[univName]) {
        univMap[univName] = { name: univName, type: record.university_type, city: record.city, count2025: 0, total2025: 0, count2024: 0, total2024: 0 };
      }
      univMap[univName].count2025 += ihlCount;
      univMap[univName].total2025 += record.toplam_yerlesen || 0;
    });

    programRecords.filter(r => r.year === '2024').forEach(record => {
      const univName = record.university_name;
      const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => s + (tip.yerlesen || 0), 0) || 0;
      if (univMap[univName]) {
        univMap[univName].count2024 += ihlCount;
        univMap[univName].total2024 += record.toplam_yerlesen || 0;
      }
    });

    const universities = Object.values(univMap).map(univ => ({
      ...univ,
      percentage2025: univ.total2025 > 0 ? ((univ.count2025 / univ.total2025) * 100).toFixed(2) : 0,
      trend: calculateTrend(univ.count2025, univ.count2024)
    })).sort((a, b) => b.count2025 - a.count2025);

    setProgramData({
      name: decodedName,
      category: programRecords[0]?.puan_turu || '',
      yearlyData: [data2023, data2024, data2025],
      data2023, data2024, data2025,
      universities,
      topUniversities: universities.slice(0, 10)
    });

    setLoading(false);
  }, [data, decodedName]);

  const handleUniversityClick = (univ) => {
    const univProgramRecords = data.filter(r => {
      const normalizedRecordName = normalizeProgramName(r.program_name);
      return normalizedRecordName === decodedName &&
        r.university_name === univ.name &&
        r.year === '2025';
    });

    const ihlSchools = [];
    univProgramRecords.forEach(record => {
      if (record.imam_hatip_liseler && Array.isArray(record.imam_hatip_liseler)) {
        record.imam_hatip_liseler.forEach(school => {
          const schoolName = school.lise || school.okul_adi;
          const studentCount = school.yerlesen || 0;
          if (schoolName && studentCount > 0) {
            let cityName = 'Bilinmiyor';
            const match = schoolName.match(/\(([^-]+)/);
            if (match) cityName = match[1].trim();
            ihlSchools.push({ name: schoolName, city: cityName, count: studentCount });
          }
        });
      }
    });

    ihlSchools.sort((a, b) => b.count - a.count);

    setSelectedUniversity({
      name: univ.name,
      type: univ.type,
      city: univ.city,
      totalStudents: ihlSchools.reduce((sum, s) => sum + s.count, 0),
      schools: ihlSchools
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Bölüm bulunamadı</p>
        <button
          onClick={() => navigate('/programs/v2')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Bölümlere Dön
        </button>
      </div>
    );
  }

  const trend2425 = calculateTrend(programData.data2025.ihlCount, programData.data2024.ihlCount);

  return (
    <>
      {/* Modal */}
      {selectedUniversity && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUniversity(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedUniversity.name}</h2>
                  <p className="text-green-100">{programData.name} Bölümü</p>
                </div>
                <button
                  onClick={() => setSelectedUniversity(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm text-green-100">Toplam İHL Öğrencisi</p>
                  <p className="text-3xl font-bold">{selectedUniversity.totalStudents}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm text-green-100">Farklı Okul Sayısı</p>
                  <p className="text-3xl font-bold">{selectedUniversity.schools.length}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-green-600" />
                Mezun Olunan İmam Hatip Liseleri
              </h3>

              {selectedUniversity.schools.length > 0 ? (
                <div className="space-y-2">
                  {selectedUniversity.schools.map((school, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{school.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{school.city}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-2xl font-bold text-green-600">{school.count}</p>
                        <p className="text-xs text-gray-500">öğrenci</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">İmam Hatip Lisesi verisi bulunamadı</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => {
                  setSelectedUniversity(null);
                  navigate(`/universities/v2/${encodeURIComponent(selectedUniversity.name)}`);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                {selectedUniversity.name} Detay Sayfasına Git
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">

        {/* Geri Butonu */}
        <button
          onClick={() => navigate('/programs/v2')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Bölümlere Dön</span>
        </button>

        {/* Başlık */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{programData.name}</h1>
          {programData.category && (
            <p className="mt-2 text-gray-600">Alan: {programData.category}</p>
          )}
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">2025 İHL Öğrencisi</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {programData.data2025.ihlCount.toLocaleString('tr-TR')}
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Üniversite Sayısı</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {programData.data2025.universityCount}
            </p>
            <p className="text-sm text-gray-500 mt-2">farklı üniversite</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600">Genel Oran (2025)</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              %{programData.data2025.percentage}
            </p>
          </div>
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
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Üniversite</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Oran</th>
                </tr>
              </thead>
              <tbody>
                {programData.yearlyData.map((yearData) => (
                  <tr key={yearData.year} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{yearData.year}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {yearData.ihlCount.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {yearData.totalStudents.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">{yearData.universityCount}</td>
                    <td className="py-3 px-4 text-right font-semibold text-blue-600">
                      %{yearData.percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trend Grafiği */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">İHL Öğrenci Sayısı Trendi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={programData.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => value.toLocaleString('tr-TR')}
              />
              <Line type="monotone" dataKey="ihlCount" stroke="#0ea5e9" strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 6 }} name="İHL Öğrenci Sayısı" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* En Çok Tercih Edilen 10 Üniversite */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">En Çok Tercih Edilen 10 Üniversite (2025)</h2>
          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Üniversiteye tıklayarak <strong>mezun olunan İmam Hatip Liselerini</strong> görün</span>
          </p>
          <div className="space-y-3">
            {programData.topUniversities.map((univ, index) => (
              <div
                key={index}
                onClick={() => handleUniversityClick(univ)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:border-green-300 border border-gray-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {univ.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span>{univ.city}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${univ.type === 'Devlet' ? 'bg-blue-100 text-blue-700' : ''}
                        ${univ.type === 'Vakıf' ? 'bg-purple-100 text-purple-700' : ''}
                        ${univ.type === 'KKTC' ? 'bg-orange-100 text-orange-700' : ''}
                      `}>
                        {univ.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{univ.count2025}</p>
                    <p className="text-sm text-gray-500">%{univ.percentage2025}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {univ.trend.direction === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : univ.trend.direction === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span className={`text-sm font-medium ${
                      univ.trend.direction === 'up' ? 'text-green-600' :
                      univ.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {univ.trend.direction !== 'neutral' && (univ.trend.direction === 'up' ? '+' : '-')}
                      %{univ.trend.percentage}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/universities/v2/${encodeURIComponent(univ.name)}`); }}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Üniversite detay sayfasına git"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tüm Üniversiteler Tablosu */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Tüm Üniversiteler ({programData.universities.length})
          </h2>
          <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Üniversiteye tıklayarak <strong>mezun olunan İmam Hatip Liselerini</strong> görün</span>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Üniversite</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Şehir</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Tip</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">2025 Sayı</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Oran</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Trend</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">İHL Detay</th>
                </tr>
              </thead>
              <tbody>
                {programData.universities.map((univ, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors group">
                    <td className="py-3 px-4 font-medium text-gray-900">{univ.name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{univ.city}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${univ.type === 'Devlet' ? 'bg-blue-100 text-blue-700' : ''}
                        ${univ.type === 'Vakıf' ? 'bg-purple-100 text-purple-700' : ''}
                        ${univ.type === 'KKTC' ? 'bg-orange-100 text-orange-700' : ''}
                      `}>
                        {univ.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{univ.count2025}</td>
                    <td className="py-3 px-4 text-right text-blue-600 font-medium">%{univ.percentage2025}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {univ.trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : univ.trend.direction === 'down' ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : null}
                        <span className={`text-sm font-medium ${
                          univ.trend.direction === 'up' ? 'text-green-600' :
                          univ.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {univ.trend.direction !== 'neutral' && (univ.trend.direction === 'up' ? '+' : '-')}
                          %{univ.trend.percentage}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUniversityClick(univ); }}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          <School className="w-4 h-4" />
                          Liseler
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/universities/v2/${encodeURIComponent(univ.name)}`); }}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-600 rotate-180" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default ProgramDetail;