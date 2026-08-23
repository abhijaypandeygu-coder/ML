import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Ship, 
  Anchor, 
  Activity, 
  ShieldAlert, 
  FileCheck, 
  Sliders, 
  DollarSign, 
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  ChevronRight,
  Database,
  LineChart,
  Navigation,
  Fuel,
  Waves,
  Zap,
  Gauge
} from 'lucide-react';
import { MainNavPage } from './Navbar';

interface FeaturesPageProps {
  onNavigate: (page: MainNavPage) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'forecasting' | 'constraints' | 'contracts' | 'simulation'>('forecasting');

  // Interactive Live Voyage Calculator State (Unique Live Tool)
  const [selectedRoute, setSelectedRoute] = useState<'haypoint-paradip' | 'taboneo-vizag' | 'maputo-dhamra'>('haypoint-paradip');
  const [selectedVessel, setSelectedVessel] = useState<'panamax' | 'supramax' | 'capesize'>('panamax');
  const [cargoTonnage, setCargoTonnage] = useState<number>(75000);

  // Dynamic route data
  const routeConfigs = {
    'haypoint-paradip': {
      name: 'Hay Point (Aus) → Paradip (India)',
      distanceNm: 4850,
      cargo: 'Coking Coal',
      maxPortDraft: 14.5,
      spotRatePerMt: 28.40,
      coaDiscountPct: 7.1,
    },
    'taboneo-vizag': {
      name: 'Taboneo (Indo) → Visakhapatnam (India)',
      distanceNm: 2200,
      cargo: 'Thermal Coal',
      maxPortDraft: 16.5,
      spotRatePerMt: 14.80,
      coaDiscountPct: 5.8,
    },
    'maputo-dhamra': {
      name: 'Maputo (Moz) → Dhamra (India)',
      distanceNm: 4600,
      cargo: 'Steam Coal',
      maxPortDraft: 18.0,
      spotRatePerMt: 24.10,
      coaDiscountPct: 6.4,
    }
  };

  const vesselConfigs = {
    panamax: {
      name: 'Panamax (76k DWT)',
      capacityMt: 76000,
      draftM: 13.8,
      speedKnots: 13.0,
      bunkerTonPerDay: 26.5,
      dailyCharterHire: 14200,
    },
    supramax: {
      name: 'Supramax (58k DWT)',
      capacityMt: 58000,
      draftM: 12.8,
      speedKnots: 13.5,
      bunkerTonPerDay: 23.0,
      dailyCharterHire: 12500,
    },
    capesize: {
      name: 'Capesize (180k DWT)',
      capacityMt: 180000,
      draftM: 18.2,
      speedKnots: 12.5,
      bunkerTonPerDay: 44.0,
      dailyCharterHire: 21500,
    }
  };

  const currentRoute = routeConfigs[selectedRoute];
  const currentVessel = vesselConfigs[selectedVessel];

  // Mathematical Voyage Computations
  const seaDaysOneWay = Number((currentRoute.distanceNm / (currentVessel.speedKnots * 24)).toFixed(1));
  const roundTripDays = Number((seaDaysOneWay * 2 + 5).toFixed(1)); // 5 days port loading/discharge
  const spotTotalCost = Math.round(cargoTonnage * currentRoute.spotRatePerMt);
  const coaTotalCost = Math.round(spotTotalCost * (1 - currentRoute.coaDiscountPct / 100));
  const netSavingsInrCr = Number(((spotTotalCost - coaTotalCost) * 87.5 / 10000000).toFixed(2));
  const isDraftFeasible = currentVessel.draftM <= currentRoute.maxPortDraft;

