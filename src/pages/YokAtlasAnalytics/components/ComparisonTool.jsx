import React, { useState, useMemo } from 'react';
import { MultiLineChart } from './TrendChart';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { hasAnyData } from '../utils/dataProcessor';

const ComparisonTool = ({ data }) => {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comparisonType, setComparisonType] = useState('university'); // university or department

  // Arama sonuçları
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const term = searchTerm.toLowerCase().trim();
    const validData = data.filter(hasAnyData);
    
    let results;
    if (comparisonType === 'university') {
      // Üniversite bazlı arama
      const uniqueUnis = {};
      validData.forEach(record => {
        if (record.universiteName.toLowerCase().includes(term)) {
          if (!uniqueUnis[record.universiteName]) {
            uniqueUnis[record.universiteName] = {
              name: record.universiteName,
              type: record.universityType,
              records: []
            };
          }
          uniqueUnis[record.universiteName].records.push(record);
        }
      });
      results = Object.values(uniqueUnis).slice(0, 10);
    } else {
      // Bölüm bazlı arama
      const uniqueDepts = {};
      validData.forEach(record => {
        if (record.bolum.toLowerCase().includes(term)) {
          const key = `${record.bolum}-${record.universiteName}`;
          if (!uniqueDepts[key]) {
            uniqueDepts[key] = record;
          }
        }
      });
      results = Object.values(uniqueDepts).slice(0, 10);
    }
    
    return results;
  }, [data, searchTerm, comparisonType]);

  // Karşılaştırma için seçili kayıtları ekle
  const handleSelectRecord = (record) => {
    if (selectedRecords.length >= 4) {
      alert('En fazla 4 kayıt karşılaştırabilirsiniz!');
      return;
    }
    
    // Zaten seçilmiş mi kontrol et
    const exists = selectedRecords.some(r => 
      comparisonType === 'university' 
        ? r.name === record.name 
        : (r.universiteName === record.universiteName && r.bolum === record.bolum)
    );
    
    if (!exists) {
      setSelectedRecords([...selectedRecords, record]);
      setSearchTerm('');
    }
  };

  // Seçili kaydı kaldır
  const handleRemoveRecord = (index) => {
    setSelectedRecords(selectedRecords.filter((_, i) => i !== index));
  };

  // Chart data hazırla
  const chartData = useMemo(() => {
    if (selectedRecords.length === 0) return [];
    
    if (comparisonType === 'university') {
      // Üniversite karşılaştırması - ortalama oranlar
      return [
        { 
          year: '2023',
          ...selectedRecords.reduce((acc, uni, idx) => {
            const rates = uni.records
              .filter(r => r.data2023)
              .map(r => r.data2023.oran);
            acc[`uni${idx}`] = rates.length > 0 
              ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2)
              : 0;
            return acc;
          }, {})
        },
        { 
          year: '2024',
          ...selectedRecords.reduce((acc, uni, idx) => {
            const rates = uni.records
              .filter(r => r.data2024)
              .map(r => r.data2024.oran);
            acc[`uni${idx}`] = rates.length > 0 
              ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2)
              : 0;
            return acc;
          }, {})
        },
        { 
          year: '2025',
          ...selectedRecords.reduce((acc, uni, idx) => {
            const rates = uni.records
              .filter(r => r.data2025)
              .map(r => r.data2025.oran);
            acc[`uni${idx}`] = rates.length > 0 
              ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(2)
              : 0;
            return acc;
          }, {})
        }
      ];
    } else {
      // Bölüm karşılaştırması
      return [
        { 
          year: '2023',
          ...selectedRecords.reduce((acc, record, idx) => {
            acc[`dept${idx}`] = record.data2023?.oran || 0;
            return acc;
          }, {})
        },
        { 
          year: '2024',
          ...selectedRecords.reduce((acc, record, idx) => {
            acc[`dept${idx}`] = record.data2024?.oran || 0;
            return acc;
          }, {})
        },
        { 
          year: '2025',
          ...selectedRecords.reduce((acc, record, idx) => {
            acc[`dept${idx}`] = record.data2025?.oran || 0;
            return acc;
          }, {})
        }
      ];
    }
  }, [selectedRecords, comparisonType]);

  const chartLines = useMemo(() => {
    return selectedRecords.map((record, idx) => ({
      key: comparisonType === 'university' ? `uni${idx}` : `dept${idx}`,
      name: comparisonType === 'university' 
        ? record.name.substring(0, 30) + (record.name.length > 30 ? '...' : '')
        : `${record.bolum} (${record.universiteName.substring(0, 20)}...)`
    }));
  }, [selectedRecords, comparisonType]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Karşılaştırma Aracı</h1>
        <p className="text-slate-500 mt-1">
          Üniversiteleri veya bölümleri yan yana getirerek performanslarını analiz edin.
        </p>
      </div>

      {/* Controls Container */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        
        {/* Tip Seçimi & Arama */}
        <div className="flex flex-col md:flex-row gap-4">
            {/* Toggle Buttons */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl shrink-0 h-14 w-fit">
                <button 
                className={`px-6 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2
                    ${comparisonType === 'university' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                onClick={() => {
                    setComparisonType('university');
                    setSelectedRecords([]);
                    setSearchTerm('');
                }}
                >
                <span>🏛️</span> Üniversite
                </button>
                <button 
                className={`px-6 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2
                    ${comparisonType === 'department' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                onClick={() => {
                    setComparisonType('department');
                    setSelectedRecords([]);
                    setSearchTerm('');
                }}
                >
                <span>📚</span> Bölüm
                </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                    <input
                        type="text"
                        placeholder={comparisonType === 'university' 
                        ? "Hangi üniversiteleri karşılaştırmak istersiniz?" 
                        : "Hangi bölümleri karşılaştırmak istersiniz?"
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>
                
                {/* Arama Sonuçları Dropdown */}
                {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
                    <div className="p-2">
                        {searchResults.map((result, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleSelectRecord(result)}
                            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-100 transition-colors">
                                    +
                                </div>
                                {comparisonType === 'university' ? (
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700">{result.name}</span>
                                    <span className="text-xs text-slate-400">{result.type}</span>
                                </div>
                                ) : (
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700">{result.bolum}</span>
                                    <span className="text-xs text-slate-400">{result.universiteName}</span>
                                </div>
                                )}
                            </div>
                            
                            {comparisonType === 'university' && (
                                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500">
                                    {getUniversityTypeBadge(result.type).text || result.type}
                                </span>
                            )}
                        </div>
                        ))}
                    </div>
                </div>
                )}
            </div>
        </div>

        {/* Seçili Kayıtlar Listesi */}
        {selectedRecords.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {selectedRecords.map((record, index) => (
                <div key={index} className="relative bg-blue-50/50 hover:bg-blue-50 border border-blue-100 p-4 rounded-2xl transition-all group">
                    <button 
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                        onClick={() => handleRemoveRecord(index)}
                    >
                        ✕
                    </button>
                    
                    <div className="pr-6">
                        {comparisonType === 'university' ? (
                        <>
                            <h4 className="font-bold text-slate-700 text-sm line-clamp-1" title={record.name}>{record.name}</h4>
                            <span className="text-xs font-medium text-blue-600 mt-1 inline-block">
                                {record.records.length} bölüm verisi
                            </span>
                        </>
                        ) : (
                        <>
                            <h4 className="font-bold text-slate-700 text-sm line-clamp-1" title={record.bolum}>{record.bolum}</h4>
                            <div className="text-xs text-slate-500 mt-1 line-clamp-1" title={record.universiteName}>
                                {record.universiteName}
                            </div>
                        </>
                        )}
                    </div>
                </div>
            ))}
             
             {/* Add More Placeholder (Eğer 4'ten az ise) */}
             {selectedRecords.length < 4 && (
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center text-slate-400 text-sm font-medium">
                    {4 - selectedRecords.length} kayıt daha eklenebilir
                 </div>
             )}
            </div>
        )}
      </div>

      {/* Karşılaştırma Sonuçları */}
      {selectedRecords.length >= 2 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Sol: Grafik */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                <span>📊</span> Trend Karşılaştırması (2023-2025)
            </h3>
            <div className="h-[400px]">
                <MultiLineChart 
                data={chartData}
                lines={chartLines}
                title="Yıllara Göre İH Oranı (%)"
                />
            </div>
          </div>

          {/* Tablo - Tam Genişlik */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">📋 Detaylı Veriler</h3>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {comparisonType === 'university' ? 'Üniversite' : 'Bölüm'}
                        </th>
                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">2023 Oran</th>
                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">2024 Oran</th>
                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">2025 Oran</th>
                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Değişim</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {selectedRecords.map((record, index) => {
                        let rate2023, rate2024, rate2025;
                        
                        if (comparisonType === 'university') {
                        const calc = (year) => {
                            const rates = record.records
                            .filter(r => r[`data${year}`])
                            .map(r => r[`data${year}`].oran);
                            return rates.length > 0 
                            ? (rates.reduce((a, b) => a + b, 0) / rates.length)
                            : 0;
                        };
                        rate2023 = calc(2023);
                        rate2024 = calc(2024);
                        rate2025 = calc(2025);
                        } else {
                        rate2023 = record.data2023?.oran || 0;
                        rate2024 = record.data2024?.oran || 0;
                        rate2025 = record.data2025?.oran || 0;
                        }
                        
                        const change = rate2025 - rate2023;
                        const percentChange = rate2023 > 0 ? ((change / rate2023) * 100) : 0;
                        const isPositive = change > 0;
                        const isNeutral = change === 0;
                        
                        return (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                            <div className="font-semibold text-slate-700">
                                {comparisonType === 'university' 
                                ? record.name 
                                : record.bolum
                                }
                            </div>
                            {comparisonType !== 'university' && (
                                <div className="text-xs text-slate-400 mt-0.5">{record.universiteName}</div>
                            )}
                            </td>
                            <td className="p-4 text-right text-slate-600 tabular-nums">{formatPercent(rate2023)}</td>
                            <td className="p-4 text-right text-slate-600 tabular-nums">{formatPercent(rate2024)}</td>
                            <td className="p-4 text-right font-bold text-slate-800 tabular-nums">{formatPercent(rate2025)}</td>
                            <td className="p-4 text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums
                                    ${isPositive ? 'bg-emerald-100 text-emerald-700' : isNeutral ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>
                                    {isPositive ? '↑' : isNeutral ? '→' : '↓'} {Math.abs(percentChange).toFixed(1)}%
                                </span>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
             </div>
          </div>

        </div>
      ) : (
        /* Empty State */
        selectedRecords.length === 1 && (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl mb-4">✨</div>
                <h3 className="text-lg font-bold text-slate-700">Karşılaştırma için hazır</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Grafikleri görmek için en az 1 kayıt daha ekleyin.
                </p>
            </div>
        )
      )}
      
      {/* İlk Yükleme Ekranı (Hiç kayıt yoksa) */}
      {selectedRecords.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 text-center">
             <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-4xl mb-6">
                👆
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Karşılaştırmaya Başlayın</h2>
             <p className="text-slate-500 max-w-md">
                Yukarıdaki arama kutusunu kullanarak üniversite veya bölümleri ekleyin ve trendleri kıyaslayın.
             </p>
          </div>
      )}
    </div>
  );
};

export default ComparisonTool;