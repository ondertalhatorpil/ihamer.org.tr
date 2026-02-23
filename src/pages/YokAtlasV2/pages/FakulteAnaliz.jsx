import { useState, useEffect } from 'react';
import { BookOpen, Search, Building2 } from 'lucide-react';
import { groupByFakulte, groupByFakulteKategori } from '../utils/dataProcessor';

const KATEGORI_COLORS = {
  'İlahiyat':       '#16a34a',
  'Tıp':            '#dc2626',
  'Hukuk':          '#7c3aed',
  'Eğitim':         '#2563eb',
  'Mühendislik':    '#d97706',
  'Fen-Edebiyat':   '#0891b2',
  'İktisat':        '#be185d',
  'İşletme':        '#7c2d12',
  'Sosyal Bilimler':'#4f46e5',
  'Sağlık':         '#059669',
  'İletişim':       '#9333ea',
  'Mimarlık':       '#b45309',
  'Eczacılık':      '#0369a1',
  'Diş Hekimliği':  '#475569',
  'Güzel Sanatlar': '#db2777',
  'Diğer':          '#6b7280',
};

const FakulteAnaliz = ({ data }) => {
  const [fakulteData, setFakulteData] = useState([]);
  const [kategoriData, setKategoriData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [sortBy, setSortBy] = useState('count');

  useEffect(() => {
    if (!data || !data.length) return;
    setLoading(true);
    setFakulteData(groupByFakulte(data, selectedYear));
    setKategoriData(groupByFakulteKategori(data, selectedYear));
    setLoading(false);
  }, [data, selectedYear]);

  const filtered = fakulteData
    .filter(f => {
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
      const matchKat = !selectedKategori || f.kategori === selectedKategori;
      return matchSearch && matchKat;
    })
    .sort((a, b) => sortBy === 'count' ? b.count - a.count : b.percentage - a.percentage);

  const allKategoriler = [...new Set(fakulteData.map(f => f.kategori))].sort();

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
          <BookOpen className="w-8 h-8 text-blue-600" />
          Fakülte Analizi
        </h1>
        <p className="text-gray-600 mt-1">Fakülte bazında İHL mezunu öğrenci yoğunluğu</p>
      </div>

      {/* Açıklayıcı Bilgi Kutusu */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-600 rounded-lg flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">💡 Bu sayfada ne var?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Fakülte Kategorileri:</strong> İlahiyat, Tıp, Hukuk, Mühendislik gibi fakülte türlerine göre İHL yoğunluğu</li>
              <li>• <strong>Karşılaştırma:</strong> Hangi fakültelerde İHL mezunları daha çok tercih ediliyor?</li>
              <li>• <strong>Detaylı Liste:</strong> Tüm fakülteler öğrenci sayısı ve oranıyla birlikte</li>
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
              selectedYear === y ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Kategori Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kategoriData.slice(0, 8).map((kat) => (
          <div
            key={kat.name}
            onClick={() => setSelectedKategori(kat.name === selectedKategori ? '' : kat.name)}
            className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
              selectedKategori === kat.name ? 'border-blue-500 shadow-md' : 'border-transparent'
            }`}
            style={{ backgroundColor: `${KATEGORI_COLORS[kat.name] || '#6b7280'}15` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold truncate" style={{ color: KATEGORI_COLORS[kat.name] || '#6b7280' }}>
                {kat.name}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{kat.count.toLocaleString('tr-TR')}</p>
            <p className="text-xs text-gray-600">%{kat.percentage} oran</p>
            <p className="text-xs text-gray-500">{kat.fakulteCount} fakülte</p>
          </div>
        ))}
      </div>

      {/* Fakülte Listesi */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Tüm Fakülteler
            <span className="text-base text-gray-500 font-normal ml-2">({filtered.length})</span>
          </h2>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Fakülte ara..."
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none w-44"
              />
            </div>
            <select
              value={selectedKategori}
              onChange={e => setSelectedKategori(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="">Tüm Kategoriler</option>
              {allKategoriler.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="count">Öğrenci Sayısı</option>
              <option value="percentage">Oran</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fakülte Adı</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Kategori</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">İHL Öğrenci</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Toplam</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Oran</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Üniversite</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 80).map((fak, idx) => (
                <tr
                  key={fak.name}
                  className="border-b border-gray-50 hover:bg-blue-50 transition-colors group"
                >
                  <td className="py-3 px-4 text-sm text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{fak.name}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${KATEGORI_COLORS[fak.kategori] || '#6b7280'}20`,
                        color: KATEGORI_COLORS[fak.kategori] || '#6b7280'
                      }}
                    >
                      {fak.kategori}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {fak.count.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 text-sm">
                    {fak.total.toLocaleString('tr-TR')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-semibold ${
                      parseFloat(fak.percentage) > 20 ? 'text-green-600' :
                      parseFloat(fak.percentage) > 10 ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      %{fak.percentage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">{fak.universityCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 80 && (
          <p className="text-center text-sm text-gray-500 mt-4 py-3 bg-gray-50 rounded-lg">
            İlk 80 sonuç gösteriliyor — aramayı daraltın
          </p>
        )}
      </div>

    </div>
  );
};

export default FakulteAnaliz;