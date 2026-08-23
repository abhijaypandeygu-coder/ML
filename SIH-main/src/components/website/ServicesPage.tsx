import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Ship, 
  Clock, 
  FileCheck, 
  ShieldAlert, 
  Anchor, 
  Sliders, 
  Activity, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { MainNavPage } from './Navbar';

interface ServicesPageProps {
  onNavigate: (page: MainNavPage) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const services = [
    {
      id: 'forecast',
      title: 'Freight Rate Forecasting',
      icon: TrendingUp,
      badge: 'DEEPAR ML',
      desc: 'Probabilistic machine-learning forecasts across 7, 14, 30, and 90-day horizons with calibrated 80% and 95% confidence bounds.',
      features: ['DeepAR Recurrent Models', 'Contango/Backwardation Signal', 'Daily Spot Updating'],
    },
    {
      id: 'vessels',
      title: 'Vessel Charter Optimization',
      icon: Ship,
      badge: 'FLEET SIZING',
      desc: 'Determines the optimal vessel class (Handysize, Supramax, Panamax, Capesize) based on cargo parcel geometry and scale economics.',
      features: ['Turnaround Days Solver', 'Bunker Burn Estimation', 'DWT Payload Matching'],
    },
    {
      id: 'timing',
      title: 'Optimal Charter Timing',
      icon: Clock,
      badge: 'MARKET DIP',
      desc: 'Predicts high-probability market troughs and recommends the exact charter entry window to hedge against price inflation.',
      features: ['Pre-Spike Entry Signals', 'Laycan Scheduling', 'Historical Seasonality'],
    },
    {
      id: 'contracts',
      title: 'Contract Strategy Advisor',
      icon: FileCheck,
      badge: 'COA SOLVER',
      desc: 'Simulates Spot Single-Voyage, Short-Term consecutive fixtures, and Medium-Term Multiple-Voyage Contracts (COAs).',
      features: ['Volume Discount Modeling', 'Demurrage Capping', 'Index-Linked Formats'],
    },
    {
      id: 'risk',
      title: 'Risk Assessment & Alerts',
      icon: ShieldAlert,
      badge: 'REAL-TIME RISKS',
      desc: 'Continuous indexing of freight volatility, geopolitical chokepoints, weather disruptions, and vessel availability queues.',
      features: ['Composite Risk Score (0-100)', 'Monsoon Advisory', 'Vessel Queue Monitoring'],
    },
    {
      id: 'ports',
      title: 'Port Intelligence',
      icon: Anchor,
      badge: 'EAST COAST',
      desc: 'Detailed geometric constraints for Indian East Coast discharge ports (Paradip, Vizag, Gangavaram, Dhamra, Haldia).',
      features: ['Draft & LOA Verification', 'Tidal Clearance Windows', 'Daily Handling Rates'],
    },
    {
      id: 'simulator',
      title: 'Scenario Simulator',
      icon: Sliders,
      badge: 'WHAT-IF LAB',
      desc: 'Stress-test freight rate shifts, bunker fuel shocks, and port discharge delays with instantaneous before-vs-after deltas.',
      features: ['Real-time Sensitivity', 'Demurrage Impact Analysis', 'Cost Breakdown'],
    },
    {
      id: 'market',
      title: 'Market Intelligence',
      icon: Activity,
      badge: 'BALTIC INDICES',
      desc: 'Live tracking of Baltic Dry Index (BDI), Baltic Panamax Index (BPI), and Singapore VLSFO bunker benchmarks.',
      features: ['Real-time Indices', 'Commodity Spot Curves', 'Disruption Feeds'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 overflow-hidden">
      {/* Header Banner with Animated Port Terminal Photo & Motion Entrance */}
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
              <span>DECISION-SUPPORT CAPABILITIES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Maritime Intelligence Services
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Comprehensive quantitative modeling built specifically for dry-bulk procurement managers, logistics heads, and chartering organizations.
            </p>
          </div>
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden group">
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              src="/port_terminal.jpg"
              alt="Container Port Terminal at Sunset"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070e1e] via-transparent to-transparent hidden lg:block"></div>
          </div>
        </div>
      </motion.div>

      {/* Services Grid with Staggered Framer Motion Animations & Hover Elevation */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div 
              key={s.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="enterprise-card p-6 flex flex-col justify-between space-y-5 group relative overflow-hidden border border-slate-200/80 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer"
            >
              {/* Subtle Top Glow Gradient Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-600 bg-slate-50 group-hover:bg-blue-50 px-2 py-0.5 rounded transition-colors">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1.5">
                  {s.features.map((f, i) => (
                    <div key={i} className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="pt-2 text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
                >
                  <span>Launch in Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
