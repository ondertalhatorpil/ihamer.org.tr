import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { groupByProgram, calculateTrend, isAcikogretim } from '../utils/dataProcessor';

const Programs = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;

    const progs2023 = groupByProgram(data, '2023');
    const progs2024 = groupByProgram(data, '2024');
    const progs2025 = groupByProgram(data, '2025');

    const mergedProgs = progs2025
      .filter(p => !isAcikogretim(p.name, ''))
      .map(prog2025 => {
        const prog2023 = progs2023.find(p => p.name === prog2025.name);
        const prog2024 = progs2024.find(p => p.name === prog2025.name);
        const trend = calculateTrend(prog2025.count, prog2023?.count || 0);
        return {
          ...prog2025,
          count2023: prog2023?.count || 0,
          count2024: prog2024?.count || 0,
          count2025: prog2025.count,
          trend
        };
      });

    setPrograms(mergedProgs);
  }, [data]);

  const filteredPrograms = useMemo(() => {
    return programs.filter(prog => {
      const matchesSearch = prog.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tümü' || prog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [programs, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">

      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bölümler</h1>
        <p className="mt-2 text-gray-600">
          Bölümlere yerleşen İHL mezunu öğrenci sayıları ve trendler
        </p>
      </div>

      {/* Açıklayıcı Bilgi Kutusu */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-600 rounded-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">💡 Bu sayfada ne var?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>3 Yıllık Karşılaştırma:</strong> 2023-2024-2025 yılları arasında bölüm bazlı İHL mezunu sayıları</li>
              <li>• <strong>Trend Göstergeleri:</strong> 2023'ten 2025'e yüzdelik değişim (yeşil ↗ artış, kırmızı ↘ azalış)</li>
              <li>• <strong>Alan Filtreleme:</strong> Sayısal, Sözel, Eşit Ağırlık kategorilerine göre filtreleyin</li>
              <li>• <strong>Detaylı İnceleme:</strong> Her bölüme tıklayarak hangi üniversitelerde tercih edildiğini görebilirsiniz</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm Ara</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Bölüm adı..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alan</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option>Tümü</option>
              <option>Sayısal</option>
              <option>Sözel</option>
              <option>Eşit Ağırlık</option>
              <option>Dil</option>
            </select>
          </div>
        </div>

        {(searchTerm || selectedCategory !== 'Tümü') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Arama: {searchTerm}
              </span>
            )}
            {selectedCategory !== 'Tümü' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Alan: {selectedCategory}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sonuç Sayısı */}
      <div>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredPrograms.length}</span> bölüm bulundu
        </p>
      </div>

      {/* Bölüm Tablosu */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 min-w-[300px]">Bölüm Adı</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Alan</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Üniversite</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 bg-gray-50">2023</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 bg-blue-50">2024</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 bg-green-50">2025</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                Trend
                <div className="text-xs font-normal text-gray-500 mt-1">(2023→2025)</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map((prog, index) => (
              <tr
                key={index}
                onClick={() => navigate(`/programs/v2/${encodeURIComponent(prog.name)}`)}
                className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                    {prog.name}
                  </p>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                    ${prog.category === 'Sayısal' ? 'bg-blue-100 text-blue-700' : ''}
                    ${prog.category === 'Sözel' ? 'bg-purple-100 text-purple-700' : ''}
                    ${prog.category === 'Eşit Ağırlık' ? 'bg-green-100 text-green-700' : ''}
                    ${prog.category === 'Dil' ? 'bg-gray-100 text-gray-900' : ''}
                  `}>
                    {prog.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-600">{prog.universityCount}</td>
                <td className="py-3 px-4 text-center bg-gray-50">
                  <span className="font-semibold text-gray-700">{prog.count2023.toLocaleString('tr-TR')}</span>
                </td>
                <td className="py-3 px-4 text-center bg-blue-50">
                  <span className="font-semibold text-gray-700">{prog.count2024.toLocaleString('tr-TR')}</span>
                </td>
                <td className="py-3 px-4 text-center bg-green-50">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-900">{prog.count2025.toLocaleString('tr-TR')}</span>
                    <span className="text-xs text-gray-500">%{prog.percentage}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1">
                    {prog.trend.direction === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : prog.trend.direction === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={`text-sm font-medium
                      ${prog.trend.direction === 'up' ? 'text-green-600' : ''}
                      ${prog.trend.direction === 'down' ? 'text-red-600' : ''}
                      ${prog.trend.direction === 'neutral' ? 'text-gray-600' : ''}
                    `}>
                      {prog.trend.direction === 'up' ? '+' : prog.trend.direction === 'down' ? '-' : ''}
                      %{prog.trend.percentage}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Filtre kriterlerine uygun bölüm bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;