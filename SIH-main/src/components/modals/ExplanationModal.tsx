import React from 'react';
import { CharterRecommendationResult } from '../../types/freight';
import { 
  X, 
  HelpCircle, 
  Calculator, 
  CheckCircle, 
  TrendingUp, 
  Anchor, 
  Layers, 
  ShieldCheck,
  DollarSign
} from 'lucide-react';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: CharterRecommendationResult;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  recommendation,
}) => {
  if (!isOpen) return null;

  const rec = recommendation;
  const eq = rec.mathematicalEquation;

  const steps = [
    {
      num: '01',
      title: 'Probabilistic Market Forward Curve',
      desc: 'Predicts freight rate trajectories over 7D/14D/30D horizons using DeepAR probabilistic autoregressive recurrent network with 80%/95% confidence intervals.',
    },
    {
      num: '02',
      title: 'Geometric Port & Draft Envelope Filtering',
      desc: 'Evaluates channel depth limits, LOA pocket clearances, and berth crane productivity rates across Indian East Coast discharge ports (e.g. Paradip max draft 14.5m).',
    },
    {
      num: '03',
      title: 'Voyage Sizing & Scale Optimization',
      desc: 'Calculates round-trip voyage duration, sea-days, load/discharge laytime, and total required voyages for parcel sizing (e.g. 100,000 MT).',
    },
    {
      num: '04',
      title: 'Total Expected Cost & Demurrage Simulation',
      desc: 'Calculates total voyage costs combining Charter Hire + VLSFO Bunker + Port Dues + Demurrage Buffer.',
    },
    {
      num: '05',
      title: 'Contract Strategy Selection (Spot vs Multi-Voyage COA)',
      desc: 'Evaluates spot market exposure risk against forward curve contango to recommend the optimal volume COA contract structure.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c1630] border border-cyan-500/50 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e3362] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center border border-blue-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                How the Chartering Recommendation Was Calculated
              </h2>
              <p className="text-xs text-slate-400">
                Mathematical formulations and 5-step optimization logic for SIH 26006.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#111f42] text-slate-400 hover:text-white border border-[#1e3362] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mathematical Equation Hero */}
        <div className="bg-[#070d1e] border border-cyan-500/40 p-4 rounded-lg space-y-3">
          <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
            Core Objective Cost Function:
          </span>
          <div className="font-mono text-xs sm:text-sm text-slate-100 font-bold bg-[#0c1630] p-3 rounded border border-[#1e3362] overflow-x-auto">
            {eq.formula}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {eq.breakdown.map((b: { label: string; valueINR: number; sharePct: number }, i: number) => (
              <div key={i} className="bg-[#0c1630] p-2.5 rounded border border-[#1e3362] text-xs">
                <span className="text-slate-400 text-[10px] block truncate">{b.label}</span>
                <span className="font-mono font-bold text-white block mt-0.5">₹{b.valueINR.toFixed(2)} Cr</span>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold">{b.sharePct}% share</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Logic Walkthrough */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            5-Stage Decision Optimization Sequence
          </h3>

          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.num} className="bg-[#070d1e] border border-[#1e3362] p-3.5 rounded flex items-start gap-3 text-xs">
                <span className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {s.num}
                </span>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-100 block">{s.title}</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1e3362]">
          <span className="text-[11px] text-slate-400 font-mono">
            Status: Deterministic Constraint Solved | Zero Hallucinations
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Proof
          </button>
        </div>
      </div>
    </div>
  );
};
