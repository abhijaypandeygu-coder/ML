import React, { useState, useEffect } from 'react';
import { 
  WhatIfSimulationParams, 
  CharterRecommendationResult, 
  CharterPlannerInput 
} from '../../types/freight';
import { runOptimizationEngine } from '../../services/charterEngine';
import { 
  Sliders, 
  RotateCcw, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  DollarSign, 
  Clock, 
  ShieldAlert,
  Ship,
  Sparkles
} from 'lucide-react';

interface WhatIfSimulatorProps {
  baseInput: CharterPlannerInput;
  baseRecommendation: CharterRecommendationResult;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  baseInput,
  baseRecommendation,
}) => {
  const [params, setParams] = useState<WhatIfSimulationParams>({
    freightRateShiftPct: 0,
    bunkerFuelShiftPct: 0,
    portDelayDays: 0,
    cargoQuantityShiftPct: 0,
    congestionSeverity: 'MEDIUM',
  });

  const [simResult, setSimResult] = useState<CharterRecommendationResult>(baseRecommendation);

  // Recalculate on any slider change
  useEffect(() => {
    const updated = runOptimizationEngine(baseInput, params);
    setSimResult(updated);
  }, [params, baseInput]);

  const handleReset = () => {
    setParams({
      freightRateShiftPct: 0,
      bunkerFuelShiftPct: 0,
      portDelayDays: 0,
      cargoQuantityShiftPct: 0,
      congestionSeverity: 'MEDIUM',
    });
  };

  const handlePreset = (type: 'spike-15' | 'monsoon-delay' | 'bunker-rally') => {
    if (type === 'spike-15') {
      setParams({
        freightRateShiftPct: 15,
        bunkerFuelShiftPct: 5,
        portDelayDays: 0,
        cargoQuantityShiftPct: 0,
        congestionSeverity: 'MEDIUM',
      });
    } else if (type === 'monsoon-delay') {
      setParams({
        freightRateShiftPct: 8,
        bunkerFuelShiftPct: 0,
        portDelayDays: 6,
        cargoQuantityShiftPct: 0,
        congestionSeverity: 'HIGH',
      });
    } else if (type === 'bunker-rally') {
      setParams({
        freightRateShiftPct: 5,
        bunkerFuelShiftPct: 35,
        portDelayDays: 1,
        cargoQuantityShiftPct: 0,
        congestionSeverity: 'MEDIUM',
      });
    }
  };

  const baseTotalCr = baseRecommendation.expectedTotalCostINRCrores;
  const simTotalCr = simResult.expectedTotalCostINRCrores;
  const costDiffCr = (simTotalCr - baseTotalCr).toFixed(2);
  const isCostHigher = Number(costDiffCr) > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="terminal-card p-4 flex flex-wrap items-center justify-between gap-4 border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              What-If Scenario Stress Testing & Sensitivity Simulator
            </h2>
            <p className="text-xs text-slate-400">
              Perturb macroeconomic freight rates, bunker prices, and port delays to inspect instantaneous decision changes.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">SIH Stress Presets:</span>
          <button
            onClick={() => handlePreset('spike-15')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>+15% Freight Surge</span>
          </button>
          <button
            onClick={() => handlePreset('monsoon-delay')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <span>Monsoon 6D Queue</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-[#111f42] text-slate-400 hover:text-white border border-[#1e3362] transition-colors cursor-pointer"
            title="Reset to Baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 terminal-card p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#1e3362] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Scenario Control Parameters
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">Live Solver Active</span>
          </div>

          {/* Slider 1: Freight Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Freight Rate Shift:</span>
              <span className={`font-mono font-bold ${
                params.freightRateShiftPct > 0 ? 'text-rose-400' : (params.freightRateShiftPct < 0 ? 'text-emerald-400' : 'text-slate-300')
              }`}>
                {params.freightRateShiftPct > 0 ? `+${params.freightRateShiftPct}%` : `${params.freightRateShiftPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={params.freightRateShiftPct}
              onChange={(e) => setParams({ ...params, freightRateShiftPct: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-30% (Bear market)</span>
              <span>0%</span>
              <span>+30% (Severe bull market)</span>
            </div>
          </div>

          {/* Slider 2: Bunker Fuel */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Bunker Fuel (VLSFO) Shift:</span>
              <span className={`font-mono font-bold ${
                params.bunkerFuelShiftPct > 0 ? 'text-amber-400' : (params.bunkerFuelShiftPct < 0 ? 'text-emerald-400' : 'text-slate-300')
              }`}>
                {params.bunkerFuelShiftPct > 0 ? `+${params.bunkerFuelShiftPct}%` : `${params.bunkerFuelShiftPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="2"
              value={params.bunkerFuelShiftPct}
              onChange={(e) => setParams({ ...params, bunkerFuelShiftPct: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-20% ($496/MT)</span>
              <span>Base ($620/MT)</span>
              <span>+50% ($930/MT)</span>
            </div>
          </div>

          {/* Slider 3: Port Delay */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Port Discharge Delay:</span>
              <span className={`font-mono font-bold ${
                params.portDelayDays > 0 ? 'text-amber-400' : 'text-slate-300'
              }`}>
                +{params.portDelayDays} Days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={params.portDelayDays}
              onChange={(e) => setParams({ ...params, portDelayDays: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 Days (Normal)</span>
              <span>7 Days (Monsoon)</span>
              <span>15 Days (Severe Congestion)</span>
            </div>
          </div>

          {/* Slider 4: Cargo Quantity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Cargo Quantity Perturbation:</span>
              <span className="font-mono font-bold text-cyan-300">
                {params.cargoQuantityShiftPct > 0 ? `+${params.cargoQuantityShiftPct}%` : `${params.cargoQuantityShiftPct}%`} ({(baseInput.cargoQuantityMT * (1 + params.cargoQuantityShiftPct / 100)).toLocaleString()} MT)
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={params.cargoQuantityShiftPct}
              onChange={(e) => setParams({ ...params, cargoQuantityShiftPct: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50% (50k MT)</span>
              <span>100,000 MT</span>
              <span>+50% (150k MT)</span>
            </div>
          </div>

          {/* Congestion Multiplier */}
          <div className="space-y-1.5">
            <label className="block text-xs text-slate-300 font-medium">Queue / Congestion Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setParams({ ...params, congestionSeverity: lvl })}
                  className={`py-1.5 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                    params.congestionSeverity === lvl
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-[#0c1630] text-slate-400 border-[#1e3362] hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Before vs After Impact Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="terminal-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e3362] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Before vs After Scenario Comparative Output
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Delta Evaluation
              </span>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Baseline (Before) */}
              <div className="bg-[#0c1630] border border-[#1e3362] p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-[#1e3362] pb-1.5">
                  <span className="text-xs font-bold text-slate-400">BASELINE PLAN</span>
                  <span className="text-[10px] font-mono text-slate-500">Unperturbed</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Optimal Vessel:</span>
                    <div className="font-bold text-slate-200 font-mono text-sm">
                      {baseRecommendation.recommendedVessel}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Recommended Window:</span>
                    <div className="font-semibold text-cyan-300 text-xs">
                      Next 4–7 Days
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Expected Total Cost:</span>
                    <div className="font-bold font-mono text-slate-200 text-sm">
                      ₹{baseTotalCr} Cr
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Risk Index:</span>
                    <div className="font-bold font-mono text-emerald-400">
                      {baseRecommendation.overallRisk} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulated (After) */}
              <div className="bg-[#0e224d] border border-cyan-500/60 p-4 rounded-lg space-y-3 shadow-lg shadow-cyan-950/40">
                <div className="flex items-center justify-between border-b border-cyan-800/80 pb-1.5">
                  <span className="text-xs font-bold text-cyan-300">SIMULATED SCENARIO</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">RECALCULATED</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Optimal Vessel:</span>
                    <div className="font-bold text-white font-mono text-sm flex items-center gap-1.5">
                      <span>{simResult.recommendedVessel}</span>
                      {simResult.recommendedVessel !== baseRecommendation.recommendedVessel && (
                        <span className="text-[9px] px-1 py-0.2 bg-amber-950 text-amber-300 border border-amber-700 rounded font-bold">
                          SHIFTED
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Recommended Window:</span>
                    <div className="font-semibold text-amber-300 text-xs">
                      {params.freightRateShiftPct > 10 
                        ? 'Next 2–4 Days (Urgent Pre-spike Fix)'
                        : (params.freightRateShiftPct < -10 ? 'Delay 10–14 Days (Wait for trough)' : 'Next 4–7 Days')}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Expected Total Cost:</span>
                    <div className="font-bold font-mono text-white text-sm flex items-center gap-1.5">
                      <span>₹{simTotalCr} Cr</span>
                      <span className={`text-[10px] font-bold ${isCostHigher ? 'text-rose-400' : 'text-emerald-400'}`}>
                        ({isCostHigher ? `+₹${costDiffCr}` : `₹${costDiffCr}`} Cr)
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Risk Index:</span>
                    <div className={`font-bold font-mono ${
                      simResult.overallRisk > 50 ? 'text-rose-400' : (simResult.overallRisk > 30 ? 'text-amber-400' : 'text-emerald-400')
                    }`}>
                      {simResult.overallRisk} / 100
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Dynamic Narrative */}
            <div className="bg-[#0a1128] border border-[#1e3362] p-3 rounded text-xs space-y-1">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                Adaptive Decision Shift Engine:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {params.freightRateShiftPct > 10 
                  ? `Freight shift (+${params.freightRateShiftPct}%) compresses optimal charter window from 7 days down to 2-4 days to avoid compounding spot inflation. Medium-Term COA savings expand to ${(simResult.expectedSavingsPct + 2.5).toFixed(1)}%.`
                  : (params.portDelayDays > 5
                    ? `Port delay of +${params.portDelayDays} days incurs an additional ₹${(params.portDelayDays * 0.45).toFixed(1)} Cr in demurrage buffer. Recommended to negotiate guaranteed laycan rate at Paradip.`
                    : 'System parameters remain within optimal stability bounds. Medium-Term Panamax COA delivers maximum cost efficiency.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
