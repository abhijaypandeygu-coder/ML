import React from 'react';
import { 
  BarChart3, 
  Compass, 
  TrendingUp, 
  Ship, 
  FileCheck2, 
  Sliders, 
  Activity, 
  Cpu, 
  Settings,
  Anchor,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type NavPage = 
  | 'dashboard' 
  | 'planner' 
  | 'forecast' 
  | 'vessels' 
  | 'strategy' 
  | 'simulator' 
  | 'market' 
  | 'performance' 
  | 'settings';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  isAnalyzed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isAnalyzed }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Terminal', icon: BarChart3, badge: 'Live' },
    { id: 'planner', label: 'Charter Planner', icon: Compass, badge: 'Workflow' },
    { id: 'forecast', label: 'Freight Forecasting', icon: TrendingUp, badge: 'ML 30D' },
    { id: 'vessels', label: 'Vessel & Port Engine', icon: Ship, badge: 'Indian Ports' },
    { id: 'strategy', label: 'Charter Strategy', icon: FileCheck2, highlight: isAnalyzed, badge: isAnalyzed ? 'Ready' : undefined },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, badge: 'Realtime' },
    { id: 'market', label: 'Market & Risk Monitor', icon: Activity },
    { id: 'performance', label: 'Model Transparency', icon: Cpu },
    { id: 'settings', label: 'Data Sources & API', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#070d1e] border-r border-[#1e3362] flex flex-col h-screen shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1e3362] flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Anchor className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              FreightQuant
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
              SIH 26006
            </span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-tight font-medium">
            Maritime Quant & Chartering
          </p>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Decision Engine
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavPage)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111f42]'
              } ${item.highlight && !isActive ? 'animate-pulse text-emerald-400 border border-emerald-500/30' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300' 
                      : item.highlight
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'bg-[#162852] text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-cyan-400' : 'text-slate-500'}`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Status / SIH Problem Statement Card */}
      <div className="p-3 border-t border-[#1e3362] bg-[#0c1630]">
        <div className="p-2.5 rounded-md bg-[#111f42]/70 border border-[#1e3362] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-cyan-400" />
              Engine Status
            </span>
            <span className="text-emerald-400 font-mono font-bold text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              ONLINE
            </span>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            Optimized for <span className="text-slate-200 font-medium">SAIL / CIL</span> East Coast bulk procurement & COA multi-voyages.
          </div>
        </div>
      </div>
    </aside>
  );
};
