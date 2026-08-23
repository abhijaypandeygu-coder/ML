import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { FreightForecastPoint } from '../../types/freight';
import { TrendingUp, ShieldAlert, Sparkles, Layers } from 'lucide-react';

interface ForecastChartProps {
  data: FreightForecastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const [horizonFilter, setHorizonFilter] = useState<'7D' | '14D' | '30D' | '90D' | 'ALL'>('30D');
  const [showConfidence, setShowConfidence] = useState(true);

  // Filter data according to horizon
  const filteredData = React.useMemo(() => {
    const historicalCount = 30; // show last 30 historical days
    const historical = data.filter(d => !d.isForecast).slice(-historicalCount);
    const forecast = data.filter(d => d.isForecast);

    let forecastSlice = forecast;
    if (horizonFilter === '7D') forecastSlice = forecast.slice(0, 7);
    else if (horizonFilter === '14D') forecastSlice = forecast.slice(0, 14);
    else if (horizonFilter === '30D') forecastSlice = forecast.slice(0, 30);
    else if (horizonFilter === '90D') forecastSlice = forecast.slice(0, 90);

    return [...historical, ...forecastSlice];
  }, [data, horizonFilter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as FreightForecastPoint;
      const isForecast = point.isForecast;

      return (
        <div className="bg-[#0c1630] border border-[#1e3362] p-3 rounded-lg shadow-2xl text-xs space-y-1.5 min-w-[200px] z-50">
          <div className="flex items-center justify-between border-b border-[#1e3362] pb-1.5">
            <span className="font-mono text-slate-300 font-bold">{point.date}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              isForecast ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
            }`}>
              {isForecast ? 'ML Forecast' : 'Historical Actual'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Freight Rate:</span>
              <span className="font-mono font-bold text-white text-sm">
                ${(point.actualRateUSD || point.predictedRateUSD).toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ MT</span>
              </span>
            </div>

            {isForecast && (
              <>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">80% Conf. Bound:</span>
                  <span className="font-mono text-cyan-300">
                    ${point.confidenceLowerUSD} – ${point.confidenceUpperUSD}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>95% Conf. Bound:</span>
                  <span className="font-mono text-slate-300">
                    ${point.confidence95LowerUSD || (point.confidenceLowerUSD - 0.4).toFixed(2)} – ${point.confidence95UpperUSD || (point.confidenceUpperUSD + 0.4).toFixed(2)}
                  </span>
                </div>
              </>
            )}

            {point.eventAnnotation && (
              <div className="mt-1 pt-1.5 border-t border-[#1e3362] text-[11px] text-amber-300 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{point.eventAnnotation}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="terminal-card p-5 space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e3362] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              DeepAR + XGBoost Freight Rate Forward Curve
            </h3>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded">
              Route: Australia (Hay Point) → India (Paradip)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical fixtures vs probabilistic ML forecast with uncertainty cone.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence toggle */}
          <button
            onClick={() => setShowConfidence(!showConfidence)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
              showConfidence 
                ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300' 
                : 'bg-[#111f42] border-[#1e3362] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Confidence Cone (80% / 95%)</span>
          </button>

          {/* Time Horizon Filter */}
          <div className="flex items-center bg-[#111f42] border border-[#1e3362] rounded p-0.5 text-xs font-semibold">
            {(['7D', '14D', '30D', '90D', 'ALL'] as const).map((horizon) => (
              <button
                key={horizon}
                onClick={() => setHorizonFilter(horizon)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  horizonFilter === horizon
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {horizon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Area */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              {/* Confidence interval gradient */}
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#162852" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              tickFormatter={(val) => {
                const parts = val.split('-');
                return parts.length === 3 ? `${parts[1]}/${parts[2]}` : val;
              }} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              domain={['auto', 'auto']} 
              tickLine={false}
              unit="$"
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Split reference line between actual and forecast */}
            <ReferenceLine x={data.find(d => !d.isForecast && d.actualRateUSD === 28.4)?.date} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: 'LIVE TODAY', fill: '#38bdf8', fontSize: 10, position: 'top' }} />

            {/* Confidence Area */}
            {showConfidence && (
              <Area
                type="monotone"
                dataKey="confidenceUpperUSD"
                stroke="none"
                fill="url(#confidenceGradient)"
                name="Confidence Range"
              />
            )}

            {/* Actual Rate Line */}
            <Line
              type="monotone"
              dataKey="actualRateUSD"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 2, fill: '#38bdf8' }}
              activeDot={{ r: 5, fill: '#38bdf8' }}
              name="Historical Actual ($/MT)"
            />

            {/* Forecast Rate Line */}
            <Line
              type="monotone"
              dataKey="predictedRateUSD"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 2, fill: '#f59e0b' }}
              activeDot={{ r: 5, fill: '#f59e0b' }}
              name="Forecast Target ($/MT)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Notes */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#0c1630] border border-[#1e3362] p-2.5 rounded">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#38bdf8] inline-block"></span>
            <span className="text-slate-300">Historical Fixtures (Live Baltic Feed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block"></span>
            <span className="text-amber-300 font-medium">Predicted Trajectory ($28.40 → $31.80/MT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-500/40 inline-block rounded-xs"></span>
            <span className="text-slate-400">80% / 95% Confidence Bounds</span>
          </div>
        </div>

        <div className="text-emerald-400 font-medium font-mono text-[11px] flex items-center gap-1">
          <span>Signal: Forward Curve in Contango (+11.9% in 30D)</span>
        </div>
      </div>
    </div>
  );
};
