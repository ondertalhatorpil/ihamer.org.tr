import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, School, MapPin, Building2, BookOpen, Users } from 'lucide-react';
import { normalizeProgramName } from '../utils/dataProcessor';

const ProgramUniversityDetail = ({ data }) => {
  const { programName, universityName } = useParams();
  const navigate = useNavigate();
  const decodedProgramName = decodeURIComponent(programName);
  const decodedUniversityName = decodeURIComponent(universityName);

  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCity, setHoveredCity] = useState(null);

  useEffect(() => {
    if (!data || !data.length) return;

    const records = data.filter(r => {
      const normalizedRecordName = normalizeProgramName(r.program_name);
      return normalizedRecordName === decodedProgramName &&
        r.university_name === decodedUniversityName &&
        r.year === '2025';
    });

    if (records.length === 0) {
      setLoading(false);
      return;
    }

    const ihlSchools = [];
    const cityMap = {};

    records.forEach(record => {
      if (record.imam_hatip_liseler && Array.isArray(record.imam_hatip_liseler)) {
        record.imam_hatip_liseler.forEach(item => {
          const schools = item.imam_hatip_liseler;
          if (schools && Array.isArray(schools)) {
            schools.forEach(school => {
              const schoolName = school.lise;
              const studentCount = school.yerlesen || 0;
              if (schoolName && studentCount > 0) {
                let cityName = 'Bilinmiyor';
                const match = schoolName.match(/\(([^-]+)/);
                if (match) cityName = match[1].trim();
                const schoolData = { name: schoolName, city: cityName, count: studentCount };
                ihlSchools.push(schoolData);
                if (!cityMap[cityName]) cityMap[cityName] = { city: cityName, count: 0, schools: [] };
                cityMap[cityName].count += studentCount;
                cityMap[cityName].schools.push(schoolData);
              }
            });
          }
        });
      }
    });

    ihlSchools.sort((a, b) => b.count - a.count);
    const citiesData = Object.values(cityMap).sort((a, b) => b.count - a.count);

    setDetailData({
      programName: decodedProgramName,
      universityName: decodedUniversityName,
      universityType: records[0]?.university_type || 'Devlet',
      universityCity: records[0]?.city || '',
      totalStudents: ihlSchools.reduce((sum, s) => sum + s.count, 0),
      schools: ihlSchools,
      citiesData
    });

    setLoading(false);
  }, [data, decodedProgramName, decodedUniversityName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="text-center py-12">
        <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Veri bulunamadı</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Geri Butonu */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Geri Dön</span>
      </button>

      {/* Başlık Kartı */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{detailData.universityName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${detailData.universityType === 'Devlet' ? 'bg-blue-100 text-blue-700' : ''}
                    ${detailData.universityType === 'Vakıf' ? 'bg-purple-100 text-purple-700' : ''}
                    ${detailData.universityType === 'KKTC' ? 'bg-orange-100 text-orange-700' : ''}
                  `}>
                    {detailData.universityType}
                  </span>
                  <span className="text-sm text-gray-600">{detailData.universityCity}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-gray-700">
              <BookOpen className="w-5 h-5 text-green-600" />
              <p className="font-semibold">{detailData.programName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Toplam İHL Öğrencisi</p>
              <p className="text-3xl font-bold text-green-900">{detailData.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Farklı Okul Sayısı</p>
              <p className="text-3xl font-bold text-blue-900">{detailData.schools.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Farklı Şehir Sayısı</p>
              <p className="text-3xl font-bold text-purple-900">{detailData.citiesData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Şehir Bazlı Dağılım */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Şehir Bazlı Dağılım
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Şehirlerin üzerine gelerek okul detaylarını görebilirsiniz
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {detailData.citiesData.map((city, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCity(city.city)}
              onMouseLeave={() => setHoveredCity(null)}
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">{city.city}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">{city.count}</p>
                  <p className="text-xs text-gray-600">öğrenci</p>
                </div>
              </div>

              {hoveredCity === city.city && (
                <div className="mt-3 pt-3 border-t border-green-300">
                  <p className="text-xs font-semibold text-green-800 mb-2">
                    {city.schools.length} okul:
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {city.schools.slice(0, 5).map((school, i) => (
                      <div key={i} className="text-xs text-gray-700 flex justify-between">
                        <span className="truncate flex-1">{school.name.split('(')[0].trim()}</span>
                        <span className="font-semibold text-green-700 ml-2">{school.count}</span>
                      </div>
                    ))}
                    {city.schools.length > 5 && (
                      <p className="text-xs text-gray-500 italic">+{city.schools.length - 5} okul daha...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tüm İmam Hatip Liseleri */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <School className="w-6 h-6 text-green-600" />
          Mezun Olunan İmam Hatip Liseleri ({detailData.schools.length})
        </h2>

        {detailData.schools.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <School className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-900">En Çok Öğrenci Gönderen Okul</p>
            </div>
            <p className="text-lg font-bold text-blue-900">{detailData.schools[0].name}</p>
            <p className="text-sm text-blue-700 mt-1">
              {detailData.schools[0].count} öğrenci • {detailData.schools[0].city}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {detailData.schools.map((school, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors border border-gray-200 hover:border-green-300"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
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
      </div>

      {/* Hızlı Linkler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate(`/universities/v2/${encodeURIComponent(detailData.universityName)}`)}
          className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-700">Üniversite Detay Sayfası</p>
                <p className="text-sm text-gray-600">{detailData.universityName}</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-600 rotate-180" />
          </div>
        </button>

        <button
          onClick={() => navigate(`/programs/v2/${encodeURIComponent(detailData.programName)}`)}
          className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-green-700">Bölüm Detay Sayfası</p>
                <p className="text-sm text-gray-600">{detailData.programName}</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-600 rotate-180" />
          </div>
        </button>
      </div>

    </div>
  );
};

export default ProgramUniversityDetail;