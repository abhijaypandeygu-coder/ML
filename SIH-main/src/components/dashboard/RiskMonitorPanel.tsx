import React from 'react';
import { RiskEvaluation } from '../../types/freight';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Anchor, 
  Clock, 
  FileText 
} from 'lucide-react';

interface RiskMonitorPanelProps {
  risk: RiskEvaluation;
}

export const RiskMonitorPanel: React.FC<RiskMonitorPanelProps> = ({ risk }) => {
  const getBadge = (level: 'LOW' | 'MEDIUM' | 'HIGH' | 'PASS' | 'WARNING' | 'INCOMPATIBLE') => {
    if (level === 'LOW' || level === 'PASS') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
          <CheckCircle className="w-2.5 h-2.5" />
          {level}
        </span>
      );
    }
    if (level === 'MEDIUM' || level === 'WARNING') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5" />
          {level}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800 flex items-center gap-1">
        <XCircle className="w-2.5 h-2.5" />
        {level}
      </span>
    );
  };

  const riskFactors = [
    {
      title: 'Freight Rate Volatility Risk',
      icon: Activity,
      level: risk.freightRisk,
      score: risk.freightRiskScore,
      reason: risk.freightRiskReason,
    },
    {
      title: 'Port Congestion & Turnaround',
      icon: Anchor,
      level: risk.portCongestionRisk,
      score: risk.portCongestionScore,
      reason: risk.portCongestionReason,
    },
    {
      title: 'Vessel Geometric Compatibility',
      icon: ShieldCheck,
      level: risk.vesselCompatibilityRisk,
      score: risk.vesselCompatibilityScore,
      reason: risk.vesselCompatibilityReason,
    },
    {
      title: 'Weather & Delay Demurrage',
      icon: Clock,
      level: risk.delayRisk,
      score: risk.delayRiskScore,
      reason: risk.delayRiskReason,
    },
    {
      title: 'Contract Market Exposure',
      icon: FileText,
      level: risk.contractExposureRisk,
      score: risk.contractExposureScore,
      reason: risk.contractExposureReason,
    },
  ];

  return (
    <div className="terminal-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e3362] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              Quantitative Risk & Compliance Monitor
            </h3>
            <p className="text-xs text-slate-400">
              Multi-factor risk indexing across freight volatility, draft constraints, and demurrage.
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Composite Risk:</span>
            <span className="text-base font-black font-mono text-emerald-400">
              {risk.overallScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-400/90 font-medium">Low Exposure Tier</span>
        </div>
      </div>

      {/* Grid of Risk Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {riskFactors.map((rf, idx) => {
          const Icon = rf.icon;
          return (
            <div key={idx} className="bg-[#0c1630] border border-[#1e3362] p-3 rounded space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">{rf.title}</span>
                </div>
                {getBadge(rf.level)}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {rf.reason}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
