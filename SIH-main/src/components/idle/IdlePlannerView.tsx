import React from 'react';
import { getIdleScenarios } from '../../services/charterEngine';
import { 
  Ship, 
  MapPin, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Compass, 
  Sparkles 
} from 'lucide-react';

export const IdlePlannerView: React.FC = () => {
  const scenarios = getIdleScenarios();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="terminal-card p-4 flex items-center justify-between border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Vessel Idle Time & Post-Discharge Employment Planner
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates post-discharge ballast distance, deadheading costs, and alternative backhaul fixtures to minimize unremunerated waiting days.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scenarios.map((sc, idx) => (
          <div key={idx} className="terminal-card p-5 space-y-4 border-cyan-500/40">
            <div className="flex items-center justify-between border-b border-[#1e3362] pb-3">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-slate-100">{sc.vesselClass} Fleet Scenario</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                {sc.nextCargoDemandProbabilityPct}% Demand Match
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0c1630] border border-[#1e3362] p-2.5 rounded">
                <span className="text-slate-400 block">Current Discharge Port:</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{sc.currentDischargePort}</span>
                <span className="text-[10px] text-amber-400 font-mono mt-1 block">
                  Est. Idle: {sc.expectedIdleDaysCurrentPort} days
                </span>
              </div>

              <div className="bg-[#0c1630] border border-cyan-700/60 p-2.5 rounded">
                <span className="text-cyan-300 block font-medium">Optimal Repositioning:</span>
                <span className="font-semibold text-white mt-0.5 block">{sc.alternativeDestinationPort}</span>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                  Saves: {sc.daysSaved} idle days
                </span>
              </div>
            </div>

            <div className="bg-[#0a1128] border border-[#1e3362] p-3 rounded text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quantitative Repositioning Directive:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {sc.recommendationText}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1e3362] text-xs font-mono">
              <span className="text-slate-400">Net Repositioning Benefit:</span>
              <span className="font-bold text-emerald-400 text-sm">
                +${sc.netFinancialBenefitUSD.toLocaleString()} USD
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
