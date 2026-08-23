import React, { useState } from 'react';
import { CharterRecommendationResult } from '../../types/freight';
import { 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Anchor, 
  Calendar, 
  DollarSign, 
  FileText, 
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Zap,
  Ship
} from 'lucide-react';

interface CharterStrategyViewProps {
  recommendation: CharterRecommendationResult;
  onOpenExplainModal: () => void;
  onOpenSimulator: () => void;
}

export const CharterStrategyView: React.FC<CharterStrategyViewProps> = ({
  recommendation,
  onOpenExplainModal,
  onOpenSimulator,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'SPOT' | 'SHORT_TERM' | 'MEDIUM_TERM_MULTI'>('MEDIUM_TERM_MULTI');

  const rec = recommendation;
  const spotOption = rec.contractComparisons.find(c => c.strategy === 'SPOT')!;
  const multiOption = rec.contractComparisons.find(c => c.strategy === 'MEDIUM_TERM_MULTI')!;
  const inrSavingsCr = (spotOption.expectedTotalCostINRCrores - multiOption.expectedTotalCostINRCrores).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Banner Recommendation Hero */}
      <div className="terminal-card p-6 border-cyan-500/50 relative overflow-hidden bg-gradient-to-br from-[#0c1a3a] via-[#0e1e45] to-[#070d1e]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1e3362] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                OPTIMIZED CHARTER DIRECTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SIH Problem Statement 26006
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Recommended Chartering & Procurement Strategy
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Corridor: <span className="text-cyan-300 font-semibold">{rec.recommendedRoute}</span> | Commodity: <span className="text-slate-100 font-semibold">{rec.cargoInput.commodity}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#162852] hover:bg-[#1e3362] border border-[#1e3362] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Stress-Test in Simulator</span>
            </button>

            <button
              onClick={onOpenExplainModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-200" />
              <span>Mathematical Proof</span>
            </button>
          </div>
        </div>

        {/* 4 Core Recommendation Anchors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-[#070d1e]/80 border border-[#1e3362] p-3.5 rounded">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
              <Ship className="w-4 h-4 text-cyan-400" />
              <span>Recommended Vessel Class</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {rec.recommendedVessel}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">
              100% Port Compliant (13.8m draft)
            </div>
          </div>

          <div className="bg-[#070d1e]/80 border border-[#1e3362] p-3.5 rounded">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Optimal Entry Window</span>
            </div>
            <div className="text-base font-bold text-cyan-300 leading-snug">
              {rec.recommendedEntryWindow}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Hedges against +11.9% 30D contango
            </div>
          </div>

          <div className="bg-[#070d1e]/80 border border-[#1e3362] p-3.5 rounded">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Recommended Contract</span>
            </div>
            <div className="text-base font-bold text-white leading-snug">
              Medium-Term Multi-Voyage COA
            </div>
            <div className="text-[11px] text-amber-400 font-medium mt-1">
              Guarantees laycan + demurrage cap
            </div>
          </div>

          <div className="bg-[#070d1e]/80 border border-emerald-500/40 p-3.5 rounded">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Expected Savings vs Spot</span>
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {rec.expectedSavingsPct}% (₹{inrSavingsCr} Cr)
            </div>
            <div className="text-[11px] text-slate-300 mt-1 font-mono">
              Target: ${rec.expectedFreightRateUSD}/MT
            </div>
          </div>
        </div>
      </div>

      {/* Spot vs Short-Term vs Medium-Term COA Matrix */}
      <div className="terminal-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e3362] pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Contract Structure Trade-Off Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Direct quantitative comparison for moving from single-voyage spot exposure to structured volume COAs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rec.contractComparisons.map((c) => {
            return (
              <div
                key={c.strategy}
                className={`p-4 rounded-lg border transition-all ${
                  c.isRecommended
                    ? 'bg-[#0e224d] border-cyan-400 shadow-lg shadow-cyan-950/50'
                    : 'bg-[#0c1630] border-[#1e3362]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#1e3362] pb-2.5">
                  <span className="font-bold text-xs text-slate-100">{c.title}</span>
                  {c.isRecommended && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-600">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400">Expected Total Cost:</span>
                    <span className="font-mono font-bold text-sm text-white">
                      ₹{c.expectedTotalCostINRCrores} Cr
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Freight Target Rate:</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      ${c.expectedRateUSDPerMT} / MT
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Projected Savings:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {c.expectedSavingsPct > 0 ? `+${c.expectedSavingsPct}%` : '0% (Baseline)'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Exposure:</span>
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      c.marketExposureLevel === 'LOW' ? 'bg-emerald-950 text-emerald-400' : (c.marketExposureLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400')
                    }`}>
                      {c.marketExposureLevel}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Composite Risk Score:</span>
                    <span className="font-mono font-bold text-slate-300">
                      {c.riskScore} / 100
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1e3362] space-y-1.5 text-[11px]">
                  <span className="text-slate-400 font-semibold block">Key Advantages:</span>
                  {c.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300 leading-tight">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Pillars (Explainability) */}
      <div className="terminal-card p-5 space-y-4">
        <div className="border-b border-[#1e3362] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Decision Justification & Model Signals
          </h3>
          <p className="text-xs text-slate-400">
            Algorithmic rationale linking probabilistic forecasting, geometric constraints, and multi-voyage economics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {rec.decisionPillars.map((p, idx) => (
            <div key={idx} className="bg-[#0c1630] border border-[#1e3362] p-3.5 rounded space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-600/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
                  0{idx + 1}
                </div>
                <h4 className="text-xs font-bold text-slate-100">{p.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
