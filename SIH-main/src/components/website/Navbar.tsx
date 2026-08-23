import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  ChevronRight, 
  Menu, 
  X, 
  BarChart3, 
  Activity, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Compass, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';

export type MainNavPage = 
  | 'home' 
  | 'services' 
  | 'methodology' 
  | 'features' 
  | 'dashboard' 
  | 'about' 
  | 'contact';

interface NavbarProps {
  activePage: MainNavPage;
  onNavigate: (page: MainNavPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: MainNavPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'features', label: 'Features' },
    { id: 'dashboard', label: 'Platform Dashboard' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#070e1e]/95 backdrop-blur-md border-b border-[#1e3362] shadow-lg shadow-black/20 py-3' 
          : 'bg-[#070e1e] border-b border-[#1e3362]/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                FREIGHTQUANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-normal font-normal">
              Maritime Intelligence Platform
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer rounded-md ${
                  isActive 
                    ? 'text-blue-400 font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-[#111f42]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-blue-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
          >
            Explore Services
          </button>
          
          <button
            onClick={() => onNavigate('features')}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explore Platform</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-[#111f42]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c1630] border-b border-[#1e3362] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                activePage === link.id 
                  ? 'bg-blue-600/20 text-blue-400 font-semibold' 
                  : 'text-slate-300 hover:bg-[#111f42]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#1e3362] flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold text-center"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
