import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Percent, 
  DollarSign,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { MarketRegimeInfo, RiskEvaluation } from '../../types/freight';

interface KPICardsProps {
  currentRate: number;
  forecast7D: number;
  forecast30D: number;
  regime: MarketRegimeInfo;
  risk: RiskEvaluation;
  savingsPct: number;
  onOpenPlanner: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  currentRate,
  forecast7D,
  forecast30D,
  regime,
  risk,
  savingsPct,
  onOpenPlanner,
}) => {
  const pct7D = (((forecast7D - currentRate) / currentRate) * 100).toFixed(2);
  const pct30D = (((forecast30D - currentRate) / currentRate) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Card 1: Live Freight Rate & 7D Target */}
      <div className="terminal-card terminal-card-hover p-4 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Current Benchmark Rate</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 font-mono font-bold">
            SPOT FIX
          </span>
        </div>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">
            ${currentRate.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ MT</span>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#1e3362] flex items-center justify-between text-xs">
          <span className="text-slate-400">7-Day Target:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-amber-400">
            <span>${forecast7D.toFixed(2)}</span>
            <span className="text-[11px] text-amber-400 font-semibold">(+{pct7D}%)</span>
          </div>
        </div>
      </div>

      {/* Card 2: Market Regime Signal */}
      <div className="terminal-card terminal-card-hover p-4 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Market Regime</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold">
            {regime.confidencePct}% CONFIDENCE
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wide text-emerald-400 uppercase">
              {regime.regime} MARKET
            </span>
            <div className="text-[11px] text-slate-400 font-mono">
              BDI: 1,845 (+{regime.bdiChange7D}% 7D)
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#1e3362] text-[11px] text-slate-300 truncate">
          Persistent upward momentum in Pacific basin.
        </div>
      </div>

      {/* Card 3: Recommended Charter Action Window */}
      <div className="terminal-card terminal-card-hover p-4 relative overflow-hidden border-cyan-500/30">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-cyan-300">Action Recommendation</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono font-bold">
            OPTIMAL TIMING
          </span>
        </div>

        <div className="mt-2">
          <div className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Next 4–7 Days</span>
          </div>
          <div className="text-[11px] text-cyan-400 font-medium mt-0.5">
            Pre-empt 30D freight rally (+{pct30D}%)
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#1e3362] flex items-center justify-between text-xs">
          <span className="text-slate-400">Contract Format:</span>
          <span className="font-semibold text-slate-200">Medium-Term COA</span>
        </div>
      </div>

      {/* Card 4: Risk Score & Cost Savings */}
      <div className="terminal-card terminal-card-hover p-4 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">Composite Risk & Savings</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold">
            ROBUST FIT
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black font-mono text-emerald-400">
              {savingsPct}%
            </span>
            <span className="text-xs text-slate-400 ml-1">Est. Savings</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono font-bold text-slate-300">
              {risk.overallScore} <span className="text-xs text-slate-500">/ 100</span>
            </span>
            <div className="text-[10px] text-slate-400 font-medium">Risk Score</div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#1e3362] flex items-center justify-between text-xs">
          <span className="text-slate-400">Vessel Compatibility:</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Pass (Paradip)
          </span>
        </div>
      </div>
    </div>
  );
};