  const featureTabs = [
    {
      id: 'forecasting' as const,
      label: 'DeepAR Rate Forecasting',
      icon: TrendingUp,
      badge: 'PROBABILISTIC ML',
      headline: 'Multi-Horizon Probabilistic Forward Curves',
      subhead: 'DeepAR recurrent architectures trained on 15-year Baltic indices, fuel spreads, and China steel demand.',
      stats: [
        { label: 'Forecast Horizons', value: '7D, 14D, 30D, 90D' },
        { label: 'Confidence Envelopes', value: 'P80 & P95 Calibrated' },
        { label: 'Market Regime Model', value: 'Markov 4-State Detection' },
      ],
      points: [
        'Forecasts spot rates for Coking Coal (Australia to Paradip) & Thermal Coal (Indonesia to Vizag)',
        'Quantifies upside contango and downside backwardation risk',
        'Automatic regime tagging: RISING, VOLATILE, STABLE, or DECLINING'
      ]
    },
    {
      id: 'constraints' as const,
      label: 'Port & Vessel Draft Solver',
      icon: Anchor,
      badge: 'GEOMETRIC OPTIMIZER',
      headline: 'Discharge Port Geometric Compatibility',
      subhead: 'Real-time validation against draft tides, beam limits, and discharge rates across Indian East Coast.',
      stats: [
        { label: 'Ports Mapped', value: 'Paradip, Vizag, Dhamra, Haldia' },
        { label: 'Vessel Classes', value: 'Handysize to Capesize' },
        { label: 'Demurrage Guard', value: 'Zero Over-Draft Risk' },
      ],
      points: [
        'Prevents draft violations by calculating maximum allowable arrival parcel size',
        'Evaluates daily discharge speeds (MT/day) and port turnaround waiting queues',
        'Computes tidal window adjustments for high-risk seasonal monsoon periods'
      ]
    },
    {
      id: 'contracts' as const,
      label: 'COA Contract Matrix',
      icon: FileCheck,
      badge: 'STRATEGY ENGINE',
      headline: 'Spot vs Short-Term vs Medium-Term COA',
      subhead: 'Mathematical expected-value contract optimizer with volume discount factoring.',
      stats: [
        { label: 'Multi-Voyage Savings', value: 'Up to 7.1% (₹7.1 Cr)' },
        { label: 'Laycan Windows', value: 'Automated 4–7 Day Timing' },
        { label: 'Hedging Ratio', value: 'Dynamic Spot/COA Split' },
      ],
      points: [
        'Compares total cost of single-voyage spot fixtures against 3-voyage and 6-voyage COAs',
        'Recommends optimal vessel charter entry windows based on forward curve slope',
        'Quantifies bunker fuel escalation pass-through formulas'
      ]
    },
    {
      id: 'simulation' as const,
      label: 'Real-Time Sensitivity Lab',
      icon: Sliders,
      badge: 'STRESS-TEST ENGINE',
      headline: 'Scenario What-If Simulation Suite',
      subhead: 'Interactive Monte Carlo sensitivity engine testing rate spikes, fuel volatility, and port delays.',
      stats: [
        { label: 'Freight Stress', value: '±30% Spot Volatility' },
        { label: 'Bunker Shock', value: '±50% VLSFO Shift' },
        { label: 'Queue Delays', value: '0 to 14 Days Demurrage' },
      ],
      points: [
        'Real-time recalculation of total voyage expenditures under market shocks',
        'Instant strategy re-ranking when market switches from contango to backwardation',
        'Exportable executive audit reports for procurement committee approval'
      ]
    }
  ];

  const currentTab = featureTabs.find(t => t.id === activeTab)!;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ENTERPRISE CAPABILITIES & QUANTITATIVE LAB</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Platform Architecture & Live Simulator
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Explore how FreightQuant translates complex stochastic freight models into physical navigation feasibility and contract optimization.
        </p>
      </motion.div>

