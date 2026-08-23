import React, { useState } from 'react';
import { 
  CommoditySpec, 
  CharterPlannerInput,
  VesselClassType 
} from '../../types/freight';
import { COMMODITIES, ORIGIN_COUNTRIES, PORTS, VESSEL_CLASSES } from '../../data/maritimeData';
import { 
  Compass, 
  ArrowRight, 
  Layers, 
  Anchor, 
  MapPin, 
  Calendar, 
  Fuel, 
  ShieldAlert, 
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';

interface CharterPlannerProps {
  initialValues: CharterPlannerInput;
  onAnalyze: (values: CharterPlannerInput) => void;
  isCalculating: boolean;
}

export const CharterPlanner: React.FC<CharterPlannerProps> = ({
  initialValues,
  onAnalyze,
  isCalculating,
}) => {
  const [form, setForm] = useState<CharterPlannerInput>(initialValues);

  // Available loading ports based on selected origin country
  const filteredOriginPorts = PORTS.filter(
    p => p.isOrigin && p.country === form.originCountry
  );

  // Destination ports (Indian East Coast)
  const destinationPorts = PORTS.filter(p => !p.isOrigin);

  const handleCountryChange = (country: string) => {
    const defaultPort = PORTS.find(p => p.isOrigin && p.country === country)?.id || 'port-hay-point';
    setForm({
      ...form,
      originCountry: country,
      originPortId: defaultPort,
    });
  };

  const handleLoadPreset = (type: 'coal-sih' | 'iron-ore' | 'us-coal') => {
    if (type === 'coal-sih') {
      setForm({
        commodity: 'Premium Coking Coal',
        cargoQuantityMT: 100000,
        originCountry: 'Australia',
        originPortId: 'port-hay-point',
        destPortId: 'port-paradip',
        laycanStart: '2026-08-27',
        deliveryDeadline: '2026-09-26',
        contractHorizonMonths: 3,
        expectedVoyagesCount: 2,
        preferredVesselClass: 'Panamax',
        maxAcceptableFreightUSD: 32.0,
        riskTolerance: 'BALANCED',
        fuelPriceAssumptionUSD: 620,
        urgency: 'NORMAL',
      });
    } else if (type === 'iron-ore') {
      setForm({
        commodity: 'Iron Ore Fines (Fe 62%)',
        cargoQuantityMT: 140000,
        originCountry: 'Australia',
        originPortId: 'port-hay-point',
        destPortId: 'port-gangavaram',
        laycanStart: '2026-09-01',
        deliveryDeadline: '2026-09-30',
        contractHorizonMonths: 6,
        expectedVoyagesCount: 2,
        preferredVesselClass: 'Capesize',
        maxAcceptableFreightUSD: 24.0,
        riskTolerance: 'CONSERVATIVE',
        fuelPriceAssumptionUSD: 615,
        urgency: 'NORMAL',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(form);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & SIH Quick Presets */}
      <div className="terminal-card p-4 flex flex-wrap items-center justify-between gap-4 border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Procurement & Chartering Requirement Specification
            </h2>
            <p className="text-xs text-slate-400">
              Configure cargo parcel, loading laycan, Indian discharge port constraints, and risk preferences.
            </p>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">SIH 26006 Test Cases:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset('coal-sih')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-950 text-cyan-300 border border-cyan-700/80 hover:bg-cyan-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>SIH Benchmark: Coal 100k MT (Aus → Paradip)</span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('iron-ore')}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#111f42] text-slate-300 border border-[#1e3362] hover:bg-[#162852] transition-colors cursor-pointer"
          >
            <span>Capesize Iron Ore 140k MT</span>
          </button>
        </div>
      </div>

      {/* Guided Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Cargo & Volume */}
          <div className="terminal-card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3362] pb-2.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                1. Cargo & Volume Profile
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Commodity Specification</label>
                <select
                  value={form.commodity}
                  onChange={(e) => setForm({ ...form, commodity: e.target.value })}
                  className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  {COMMODITIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-400 font-medium">Total Cargo Parcel Quantity</label>
                  <span className="font-mono text-cyan-300 font-bold">{form.cargoQuantityMT.toLocaleString()} MT</span>
                </div>
                <input
                  type="number"
                  step="5000"
                  min="20000"
                  max="300000"
                  value={form.cargoQuantityMT}
                  onChange={(e) => setForm({ ...form, cargoQuantityMT: Number(e.target.value) })}
                  className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-3 py-2 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Typical Capesize ~150k MT | Panamax ~75k MT | Supramax ~55k MT
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Laycan Start</label>
                  <input
                    type="date"
                    value={form.laycanStart}
                    onChange={(e) => setForm({ ...form, laycanStart: e.target.value })}
                    className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Delivery Deadline</label>
                  <input
                    type="date"
                    value={form.deliveryDeadline}
                    onChange={(e) => setForm({ ...form, deliveryDeadline: e.target.value })}
                    className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Contract Horizon</label>
                  <select
                    value={form.contractHorizonMonths}
                    onChange={(e) => setForm({ ...form, contractHorizonMonths: Number(e.target.value) })}
                    className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-2.5 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={1}>1 Month (Spot / Prompt)</option>
                    <option value={3}>3 Months (Quarterly COA)</option>
                    <option value={6}>6 Months (Multi-Voyage)</option>
                    <option value={12}>12 Months (Annual Contract)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Expected Voyages</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={form.expectedVoyagesCount}
                    onChange={(e) => setForm({ ...form, expectedVoyagesCount: Number(e.target.value) })}
                    className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-2.5 py-2 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Origin & Indian Discharge Port */}
          <div className="terminal-card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3362] pb-2.5">
              <Anchor className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                2. Origin & Discharge Corridor
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Origin Exporting Country</label>
                <select
                  value={form.originCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  {ORIGIN_COUNTRIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Origin Loading Port Terminal</label>
                <select
                  value={form.originPortId}
                  onChange={(e) => setForm({ ...form, originPortId: e.target.value })}
                  className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  {filteredOriginPorts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Max Draft: {p.maxDraft}m, Handling: {p.avgHandlingRateTPD.toLocaleString()} TPD)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-[#1e3362]">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-cyan-300 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Indian East Coast Discharge Port
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">SIH Focus</span>
                </div>
                <select
                  value={form.destPortId}
                  onChange={(e) => setForm({ ...form, destPortId: e.target.value })}
                  className="w-full bg-[#0c1630] border border-cyan-700/60 rounded px-3 py-2 text-slate-100 font-semibold focus:border-cyan-400 focus:outline-none"
                >
                  {destinationPorts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Draft: {p.maxDraft}m, LOA: {p.maxLOA}m ({p.currentCongestionLevel} Queue)
                    </option>
                  ))}
                </select>
                <div className="mt-2 bg-[#0a1128] border border-[#1e3362] p-2 rounded text-[11px] text-slate-400">
                  Selected Port Constraints: <span className="text-slate-200 font-mono">
                    {PORTS.find(p => p.id === form.destPortId)?.channelRestrictions || 'Standard East Coast Navigation Parameters.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Preferences & Optimization Constraints */}
          <div className="terminal-card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1e3362] pb-2.5">
              <Fuel className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                3. Strategy & Economic Assumptions
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Preferred Vessel Candidate</label>
                <select
                  value={form.preferredVesselClass}
                  onChange={(e) => setForm({ ...form, preferredVesselClass: e.target.value as any })}
                  className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="ANY">Auto-Optimize (All Vessel Classes)</option>
                  {VESSEL_CLASSES.map(v => (
                    <option key={v.id} value={v.id}>{v.name} (~{v.typicalDWT.toLocaleString()} DWT)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Bunker Fuel (VLSFO)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={form.fuelPriceAssumptionUSD}
                      onChange={(e) => setForm({ ...form, fuelPriceAssumptionUSD: Number(e.target.value) })}
                      className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-2.5 py-1.5 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">$/MT</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Max Freight Cap</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={form.maxAcceptableFreightUSD || 32}
                      onChange={(e) => setForm({ ...form, maxAcceptableFreightUSD: Number(e.target.value) })}
                      className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-2.5 py-1.5 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-slate-500 font-mono">$/MT</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Risk Appetite</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, riskTolerance: r })}
                      className={`py-1.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                        form.riskTolerance === r
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-[#0c1630] text-slate-400 border-[#1e3362] hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Procurement Urgency</label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value as any })}
                  className="w-full bg-[#0c1630] border border-[#1e3362] rounded px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="NORMAL">Standard Schedule</option>
                  <option value="HIGH">High (Within 14 Days)</option>
                  <option value="CRITICAL">Critical Stockout Risk (Prompt Laycan)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-900/40 via-[#111f42] to-cyan-950/40 border border-cyan-500/40 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            <div className="text-xs">
              <span className="text-slate-300 font-semibold">Ready for Quantitative Optimization: </span>
              <span className="text-slate-400">
                Solves draft geometry, forward rate contango, bunker burn, and COA discount matrix.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Solving Constraints...</span>
              </>
            ) : (
              <>
                <span>Analyze Charter Strategy</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
