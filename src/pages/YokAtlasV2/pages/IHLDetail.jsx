import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, School, Building2, BookOpen, MapPin, ChevronRight, Users, Trophy } from 'lucide-react';
import { getIHLUniversityFlow } from '../utils/dataProcessor';

const IHLDetail = ({ data }) => {
  const { ihlName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(ihlName);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    if (!data || !data.length) return;
    setLoading(true);

    const match = decodedName.match(/\(([^-]+?)(?:\s*-\s*(.+?))?\)\s*$/);
    const city = match?.[1]?.trim() || '';
    const district = match?.[2]?.trim() || '';
    const displayName = decodedName.replace(/\s*\([^)]*\)\s*$/, '').trim();

    const univsByYear = {};
    ['2023', '2024', '2025'].forEach(year => {
      univsByYear[year] = getIHLUniversityFlow(data, decodedName, year);
    });

    const univs = univsByYear[selectedYear];
    const totalStudents = univs.reduce((s, u) => s + u.count, 0);

    const yearlyTotals = {
      '2023': univsByYear['2023'].reduce((s, u) => s + u.count, 0),
      '2024': univsByYear['2024'].reduce((s, u) => s + u.count, 0),
      '2025': univsByYear['2025'].reduce((s, u) => s + u.count, 0),
    };

    const univProgramMap = {};
    data.filter(r => r.year === selectedYear).forEach(record => {
      if (!record.imam_hatip_liseler) return;
      const schools = [];
      record.imam_hatip_liseler.forEach(item => {
        if (item.lise !== undefined) schools.push(item);
        else if (item.imam_hatip_liseler) item.imam_hatip_liseler.forEach(s => schools.push(s));
      });
      schools.forEach(school => {
        if (school.lise !== decodedName) return;
        const count = school.yerlesen || 0;
        if (count === 0) return;
        const univName = record.university_name;
        const progName = record.program_name?.replace(/\s*\([^)]*\)/g, '').trim();
        if (!univProgramMap[univName]) {
          univProgramMap[univName] = { name: univName, type: record.university_type, city: record.city, programs: {} };
        }
        if (!univProgramMap[univName].programs[progName]) univProgramMap[univName].programs[progName] = 0;
        univProgramMap[univName].programs[progName] += count;
      });
    });

    const universityDetails = Object.values(univProgramMap).map(univ => {
      const programsList = Object.entries(univ.programs)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      return {
        name: univ.name, type: univ.type, city: univ.city,
        totalCount: programsList.reduce((s, p) => s + p.count, 0),
        programCount: programsList.length,
        programs: programsList
      };
    }).sort((a, b) => b.totalCount - a.totalCount);

    const programFlow = {};
    data.filter(r => r.year === selectedYear).forEach(record => {
      if (!record.imam_hatip_liseler) return;
      const schools = [];
      record.imam_hatip_liseler.forEach(item => {
        if (item.lise !== undefined) schools.push(item);
        else if (item.imam_hatip_liseler) item.imam_hatip_liseler.forEach(s => schools.push(s));
      });
      schools.forEach(school => {
        if (school.lise !== decodedName) return;
        const prog = record.program_name?.replace(/\s*\([^)]*\)/g, '').trim();
        if (!prog) return;
        programFlow[prog] = (programFlow[prog] || 0) + (school.yerlesen || 0);
      });
    });

    const topPrograms = Object.entries(programFlow)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setDetailData({ name: decodedName, displayName, city, district, totalStudents, universities: univsByYear[selectedYear], universityDetails, yearlyTotals, topPrograms });
    setLoading(false);
  }, [data, decodedName, selectedYear]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
    </div>
  );

  if (!detailData || detailData.universities.length === 0) return (
    <div className="text-center py-12">
      <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">Bu okul için {selectedYear} yılında veri bulunamadı.</p>
      <button onClick={() => navigate('/ihl/v2')} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
        Geri Dön
      </button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Geri Butonu */}
      <button onClick={() => navigate('/ihl/v2')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>İHL Köken Analizine Dön</span>
      </button>

      {/* Başlık */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-600 rounded-xl">
            <School className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{detailData.displayName}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium">{detailData.city}</span>
              {detailData.district && <span className="text-gray-400">/ {detailData.district}</span>}
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-gray-700">
                📚 <strong>Bu sayfada ne var?</strong> {detailData.displayName} okulundan mezun olan öğrencilerin
                hangi üniversitelere ve hangi bölümlere yerleştiğini görüyorsunuz. Yıl seçerek geçmiş yılları da
                karşılaştırabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Yıl Seçici */}
      <div className="flex gap-2">
        {['2023', '2024', '2025'].map(y => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedYear === y ? 'bg-green-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300'
            }`}
          >
            {y}
            <span className="ml-2 text-xs opacity-75">({detailData.yearlyTotals[y]})</span>
          </button>
        ))}
      </div>

      {/* İstatistik Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-lg"><Users className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sm text-green-700">Toplam Yerleşen</p>
              <p className="text-3xl font-bold text-green-900">{detailData.totalStudents}</p>
              <p className="text-xs text-green-600">{selectedYear} yılı</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg"><Building2 className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sm text-blue-700">Üniversite Sayısı</p>
              <p className="text-3xl font-bold text-blue-900">{detailData.universities.length}</p>
              <p className="text-xs text-blue-600">farklı üniversite</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-lg"><BookOpen className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sm text-purple-700">Bölüm Sayısı</p>
              <p className="text-3xl font-bold text-purple-900">{detailData.topPrograms.length}+</p>
              <p className="text-xs text-purple-600">farklı bölüm</p>
            </div>
          </div>
        </div>
      </div>

      {/* En Çok Tercih Edilen Bölümler */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          En Çok Tercih Edilen Bölümler ({selectedYear})
        </h2>
        <div className="space-y-2">
          {detailData.topPrograms.map((prog, idx) => (
            <div
              key={prog.name}
              onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer group transition-colors border border-transparent hover:border-purple-200"
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex-shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors truncate">{prog.name}</p>
                <div className="w-full bg-purple-100 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full"
                    style={{ width: `${(prog.count / detailData.topPrograms[0].count) * 100}%` }}
                  />
                </div>
              </div>
              <span className="font-bold text-purple-700 text-lg flex-shrink-0">{prog.count}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Üniversite ve Bölüm Detayları */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Üniversite ve Bölüm Detayları ({selectedYear})
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-900">
            💡 <strong>Bu okuldan mezun olan {detailData.totalStudents} öğrenci</strong> hangi üniversitelerin
            hangi bölümlerine yerleşti?
          </p>
        </div>

        <div className="space-y-4">
          {detailData.universityDetails.map((univ, idx) => (
            <div
              key={univ.name}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
            >
              {/* Üniversite Başlığı */}
              <div
                onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ.name)}`)}
                className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{univ.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-600">{univ.city}</span>
                        <span className="text-gray-400">•</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          ${univ.type === 'Devlet' ? 'bg-blue-200 text-blue-800' :
                            univ.type === 'Vakıf' ? 'bg-purple-200 text-purple-800' :
                            'bg-orange-200 text-orange-800'}`}>
                          {univ.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-700">{univ.totalCount}</div>
                    <div className="text-xs text-gray-500">{univ.programCount} bölüm</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-3 transition-colors" />
                </div>
              </div>

              {/* Bölüm Listesi */}
              <div className="p-4 bg-white">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Yerleştikleri Bölümler ({univ.programCount} bölüm)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {univ.programs.map((prog, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={(e) => { e.stopPropagation(); navigate(`/programs/v2/${encodeURIComponent(prog.name)}`); }}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer group/prog transition-colors border border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <BookOpen className="w-3 h-3 text-gray-400 group-hover/prog:text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 group-hover/prog:text-blue-700 truncate font-medium">
                          {prog.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-blue-600 ml-2 flex-shrink-0">{prog.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default IHLDetail;