      {/* 🌟 UNIQUE COMPONENT: Live Voyage Optimization Sandbox (Real-time Interactive Tool) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="bg-gradient-to-br from-[#070e1e] via-[#0b1633] to-[#040813] rounded-3xl p-8 sm:p-12 text-white border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 relative overflow-hidden space-y-8"
      >
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Interactive Decision Sandbox</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Live Voyage Cost & Draft Feasibility Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Select trade routes and vessel specifications to see instantaneous mathematical calculations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Open Full Platform Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          {/* Control 1: Corridor */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Maritime Corridor</span>
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value as any)}
              className="w-full bg-[#111f42] border border-[#1e3362] text-white text-xs font-medium rounded-xl p-3 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="haypoint-paradip">Hay Point (Aus) → Paradip (Coking Coal)</option>
              <option value="taboneo-vizag">Taboneo (Indo) → Vizag (Thermal Coal)</option>
              <option value="maputo-dhamra">Maputo (Moz) → Dhamra (Steam Coal)</option>
            </select>
          </div>

          {/* Control 2: Vessel Class */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vessel Geometric Sizing</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['supramax', 'panamax', 'capesize'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setSelectedVessel(v);
                    setCargoTonnage(vesselConfigs[v].capacityMt);
                  }}
                  className={`py-2.5 text-xs font-bold rounded-xl uppercase transition-all cursor-pointer ${
                    selectedVessel === v 
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                      : 'bg-[#111f42] text-slate-300 hover:bg-[#162852]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Control 3: Cargo Parcel Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cargo Parcel Size:</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">{cargoTonnage.toLocaleString()} MT</span>
            </div>
            <input
              type="range"
              min="30000"
              max={currentVessel.capacityMt}
              step="5000"
              value={cargoTonnage}
              onChange={(e) => setCargoTonnage(Number(e.target.value))}
              className="w-full h-2 bg-[#111f42] rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30,000 MT</span>
              <span>Max: {currentVessel.capacityMt.toLocaleString()} MT</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1: Port Draft Compatibility */}
          <div className="bg-[#0c1630] border border-[#1e3362] p-5 rounded-2xl space-y-2">
            <div className="text-[11px] text-slate-400 font-medium">Discharge Port Draft</div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold font-mono ${isDraftFeasible ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentVessel.draftM}m / {currentRoute.maxPortDraft}m
              </span>
            </div>
            <div className={`text-[11px] font-semibold flex items-center gap-1 ${isDraftFeasible ? 'text-emerald-400' : 'text-red-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isDraftFeasible ? 'Feasible (Zero Demurrage Risk)' : 'Draft Exceeded (Port Draft Limit)'}</span>
            </div>
          </div>

          {/* Card 2: Sea Transit Days */}
          <div className="bg-[#0c1630] border border-[#1e3362] p-5 rounded-2xl space-y-2">
            <div className="text-[11px] text-slate-400 font-medium">Voyage Duration</div>
            <div className="text-xl font-bold text-cyan-300 font-mono">
              {seaDaysOneWay} Days <span className="text-xs text-slate-400 font-normal">One-Way</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {roundTripDays} Days Round-Trip (+5D Berth)
            </div>
          </div>

          {/* Card 3: Total Spot Fixture Cost */}
          <div className="bg-[#0c1630] border border-[#1e3362] p-5 rounded-2xl space-y-2">
            <div className="text-[11px] text-slate-400 font-medium">Spot Single-Voyage Cost</div>
            <div className="text-xl font-bold text-white font-mono">
              ${(spotTotalCost / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              @ ${currentRoute.spotRatePerMt.toFixed(2)} / MT
            </div>
          </div>

          {/* Card 4: Medium-Term COA Net Savings */}
          <div className="bg-gradient-to-b from-[#102a45] to-[#0c1630] border border-cyan-500/50 p-5 rounded-2xl space-y-2 shadow-lg shadow-cyan-950/40">
            <div className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider">COA Multi-Voyage Savings</div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              ₹{netSavingsInrCr} Cr <span className="text-xs text-cyan-200 font-normal">({currentRoute.coaDiscountPct}%)</span>
            </div>
            <div className="text-[11px] text-cyan-300 font-medium">
              vs Unhedged Spot Volatility
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Feature Exploration Tabs */}
      <div className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Deep Dive</div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Explore Core Analytical Engines
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-5 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#070e1e] text-white border-blue-500 shadow-xl shadow-blue-500/10'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                </div>
                <div className="text-sm font-bold">{tab.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Detail Panel (Interactive Architecture Workspace) */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="bg-[#070e1e] rounded-2xl p-8 sm:p-12 text-white border border-[#1e3362] shadow-2xl space-y-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                MODULE 0{featureTabs.findIndex(t => t.id === activeTab) + 1} // {currentTab.badge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                {currentTab.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {currentTab.subhead}
              </p>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Open in Terminal Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1e3362]">
            {currentTab.stats.map((stat, idx) => (
              <div key={idx} className="bg-[#0c1630] border border-[#1e3362] p-5 rounded-xl space-y-1">
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                <div className="text-lg sm:text-xl font-bold text-cyan-300 font-mono">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Capability Checklist */}
          <div className="space-y-3 pt-4">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Key Capabilities:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTab.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#0a1226] p-4 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
