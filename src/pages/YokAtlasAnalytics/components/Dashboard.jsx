import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Users, Building2, BookOpen,
    MapPin, Award, BarChart3, ArrowRight, ArrowUpRight, Info
} from 'lucide-react';
import { getGeneralStatistics, getTopRecords, getTrendingRecords } from '../utils/statistics';
import { formatNumber } from '../utils/helpers';
import StatCard, { ComparisonStatCard } from '../components/StatCard';
import Tooltip from '../components/Tooltip';

const AnimatedCounter = ({ value, formatter }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let numericValue = 0;
        if (typeof value === 'string') {
            numericValue = parseInt(value.replace(/\./g, '').replace(/,/g, ''), 10);
        } else {
            numericValue = value;
        }

        if (!numericValue || isNaN(numericValue)) numericValue = 0;

        let start = 0;
        const end = numericValue;

        if (end === 0) {
            setDisplayValue(0);
            return;
        }

        const duration = 1000; // 1 saniye
        const steps = 60; // 60 kare
        const increment = end / steps;
        const intervalTime = duration / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [value]);

    return <>{formatter ? formatter(Math.floor(displayValue)) : Math.floor(displayValue)}</>;
};

const Dashboard = ({ data }) => {
    const navigate = useNavigate();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const stats = useMemo(() => getGeneralStatistics(data), [data]);
    const topByStudents = useMemo(() => getTopRecords(data, 'students', 10, 2025, 10, 0), [data]);
    const topByRate = useMemo(() => getTopRecords(data, 'rate', 5, 2025, 10, 50), [data]);
    const rising = useMemo(() => getTrendingRecords(data, 'rising', 5, 5), [data]);

    return (
        <div className="space-y-4 md:space-y-8 pb-8 animate-fade-in">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard
                    icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                    title="Toplam Öğr."
                    value={<AnimatedCounter value={stats.stats2025.totalStudents} formatter={formatNumber} />}
                    subtitle={`Ort: %${stats.stats2025.averageRate}`}
                    trend={stats.stats2025.totalStudents > stats.stats2023.totalStudents ? 'up' : 'down'}
                    color="custom"
                    customColor="#B38F65"
                    tooltipText="2025 yılında üniversitelere yerleşen toplam İmam Hatip mezunu öğrenci sayısı" />
                <StatCard
                    icon={<MapPin className="w-5 h-5 md:w-6 md:h-6" />}
                    title="Kayıt"
                    value={<AnimatedCounter value={stats.totalRecords} formatter={formatNumber} />}
                    subtitle={`${formatNumber(stats.validRecords)} aktif`}
                    color="custom"
                    customColor="#B38F65"
                    tooltipText="YÖK Atlas'tan çekilen toplam program kaydı. 8.278'inde İH öğrenci bulunuyor"
                />
                <StatCard
                    icon={<Building2 className="w-5 h-5 md:w-6 md:h-6" />}
                    title="Üniversite"
                    value={<AnimatedCounter value={stats.uniqueUniversities} formatter={formatNumber} />}
                    subtitle="Kurum"
                    color="custom"
                    customColor="#B38F65"
                    tooltipText="İH öğrencisi bulunan üniversite sayısı (Devlet, Vakıf, KKTC dahil)"
                />
                <StatCard
                    icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6" />}
                    title="Bölüm"
                    value={<AnimatedCounter value={stats.uniqueDepartments} formatter={formatNumber} />}
                    subtitle="Program"
                    color="custom"
                    customColor="#B38F65"
                    tooltipText="İH öğrencisi bulunan farklı bölüm/program sayısı"
                />
            </div>

            {/* --- KARŞILAŞTIRMA (BANNER) --- */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-white via-slate-50 to-[#B38F65]/10 p-5 md:p-10 border border-[#B38F65]/20 shadow-sm group">
                <div className="relative z-10 mb-6 md:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-base md:text-xl font-extrabold tracking-tight text-[#B38F65]">
                        <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                        Dönemsel Performans
                    </h2>
                    <span className="rounded-full bg-[#B38F65]/10 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold tracking-wide text-[#B38F65] ring-1 ring-[#B38F65]/20">
                        2023 vs 2025
                    </span>
                </div>
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                    <ComparisonStatCard
                        title="Toplam Öğrenci"
                        // HESAPLAMA İÇİN: Ham veriyi gönderiyoruz
                        current={stats.stats2025.totalStudents}
                        previous={stats.stats2023.totalStudents}
                        // GÖRÜNTÜLEME İÇİN: Animasyonlu bileşeni gönderiyoruz
                        customCurrent={<AnimatedCounter value={stats.stats2025.totalStudents} formatter={formatNumber} />}
                    />
                    <ComparisonStatCard
                        title="Veri Kapsamı"
                        current={stats.stats2025.recordCount}
                        previous={stats.stats2023.recordCount}
                        customCurrent={<AnimatedCounter value={stats.stats2025.recordCount} formatter={formatNumber} />}
                    />
                    <ComparisonStatCard
                        title="Ort. Yerleşme"
                        current={stats.stats2025.averageRate}
                        previous={stats.stats2023.averageRate}
                        unit="%"
                    // Yüzdeler küçük olduğu için animasyon gerekmez ama istenirse eklenebilir
                    />
                </div>
            </div>

            {/* --- ALT LİSTELER --- */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-8 items-start">

                {/* En Çok Tercih Edilenler */}
                <div className="xl:col-span-7 bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 border-b border-slate-50">
                        <div>
                            <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Award className="w-4 h-4 md:w-5 md:h-5 text-[#B38F65]" />
                                En Çok Tercih Edilenler
                            </h2>
                            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">Öğrenci sayısına göre ilk 10</p>
                        </div>
                        <button
                            onClick={() => navigate('/analytics/universities')}
                            className="text-[10px] md:text-xs font-bold text-[#B38F65] bg-[#B38F65]/10 hover:bg-[#B38F65]/20 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            Tümü <ArrowRight size={12} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-3">
                        {topByStudents.map((record, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/analytics/university/${encodeURIComponent(record.universiteName)}`)}
                                className="group flex items-center p-2.5 md:p-3 rounded-xl hover:bg-[#B38F65]/5 border border-transparent hover:border-[#B38F65]/20 cursor-pointer transition-all"
                            >
                                <div className={`
                        w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-xs md:text-sm font-bold mr-3 shrink-0
                        ${index < 3 ? 'bg-[#B38F65] text-white shadow-sm shadow-[#B38F65]/30' : 'bg-slate-100 text-slate-500'}
                    `}>
                                    {index + 1}
                                </div>

                                <div className="flex-1 min-w-0 mr-2 md:mr-4">
                                    <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate group-hover:text-[#B38F65] transition-colors">
                                        {record.universiteName}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] md:text-xs text-slate-500 truncate">{record.bolum}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm md:text-lg font-bold text-[#B38F65] tabular-nums">
                                        {formatNumber(record.data2025.sayi)}
                                    </div>
                                    <div className="text-[9px] md:text-[10px] text-slate-400 font-medium hidden sm:block">Öğr.</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sağ Kolon */}
                <div className="xl:col-span-5 flex flex-col gap-4 md:gap-6">
                    {/* Trendler */}
                    <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 md:p-2 bg-[#B38F65]/10 rounded-lg text-[#B38F65]">
                                <TrendingUp size={16} />
                            </div>
                            <div>
                               <div className='flex'>
                                 <h2 className="text-sm md:text-base font-bold text-slate-800 mr-2">Yükselen Trendler</h2>
                                <Tooltip
                                    text="Son 2 yılda İH öğrenci sayısı hızla artan popüler bölümler(Sayısal olarak değil oransal artışa göre)"
                                    position="top"
                                >
                                    <Info size={14} className="text-slate-400 hover:text-[#B38F65] transition-colors" />
                                </Tooltip>
                               </div>
                                <p className="text-[10px] md:text-[11px] text-slate-500">Son 3 yılda artış</p>

                            </div>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            {rising.map((record, index) => (
                                <div key={index} className="flex items-center justify-between group">
                                    <div className="flex-1 min-w-0 pr-3">
                                        <div className="text-xs md:text-sm font-semibold text-slate-800 truncate">{record.bolum}</div>
                                        <div className="text-[10px] md:text-[11px] text-slate-500 truncate">{record.universiteName}</div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[#B38F65] bg-[#B38F65]/5 border border-[#B38F65]/10 px-2 py-1 rounded-lg">
                                        <ArrowUpRight size={12} strokeWidth={2.5} />
                                        <span className="text-[10px] md:text-xs font-bold">%{record.trendData.percentChange.toFixed(0)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Yoğunluk */}
                    <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 md:p-2 bg-[#B38F65]/10 rounded-lg text-[#B38F65]">
                                <Users size={16} />
                            </div>
                            <div>
<div className="flex items-center gap-1.5">
                <h2 className="text-sm md:text-base font-bold text-slate-800">Yüksek Yoğunluk</h2>
                <Tooltip 
                    text="Bu oran, bölümün toplam kontenjanına göre İmam Hatip mezunu yerleşme yüzdesini ifade eder. Küçük kontenjanlı bölümlerde sayı az olsa da yüzdesel yoğunluk daha yüksek çıkabilir." 
                    position="top"
                >
                    <Info size={14} className="text-slate-400 hover:text-[#B38F65] transition-colors cursor-help" />
                </Tooltip>
            </div>                                <p className="text-[10px] md:text-[11px] text-slate-500">Doluluk oranı</p>
                            </div>
                        </div>
                        <div className="space-y-4 md:space-y-5">
                            {topByRate.map((record, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-end mb-1.5">
                                        <div className="min-w-0 pr-2">
                                            <div className="text-xs md:text-sm font-semibold text-slate-800 truncate">{record.universiteName}</div>
                                            <div className="text-[10px] md:text-[11px] text-slate-500 truncate">{record.bolum}</div>
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-[#B38F65]">%{record.data2025.oran}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#B38F65]/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#B38F65] rounded-full shadow-sm transition-all duration-1000 ease-out"
                                            style={{ width: isMounted ? `${Math.min(record.data2025.oran, 100)}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;