import React from 'react';
import { Anchor, Mail, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { MainNavPage } from './Navbar';

interface FooterProps {
  onNavigate: (page: MainNavPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#070e1e] text-white border-t border-[#1e3362] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <Anchor className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">FREIGHTQUANT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise AI maritime analytics and quantitative decision intelligence platform.
            </p>
            <div className="text-[11px] font-mono text-blue-400">
              SIH 2026 Problem Statement 26006
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Navigation</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">Home</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-white cursor-pointer">Services</button></li>
              <li><button onClick={() => onNavigate('methodology')} className="hover:text-white cursor-pointer">Methodology</button></li>
              <li><button onClick={() => onNavigate('features')} className="hover:text-white cursor-pointer">Features</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-white cursor-pointer">About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">Contact</button></li>
            </ul>
          </div>

          {/* Col 3: Terminal Modules */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Decision Engine</div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">Charter Planner</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">Forecast Forward Curve</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">Port Compatibility Solver</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">COA Trade-off Matrix</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">What-If Simulator</button></li>
            </ul>
          </div>

          {/* Col 4: Platform Focus */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Corridor Coverage</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimized for East Coast India discharge terminals including Paradip, Visakhapatnam, Gangavaram, Dhamra, and Haldia.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1e3362] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 FreightQuant Maritime Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with Precision for SIH 2026</span>
            <span>•</span>
            <span>Deterministic Optimization</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
