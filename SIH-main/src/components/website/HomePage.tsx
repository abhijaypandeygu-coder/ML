import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Ship, 
  Sparkles, 
  Play
} from 'lucide-react';
import { MainNavPage } from './Navbar';

interface HomePageProps {
  onNavigate: (page: MainNavPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Animated KPI count-up values
  const [freightRate, setFreightRate] = useState(0);
  const [savingsVal, setSavingsVal] = useState(0);
  const [confidenceVal, setConfidenceVal] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setFreightRate(Number((28.40 * easeOut).toFixed(2)));
      setSavingsVal(Number((7.1 * easeOut).toFixed(1)));
      setConfidenceVal(Number((84.5 * easeOut).toFixed(1)));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    requestAnimationFrame(updateCount);
  }, []);

  return (
    <div className="space-y-24 overflow-hidden">
      {/* 1. Cinematic Full-Bleed Vessel Hero Section (Matching Exactly Your Reference Design) */}
      <section className="relative min-h-[95vh] flex flex-col justify-between overflow-hidden bg-[#070e1e] text-white pt-28 pb-16">
        {/* Cinematic Ocean Vessel Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            src="/cma_cgm_hero.jpg"
            alt="CMA CGM Vessel Navigating Ocean"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Dark Radial Gradient Vignette Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070e1e]/85 via-black/40 to-[#070e1e] z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070e1e]/40 to-[#070e1e]/90 z-10"></div>
        </div>

        {/* Center Title Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center flex-1 flex flex-col justify-center items-center my-auto space-y-6">
          {/* Small Cyan Tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-cyan-400 font-bold tracking-[0.25em] text-xs sm:text-sm uppercase drop-shadow-[0_2px_10px_rgba(6,182,212,0.6)]"
          >
            FREIGHTQUANT
          </motion.div>

          {/* Bold Centered Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-2xl font-sans"
          >
            MARITIME INTELLIGENCE PLATFORM
          </motion.h1>

          {/* Clean Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-lg"
          >
            Leveraging AI for Global Shipping & Bulk Logistics Optimization
          </motion.p>

          {/* Glowing Pill CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-4"
          >
            <button
              onClick={() => onNavigate('features')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_40px_rgba(6,182,212,0.9)] transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              Explore Platform
            </button>
          </motion.div>
        </div>

        {/* Live Staggered KPI Metric Bar at Bottom of Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pt-6 border-t border-slate-700/60 backdrop-blur-sm bg-black/30 rounded-2xl py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1 hover:translate-x-1 transition-transform">
              <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Current Freight Rate</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
                ${freightRate.toFixed(2)} <span className="text-xs text-slate-300 font-sans font-normal">/ MT</span>
              </div>
              <div className="text-xs text-cyan-300 font-medium">Hay Point → Paradip</div>
            </div>

            <div className="space-y-1 hover:translate-x-1 transition-transform">
              <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">30-Day Forecast</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                $31.80 <span className="text-xs text-slate-300 font-sans font-normal">/ MT</span>
              </div>
              <div className="text-xs text-amber-300/90 font-medium">+11.9% Contango Shift</div>
            </div>

            <div className="space-y-1 hover:translate-x-1 transition-transform">
              <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Market Regime</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                RISING
              </div>
              <div className="text-xs text-emerald-300/90 font-medium">{confidenceVal}% Confidence</div>
            </div>

            <div className="space-y-1 hover:translate-x-1 transition-transform">
              <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">COA Cost Savings</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">
                {savingsVal}% (₹7.1 Cr)
              </div>
              <div className="text-xs text-slate-300 font-medium">vs Spot Fixtures</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Enterprise Decision Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Decision Intelligence</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Built for Logistics & Bulk Procurement Teams
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Move from subjective spot fixtures to automated quantitative optimization. FreightQuant converts probabilistic market predictions into defensible chartering decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Probabilistic Forecasting',
              desc: 'DeepAR recurrent models and XGBoost ensembles forecast 7D, 14D, and 30D rate trajectories with calibrated 80% and 95% confidence cones.',
              icon: TrendingUp,
            },
            {
              title: 'Vessel & Port Constraints',
              desc: 'Calculates geometric compatibility against Indian East Coast discharge drafts (Paradip, Vizag, Dhamra, Haldia) to avoid costly demurrage.',
              icon: Ship,
            },
            {
              title: 'COA Contract Strategy',
              desc: 'Quantifies spot vs short-term vs medium-term multiple-voyage contracts, recommending optimal laycan windows with guaranteed volume discounts.',
              icon: ShieldCheck,
            }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="enterprise-card p-8 space-y-4 group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Methodology Snapshot */}
      <section className="bg-slate-900 text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Core Methodology</div>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
                From Raw Market Signals to Executable Decision
              </h2>
            </div>
            <button
              onClick={() => onNavigate('methodology')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer group"
            >
              <span>Explore Detailed Methodology</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Data Ingestion', desc: 'Baltic Dry indices, Singapore bunker spreads, and port wait queues.' },
              { step: '02', title: 'Forward Curve ML', desc: 'Generates probabilistic price paths and market regime signals.' },
              { step: '03', title: 'Constraint Solver', desc: 'Evaluates drafts, LOA, turnaround days, and fuel burn.' },
              { step: '04', title: 'Charter Directive', desc: 'Outputs recommended vessel, entry timing, and contract type.' },
            ].map((m) => (
              <div key={m.step} className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 p-6 rounded-xl space-y-3 transition-all transform hover:-translate-y-1">
                <span className="text-xs font-mono font-bold text-blue-400">{m.step}</span>
                <h3 className="text-lg font-bold text-white">{m.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-10 sm:p-14 text-white flex flex-wrap items-center justify-between gap-8 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="max-w-xl space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to optimize your vessel chartering strategy?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed font-normal">
              Access live probabilistic freight forecasting, port constraint simulation, and contract optimization directly in the platform dashboard.
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3.5 rounded-lg bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Open Platform Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
