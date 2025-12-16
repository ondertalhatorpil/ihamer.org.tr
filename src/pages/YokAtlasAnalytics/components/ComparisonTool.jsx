import React, { useState, useMemo } from 'react';
import { MultiLineChart } from './TrendChart';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { hasAnyData } from '../utils/dataProcessor';
import { Search, X, Plus, BarChart2, ArrowRight } from 'lucide-react';

const ComparisonTool = ({ data }) => {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [comparisonType, setComparisonType] = useState('university');

  // Search Logic
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase().trim();
    const validData = data.filter(hasAnyData);
    
    let results;
    if (comparisonType === 'university') {
      const uniqueUnis = {};
      validData.forEach(record => {
        if (record.universiteName.toLowerCase().includes(term)) {
          if (!uniqueUnis[record.universiteName]) {
            uniqueUnis[record.universiteName] = { name: record.universiteName, type: record.universityType, records: [] };
          }
          uniqueUnis[record.universiteName].records.push(record);
        }
      });
      results = Object.values(uniqueUnis).slice(0, 10);
    } else {
      const uniqueDepts = {};
      validData.forEach(record => {
        if (record.bolum.toLowerCase().includes(term)) {
            const key = `${record.bolum}-${record.universiteName}`;
            if (!uniqueDepts[key]) uniqueDepts[key] = record;
        }
      });
      results = Object.values(uniqueDepts).slice(0, 10);
    }
    return results;
  }, [data, searchTerm, comparisonType]);

  const handleSelectRecord = (record) => {
    if (selectedRecords.length >= 4) { alert('En fazla 4 kayıt karşılaştırabilirsiniz!'); return; }
    const exists = selectedRecords.some(r => comparisonType === 'university' ? r.name === record.name : (r.universiteName === record.universiteName && r.bolum === record.bolum));
    if (!exists) { setSelectedRecords([...selectedRecords, record]); setSearchTerm(''); }
  };

  // Chart Data Hazırlığı
  const chartData = useMemo(() => {
     if (selectedRecords.length === 0) return [];
     const years = ['2023', '2024', '2025'];
     return years.map(year => {
        const point = { year };
        selectedRecords.forEach((rec, idx) => {
             let val = 0;
             if (comparisonType === 'university') {
                 const rates = rec.records.filter(r => r[`data${year}`]).map(r => r[`data${year}`].oran);
                 val = rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
             } else {
                 val = rec[`data${year}`]?.oran || 0;
             }
             point[`item${idx}`] = parseFloat(val.toFixed(2));
        });
        return point;
     });
  }, [selectedRecords, comparisonType]);

  const chartLines = selectedRecords.map((rec, idx) => ({
      key: `item${idx}`,
      name: comparisonType === 'university' ? rec.name : `${rec.bolum} (${rec.universiteName})`
  }));

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Karşılaştırma Aracı</h1>
        <p className="text-slate-500 mt-2">
          Kurumları veya bölümleri yan yana getirerek detaylı performans analizi yapın.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-visible z-30">
        <div className="flex flex-col md:flex-row gap-4">
            
            {/* Toggle Switch */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex shrink-0">
                {[{id: 'university', label: 'Üniversite', icon: '🏛️'}, {id: 'department', label: 'Bölüm', icon: '📚'}].map(type => (
                    <button 
                        key={type.id}
                        onClick={() => { setComparisonType(type.id); setSelectedRecords([]); setSearchTerm(''); }}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                            ${comparisonType === type.id ? 'bg-white text-slate-800 shadow-md scale-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-95'}
                        `}
                    >
                        <span>{type.icon}</span> {type.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder={comparisonType === 'university' ? "Karşılaştırmak için üniversite arayın..." : "Karşılaştırmak için bölüm arayın..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[52px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                />
                
                {/* Search Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-scale-up">
                        <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {searchResults.map((result, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleSelectRecord(result)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Plus size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700 text-sm">
                                                {comparisonType === 'university' ? result.name : result.bolum}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {comparisonType === 'university' ? result.type : result.universiteName}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Selected Chips - MOBİL İYİLEŞTİRMESİ YAPILDI */}
        {selectedRecords.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
                {/* MOBİL: Flex + Overflow-X (Yatay kaydırma) 
                   DESKTOP: Grid (Düzenli ızgara)
                */}
                <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 custom-scrollbar snap-x">
                    {selectedRecords.map((record, index) => (
                        <div 
                            key={index} 
                            // Min-width: Mobilde kartların sıkışmasını engeller, sabit genişlik verir.
                            className="relative bg-white border-2 border-slate-100 p-4 rounded-2xl group hover:border-blue-100 transition-colors min-w-[260px] md:min-w-0 snap-center"
                        >
                            <button 
                                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shadow-sm z-10 border-2 border-white"
                                onClick={() => setSelectedRecords(selectedRecords.filter((_, i) => i !== index))}
                            >
                                <X size={14} />
                            </button>
                            <div className="pr-2">
                                 <div className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
                                    <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">{String.fromCharCode(65 + index)}</span>
                                    Veri Seti
                                 </div>
                                 <div className="font-bold text-slate-800 text-sm line-clamp-1" title={comparisonType === 'university' ? record.name : record.bolum}>
                                    {comparisonType === 'university' ? record.name : record.bolum}
                                 </div>
                                 <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                                    {comparisonType === 'university' ? `${record.records.length} bölüm verisi` : record.universiteName}
                                 </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Mobilde sağda biraz boşluk bırakmak için dummy div (UX) */}
                    <div className="md:hidden min-w-[1px]"></div>
                </div>
                
                {/* Mobil Kaydırma İpucu (Sadece mobilde görünür) */}
                {selectedRecords.length > 1 && (
                    <div className="md:hidden flex items-center justify-center gap-1 text-[10px] font-medium text-slate-400 mt-1 animate-pulse">
                        Kaydırın <ArrowRight size={10} />
                    </div>
                )}
            </div>
        )}
      </div>

      {/* --- RESULTS AREA --- */}
      {selectedRecords.length >= 2 ? (
        <div className="animate-fade-in space-y-6">
          {/* Main Chart */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg mb-8 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-slate-400" />
                Trend Analizi (2023-2025)
            </h3>
            <div className="h-[450px]">
                <MultiLineChart data={chartData} lines={chartLines} />
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Henüz Yeterli Veri Yok</h3>
            <p className="text-slate-400 max-w-sm mx-auto mt-2 text-sm">
                Karşılaştırma grafiğini oluşturmak için yukarıdan en az 2 farklı kayıt seçmelisiniz.
            </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;