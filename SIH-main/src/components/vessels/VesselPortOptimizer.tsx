import React, { useState } from 'react';
import { VesselCandidateAnalysis, PortSpec } from '../../types/freight';
import { PORTS, VESSEL_CLASSES } from '../../data/maritimeData';
import { 
  Ship, 
  Anchor, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface VesselPortOptimizerProps {
  candidates: VesselCandidateAnalysis[];
  destPortId: string;
}

export const VesselPortOptimizer: React.FC<VesselPortOptimizerProps> = ({
  candidates,
  destPortId,
}) => {
  const [selectedPortId, setSelectedPortId] = useState<string>(destPortId);
  const selectedPort = PORTS.find(p => p.id === selectedPortId) || PORTS[6];

  const getStatusBadge = (status: 'PASS' | 'WARNING' | 'INCOMPATIBLE') => {
    if (status === 'PASS') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
          <CheckCircle className="w-2.5 h-2.5" />
          PASS
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5" />
          WARNING
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
        <XCircle className="w-2.5 h-2.5" />
        INCOMPATIBLE
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="terminal-card p-4 flex items-center justify-between border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Vessel Sizing & Port Geometric Compatibility Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates draft clearance, LOA/Beam physical berth envelopes, and Indian East Coast cargo handling rates.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Comparison Table */}
      <div className="terminal-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e3362] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Candidate Vessel Class Performance Ranking
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Discharge Port: <span className="text-cyan-300 font-bold">{selectedPort.name}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e3362] text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Vessel Class</th>
                <th className="py-2.5 px-3">Typical DWT</th>
                <th className="py-2.5 px-3">Draft / LOA</th>
                <th className="py-2.5 px-3">Port Clearance</th>
                <th className="py-2.5 px-3 text-right">Est. Freight / MT</th>
                <th className="py-2.5 px-3 text-right">Total Cost (₹ Cr)</th>
                <th className="py-2.5 px-3 text-center">Turnaround</th>
                <th className="py-2.5 px-3 text-center">Idle Risk</th>
                <th className="py-2.5 px-3 text-right">Feasibility Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162852]">
              {candidates.map((c) => {
                return (
                  <tr 
                    key={c.vesselClass}
                    className={`transition-colors ${
                      c.isRecommended 
                        ? 'bg-blue-950/40 border-l-4 border-l-cyan-400' 
                        : 'hover:bg-[#0c1630]'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{c.vesselClass}</span>
                        {c.isRecommended && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {c.dwtCapacity.toLocaleString()} MT
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {c.draft}m / {c.loa}m
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {getStatusBadge(c.destFit)}
                        </div>
                        <div className="text-[10px] text-slate-400 max-w-xs truncate">
                          {c.destFitReason}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      ${c.estimatedFreightPerMT}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                      ₹{c.totalCostINRCrores} Cr
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {c.turnaroundDays} d
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        c.idleRisk === 'LOW' ? 'text-emerald-400 bg-emerald-950' : (c.idleRisk === 'MEDIUM' ? 'text-amber-400 bg-amber-950' : 'text-rose-400 bg-rose-950')
                      }`}>
                        {c.idleRisk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-sm font-black font-mono ${
                        c.isRecommended ? 'text-cyan-300' : (c.overallScore > 75 ? 'text-emerald-400' : 'text-slate-400')
                      }`}>
                        {c.overallScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Port Physical Constraints Explorer */}
      <div className="terminal-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e3362] pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-cyan-400" />
              Indian East Coast Port Navigation Envelope
            </h3>
            <p className="text-xs text-slate-400">
              Interactive constraint parameters across Paradip, Visakhapatnam, Gangavaram, Gopalpur, Dhamra, and Haldia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Port:</span>
            <select
              value={selectedPortId}
              onChange={(e) => setSelectedPortId(e.target.value)}
              className="bg-[#0c1630] border border-[#1e3362] rounded px-3 py-1.5 text-xs text-cyan-300 font-semibold focus:border-cyan-400 focus:outline-none"
            >
              {PORTS.filter(p => !p.isOrigin).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#0c1630] border border-[#1e3362] p-3 rounded">
            <div className="text-[11px] text-slate-400 font-medium">Max Permissible Draft</div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
              {selectedPort.maxDraft} <span className="text-xs text-slate-400 font-normal">meters</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Channel depth at CD</div>
          </div>

          <div className="bg-[#0c1630] border border-[#1e3362] p-3 rounded">
            <div className="text-[11px] text-slate-400 font-medium">Max Length Overall (LOA)</div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
              {selectedPort.maxLOA} <span className="text-xs text-slate-400 font-normal">meters</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Berth pocket envelope</div>
          </div>

          <div className="bg-[#0c1630] border border-[#1e3362] p-3 rounded">
            <div className="text-[11px] text-slate-400 font-medium">Avg Handling Discharge Rate</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {selectedPort.avgHandlingRateTPD.toLocaleString()} <span className="text-xs text-slate-400 font-normal">TPD</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Tons per calendar day</div>
          </div>

          <div className="bg-[#0c1630] border border-[#1e3362] p-3 rounded">
            <div className="text-[11px] text-slate-400 font-medium">Current Queue & Congestion</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1 flex items-center justify-between">
              <span>{selectedPort.avgWaitDays} days</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300">
                {selectedPort.currentCongestionLevel}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{selectedPort.berthCount} operational bulk berths</div>
          </div>
        </div>

        {selectedPort.channelRestrictions && (
          <div className="bg-[#0a1128] border border-blue-900/60 p-3 rounded flex items-start gap-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-300">Port Operations Bulletin: </span>
              {selectedPort.channelRestrictions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
