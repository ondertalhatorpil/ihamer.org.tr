import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Book, User, Calendar, Building2, FileText, GraduationCap, ExternalLink, Filter, X, ChevronDown, ChevronUp, ArrowLeft, Tag, Home } from 'lucide-react';

const AllThesesPage = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    type: '',
    university: '',
    category: '',
    imamHatipTitle: false
  });

  useEffect(() => {
    import('./data/tez.json')
      .then(module => {
        const data = module.default;
        const enrichedData = data.map(thesis => ({
          ...thesis,
          category: categorizeThesis(thesis),
          hasImamHatipTitle: hasImamHatipInTitle(thesis)
        }));
        setTheses(enrichedData);
        setFilteredTheses(enrichedData);
        setLoading(false);
      })
      .catch(err => {
        console.error('JSON yükleme hatası:', err);
        setLoading(false);
      });
  }, []);

  const categorizeThesis = (thesis) => {
    const bolum = thesis['Bölüm']?.toLowerCase() || '';
    const alanDisiKeywords = ['tıp', 'hemşirelik', 'diş hekimliği', 'gıda mühendisliği', 'beslenme', 'diyetetik'];
    if (alanDisiKeywords.some(keyword => bolum.includes(keyword))) return 'Alan Dışı';
    const dogruданKatkiKeywords = ['din eğitimi', 'ilahiyat', 'sosyoloji', 'psikoloji', 'eğitim bilimleri'];
    if (dogruданKatkiKeywords.some(keyword => bolum.includes(keyword))) return 'Doğrudan Katkı';
    return 'Diğer';
  };

  const hasImamHatipInTitle = (thesis) => {
    const baslik = thesis['Tez Başlığı']?.toLowerCase() || '';
    return baslik.includes('imam hatip') || baslik.includes('imam-hatip');
  };

  useEffect(() => {
    let result = theses;

    if (searchTerm) {
      result = result.filter(thesis => 
        thesis['Tez Başlığı']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis['Yazar']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis['Danışman']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis['Üniversite']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thesis['Özet (Türkçe)']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.year) result = result.filter(t => t['Yıl'] === filters.year);
    if (filters.type) result = result.filter(t => t['Tez Türü'] === filters.type);
    if (filters.university) result = result.filter(t => t['Üniversite']?.toLowerCase().includes(filters.university.toLowerCase()));
    if (filters.category) result = result.filter(t => t.category === filters.category);
    if (filters.imamHatipTitle) result = result.filter(t => t.hasImamHatipTitle);

    setFilteredTheses(result);
  }, [searchTerm, filters, theses]);

  const uniqueYears = [...new Set(theses.map(t => t['Yıl']))].filter(Boolean).sort().reverse();
  const uniqueTypes = [...new Set(theses.map(t => t['Tez Türü']))].filter(Boolean);
  const categories = ['Alan Dışı', 'Doğrudan Katkı', 'Diğer'];

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Alan Dışı': return 'bg-red-100 text-red-700 border-red-200';
      case 'Doğrudan Katkı': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#B38F65] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Tezler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/tez-analytics')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[#B38F65] to-[#8b6f47] rounded-xl shadow-lg">
                  <Book className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    Tüm Tezler
                  </h1>
                  <p className="text-sm text-slate-500">Tüm tezleri arayın ve filtreleyin</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-sm font-medium text-slate-500 hover:text-[#B38F65] transition-colors flex items-center gap-2"
              >
                <Home size={16} />
                Anasayfa'ya Dön
              </button>
            </div>
          </div>

          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tez başlığı, yazar, danışman veya anahtar kelime ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#B38F65] focus:ring-4 focus:ring-[#B38F65]/10 outline-none transition-all text-sm bg-white shadow-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-[#B38F65] hover:text-[#8b6f47] transition-colors"
          >
            <Filter size={16} />
            {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showFilters && (
            <div className="mt-4 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                  className="px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:border-[#B38F65] focus:ring-2 focus:ring-[#B38F65]/10 outline-none text-sm"
                >
                  <option value="">Tüm Yıllar</option>
                  {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>

                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:border-[#B38F65] focus:ring-2 focus:ring-[#B38F65]/10 outline-none text-sm"
                >
                  <option value="">Tüm Türler</option>
                  {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:border-[#B38F65] focus:ring-2 focus:ring-[#B38F65]/10 outline-none text-sm"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <input
                  type="text"
                  placeholder="Üniversite..."
                  value={filters.university}
                  onChange={(e) => setFilters({...filters, university: e.target.value})}
                  className="px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white focus:border-[#B38F65] focus:ring-2 focus:ring-[#B38F65]/10 outline-none text-sm"
                />

                <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-slate-200 bg-white cursor-pointer hover:border-[#B38F65] transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.imamHatipTitle}
                    onChange={(e) => setFilters({...filters, imamHatipTitle: e.target.checked})}
                    className="w-4 h-4 text-[#B38F65] rounded focus:ring-[#B38F65]"
                  />
                  <span className="text-sm text-slate-700">İH Başlıklı</span>
                </label>
              </div>
            </div>
          )}

          {(searchTerm || Object.values(filters).some(f => f)) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B38F65]/10 text-[#B38F65] rounded-lg text-xs font-medium">
                  Arama: "{searchTerm}"
                  <X size={14} className="cursor-pointer" onClick={() => setSearchTerm('')} />
                </span>
              )}
              {Object.entries(filters).map(([key, value]) => {
                if (key === 'imamHatipTitle' && value) {
                  return (
                    <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B38F65]/10 text-[#B38F65] rounded-lg text-xs font-medium">
                      İH Başlıklı
                      <X size={14} className="cursor-pointer" onClick={() => setFilters({...filters, [key]: false})} />
                    </span>
                  );
                }
                if (value && typeof value === 'string') {
                  return (
                    <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B38F65]/10 text-[#B38F65] rounded-lg text-xs font-medium">
                      {value}
                      <X size={14} className="cursor-pointer" onClick={() => setFilters({...filters, [key]: ''})} />
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <p className="text-sm text-slate-600 font-medium">
            <span className="text-[#B38F65] font-bold">{filteredTheses.length}</span> tez bulundu
          </p>
        </div>

        <div className="space-y-4">
          {filteredTheses.map((thesis, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:border-[#B38F65]/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-base font-bold text-slate-800 flex-1 hover:text-[#B38F65] cursor-pointer transition-colors leading-snug">
                  {thesis['Tez Başlığı']}
                </h2>
                <div className="flex flex-col gap-2 shrink-0">
                  <span className="bg-[#B38F65] text-white px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                    {thesis['Tez No']}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap border ${getCategoryColor(thesis.category)}`}>
                    {thesis.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-[#B38F65] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Yazar</p>
                    <p className="text-sm text-slate-800 font-semibold truncate">{thesis['Yazar']}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-[#B38F65] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Danışman</p>
                    <p className="text-sm text-slate-800 font-semibold truncate">{thesis['Danışman']}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#B38F65] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Üniversite</p>
                    <p className="text-sm text-slate-800 font-semibold truncate">{thesis['Üniversite']}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-[#B38F65] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Yıl & Tür</p>
                    <p className="text-sm text-slate-800 font-semibold">{thesis['Yıl']} • {thesis['Tez Türü']}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="text-xs text-slate-600 mb-1">
                  <span className="font-semibold text-[#B38F65]">Enstitü:</span> {thesis['Enstitü']}
                </p>
                <p className="text-xs text-slate-600 mb-2">
                  <span className="font-semibold text-[#B38F65]">Bölüm:</span> {thesis['Bölüm']}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-[#B38F65]/10 text-[#B38F65] px-3 py-1 rounded-lg text-xs font-semibold border border-[#B38F65]/20">
                    {thesis['Konu Alanı']}
                  </span>
                  {thesis.hasImamHatipTitle && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-semibold border border-amber-200">
                      <Tag size={12} />
                      İmam Hatip Başlıklı
                    </span>
                  )}
                </div>
              </div>

              {thesis['Özet (Türkçe)'] && (
                <div>
                  <button
                    onClick={() => setSelectedThesis(selectedThesis === index ? null : index)}
                    className="flex items-center gap-2 text-[#B38F65] hover:text-[#8b6f47] font-semibold text-sm transition-colors mb-3"
                  >
                    <FileText className="w-4 h-4" />
                    {selectedThesis === index ? 'Özeti Gizle' : 'Özeti Göster'}
                  </button>
                  
                  {selectedThesis === index && (
                    <div className="bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl p-4 border border-slate-200 animate-fade-in">
                      <div className="mb-3">
                        <p className="text-xs font-bold text-[#B38F65] mb-2">Türkçe Özet</p>
                        <p className="text-sm text-justify text-slate-700 leading-relaxed">{thesis['Özet (Türkçe)']}</p>
                      </div>
                      {thesis['Özet (İngilizce)'] && (
                        <div className="pt-3 border-t border-slate-200">
                          <p className="text-xs font-bold text-[#B38F65] mb-2">English Abstract</p>
                          <p className="text-sm text-justify text-slate-600 leading-relaxed">{thesis['Özet (İngilizce)']}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100">
                {thesis['Tez Dosyası'] && thesis['Tez Dosyası'] !== 'İzinsiz' ? (
                  <a
                    href={thesis['Tez Dosyası']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B38F65] to-[#8b6f47] text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    YÖKTEZ'de Görüntüle
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-slate-400 text-sm">
                    <Book className="w-4 h-4" />
                    Tez erişime kapalı
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTheses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Book className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-700 mb-2">Sonuç bulunamadı</p>
            <p className="text-sm text-slate-500">Farklı filtreler deneyin</p>
          </div>
        )}
      </main>

        {/* Footer */}
        <footer className="w-full py-8 mt-auto border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
      <p className="text-sm font-medium text-slate-400">
        © 2026 İHAMER Analitik. Tüm hakları saklıdır.
      </p>
    </div>
  </footer>
    </div>
  );
};

export default AllThesesPage;