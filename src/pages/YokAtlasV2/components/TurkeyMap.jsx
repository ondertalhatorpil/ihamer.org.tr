import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Türkiye GeoJSON haritası URL'i
const TURKEY_GEOJSON = 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/turkey.geojson';

const TurkeyMap = ({ citiesData, data }) => {
  const navigate = useNavigate();
  const [hoveredCity, setHoveredCity] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Şehir adı normalizasyonu (Türkçe karakterler ve büyük/küçük harf)
  const normalizeCity = (cityName) => {
    if (!cityName) return '';
    return cityName
      .toUpperCase() // Önce büyük harfe çevir
      .replace(/Ğ/g, 'G')
      .replace(/Ü/g, 'U')
      .replace(/Ş/g, 'S')
      .replace(/I/g, 'I')
      .replace(/İ/g, 'I')
      .replace(/Ö/g, 'O')
      .replace(/Ç/g, 'C')
      .trim();
  };

  // Şehir eşleştirme fonksiyonu - Çok esnek
  const findCityData = (geoName) => {
    const normalized = normalizeCity(geoName);
    
    // 1. Önce tam eşleşme dene
    let found = citiesData.find(c => normalizeCity(c.city) === normalized);
    if (found) return found;
    
    // 2. Kelime kelime eşleştir (KAHRAMAN MARAS gibi durumlar için)
    const normalizedWords = normalized.split(/\s+/).filter(w => w.length > 0);
    found = citiesData.find(c => {
      const cityWords = normalizeCity(c.city).split(/\s+/).filter(w => w.length > 0);
      
      // Tüm kelimeler eşleşiyor mu?
      if (normalizedWords.length === cityWords.length) {
        return normalizedWords.every((word, i) => cityWords[i] === word);
      }
      
      // Ana kelimeler eşleşiyor mu? (MARAS içinde KAHRAMANMARAS gibi)
      if (normalizedWords.length > 0 && cityWords.length > 0) {
        const hasMainWord = normalizedWords.some(word => 
          cityWords.some(cityWord => cityWord.includes(word) || word.includes(cityWord))
        );
        if (hasMainWord) {
          // İkinci kontrol: karakteristik kelime eşleşmesi
          if (normalizedWords.some(w => w.length > 4) && cityWords.some(w => w.length > 4)) {
            const longWords = normalizedWords.filter(w => w.length > 4);
            const longCityWords = cityWords.filter(w => w.length > 4);
            return longWords.some(w => longCityWords.some(cw => w.includes(cw) || cw.includes(w)));
          }
        }
      }
      
      return false;
    });
    if (found) return found;
    
    // 3. İçerme kontrolü
    found = citiesData.find(c => {
      const cityNormalized = normalizeCity(c.city);
      return cityNormalized.includes(normalized) || normalized.includes(cityNormalized);
    });
    if (found) return found;
    
    // 4. Özel eşleştirmeler
    const specialMap = {
      'AFYON': 'AFYONKARAHISAR',
      'K.MARAS': 'KAHRAMANMARAS',
      'KMARAS': 'KAHRAMANMARAS',
      'K MARAS': 'KAHRAMANMARAS',
      'MARAS': 'KAHRAMANMARAS',
      'S.URFA': 'SANLIURFA',
      'SURFA': 'SANLIURFA',
      'S URFA': 'SANLIURFA',
      'URFA': 'SANLIURFA'
    };
    
    const mapped = specialMap[normalized];
    if (mapped) {
      found = citiesData.find(c => normalizeCity(c.city).includes(mapped));
      if (found) return found;
    }
    
    // 5. Ters eşleştirme (citiesData'daki şehir GeoJSON'da kısaltılmış olabilir)
    found = citiesData.find(c => {
      const cityNormalized = normalizeCity(c.city);
      return Object.entries(specialMap).some(([key, value]) => 
        (cityNormalized.includes(value) && normalized === key) ||
        (cityNormalized === value && normalized === key)
      );
    });
    
    return found;
  };

  // Renk skalası - öğrenci sayısına göre
  const maxCount = Math.max(...citiesData.map(c => c.count));
  const colorScale = scaleLinear()
    .domain([0, maxCount / 2, maxCount])
    .range(['#e0f2fe', '#0ea5e9', '#0369a1']);

  const handleMouseEnter = (geo, event) => {
    const cityName = geo.properties.name;
    const cityData = findCityData(cityName);
    
    if (cityData) {
      setHoveredCity(cityData);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredCity(null);
  };

  const handleClick = (geo) => {
    const cityName = geo.properties.name;
    const cityData = findCityData(cityName);
    
    if (cityData && data) {
      // Normalize edilmiş şehir adını al
      const normalizedGeoName = normalizeCity(cityName);
      
      // O ildeki üniversiteleri bul - normalize ederek
      const cityRecords = data.filter(r => {
        if (r.year !== '2025' || !r.city) return false;
        
        const recordCityNormalized = normalizeCity(r.city);
        
        // Tam eşleşme
        if (recordCityNormalized === normalizedGeoName) return true;
        
        // İçerme
        if (recordCityNormalized.includes(normalizedGeoName) || 
            normalizedGeoName.includes(recordCityNormalized)) return true;
        
        // Özel durumlar kontrolü
        const specialMap = {
          'AFYON': 'AFYONKARAHISAR',
          'AFYONKARAHISAR': 'AFYON',
          'K.MARAS': 'KAHRAMANMARAS',
          'KMARAS': 'KAHRAMANMARAS',
          'K MARAS': 'KAHRAMANMARAS',
          'MARAS': 'KAHRAMANMARAS',
          'KAHRAMANMARAS': 'MARAS',
          'S.URFA': 'SANLIURFA',
          'SURFA': 'SANLIURFA',
          'S URFA': 'SANLIURFA',
          'URFA': 'SANLIURFA',
          'SANLIURFA': 'URFA'
        };
        
        // GeoJSON'dan gelen isim özel haritada var mı?
        if (specialMap[normalizedGeoName]) {
          const mapped = specialMap[normalizedGeoName];
          if (recordCityNormalized.includes(mapped) || mapped.includes(recordCityNormalized)) {
            return true;
          }
        }
        
        // Kayıttaki şehir özel haritada var mı?
        if (specialMap[recordCityNormalized]) {
          const mapped = specialMap[recordCityNormalized];
          if (normalizedGeoName.includes(mapped) || mapped.includes(normalizedGeoName)) {
            return true;
          }
        }
        
        // Kelime bazlı eşleştirme
        const geoWords = normalizedGeoName.split(/\s+/).filter(w => w.length > 3);
        const cityWords = recordCityNormalized.split(/\s+/).filter(w => w.length > 3);
        
        if (geoWords.length > 0 && cityWords.length > 0) {
          return geoWords.some(gw => cityWords.some(cw => 
            gw.includes(cw) || cw.includes(gw)
          ));
        }
        
        return false;
      });

      console.log(`🔍 ${cityName} için ${cityRecords.length} kayıt bulundu`);

      // Üniversite bazlı grupla
      const univMap = {};
      cityRecords.forEach(record => {
        const univName = record.university_name;
        const ihlCount = record.imam_hatip_lise_tipi?.reduce((s, tip) => s + (tip.yerlesen || 0), 0) || 0;
        
        if (!univMap[univName]) {
          univMap[univName] = {
            name: univName,
            type: record.university_type,
            count: 0,
            total: 0,
            programs: new Set()
          };
        }
        
        univMap[univName].count += ihlCount;
        univMap[univName].total += record.toplam_yerlesen || 0;
        univMap[univName].programs.add(record.program_name);
      });

      const universities = Object.values(univMap).map(univ => ({
        ...univ,
        programCount: univ.programs.size,
        percentage: univ.total > 0 ? ((univ.count / univ.total) * 100).toFixed(2) : 0
      })).sort((a, b) => b.count - a.count);

      console.log(`🏛️  ${universities.length} üniversite bulundu`);

      setSelectedCity({
        ...cityData,
        cityName,
        universities
      });
    }
  };

  return (
    <div className="relative bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2500,
          center: [35, 39]
        }}
        width={800}
        height={500}
        className="w-full h-auto drop-shadow-lg"
      >
        <Geographies geography={TURKEY_GEOJSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const cityName = geo.properties.name;
              const cityData = findCityData(cityName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e) => handleMouseEnter(geo, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(geo)}
                  style={{
                    default: {
                      fill: cityData ? colorScale(cityData.count) : '#f3f4f6',
                      stroke: '#374151',
                      strokeWidth: 1.5,
                      outline: 'none',
                      transition: 'all 0.3s',
                    },
                    hover: {
                      fill: cityData ? '#0284c7' : '#e5e7eb',
                      stroke: '#1f2937',
                      strokeWidth: 2.5,
                      outline: 'none',
                      cursor: 'pointer',
                      filter: 'brightness(1.1)',
                    },
                    pressed: {
                      fill: '#0369a1',
                      stroke: '#111827',
                      strokeWidth: 2.5,
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* İl Detay Modal */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedCity.cityName}</h2>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-sm text-primary-100">Toplam İHL Öğrencisi</p>
                    <p className="text-3xl font-bold">{selectedCity.count.toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <p className="text-sm text-primary-100">Oran</p>
                    <p className="text-3xl font-bold">%{selectedCity.percentage}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary-600" />
                    Üniversiteler ({selectedCity.universities.length})
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    💡 Detaylar için tıklayın
                  </p>
                </div>

                {selectedCity.universities.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCity.universities.map((univ, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedCity(null);
                          navigate(`/universities/${encodeURIComponent(univ.name)}`);
                        }}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-primary-50 hover:border-primary-300 hover:shadow-md transition-all border border-gray-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                                {univ.name}
                              </h4>
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${univ.type === 'Devlet' ? 'bg-blue-100 text-blue-700' : ''}
                                ${univ.type === 'Vakıf' ? 'bg-purple-100 text-purple-700' : ''}
                                ${univ.type === 'KKTC' ? 'bg-orange-100 text-orange-700' : ''}
                              `}>
                                {univ.type}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{univ.count} öğrenci</span>
                              </div>
                              <span>•</span>
                              <span>{univ.programCount} program</span>
                              <span>•</span>
                              <span className="font-medium text-primary-600">%{univ.percentage}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{univ.count}</p>
                              <p className="text-xs text-gray-500">İHL Öğrenci</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Bu ilde üniversite verisi bulunamadı</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredCity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="fixed pointer-events-none z-50"
            style={{
              left: tooltipPosition.x + 15,
              top: tooltipPosition.y + 15,
            }}
          >
            <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200">
              <p className="font-bold text-gray-900 mb-1">{hoveredCity.city}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold text-primary-600">
                    {hoveredCity.count.toLocaleString('tr-TR')}
                  </span>
                  {' '}öğrenci
                </p>
                <p className="text-xs">
                  Oran: <span className="font-medium">%{hoveredCity.percentage}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Renk Skalası Göstergesi ve Açıklama */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-gray-700">Az Öğrenci</span>
          <div className="flex gap-0.5 shadow-sm rounded-lg overflow-hidden border border-gray-300">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-6"
                style={{
                  backgroundColor: colorScale((maxCount / 4) * i)
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">Çok Öğrenci</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-700 rounded"></div>
            <span>Şehir Sınırları</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Veri Yok</span>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-500 italic">
          💡 Harita üzerinde bir şehre gelin, detaylı bilgi görmek için
        </p>
      </div>
    </div>
  );
};

export default TurkeyMap;