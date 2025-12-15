import React from 'react';
import { ArrowUp, ArrowDown, Minus, Info } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import Tooltip from './Tooltip'; // Tooltip importu

export const StatGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, trend, color = 'blue', tooltipText }) => {
  
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    default: 'bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white'
  };

  const isCustomColor = color.startsWith('#') || color.startsWith('var(') || color.startsWith('rgb');
  const themeClass = !isCustomColor ? (colorMap[color] || colorMap.default) : 'transition-colors duration-300';
  
  const customStyle = isCustomColor ? {
    backgroundColor: color.startsWith('var') ? `color-mix(in srgb, ${color}, white 90%)` : `${color}20`,
    color: color
  } : {};

  // Arka plan rengini belirle (border ve süsleme için)
  const bgDecorationColor = color === 'blue' ? 'bg-blue-50' : 
                            color === 'indigo' ? 'bg-indigo-50' :
                            color === 'emerald' ? 'bg-emerald-50' : 
                            color === 'amber' ? 'bg-amber-50' : 'bg-slate-50';

  return (
    // DİKKAT: Ana div'de 'overflow-hidden' YOK. Sadece 'relative'.
    <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group z-0 hover:z-10">
      
      {/* 1. KATMAN: Arka Plan Süslemesi (Clipped) */}
      {/* overflow-hidden SADECE burada var, böylece renkli daire kesilir ama tooltip kesilmez */}
      <div className={`absolute inset-0 rounded-3xl overflow-hidden pointer-events-none`}>
         <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-60 transition-opacity duration-500 ${bgDecorationColor}`}></div>
      </div>

      {/* 2. KATMAN: İçerik (Unclipped) */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className={`p-3.5 rounded-2xl transition-colors duration-300 flex items-center justify-center ${themeClass}`}
            style={isCustomColor ? customStyle : {}}
          >
            {icon || <span className="text-xl">📊</span>}
          </div>

          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
              ${trend === 'up' || trend.text === 'up' ? 'bg-emerald-100 text-emerald-700' : 
                trend === 'down' || trend.text === 'down' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
              }`}>
               {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
               <span>{trend === 'up' ? 'Artış' : 'Azalış'}</span>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-500">{title}</span>
              
              {/* Tooltip Entegrasyonu */}
              {tooltipText && (
                <Tooltip text={tooltipText}>
                  <Info className="w-3.5 h-3.5 text-slate-300 hover:text-blue-500 cursor-help transition-colors" />
                </Tooltip>
              )}
          </div>
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
    </div>
  );
};

// ... Diğer alt bileşenler (MiniStatCard, ComparisonStatCard) aynı kalabilir ...
// Sadece export kısmını unutma
export const ComparisonStatCard = ({ title, current, previous, unit = '' }) => {
    // ... (eski kodun aynısı)
    const diff = current - previous;
    const percentDiff = previous > 0 ? ((diff / previous) * 100).toFixed(1) : 0;
    const isPositive = diff > 0;
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">{title}</h4>
            <div className="flex items-center justify-between gap-2">
                <div className="text-center flex-1">
                    <div className="text-[10px] font-semibold text-slate-400 mb-1">Önceki</div>
                    <div className="text-lg font-bold text-slate-500 line-through decoration-slate-300">{formatNumber(previous)}{unit}</div>
                </div>
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full shrink-0 text-[10px] font-bold border-2 ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                    <span>{isPositive ? '↑' : '↓'}</span>
                    <span>%{Math.abs(percentDiff)}</span>
                </div>
                <div className="text-center flex-1">
                    <div className="text-[10px] font-semibold text-blue-500 mb-1">Güncel</div>
                    <div className="text-xl font-bold text-slate-800">{formatNumber(current)}{unit}</div>
                </div>
            </div>
        </div>
    )
};

export const MiniStatCard = ({ label, value }) => (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="text-lg font-bold text-slate-700">{value}</div>
    </div>
);

export default StatCard;