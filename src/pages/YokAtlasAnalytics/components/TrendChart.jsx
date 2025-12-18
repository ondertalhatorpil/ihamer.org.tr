import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Ortak Stil Değişkenleri
const axisStyle = { fontSize: 11, fill: '#64748b', fontFamily: 'inherit' };
const gridStyle = { stroke: '#f1f5f9' }; // slate-100
const colors = {
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#ef4444',
  violet: '#8b5cf6',
  slate: '#94a3b8'
};

/**
 * Özel Tooltip Bileşeni
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700">
        <p className="font-bold mb-2 border-b border-slate-600 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="font-bold">
              {typeof entry.value === 'number' && entry.value % 1 !== 0 
                ? entry.value.toFixed(2) 
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Yıllara göre trend line chart
 */
export const YearlyTrendChart = ({ data, dataKey = 'oran', title = 'Yıllara Göre Trend' }) => {
  const chartData = [
    { year: '2023', value: data.data2023?.[dataKey] || 0 },
    { year: '2024', value: data.data2024?.[dataKey] || 0 },
    { year: '2025', value: data.data2025?.[dataKey] || 0 }
  ].filter(d => d.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
        Grafik için yeterli veri yok
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {title && <h4 className="text-sm font-bold text-slate-700 mb-4">{title}</h4>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} {...gridStyle} />
          <XAxis dataKey="year" tick={axisStyle} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={colors.blue} 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: colors.blue }}
            activeDot={{ r: 6, strokeWidth: 0, fill: colors.blue }}
            name={dataKey === 'oran' ? 'Oran (%)' : 'Sayı'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Karşılaştırma bar chart
 */
export const ComparisonBarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
        Grafik için veri yok
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {title && <h4 className="text-sm font-bold text-slate-700 mb-4">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} {...gridStyle} />
          <XAxis 
            dataKey="name" 
            tick={axisStyle} 
            tickLine={false} 
            axisLine={{ stroke: '#e2e8f0' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar 
            dataKey="value" 
            fill={colors.blue} 
            radius={[4, 4, 0, 0]} 
            name="Değer"
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MultiLineChart = ({ data, lines, title }) => {
  const lineColors = [colors.blue, colors.emerald, colors.amber, colors.rose, colors.violet];

  return (
    <div className="w-full h-full">
      {title && <h4 className="text-sm font-bold text-slate-700 mb-4">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} {...gridStyle} />
          <XAxis dataKey="year" tick={axisStyle} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={lineColors[index % lineColors.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'white', stroke: lineColors[index % lineColors.length] }}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Basit trend göstergesi (grafik olmadan)
 */
export const TrendIndicator = ({ data2023, data2024, data2025, type = 'oran' }) => {
  const values = [
    data2023?.[type] || null,
    data2024?.[type] || null,
    data2025?.[type] || null
  ].filter(v => v !== null);

  if (values.length < 2) {
    return <span className="text-xs text-slate-400 italic">Yetersiz veri</span>;
  }

  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  const percentChange = ((change / first) * 100).toFixed(1);

  const isPositive = change > 0;
  const isNeutral = Math.abs(change) < 0.5;

  return (
    <div className="flex flex-col items-end gap-1">
      {/* Trend Değerleri */}
      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        {values.map((val, idx) => (
          <React.Fragment key={idx}>
            <span>{type === 'oran' ? `%${val.toFixed(0)}` : val}</span>
            {idx < values.length - 1 && <span className="text-slate-300">→</span>}
          </React.Fragment>
        ))}
      </div>
      
      {/* Değişim Badge */}
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold
        ${isNeutral 
            ? 'bg-slate-100 text-slate-600' 
            : isPositive 
                ? 'bg-emerald-50 text-emerald-600' 
                : 'bg-rose-50 text-rose-600'
        }`}>
        {isNeutral ? (
            <Minus className="w-3 h-3" />
        ) : isPositive ? (
            <TrendingUp className="w-3 h-3" />
        ) : (
            <TrendingDown className="w-3 h-3" />
        )}
        <span>{isNeutral ? 'Stabil' : `${Math.abs(percentChange)}%`}</span>
      </div>
    </div>
  );
};

/**
 * Mini sparkline (küçük trend çizgisi)
 */
export const Sparkline = ({ data, width = 80, height = 24, color = '#3b82f6' }) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
      {/* Son noktaya bir daire koy */}
      <circle 
        cx={width} 
        cy={height - ((data[data.length - 1] - min) / range) * height} 
        r="3" 
        fill={color} 
      />
    </svg>
  );
};

export default YearlyTrendChart;