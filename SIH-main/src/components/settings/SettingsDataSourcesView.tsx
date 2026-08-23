import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Server, 
  CheckCircle, 
  Code, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';

export const SettingsDataSourcesView: React.FC = () => {
  const [currencyRate, setCurrencyRate] = useState(83.5);

  const endpoints = [
    { method: 'POST', path: '/api/analyze-charter', desc: 'Runs end-to-end multi-objective chartering and contract optimization solver.' },
    { method: 'GET', path: '/api/forecast?horizon=30D', desc: 'Returns DeepAR probabilistic freight forward curve with 80%/95% confidence intervals.' },
    { method: 'GET', path: '/api/ports', desc: 'Returns Indian East Coast port drafts, LOA limits, handling rates, and live wait queues.' },
    { method: 'GET', path: '/api/vessels', desc: 'Returns technical specs, fuel burn tables, and deadweight classes.' },
    { method: 'POST', path: '/api/simulate', desc: 'Evaluates real-time What-If sensitivity perturbations against baseline recommendations.' },
    { method: 'GET', path: '/api/model-performance', desc: 'Returns backtest MAE, RMSE, directional accuracy, and Shapley feature attribution.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="terminal-card p-4 flex items-center justify-between border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              System Configuration & Data Pipeline Integration
            </h2>
            <p className="text-xs text-slate-400">
              Manage data ingestion pipelines and production REST API endpoints.
            </p>
          </div>
        </div>
      </div>

      {/* Modes & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="terminal-card p-5 space-y-4">
          <div className="border-b border-[#1e3362] pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Data Mode & Live Ingestion
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Live Connected
            </span>
          </div>

          <div className="space-y-3 text-xs">

            <div className="p-3 rounded bg-[#0c1630] border border-[#1e3362] space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-100">USD / INR Conversion Peg</span>
                <span className="font-mono font-bold text-cyan-300">₹{currencyRate} / $</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={currencyRate}
                onChange={(e) => setCurrencyRate(Number(e.target.value))}
                className="w-full bg-[#070d1e] border border-[#1e3362] rounded px-3 py-1.5 text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="terminal-card p-5 space-y-4">
          <div className="border-b border-[#1e3362] pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Architecture & Extensibility
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <p>
              FreightQuant separates the quantitative optimization and machine learning layers from UI state management.
            </p>
            <div className="bg-[#070d1e] p-3 rounded border border-[#1e3362] space-y-1.5 font-mono text-[11px]">
              <div className="text-cyan-400 font-semibold">// Pipeline Flow:</div>
              <div className="text-slate-400">1. Ingest Baltic Exchange / Platts Fixtures</div>
              <div className="text-slate-400">2. DeepAR Probabilistic Inference (30D Horizon)</div>
              <div className="text-slate-400">3. Port Geometry & Draft Constraint Solver</div>
              <div className="text-slate-400">4. Multi-Voyage vs Spot COA Optimization Engine</div>
            </div>
          </div>
        </div>
      </div>

      {/* REST API Endpoints Table */}
      <div className="terminal-card p-5 space-y-4">
        <div className="border-b border-[#1e3362] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            Backend REST API Specification (Pluggable Microservice)
          </h3>
          <p className="text-xs text-slate-400">
            Fully typed endpoints allowing live backend ML containers to plug directly into the frontend.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#1e3362] text-slate-400">
                <th className="py-2 px-3">Method</th>
                <th className="py-2 px-3">Endpoint Route</th>
                <th className="py-2 px-3 font-sans">Description</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162852]">
              {endpoints.map((ep, i) => (
                <tr key={i} className="hover:bg-[#0c1630]">
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.method === 'POST' ? 'bg-blue-950 text-cyan-400 border border-blue-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-bold">{ep.path}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans text-[11px]">{ep.desc}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-emerald-400 text-[10px] flex items-center justify-end gap-1 font-bold">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
