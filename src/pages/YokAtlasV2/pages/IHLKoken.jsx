import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, MapPin, Search, TrendingUp, ChevronRight, Trophy, Users } from 'lucide-react';
import { groupByIHL, groupIHLByCity } from '../utils/dataProcessor';

const IHLKoken = ({ data }) => {
  const navigate = useNavigate();
  const [ihlData, setIhlData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [hoveredCity, setHoveredCity] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    if (!data || !data.length) return;
    const ihls = groupByIHL(data, selectedYear);
    const cities = groupIHLByCity(data, selectedYear);
    setIhlData(ihls);
    setCityData(cities);
    setLoading(false);
  }, [data, selectedYear]);

  const allCities = useMemo(() => {
    return [...new Set(ihlData.map(i => i.city).filter(Boolean))].sort();
  }, [ihlData]);

  const filtered = useMemo(() => {
    return ihlData.filter(ihl => {
      const matchSearch = !search || ihl.displayName.toLowerCase().includes(search.toLowerCase());
      const matchCity = !cityFilter || ihl.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [ihlData, search, cityFilter]);

  const top10Cities = cityData.slice(0, 15);
  const maxCityCount = top10Cities[0]?.count || 1;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <School className="w-8 h-8 text-green-600" />
          İHL Köken Analizi
        </h1>
        <p className="text-gray-600 mt-1">
          Hangi İmam Hatip Liselerinden kaç öğrenci üniversiteye yerleşti?
        </p>
      </div>

      {/* Açıklayıcı Bilgi Kutusu */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">💡 Bu sayfada ne var?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Şehir Bazlı Dağılım:</strong> Hangi şehirlerden kaç öğrenci üniversiteye yerleşti?</li>
              <li>• <strong>Okul Sıralaması:</strong> Türkiye geneli İmam Hatip Liseleri başarı sıralaması</li>
              <li>• <strong>Detaylı İnceleme:</strong> Her okula tıklayarak o okuldan hangi üniversite ve bölümlere yerleşildiğini görebilirsiniz</li>
            </ul>
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
              selectedYear === y
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Toplam İHL Sayısı</p>
              <p className="text-3xl font-bold text-green-900">{ihlData.length.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-green-600 mt-1">farklı okul</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Toplam Yerleşen</p>
              <p className="text-3xl font-bold text-blue-900">
                {ihlData.reduce((s, i) => s + i.totalCount, 0).toLocaleString('tr-TR')}
              </p>
              <p className="text-xs text-blue-600 mt-1">öğrenci ({selectedYear})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Şehir Bazlı Dağılım */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-green-600" />
          Şehir Bazlı İHL Mezunu Dağılımı ({selectedYear})
        </h2>
        <p className="text-sm text-gray-500 mb-4">Üzerine gelerek şehir detaylarını görebilirsiniz</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {top10Cities.map((city, idx) => {
            const ratio = city.count / maxCityCount;
            const bg = ratio > 0.7 ? 'from-green-600 to-green-700 text-white' :
                       ratio > 0.4 ? 'from-green-400 to-green-500 text-white' :
                       ratio > 0.2 ? 'from-green-200 to-green-300 text-green-900' :
                                     'from-green-50 to-green-100 text-green-800';
            return (
              <div
                key={city.city}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => setCityFilter(city.city === cityFilter ? '' : city.city)}
                className={`relative p-3 rounded-xl bg-gradient-to-br ${bg} cursor-pointer transition-all border-2 ${
                  cityFilter === city.city ? 'border-green-600 shadow-lg scale-105' : 'border-transparent hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold truncate">{city.city}</span>
                  {idx < 3 && <Trophy className="w-3 h-3 opacity-70 flex-shrink-0" />}
                </div>
                <p className="text-xl font-bold">{city.count}</p>
                <p className="text-xs opacity-75">{city.schoolCount} okul</p>

                {/* Hover Tooltip */}
                {hoveredCity?.city === city.city && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 bg-gray-900 text-white text-xs rounded-lg p-2 w-36 shadow-xl pointer-events-none">
                    <p className="font-bold">{city.city}</p>
                    <p>{city.count} öğrenci</p>
                    <p>{city.schoolCount} farklı okul</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bar Chart */}
        <div className="mt-6 space-y-2">
          {top10Cities.slice(0, 10).map((city, idx) => (
            <div key={city.city} className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-gray-700 text-right truncate">{city.city}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{ width: `${(city.count / maxCityCount) * 100}%` }}
                >
                  <span className="text-xs text-white font-bold">{city.count}</span>
                </div>
              </div>
              <div className="w-16 text-xs text-gray-500 text-left">{city.schoolCount} okul</div>
            </div>
          ))}
        </div>
      </div>

      {/* Türkiye Geneli Sıralama */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Türkiye Geneli İHL Sıralaması
            <span className="text-base text-gray-500 font-normal">({filtered.length} okul)</span>
          </h2>

          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Okul ara..."
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-300 focus:border-green-400 outline-none w-48"
              />
            </div>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-300 outline-none"
            >
              <option value="">Tüm Şehirler</option>
              {allCities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {(search || cityFilter) && (
              <button
                onClick={() => { setSearch(''); setCityFilter(''); }}
                className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Okul Adı</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Şehir</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Yerleşen</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Üniversite</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Bölüm</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((ihl, idx) => (
                <tr
                  key={ihl.name}
                  onClick={() => navigate(`/ihl/v2/${encodeURIComponent(ihl.name)}`)}
                  className="border-b border-gray-50 hover:bg-green-50 cursor-pointer group transition-colors"
                >
                  <td className="py-3 px-4">
                    {idx < 3 ? (
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold text-white
                        ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                        {idx + 1}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                      {ihl.displayName}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {ihl.city}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xl font-bold text-green-700">{ihl.totalCount}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 text-sm">{ihl.universityCount}</td>
                  <td className="py-3 px-4 text-right text-gray-600 text-sm">{ihl.programCount}</td>
                  <td className="py-3 px-4 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 ml-auto transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 100 && (
          <p className="text-center text-sm text-gray-500 mt-4 py-3 bg-gray-50 rounded-lg">
            İlk 100 sonuç gösteriliyor — aramayı daraltın
          </p>
        )}
      </div>

    </div>
  );
};

export default IHLKoken;