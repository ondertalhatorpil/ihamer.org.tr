import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

/**
 * İstatistik Grid Container
 * Responsive grid yapısı (mobilde 1, tablette 2, geniş ekranda 4 kolon)
 */
export const StatGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
};

/**
 * Ana İstatistik Kartı
 * Modern, oval köşeli, hover efektli tasarım.
 */
const StatCard = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  
  // Renk haritası (Tailwind sınıfları için)
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    // Fallback style for default
    default: 'bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white'
  };

  // Eğer gelen renk hex kodu veya var() ise inline style kullan, değilse map'ten çek
  const isCustomColor = color.startsWith('#') || color.startsWith('var(') || color.startsWith('rgb');
  const themeClass = !isCustomColor ? (colorMap[color] || colorMap.default) : 'transition-colors duration-300';
  
  const customStyle = isCustomColor ? {
    backgroundColor: color.startsWith('var') ? `color-mix(in srgb, ${color}, white 90%)` : `${color}20`,
    color: color
  } : {};

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      {/* Kartın solundaki renkli çizgi efekti (Opsiyonel, modern görünüm için kaldırdım ama yapı burada) */}
      
      <div className="flex items-start justify-between mb-4">
        {/* İkon Kutusu */}
        <div 
          className={`p-3.5 rounded-2xl transition-colors duration-300 flex items-center justify-center ${themeClass}`}
          style={isCustomColor ? customStyle : {}}
        >
          {icon || <span className="text-xl">📊</span>}
        </div>

        {/* Trend İndikatörü (Varsa) */}
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
            ${trend.text === 'up' || trend === 'up' 
              ? 'bg-emerald-100 text-emerald-700' 
              : trend.text === 'down' || trend === 'down'
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-slate-100 text-slate-600'
            }`}>
             {trend === 'up' || trend.icon === 'up' ? <ArrowUp className="w-3 h-3" /> : 
              trend === 'down' || trend.icon === 'down' ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
             <span>{trend.text || trend}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2">
            {title}
        </h3>
        <div className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
        </div>
        
        {subtitle && (
          <div className="text-xs font-medium text-slate-400 mt-1 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Mini İstatistik Kartı (Daha kompakt)
 */
export const MiniStatCard = ({ label, value, color = 'text-slate-600' }) => {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center">
      <div className="text-xs font-medium text-slate-400 mb-1">{label}</div>
      <div className={`text-lg font-bold ${color.startsWith('text-') ? color : 'text-slate-700'}`} style={!color.startsWith('text-') ? { color } : {}}>
        {value}
      </div>
    </div>
  );
};

/**
 * Karşılaştırma İstatistik Kartı
 * Önceki ve sonraki değeri yan yana gösterir
 */
export const ComparisonStatCard = ({ title, current, previous, unit = '' }) => {
  const diff = current - previous;
  const percentDiff = previous > 0 ? ((diff / previous) * 100).toFixed(1) : 0;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;
  
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">{title}</h4>
      
      <div className="flex items-center justify-between gap-2">
        {/* Önceki Dönem */}
        <div className="text-center flex-1">
          <div className="text-[10px] font-semibold text-slate-400 mb-1 bg-slate-50 inline-block px-2 py-0.5 rounded">Önceki</div>
          <div className="text-lg font-bold text-slate-500 line-through decoration-slate-300 decoration-2">
            {formatNumber(previous)}{unit}
          </div>
        </div>
        
        {/* Değişim İkonu */}
        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full shrink-0 text-[10px] font-bold border-2
            ${isPositive 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : isNeutral
                    ? 'bg-slate-50 text-slate-500 border-slate-100'
                    : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
            <span>{isPositive ? '↑' : isNeutral ? '•' : '↓'}</span>
            <span>%{Math.abs(percentDiff)}</span>
        </div>

        {/* Güncel Dönem */}
        <div className="text-center flex-1">
          <div className="text-[10px] font-semibold text-blue-500 mb-1 bg-blue-50 inline-block px-2 py-0.5 rounded">Güncel</div>
          <div className="text-xl font-bold text-slate-800">
            {formatNumber(current)}{unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;