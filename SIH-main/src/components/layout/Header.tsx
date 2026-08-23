import React from 'react';
import { 
  Radio, 
  Database, 
  MapPin, 
  HelpCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  selectedRouteName: string;
  onOpenExplainModal: () => void;
  onOpenDemoFlow: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  selectedRouteName, 
  onOpenExplainModal,
  onOpenDemoFlow
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-[#0c1630] border-b border-[#1e3362] px-6 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
      {/* Route & Mode Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#111f42] border border-[#1e3362] px-3 py-1.5 rounded-md">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <div className="text-xs">
            <span className="text-slate-400">Benchmark Corridor: </span>
            <span className="font-semibold text-slate-100">{selectedRouteName}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons & Market Freshness */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenDemoFlow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-200" />
          <span>Judges Guided Demo Flow</span>
        </button>

        <button
          onClick={onOpenExplainModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#162852] hover:bg-[#1e3362] border border-[#1e3362] text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>How Decision Was Calculated</span>
        </button>

        {/* Market Feed Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pl-2 border-l border-[#1e3362]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Baltic Feed:</span>
            <span className="text-emerald-400 font-bold">1,845 BDI</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{currentDate}</span>
        </div>
      </div>
    </header>
  );
};
