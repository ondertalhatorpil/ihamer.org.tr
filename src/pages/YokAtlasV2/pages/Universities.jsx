import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { groupByUniversity, calculateTrend } from '../utils/dataProcessor';

const Universities = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tümü');
  const [selectedCity, setSelectedCity] = useState('Tümü');
  const [universities, setUniversities] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;

    const univs2023 = groupByUniversity(data, '2023');
    const univs2024 = groupByUniversity(data, '2024');
    const univs2025 = groupByUniversity(data, '2025');

    const mergedUnivs = univs2025.map(univ2025 => {
      const univ2023 = univs2023.find(u => u.name === univ2025.name);
      const univ2024 = univs2024.find(u => u.name === univ2025.name);
      const trend = calculateTrend(univ2025.count, univ2024?.count || 0);

      return {
        ...univ2025,
        count2023: univ2023?.count || 0,
        count2024: univ2024?.count || 0,
        count2025: univ2025.count,
        trend
      };
    });

    setUniversities(mergedUnivs);

    const uniqueCities = [...new Set(mergedUnivs.map(u => u.city).filter(Boolean))].sort();
    setCities(uniqueCities);
  }, [data]);

  const filteredUniversities = useMemo(() => {
    return universities.filter(univ => {
      const matchesSearch = univ.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'Tümü' || univ.type === selectedType;
      const matchesCity = selectedCity === 'Tümü' || univ.city === selectedCity;
      return matchesSearch && matchesType && matchesCity;
    });
  }, [universities, searchTerm, selectedType, selectedCity]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Üniversiteler</h1>
        <p className="mt-2 text-gray-600">
          Üniversitelere yerleşen İHL mezunu öğrenci sayıları ve trendler
        </p>
      </div>

      {/* Açıklayıcı Bilgi Kutusu */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">💡 Bu sayfada ne var?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>3 Yıllık Karşılaştırma:</strong> 2023-2024-2025 yılları arasında İHL mezunu öğrenci sayıları</li>
              <li>• <strong>Trend Göstergeleri:</strong> 2024'ten 2025'e yüzdelik artış/azalış oranları (yeşil ↗ artış, kırmızı ↘ azalış)</li>
              <li>• <strong>Filtreleme:</strong> Devlet/Vakıf/KKTC ve şehir bazlı filtreleme yapabilirsiniz</li>
              <li>• <strong>Detaylı İnceleme:</strong> Her üniversiteye tıklayarak bölüm bazlı detaylara ulaşabilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Arama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Üniversite Ara
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Üniversite adı..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Tip Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Üniversite Tipi
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option>Tümü</option>
              <option>Devlet</option>
              <option>Vakıf</option>
              <option>KKTC</option>
            </select>
          </div>

          {/* Şehir Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şehir
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option>Tümü</option>
              {cities.map(city => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Aktif Filtreler */}
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Arama: {searchTerm}
            </span>
          )}
          {selectedType !== 'Tümü' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Tip: {selectedType}
            </span>
          )}
          {selectedCity !== 'Tümü' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Şehir: {selectedCity}
            </span>
          )}
        </div>
      </div>

      {/* Sonuç Sayısı */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredUniversities.length}</span> üniversite bulundu
        </p>
      </div>

      {/* Üniversite Listesi */}
      <div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filteredUniversities.map((univ, index) => (
          <div
            key={index}
            variants={itemVariants}
            onClick={() => navigate(`/universities/v2/${encodeURIComponent(univ.name)}`)}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {univ.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0
                    ${univ.type === 'Devlet' ? 'bg-blue-100 text-blue-700' : ''}
                    ${univ.type === 'Vakıf' ? 'bg-purple-100 text-purple-700' : ''}
                    ${univ.type === 'KKTC' ? 'bg-orange-100 text-orange-700' : ''}
                  `}>
                    {univ.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>{univ.city}</span>
                  <span>•</span>
                  <span>{univ.programCount} program</span>
                  <span>•</span>
                  <span>%{univ.percentage} oran</span>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-4 flex-shrink-0">
                {/* 2024 → 2025 Karşılaştırma */}
                <div className="text-center border-r border-gray-200 pr-6">
                  <p className="text-xs text-gray-500 mb-2">2024 → 2025 Karşılaştırma</p>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">2024</p>
                      <p className="text-lg font-bold text-gray-700">
                        {univ.count2024.toLocaleString('tr-TR')}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      {univ.trend.direction === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : univ.trend.direction === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="text-xs text-gray-400">→</span>
                      )}
                      <span className={`text-xs font-bold mt-1 ${
                        univ.trend.direction === 'up' ? 'text-green-600' :
                        univ.trend.direction === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {univ.trend.direction === 'up' ? '+' : univ.trend.direction === 'down' ? '-' : ''}
                        %{univ.trend.percentage}
                      </span>
                    </div>

                    <div className="text-left">
                      <p className="text-xs text-gray-500">2025</p>
                      <p className="text-lg font-bold text-gray-900">
                        {univ.count2025.toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>
        ))}

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Filtre kriterlerine uygun üniversite bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Universities;