import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Search, Languages } from "lucide-react";
import dilOkullariData from "../../dilOkullari.json";

const DilListPage = () => {
  const [activeLanguage, setActiveLanguage] = useState("ingilizce");
  const [searchTerm, setSearchTerm] = useState("");
  const sliderRef = useRef(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [activeLanguage]);

  // Dil kategorileri
  const languageCategories = [
    { key: "ingilizce", label: "İngilizce" },
    { key: "arapca", label: "Arapça" },
    { key: "almanca", label: "Almanca" },
    { key: "fransizca", label: "Fransızca" },
    { key: "ispanyolca", label: "İspanyolca" },
    { key: "italyanca", label: "İtalyanca" },
    { key: "cince", label: "Çince" },
    { key: "japonca", label: "Japonca" },
    { key: "rusca", label: "Rusça" },
    { key: "farsca", label: "Farsça" },
  ];

  // Yardımcı Fonksiyon: Türkçe büyük/küçük harf duyarlı metin temizleme
  const toTrLower = (text) => {
    return text ? text.toLocaleLowerCase('tr') : "";
  };

  // Aktif kategoriye göre okulları getir
  const currentSchools = dilOkullariData[activeLanguage] || [];

  // Arama fonksiyonu (Türkçe Uyumlu)
  const filteredSchools = currentSchools.filter(school => {
    const term = toTrLower(searchTerm);
    return (
      toTrLower(school.name).includes(term) ||
      toTrLower(school.city).includes(term) ||
      (school.program && toTrLower(school.program).includes(term))
    );
  });

  // Highlight fonksiyonu (Regex Düzeltmesi)
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;

    // Türkçe karakter eşleşmeleri için harita
    const trMap = {
      'i': '[iİ]', 'İ': '[iİ]',
      'ı': '[ıI]', 'I': '[ıI]',
      'ş': '[şŞ]', 'Ş': '[şŞ]',
      'ğ': '[ğĞ]', 'Ğ': '[ğĞ]',
      'ü': '[üÜ]', 'Ü': '[üÜ]',
      'ö': '[öÖ]', 'Ö': '[öÖ]',
      'ç': '[çÇ]', 'Ç': '[çÇ]'
    };

    // Arama terimini Regex formatına uygun hale getiriyoruz
    let regexPattern = searchTerm.split('').map(char => trMap[char] || char).join('');
    
    // Regex oluştur
    const regex = new RegExp(`(${regexPattern})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      toTrLower(part) === toTrLower(searchTerm) ? 
        <mark key={i} className="bg-yellow-300 px-1 rounded">{part}</mark> : part
    );
  };

  // Şehre göre grupla
  const schoolsByCity = filteredSchools.reduce((acc, school) => {
    const city = school.city || "Diğer";
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(school);
    return acc;
  }, {});

  const activeLangData = languageCategories.find(l => l.key === activeLanguage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-teal-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Dil Ağırlıklı Anadolu İmam Hatip Liseleri
          </h1>
          <p className="text-blue-100">
            Çok dilli eğitim ile küresel yetkinlik kazandıran okullarımız
          </p>
        </div>
      </header>

      {/* Back Button */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Link
          to="/dil-programlari"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-800 text-white rounded-full font-semibold hover:bg-teal-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Açıklamaya Geri Dön
        </Link>
      </div>

      {/* Language Tabs - Sticky - Z-INDEX DÜŞÜRÜLDÜ */}
      <div className="top-0 z-[9000] py-4 px-4 ">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-lg font-bold text-gray-800 mb-3 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
            <Languages className="w-5 h-5 text-teal-800" />
            Dil Seçin
          </h2>
          
          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-5 gap-2">
            {languageCategories.map((lang) => (
              <button
                key={lang.key}
                onClick={() => {
                  setActiveLanguage(lang.key);
                  setSearchTerm("");
                }}
                className={`
                  relative py-2 px-3 rounded-lg font-semibold text-sm
                  transition-all duration-300
                  ${
                    activeLanguage === lang.key
                      ? "bg-teal-800 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Mobile Slider View */}
          <div className="md:hidden relative">
            <div 
              ref={sliderRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {languageCategories.map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => {
                    setActiveLanguage(lang.key);
                    setSearchTerm("");
                  }}
                  className={`
                    flex-shrink-0 py-2 px-4 rounded-lg font-semibold text-sm 
                    transition-all duration-300 snap-start
                    ${
                      activeLanguage === lang.key
                        ? "bg-teal-800 text-white shadow-md"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - Sticky - Z-INDEX DÜŞÜRÜLDÜ */}
      <div className=" py-4 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 flex-grow">
              {activeLangData?.label} Hazırlık Sınıfı Olan Okullar
            </h3>
            <span className="bg-teal-800 text-white font-bold px-3 py-1.5 rounded-full text-sm whitespace-nowrap">
              {currentSchools.length} Okul
            </span>
          </div>
          
          <div className=" sticky top-0 z-[10000]relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Okul adı, şehir veya program ile arayın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-teal-800 focus:outline-none text-gray-700 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Schools List */}
      <div className="container mx-auto max-w-7xl px-4 pb-12 pt-6">
        {Object.keys(schoolsByCity).length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">
              {searchTerm 
                ? `"${searchTerm}" için sonuç bulunamadı`
                : "Bu dil için henüz okul bulunmamaktadır."
              }
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 px-6 py-2 bg-teal-800 text-white rounded-full hover:bg-teal-800 transition-colors"
              >
                Aramayı Temizle
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="hidden md:block space-y-6">
              {Object.entries(schoolsByCity)
                .sort(([cityA], [cityB]) => cityA.localeCompare(cityB, "tr"))
                .map(([city, schools]) => (
                  <div key={city} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Şehir Başlığı */}
                    <div className="bg-gradient-to-r from-teal-800 to-teal-800 text-white py-3 px-6">
                      <h4 className="text-lg font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          📍 {highlightText(city)}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {schools.length} okul
                        </span>
                      </h4>
                    </div>

                    {/* Table Header */}
                    <div className="bg-amber-50 border-b-2 border-amber-200">
                      <div className="grid grid-cols-12 gap-4 p-4 font-bold text-gray-700">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-7">Okul Adı</div>
                        <div className="col-span-4">Program</div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {schools
                        .sort((a, b) => a.name.localeCompare(b.name, "tr"))
                        .map((school, index) => (
                          <div
                            key={school.id}
                            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-200 transition-colors group"
                          >
                            <div className="col-span-1 flex items-center justify-center">
                              <div className="w-8 h-8 bg-amber-100 group-hover:bg-amber-200 rounded-full flex items-center justify-center font-bold text-teal-800 text-sm transition-colors">
                                {index + 1}
                              </div>
                            </div>
                            <div className="col-span-7 flex items-center">
                              <h5 className="font-semibold text-gray-800 transition-colors">
                                {highlightText(school.name)}
                              </h5>
                            </div>
                            <div className="col-span-4 flex items-center">
                              {school.program ? (
                                <span className="inline-flex items-center gap-1 text-sm text-teal-800 font-medium bg-amber-50 px-3 py-1 rounded-full">
                                  📚 {highlightText(school.program)}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm italic">Standart Program</span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {Object.entries(schoolsByCity)
                .sort(([cityA], [cityB]) => cityA.localeCompare(cityB, "tr"))
                .map(([city, schools]) => (
                  <div key={city} className="space-y-3">
                    {/* Şehir Başlığı */}
                    <div className="bg-gradient-to-r from-teal-800 to-teal-800 text-white py-3 px-4 rounded-lg shadow-md">
                      <h4 className="font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          📍 {highlightText(city)}
                        </span>
                        <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                          {schools.length} okul
                        </span>
                      </h4>
                    </div>

                    {/* Okullar */}
                    {schools
                      .sort((a, b) => a.name.localeCompare(b.name, "tr"))
                      .map((school, index) => (
                        <div key={school.id} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-teal-800">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center font-bold text-teal-800 text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-grow">
                                <h5 className="font-semibold text-gray-800 text-base">
                                  {highlightText(school.name)}
                                </h5>
                              </div>
                            </div>
                            
                            {school.program && (
                              <div className="pt-2 border-t border-gray-200">
                                <span className="inline-flex items-center gap-1 text-sm text-teal-800 font-medium bg-amber-50 px-3 py-1 rounded-full">
                                  📚 {highlightText(school.program)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>

            {/* Toplam Sonuç Sayısı */}
            <div className="mt-8 text-center">
              <div className="inline-block rounded-full px-6 py-3">
                <p className="font-semibold text-gray-700">
                  Toplam <span className="text-teal-800 text-md">{filteredSchools.length}</span> okul listelendi
                  {searchTerm && (
                    <span className="text-gray-500 text-sm ml-2">
                      ("{searchTerm}" araması)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DilListPage;