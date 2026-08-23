import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Cpu, 
  LineChart, 
  TrendingUp, 
  Calculator, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MainNavPage } from './Navbar';

interface MethodologyPageProps {
  onNavigate: (page: MainNavPage) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Data Collection & Ingestion',
      icon: Database,
      summary: 'Aggregates global dry bulk fixtures, Baltic indices, bunker fuel quotes, and port congestion telemetry.',
      details: 'Ingests real-time Baltic Dry Index (BDI), Baltic Panamax Index (BPI), FOB Newcastle/Hay Point coal benchmarks, Singapore VLSFO bunker prices, and automated berth wait times across Indian East Coast ports.',
    },
    {
      num: '02',
      title: 'Data Cleansing & Normalization',
      icon: Cpu,
      summary: 'Filters noise, handles seasonal monsoon variations, and validates draft/LOA technical constraints.',
      details: 'Applies statistical anomaly detection, fills missing time-series points with Kalman smoothing, and cross-references vessel deadweight classes against port navigation envelopes.',
    },
    {
      num: '03',
      title: 'Market Regime Detection',
      icon: LineChart,
      summary: 'Identifies whether the corridor is in a Rising, Falling, Stable, or Highly Volatile state.',
      details: 'Uses momentum oscillators, rolling volatility indices, and Pacific ton-mile demand signals to classify regime confidence (e.g. 84.5% Rising Market contango).',
    },
    {
      num: '04',
      title: 'Probabilistic Prediction Engine',
      icon: TrendingUp,
      summary: 'DeepAR recurrent networks and XGBoost ensembles forecast forward freight curves with confidence bounds.',
      details: 'Generates 7D, 14D, 30D, and 90D probability distributions with 80% and 95% uncertainty cones to quantify downside and upside risk.',
    },
    {
      num: '05',
      title: 'Constraint & Cost Optimization Solver',
      icon: Calculator,
      summary: 'Evaluates Total Expected Cost = Charter Hire + Fuel + Port Dues + Demurrage Buffer.',
      details: 'Determines the optimal vessel class (Panamax vs Capesize vs Supramax), required voyages, round-trip sea days, and post-discharge ballast deadheading.',
    },
    {
      num: '06',
      title: 'Actionable Charter Directive',
      icon: CheckCircle2,
      summary: 'Outputs clear chartering decisions: Recommended Vessel, Optimal Timing Window, and Contract Format.',
      details: 'Quantifies spot vs medium-term multiple-voyage COA savings (e.g. ₹7.1 Cr / 7.1% cost reduction) and produces mathematically explainable justifications.',
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 overflow-hidden">
      {/* Header with Animated Control Center Photo Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#070e1e] relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-400">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>RIGOROUS MATHEMATICAL ARCHITECTURE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              How FreightQuant Computes Decisions
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Our 6-stage quantitative optimization pipeline bridges macroeconomic time-series forecasting with physical port navigation constraints.
            </p>
          </div>
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden group">
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              src="/control_room.jpg"
              alt="Maritime Control Operations Center"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070e1e] via-transparent to-transparent hidden lg:block"></div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Horizontal Timeline on Desktop / Stacked Accordion on Mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <motion.button
                key={step.num}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#070e1e] text-white border-blue-500 shadow-xl shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"></div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {step.num}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-2">
                  {step.title}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <motion.div 
          key={activeStep}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                STAGE {steps[activeStep].num} OF 06
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {steps[activeStep].title}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>See in Live Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Operational Objective</div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {steps[activeStep].summary}
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Algorithmic Implementation</div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {steps[activeStep].details}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
