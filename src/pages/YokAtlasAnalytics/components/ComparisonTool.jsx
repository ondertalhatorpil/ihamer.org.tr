import React, { useState, useMemo } from 'react';
import { MultiLineChart } from './TrendChart';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { hasAnyData } from '../utils/dataProcessor';
import { Search, X, Plus, BarChart2, ArrowRight, BarChart3 } from 'lucide-react';

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
    <div className="space-y-6 md:space-y-8 pb-12 animate-fade-in w-full overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                 <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             Karşılaştırma Aracı
        </h1>
        <p className="text-slate-500 text-xs md:text-sm ml-1 md:ml-0">
          Kurumları veya bölümleri yan yana getirerek detaylı performans analizi yapın.
        </p>
      </div>

      {/* --- CONTROL PANEL --- */}
      <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-visible z-30">
        <div className="flex flex-col md:flex-row gap-4">
            
            {/* Toggle Switch */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex shrink-0 w-full md:w-auto">
                {[{id: 'university', label: 'Üniversite', icon: '🏛️'}, {id: 'department', label: 'Bölüm', icon: '📚'}].map(type => (
                    <button 
                        key={type.id}
                        onClick={() => { setComparisonType(type.id); setSelectedRecords([]); setSearchTerm(''); }}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                            ${comparisonType === type.id 
                                ? 'bg-white text-slate-800 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                        `}
                    >
                        <span>{type.icon}</span> {type.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#B38F65] transition-colors w-5 h-5" />
                <input
                    type="text"
                    placeholder={comparisonType === 'university' ? "Karşılaştırmak için üniversite arayın..." : "Karşılaştırmak için bölüm arayın..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[48px] md:h-[52px] pl-11 md:pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#B38F65]/50 focus:border-[#B38F65] transition-all text-slate-800 placeholder:text-slate-400 font-medium text-sm md:text-base"
                />
                
                {/* Search Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-scale-up">
                        <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {searchResults.map((result, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleSelectRecord(result)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-[#B38F65]/5 rounded-xl cursor-pointer transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#B38F65]/10 text-[#B38F65] flex items-center justify-center font-bold text-xs group-hover:bg-[#B38F65] group-hover:text-white transition-colors">
                                            <Plus size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700 text-xs md:text-sm">
                                                {comparisonType === 'university' ? result.name : result.bolum}
                                            </div>
                                            <div className="text-[10px] md:text-xs text-slate-400">
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

        {/* Selected Chips - MOBİL YATAY KAYDIRMA */}
        {selectedRecords.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar snap-x">
                    {selectedRecords.map((record, index) => (
                        <div 
                            key={index} 
                            // Mobilde min-width ile kartların sıkışmasını engelliyoruz
                            className="relative bg-white border-2 border-slate-100 p-4 rounded-2xl group hover:border-[#B38F65]/30 transition-colors min-w-[240px] md:min-w-0 snap-center shrink-0"
                        >
                            <button 
                                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shadow-sm z-10 border-2 border-white"
                                onClick={() => setSelectedRecords(selectedRecords.filter((_, i) => i !== index))}
                            >
                                <X size={14} />
                            </button>
                            <div className="pr-2">
                                 <div className="text-[10px] md:text-xs font-bold text-[#B38F65] mb-1 flex items-center gap-1">
                                    <span className="w-5 h-5 rounded-full bg-[#B38F65]/10 flex items-center justify-center text-[10px]">{String.fromCharCode(65 + index)}</span>
                                    Veri Seti
                                 </div>
                                 <div className="font-bold text-slate-800 text-xs md:text-sm line-clamp-1" title={comparisonType === 'university' ? record.name : record.bolum}>
                                    {comparisonType === 'university' ? record.name : record.bolum}
                                 </div>
                                 <div className="text-[10px] md:text-xs text-slate-400 mt-1 line-clamp-1">
                                    {comparisonType === 'university' ? `${record.records.length} bölüm verisi` : record.universiteName}
                                 </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Mobilde sağda biraz boşluk bırakmak için */}
                    <div className="md:hidden min-w-[1px] shrink-0"></div>
                </div>
                
                {/* Mobil Kaydırma İpucu */}
                {selectedRecords.length > 1 && (
                    <div className="md:hidden flex items-center justify-center gap-1 text-[10px] font-medium text-slate-400 mt-0 animate-pulse">
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
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base md:text-lg mb-6 md:mb-8 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#B38F65]" />
                Trend Analizi (2023-2025)
            </h3>
            <div className="h-[350px] md:h-[450px]">
                <MultiLineChart data={chartData} lines={chartLines} />
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center mx-4 md:mx-0">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-700">Yeterli Veri Seçilmedi</h3>
            <p className="text-slate-400 max-w-xs md:max-w-sm mx-auto mt-2 text-xs md:text-sm">
                Karşılaştırma grafiğini oluşturmak için yukarıdan en az 2 farklı kayıt seçmelisiniz.
            </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;