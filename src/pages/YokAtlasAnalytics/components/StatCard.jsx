import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import Tooltip from './Tooltip';

// --- YARDIMCI: Güvenli Sayı Dönüştürücü ---
// Gelen veri "36.316" gibi noktalı string ise bunu temizleyip sayıya çevirir.
const parseSafeFloat = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        // Yüzde işareti, boşluk temizle
        let clean = val.replace(/%/g, '').trim();
        // Eğer içinde nokta varsa ve virgül yoksa (36.316 gibi), noktayı sil (Binlik ayıracı varsayımı)
        // Ancak 10.5 gibi ondalıksa durum değişir. 
        // Türkiye standardında genellikle nokta binlik, virgül ondalıktır.
        // Bu yüzden tüm noktaları siliyoruz, virgülü noktaya çeviriyoruz.
        clean = clean.replace(/\./g, '').replace(/,/g, '.');
        const num = parseFloat(clean);
        return isNaN(num) ? 0 : num;
    }
    return 0;
};

// --- STAT GRID ---
export const StatGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {children}
    </div>
  );
};

// --- STAT CARD ---
const StatCard = ({ title, value, subtitle, icon, trend, color = 'blue', tooltipText, customColor }) => {
  const colorMap = {
    blue: 'bg-[#B38F65] text-white',
    indigo: 'bg-[#B38F65] text-white',
    violet: 'bg-[#B38F65] text-white',
    emerald: 'bg-[#B38F65] text-white',
    amber: 'bg-[#B38F65] text-white',
    rose: 'bg-[#B38F65] text-white',
    custom: 'bg-[#B38F65] text-white',
    default: 'bg-[#B38F65] text-white'
  };

  const finalStyle = (color === 'custom' && customColor) 
    ? { backgroundColor: customColor, color: 'white' } 
    : {};

  const themeClass = colorMap[color] || colorMap.default;
  const bgDecorationColor = color === 'custom' ? 'bg-[#B38F65]' : 'bg-slate-50';

  return (
    <div className="relative bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group z-0 hover:z-10 overflow-hidden h-full flex flex-col justify-between">
      <div className={`absolute inset-0 pointer-events-none`}>
         <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 rounded-full blur-3xl -mr-12 -mt-12 md:-mr-16 md:-mt-16 opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${bgDecorationColor}`}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div 
            className={`p-2.5 md:p-3.5 rounded-xl md:rounded-2xl transition-colors duration-300 flex items-center justify-center shadow-sm ${themeClass}`}
            style={finalStyle}
          >
            {icon || <span className="text-lg md:text-xl">📊</span>}
          </div>

          {trend && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-[10px] md:text-xs font-bold shadow-sm
              ${trend === 'up' || trend.text === 'up' ? 'bg-emerald-100 text-emerald-700' : 
                trend === 'down' || trend.text === 'down' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
              }`}>
               {trend === 'up' || trend.text === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
               <span className="hidden sm:inline">{trend === 'up' || trend.text === 'up' ? 'Artış' : 'Azalış'}</span>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <span className="text-xs md:text-sm font-medium text-slate-500 line-clamp-1">{title}</span>
              {tooltipText && (
                <Tooltip text={tooltipText}>
                  <Info className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-300 hover:text-[#B38F65] cursor-help transition-colors" />
                </Tooltip>
              )}
          </div>
          
          <div className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight break-all">
              {value}
          </div>
          
          {subtitle && (
            <div className="text-[10px] md:text-xs font-medium text-slate-400 mt-0.5 md:mt-1 truncate">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPARISON STAT CARD ---
export const ComparisonStatCard = ({ title, current, previous, unit = '', customCurrent }) => {
    // String temizleme ve güvenli parse işlemi
    const safeCurrent = parseSafeFloat(current);
    const safePrevious = parseSafeFloat(previous);
    
    const diff = safeCurrent - safePrevious;
    const percentDiff = safePrevious > 0 ? ((diff / safePrevious) * 100).toFixed(1) : 0;
    const isPositive = diff > 0;
    const isZero = diff === 0;

    // Ekranda gösterilecek formatlı string (Eğer string geldiyse olduğu gibi bas, değilse formatla)
    const displayPrevious = typeof previous === 'string' ? previous : formatNumber(safePrevious);
    const displayCurrent = typeof current === 'string' ? current : formatNumber(safeCurrent);
    
    return (
        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-100 shadow-sm hover:border-slate-200 transition-all h-full flex flex-col justify-between">
            <h4 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 md:mb-4 text-center truncate">{title}</h4>
            
            <div className="flex items-center justify-between gap-2">
                <div className="text-center flex-1 min-w-0">
                    <div className="text-[9px] md:text-[10px] font-semibold text-slate-400 mb-0.5">Önceki</div>
                    <div className="text-sm md:text-lg font-bold text-slate-500 line-through decoration-slate-300 truncate font-mono">
                        {displayPrevious}{unit}
                    </div>
                </div>
                
                <div className={`
                    flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 text-[9px] md:text-[10px] font-bold border-2
                    ${isZero ? 'bg-slate-50 text-slate-400 border-slate-200' : 
                      isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}
                `}>
                    {!isZero && <span>{isPositive ? '↑' : '↓'}</span>}
                    <span>%{Math.abs(percentDiff)}</span>
                </div>
                
                <div className="text-center flex-1 min-w-0">
                    <div className="text-[9px] md:text-[10px] font-semibold text-[#B38F65] mb-0.5">Güncel</div>
                    <div className="text-base md:text-xl font-bold text-slate-800 truncate">
                        {customCurrent ? customCurrent : <>{displayCurrent}{unit}</>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export const MiniStatCard = ({ label, value }) => (
    <div className="bg-slate-50 rounded-xl p-2 md:p-3 border border-slate-100">
        <div className="text-[10px] md:text-xs text-slate-400 mb-0.5 md:mb-1">{label}</div>
        <div className="text-base md:text-lg font-bold text-slate-700">{value}</div>
    </div>
);

export default StatCard;