import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Award, Users, CheckCircle2, Sparkles } from 'lucide-react';
import { MainNavPage } from './Navbar';

interface AboutPageProps {
  onNavigate: (page: MainNavPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 overflow-hidden">
      {/* Header with Animated Harbour Dock Photo */}
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
              <span>COMPANY & VISION // SIH 26006</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              About FreightQuant
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              Developed for SIH 2026 Problem Statement 26006 to revolutionize dry-bulk procurement and chartering decision intelligence for national logistics managers.
            </p>
          </div>
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden group">
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              src="/harbour_dock.jpg"
              alt="Bulk Carrier Vessel Entering Indian Harbour"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070e1e] via-transparent to-transparent hidden lg:block"></div>
          </div>
        </div>
      </motion.div>

      {/* Mission & Vision Grid with Hover Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="enterprise-card p-8 space-y-4 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            To eliminate unhedged freight market exposure for bulk importers by providing transparent probabilistic machine learning forecasts, physical port constraint optimization, and structured multi-voyage contract strategies.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="enterprise-card p-8 space-y-4 border border-slate-200 hover:border-blue-500/50 hover:shadow-xl transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            To become the premier maritime quantitative terminal powering maritime logistics, raw material procurement, and chartering operations across Indian East Coast ports and global corridors.
          </p>
        </motion.div>
      </div>

      {/* Core Values with Staggered Hover Motion */}
      <div className="space-y-6">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Core Principles</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          What Drives Our Engineering
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Mathematical Precision', desc: 'Zero black-box guesses. Every recommendation is backed by geometric draft solvers and calibrated confidence intervals.' },
            { title: 'Explainability First', desc: 'Clear 5-pillar justifications explaining why a vessel, entry window, or contract format is selected.' },
            { title: 'Decision-Driven', desc: 'We do not simply forecast prices; we convert market signals into actionable laycan entry windows and contract structures.' },
            { title: 'Enterprise Reliability', desc: 'Designed for high throughput, sub-second sensitivity recalculation, and robust API extensibility.' },
          ].map((v, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-50 hover:bg-white p-6 rounded-xl border border-slate-200/80 hover:border-blue-500/40 hover:shadow-lg transition-all space-y-2 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
