import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart2, Info } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts';
import { groupByPuanTuruYearly, groupByIHLTipi } from '../utils/dataProcessor';

const PUAN_COLORS = {
  'SAY': '#2563eb', 'MF': '#2563eb',
  'EA': '#7c3aed', 'TM': '#7c3aed',
  'SÖZ': '#16a34a', 'SOZ': '#16a34a',
  'DİL': '#d97706', 'DIL': '#d97706',
  'Diğer': '#6b7280',
};

const PUAN_LABELS = {
  'SAY': 'Sayısal (SAY)',
  'MF': 'Matematik-Fen (MF)',
  'EA': 'Eşit Ağırlık (EA)',
  'TM': 'Temel Matematik (TM)',
  'SÖZ': 'Sözel (SÖZ)',
  'SOZ': 'Sözel (SÖZ)',
  'DİL': 'Dil (DİL)',
  'DIL': 'Dil (DIL)',
};

const PuanTuruAnaliz = ({ data }) => {
  const [puanData, setPuanData] = useState([]);
  const [ihlTipiData, setIhlTipiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('count');

  useEffect(() => {
    if (!data || !data.length) return;
    setPuanData(groupByPuanTuruYearly(data));
    setIhlTipiData(groupByIHLTipi(data, '2025'));
    setLoading(false);
  }, [data]);

  const trendData = [
    { year: '2023', ...Object.fromEntries(puanData.map(p => [p.puan, viewMode === 'count' ? (p.count_2023 || 0) : (p.pct_2023 || 0)])) },
    { year: '2024', ...Object.fromEntries(puanData.map(p => [p.puan, viewMode === 'count' ? (p.count_2024 || 0) : (p.pct_2024 || 0)])) },
    { year: '2025', ...Object.fromEntries(puanData.map(p => [p.puan, viewMode === 'count' ? (p.count_2025 || 0) : (p.pct_2025 || 0)])) },
  ];

  const comparisonData = puanData.map(p => ({
    puan: p.puan,
    label: PUAN_LABELS[p.puan] || p.puan,
    count_2023: p.count_2023 || 0,
    count_2024: p.count_2024 || 0,
    count_2025: p.count_2025 || 0,
    pct_2023: p.pct_2023 || 0,
    pct_2024: p.pct_2024 || 0,
    pct_2025: p.pct_2025 || 0,
    trend: p.count_2025 > p.count_2024 ? 'up' : p.count_2025 < p.count_2024 ? 'down' : 'neutral',
    trendPct: p.count_2024 > 0 ? Math.abs(((p.count_2025 - p.count_2024) / p.count_2024) * 100).toFixed(1) : '0',
  }));

  const bar2025Data = puanData.map(p => ({
    puan: p.puan,
    label: PUAN_LABELS[p.puan] || p.puan,
    count: p.count_2025 || 0,
    pct: p.pct_2025 || 0,
  })).sort((a, b) => b.count - a.count);

  const total = ihlTipiData.reduce((s, t) => s + t.count, 0);

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
          <BarChart2 className="w-8 h-8 text-purple-600" />
          Puan Türü Derinlemesi
        </h1>
        <p className="text-gray-600 mt-1">
          İHL mezunları hangi alanlara yöneliyor? Sayısal, Sözel, EA dağılımı ve 3 yıllık trend
        </p>
      </div>

      {/* Açıklayıcı Bilgi Kutusu */}
      <div className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-600 rounded-lg flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">💡 Bu sayfada ne var?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Alan Dağılımı:</strong> İHL mezunları SAY, SÖZ, EA hangi alanları tercih ediyor?</li>
              <li>• <strong>3 Yıllık Trend:</strong> "İHL'liler sayısal alanlara yöneliyor mu?" sorusunun cevabı</li>
              <li>• <strong>İHL Tipi Analizi:</strong> Anadolu İmam Hatip vs Kız Anadolu İmam Hatip karşılaştırması</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Özet Kartı */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
          <div className="w-full">
            <p className="font-semibold text-purple-900 mb-3">💡 Analiz Özeti (2025)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bar2025Data.slice(0, 4).map(p => (
                <div key={p.puan} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: PUAN_COLORS[p.puan] || '#6b7280' }}>
                    {p.count.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-xs font-medium text-gray-700">{PUAN_LABELS[p.puan] || p.puan}</p>
                  <p className="text-xs text-gray-500">%{p.pct} oran</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600 font-medium">Görünüm:</span>
        <button
          onClick={() => setViewMode('count')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'count' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          Öğrenci Sayısı
        </button>
        <button
          onClick={() => setViewMode('percentage')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'percentage' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          Oran (%)
        </button>
      </div>

      {/* Bar Grafik - 2025 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Puan Türü Bazlı Dağılım (2025)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={bar2025Data} margin={{ bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => [viewMode === 'count' ? value.toLocaleString('tr-TR') + ' öğrenci' : '%' + value, '']}
            />
            <Bar dataKey={viewMode === 'count' ? 'count' : 'pct'} radius={[8, 8, 0, 0]}>
              {bar2025Data.map(entry => (
                <Cell key={entry.puan} fill={PUAN_COLORS[entry.puan] || '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Grafiği - 3 Yıl */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">3 Yıllık Trend (2023-2025)</h2>
        <p className="text-sm text-gray-500 mb-4">İHL'liler sayısal alanlara yöneliyor mu?</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value, name) => [
                viewMode === 'count' ? value.toLocaleString('tr-TR') + ' öğrenci' : '%' + value,
                PUAN_LABELS[name] || name
              ]}
            />
            <Legend formatter={(value) => PUAN_LABELS[value] || value} />
            {puanData.slice(0, 5).map(p => (
              <Line
                key={p.puan}
                type="monotone"
                dataKey={p.puan}
                stroke={PUAN_COLORS[p.puan] || '#6b7280'}
                strokeWidth={2.5}
                dot={{ r: 5, fill: PUAN_COLORS[p.puan] || '#6b7280' }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Karşılaştırma Tablosu */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Puan Türü Bazlı Detaylı Karşılaştırma</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Puan Türü</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">2023 Sayı</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">2023 %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">2024 Sayı</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">2024 %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">2025 Sayı</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">2025 %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Trend</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(p => (
                <tr key={p.puan} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PUAN_COLORS[p.puan] || '#6b7280' }} />
                      <span className="font-medium text-gray-900">{p.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">{p.count_2023.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4 text-right text-gray-500 text-sm">%{p.pct_2023}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{p.count_2024.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4 text-right text-gray-500 text-sm">%{p.pct_2024}</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">{p.count_2025.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-4 text-right font-semibold text-blue-600">%{p.pct_2025}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {p.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : p.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className={`text-sm font-medium ${
                        p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {p.trend !== 'neutral' ? (p.trend === 'up' ? '+' : '-') + '%' + p.trendPct : '—'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* İHL Tipi Analizi */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">İHL Tipi Dağılımı (2025)</h2>
        <p className="text-sm text-gray-500 mb-4">Anadolu İmam Hatip, Kız Anadolu İmam Hatip, vb. tip bazlı analiz</p>
        <div className="space-y-3">
          {ihlTipiData.map((tip) => (
            <div
              key={tip.tip}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{tip.tip}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1.5">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${(tip.count / (ihlTipiData[0]?.count || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-purple-700 text-lg">{tip.count.toLocaleString('tr-TR')}</p>
                <p className="text-xs text-gray-500">%{((tip.count / total) * 100).toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PuanTuruAnaliz;