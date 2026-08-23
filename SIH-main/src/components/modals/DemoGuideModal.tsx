import React from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Ship, 
  MapPin, 
  Calendar, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { NavPage } from '../layout/Sidebar';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavPage) => void;
  onRunSIHDemo: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRunSIHDemo,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      title: 'Define Cargo & Route',
      desc: 'Select 100,000 MT Coking Coal on the Australia (Hay Point) → India (Paradip) corridor.',
      page: 'planner',
    },
    {
      step: '2',
      title: 'Analyze Constraints & Forecast',
      desc: 'System detects Rising Market (+11.9% in 30D) and validates Paradip draft compatibility (14.5m).',
      page: 'vessels',
    },
    {
      step: '3',
      title: 'Receive Multi-Voyage Recommendation',
      desc: 'Recommends Panamax vessel + 4-7 days entry window + Medium-Term COA contract with ₹7.1 Cr savings.',
      page: 'strategy',
    },
    {
      step: '4',
      title: 'Stress-Test with What-If Simulator',
      desc: 'Shift freight by +15% and observe how the optimal entry window automatically compresses.',
      page: 'simulator',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c1630] border border-cyan-500/50 rounded-xl w-full max-w-2xl shadow-2xl space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e3362] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                SIH 2026 Judges Guided Presentation Walkthrough
              </h2>
              <p className="text-xs text-slate-400">
                Problem Statement 26006: Intelligent Freight Forecasting & Charter Optimization.
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

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.step}
              onClick={() => {
                onNavigate(s.page as NavPage);
                onClose();
              }}
              className="bg-[#070d1e] hover:bg-[#111f42] border border-[#1e3362] hover:border-cyan-500/40 p-3.5 rounded-lg flex items-center justify-between gap-4 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  {s.step}
                </span>
                <div>
                  <span className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
            </div>
          ))}
        </div>

        {/* One-Click Demo Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onRunSIHDemo();
              onClose();
            }}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Launch Complete SIH 100k MT Benchmark Demo Flow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
