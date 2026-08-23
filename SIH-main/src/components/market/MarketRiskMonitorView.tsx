import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle, 
  Anchor, 
  Globe, 
  Clock,
  Radio
} from 'lucide-react';

export const MarketRiskMonitorView: React.FC = () => {
  const marketIndices = [
    { name: 'Baltic Dry Index (BDI)', value: '1,845', change: '+6.2%', isUp: true, sub: 'Broad dry bulk sentiment' },
    { name: 'Baltic Panamax Index (BPI)', value: '1,680', change: '+8.4%', isUp: true, sub: 'Grain & Coal benchmark' },
    { name: 'Baltic Capesize Index (BCI)', value: '2,920', change: '+4.1%', isUp: true, sub: 'Iron ore benchmark' },
    { name: 'Singapore VLSFO 0.5%', value: '$624/MT', change: '+1.8%', isUp: true, sub: 'Bunker fuel cost' },
    { name: 'Newcastle Thermal Coal', value: '$138.5/MT', change: '-0.5%', isUp: false, sub: 'FOB Export Price' },
    { name: 'Brent Crude Oil', value: '$78.40/bbl', change: '+1.2%', isUp: true, sub: 'Energy input index' },
  ];

  const intelligenceTimeline = [
    {
      time: '2 hours ago',
      title: 'Port of Paradip Berth 8 Under Scheduled Conveyor Maintenance',
      severity: 'MEDIUM',
      impact: 'Average discharge turnaround temporarily expands by +0.8 days for gearless Panamax arrivals.',
      interpretation: 'Recommend pre-booking mechanized berth 4B or routing priority COA parcel.',
    },
    {
      time: '6 hours ago',
      title: 'Queensland Coal Terminal Reports Record Rail Shipments',
      severity: 'LOW',
      impact: 'Hay Point & Dalrymple Bay vessel queues reduced to 2.1 days.',
      interpretation: 'Optimal laycan window open with near-zero origin demurrage risk.',
    },
    {
      time: '14 hours ago',
      title: 'Bunker Fuel Surcharge Alert: Singapore High Sulfur Spread Expands',
      severity: 'MEDIUM',
      impact: 'VLSFO pricing stabilized at $620-630/MT range.',
      interpretation: 'Chartering engine holding VLSFO baseline estimate at $620/MT.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="terminal-card p-4 flex items-center justify-between border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Global Maritime Market & Disruption Intelligence Monitor
            </h2>
            <p className="text-xs text-slate-400">
              Live freight indices, commodity spot curves, fuel benchmarks, and port bottleneck signals.
            </p>
          </div>
        </div>
      </div>

      {/* Market Indices Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {marketIndices.map((idx, i) => (
          <div key={i} className="terminal-card p-3 space-y-1">
            <div className="text-[10px] text-slate-400 truncate">{idx.name}</div>
            <div className="text-lg font-black font-mono text-white">{idx.value}</div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-mono font-bold flex items-center ${idx.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {idx.change}
              </span>
              <span className="text-[9px] text-slate-500">7D</span>
            </div>
          </div>
        ))}
      </div>

      {/* Disruption Feed & Event Impact Timeline */}
      <div className="terminal-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e3362] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Operational Disruption Signals & Automated Interpretations
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time Feed
          </span>
        </div>

        <div className="space-y-3">
          {intelligenceTimeline.map((item, idx) => (
            <div key={idx} className="bg-[#0c1630] border border-[#1e3362] p-3.5 rounded-lg space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.severity === 'LOW' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {item.severity} IMPACT
                  </span>
                  <span className="text-xs font-bold text-slate-100">{item.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-400">Direct Impact: </span>
                {item.impact}
              </div>

              <div className="bg-[#0a1128] border border-[#1e3362] p-2 rounded text-[11px] text-cyan-300">
                <span className="font-semibold text-cyan-400">FreightQuant Interpretation: </span>
                {item.interpretation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
