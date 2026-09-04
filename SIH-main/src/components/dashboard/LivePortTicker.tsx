import React from 'react';
import { useLivePorts } from '../../hooks/useLivePorts';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export const LivePortTicker: React.FC = () => {
  const { livePorts, isConnected } = useLivePorts();

  if (!isConnected || livePorts.length === 0) {
    return (
      <div className="bg-[#070d1e] border-y border-[#1e3362] px-6 py-2 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>Connecting to Live Maritime Data Stream...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c1630] border-y border-[#1e3362] px-6 py-2 flex items-center gap-6 overflow-x-auto scrollbar-hide whitespace-nowrap">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
          Live Port Updates
        </span>
      </div>
      
      <div className="flex items-center gap-6 animate-ticker">
        {livePorts.map((port) => (
          <div key={port.id} className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">{port.name}:</span>
            <span className={`text-xs font-mono font-bold ${
              port.congestionLevel === 'HIGH' ? 'text-rose-400' : 
              port.congestionLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {port.avgWaitDays.toFixed(1)} days
            </span>
            {port.trend === 'up' ? (
              <TrendingUp className="w-3 h-3 text-rose-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-emerald-400" />
            )}
            <span className="text-[10px] text-slate-500 border-l border-slate-700 pl-2 ml-1">
              ({port.congestionLevel})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
