import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    School,
    Search,
    ChevronRight,
    X,
    RotateCcw,
    Check,
    Percent,
    BookOpen
} from 'lucide-react';
import { getUniversityStatistics } from '../utils/statistics';
import { formatNumber, formatPercent, getUniversityTypeBadge } from '../utils/helpers';
import { TrendIndicator } from './TrendChart';

const UniversityList = ({ data }) => {
    const navigate = useNavigate();

    // --- STATE TANIMLARI ---
    const [sortBy, setSortBy] = useState('students');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filtreleme State'leri
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        city: '',
        minRate: 0,       // Slider için başlangıç değeri
        minDepartments: 0 // Bölüm sayısı filtresi
    });

    // Veriyi hook ile al
    const universities = useMemo(() => getUniversityStatistics(data), [data]);

    // Şehir listesini çıkar
    const uniqueCities = useMemo(() => {
        const cities = universities.map(u => u.city).filter(Boolean);
        return [...new Set(cities)].sort((a, b) => a.localeCompare(b, 'tr'));
    }, [universities]);

    // --- ANA FİLTRELEME MANTIĞI ---
    const filteredAndSorted = useMemo(() => {
        let filtered = universities;

        // 1. Arama Çubuğu (Metin)
        if (searchTerm) {
            const lowerTerm = searchTerm.toLocaleLowerCase('tr');
            filtered = filtered.filter(u =>
                u.name.toLocaleLowerCase('tr').includes(lowerTerm) ||
                u.city.toLocaleLowerCase('tr').includes(lowerTerm)
            );
        }

        // 2. Tip (Devlet/Vakıf Tabları)
        if (selectedType !== 'all') {
            filtered = filtered.filter(u => u.type === selectedType);
        }

        // 3. Detaylı Filtreler (Modal'dan gelenler)
        if (activeFilters.city) {
            filtered = filtered.filter(u => u.city === activeFilters.city);
        }

        // Oran Filtresi (String gelebilir, float'a çevirip kontrol ediyoruz)
        if (activeFilters.minRate > 0) {
            filtered = filtered.filter(u => {
                const rate = parseFloat(u.avgRate2025) || 0;
                return rate >= activeFilters.minRate;
            });
        }

        // Bölüm Sayısı Filtresi
        if (activeFilters.minDepartments > 0) {
            filtered = filtered.filter(u => u.departmentCount >= activeFilters.minDepartments);
        }

        // 4. Sıralama Mantığı
        return [...filtered].sort((a, b) => {
            let compareA, compareB;

            switch (sortBy) {
                case 'name': compareA = a.name; compareB = b.name; break;
                case 'students': compareA = a.totalStudents2025; compareB = b.totalStudents2025; break;
                case 'rate': compareA = parseFloat(a.avgRate2025) || 0; compareB = parseFloat(b.avgRate2025) || 0; break;
                case 'departments': compareA = a.departmentCount; compareB = b.departmentCount; break;
                default: return 0;
            }

            if (typeof compareA === 'string') {
                return sortOrder === 'asc'
                    ? compareA.localeCompare(compareB, 'tr')
                    : compareB.localeCompare(compareA, 'tr');
            } else {
                return sortOrder === 'asc' ? compareA - compareB : compareB - compareA;
            }
        });
    }, [universities, selectedType, sortBy, sortOrder, searchTerm, activeFilters]);

    // Sıralama Değiştirici
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Sıralama İkonu Getirici
    const getSortIcon = (field) => {
        if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 opacity-50" />;
        return sortOrder === 'asc'
            ? <ArrowUp className="w-3.5 h-3.5 text-[#B38F65]" />
            : <ArrowDown className="w-3.5 h-3.5 text-[#B38F65]" />;
    };

    // Aktif filtre sayısı (Badge için)
    const activeFilterCount =
        (activeFilters.city ? 1 : 0) +
        (activeFilters.minRate > 0 ? 1 : 0) +
        (activeFilters.minDepartments > 0 ? 1 : 0);

    return (
        <div className="space-y-6 pb-12 animate-fade-in w-full max-w-full overflow-hidden relative">

            {/* --- FILTER MODAL (Geliştirilmiş) --- */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
                    <div
                        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-lg">
                                    <Filter size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">Detaylı Filtrele</h3>
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body - FILTER CONTROLS */}
                        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">

                            {/* 1. Şehir Seçimi */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-[#B38F65]" />
                                    Şehir Seçimi
                                </label>
                                <div className="relative">
                                    <select
                                        value={activeFilters.city}
                                        onChange={(e) => setActiveFilters({ ...activeFilters, city: e.target.value })}
                                        className="w-full p-3 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B38F65]/50 transition-all appearance-none cursor-pointer text-sm font-medium"
                                    >
                                        <option value="">Tüm Şehirler</option>
                                        {uniqueCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronRight className="rotate-90 w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Ortalama Oran Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Percent size={16} className="text-[#B38F65]" />
                                        Min. Ortalama Oran
                                    </label>
                                    <span className="text-xs font-bold bg-[#B38F65]/10 text-[#B38F65] px-2 py-1 rounded-md">
                                        %{activeFilters.minRate} ve üzeri
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={activeFilters.minRate}
                                    onChange={(e) => setActiveFilters({ ...activeFilters, minRate: Number(e.target.value) })}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#B38F65]"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                                    <span>%0</span>
                                    <span>%50</span>
                                    <span>%100</span>
                                </div>
                            </div>

                            {/* 3. Bölüm Sayısı Filtresi */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <BookOpen size={16} className="text-[#B38F65]" />
                                    Min. Bölüm Sayısı
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 20, 50, 100].map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setActiveFilters({ ...activeFilters, minDepartments: count })}
                                            className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all
                                ${activeFilters.minDepartments === count
                                                    ? 'bg-[#B38F65] text-white border-[#B38F65]'
                                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                                }
                            `}
                                        >
                                            {count === 0 ? 'Tümü' : `${count}+`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-slate-50 bg-slate-50/50 rounded-b-2xl flex items-center gap-3">
                            <button
                                onClick={() => setActiveFilters({ city: '', minRate: 0, minDepartments: 0 })}
                                className="px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                Sıfırla
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 px-4 py-3 bg-[#B38F65] text-white text-sm font-bold rounded-xl hover:bg-[#a07f5a] shadow-lg shadow-[#B38F65]/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={16} />
                                Sonuçları Göster ({filteredAndSorted.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PAGE CONTENT --- */}
            <div className="flex flex-col md:mr-1 gap-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                                <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            Üniversiteler
                        </h1>
                        <p className="text-slate-500 mt-1 text-xs md:text-sm ml-1">
                            Toplam <span className="font-bold text-[#B38F65]">{filteredAndSorted.length}</span> kurum listeleniyor
                        </p>
                    </div>

                    <div className="bg-white border border-slate-100 p-1 rounded-xl flex overflow-x-auto no-scrollbar shadow-sm w-full md:w-auto">
                        {['all', 'Devlet', 'Vakıf', 'KKTC'].map(type => {
                            const isActive = selectedType === type;
                            const label = type === 'all' ? 'Tümü' : type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap
                            ${isActive
                                            ? 'bg-[#B38F65] text-white shadow-md'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Search & Filter Trigger */}
                <div className="flex gap-3">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Üniversite veya şehir ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B38F65]/50 focus:border-[#B38F65] transition-all shadow-sm"
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`px-4 md:px-6 py-3 rounded-xl md:rounded-2xl border font-bold flex items-center gap-2 transition-all shadow-sm whitespace-nowrap
                ${activeFilterCount > 0
                                ? 'bg-[#B38F65] text-white border-[#B38F65] shadow-md shadow-[#B38F65]/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-[#B38F65] hover:text-[#B38F65]'
                            }`}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="hidden md:inline">Filtrele</span>
                        {activeFilterCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 bg-white text-[#B38F65] rounded-full text-[10px] font-extrabold ml-1 border border-[#B38F65]">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* --- MOBİL LİSTE --- */}
            <div className="md:hidden flex flex-col gap-3">
                {filteredAndSorted.map((uni, index) => {
                    const badge = getUniversityTypeBadge(uni.type);
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(`/analytics/university/${encodeURIComponent(uni.name)}`)}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#B38F65]/10 text-[#B38F65] rounded-xl">
                                        <School size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2">
                                            {/* Parantez içindeki şehir ismini ve parantezleri siler */}
                                            {uni.name.replace(/\s*\([^)]*\)$/, "")}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            {/* Şehir zaten burada badge olarak yazıyor, o yüzden isimden sildik */}
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-medium">
                                                {uni.city}
                                            </span>
                                            <span
                                                className="text-[10px] px-2 py-0.5 rounded text-white font-bold"
                                                style={{ backgroundColor: "#B38F65" }}
                                            >
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-300 w-5 h-5 shrink-0" />
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-50">
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-400 mb-0.5">Bölüm</div>
                                    <div className="text-sm font-bold text-slate-700">{uni.departmentCount}</div>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-400 mb-0.5">Öğrenci</div>
                                    <div className="text-sm font-bold text-[#B38F65]">{formatNumber(uni.totalStudents2025)}</div>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-400 mb-0.5">Ort. %</div>
                                    <div className="text-sm font-bold text-slate-700">%{uni.avgRate2025}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- MASAÜSTÜ TABLO --- */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="overflow-x-auto max-h-[70vh] custom-scrollbar">
                    <table className="w-full text-left border-collapse relative">

                        <thead className="sticky top-0 z-20">
                            <tr className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                                {[
                                    { id: 'name', label: 'Üniversite Adı', align: 'left' },
                                    { id: 'type', label: 'Tip', align: 'center' },
                                    { id: 'city', label: 'Şehir', align: 'left' },
                                    { id: 'departments', label: 'Bölüm', align: 'center' },
                                    { id: 'rate', label: 'Ort. Oran', align: 'right' },
                                    { id: 'trend', label: 'Trend', align: 'right' },
                                ].map((col) => (
                                    <th
                                        key={col.id}
                                        onClick={() => col.id !== 'type' && col.id !== 'city' && col.id !== 'trend' && handleSort(col.id)}
                                        className={`p-5 text-xs font-bold text-slate-500 uppercase tracking-wider 
                            ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                            ${col.id !== 'type' && col.id !== 'city' && col.id !== 'trend' ? 'cursor-pointer hover:bg-slate-50 hover:text-[#B38F65] transition-colors group select-none' : ''}
                        `}
                                    >
                                        <div className={`flex items-center gap-2 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                                            {col.label}
                                            {col.id !== 'type' && col.id !== 'city' && col.id !== 'trend' && getSortIcon(col.id)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {filteredAndSorted.map((uni, index) => {
                                const badge = getUniversityTypeBadge(uni.type);
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => navigate(`/analytics/university/${encodeURIComponent(uni.name)}`)}
                                        className="hover:bg-[#B38F65]/5 transition-colors cursor-pointer group"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-[#B38F65] group-hover:shadow-sm transition-all">
                                                    <School className="w-5 h-5" />
                                                </div>
                                                {/* Masaüstü Tablo İçindeki İlgili Kısım (Satır ~320 civarı) */}
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm group-hover:text-[#B38F65] transition-colors line-clamp-1">
                                                        {/* Parantez içindeki şehir ismini ve parantezleri siler */}
                                                        {uni.name.replace(/\s*\([^)]*\)$/, "")}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span
                                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold border inline-block whitespace-nowrap"
                                                style={{
                                                    backgroundColor: "#B38F65",
                                                    color: "white",
                                                    borderColor: `${badge.color}20`
                                                }}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B38F65] transition-colors" />
                                                {uni.city}
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-sm font-bold tabular-nums">
                                                {uni.departmentCount}
                                            </span>
                                        </td>

                                        <td className="p-5 text-right">
                                            <div className="font-medium text-slate-600 tabular-nums">
                                                {formatPercent(uni.avgRate2025)}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end">
                                                <TrendIndicator
                                                    data2023={{ oran: parseFloat(uni.avgRate2023) }}
                                                    data2024={{ oran: parseFloat(uni.avgRate2024) }}
                                                    data2025={{ oran: parseFloat(uni.avgRate2025) }}
                                                    type="oran"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredAndSorted.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2rem] border border-slate-100 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Filter className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Sonuç Bulunamadı</h3>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                        Arama kriterlerinize uygun üniversite bulunamadı. Lütfen filtreleri kontrol edin.
                    </p>
                    <button
                        onClick={() => {
                            setSelectedType('all');
                            setSearchTerm('');
                            setActiveFilters({ city: '', minRate: 0, minDepartments: 0 });
                        }}
                        className="mt-6 px-6 py-2.5 bg-[#B38F65]/10 text-[#B38F65] rounded-xl text-sm font-bold hover:bg-[#B38F65]/20 transition-colors"
                    >
                        Filtreleri Temizle
                    </button>
                </div>
            )}
        </div>
    );
};

export default UniversityList;