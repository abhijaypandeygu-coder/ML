import React from 'react';

export const HeroShipVisual: React.FC = () => {
  return (
    <div className="relative w-full max-w-[560px] mx-auto flex items-center justify-center pointer-events-none select-none">
      {/* Soft Water Ambient Glow at Hull Base */}
      <div className="absolute bottom-2 w-4/5 h-10 bg-cyan-500/15 blur-2xl rounded-full"></div>

      <svg
        className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
        viewBox="0 0 700 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hullDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="superstructureWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="cargoHatch" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="keelRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          <linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Bulbous Bow & Keel Waterline (Complete Side Profile) */}
        <path
          d="M 50 205 L 610 205 Q 655 205 670 190 L 660 225 Q 625 242 560 242 L 100 242 Q 40 242 35 220 Z"
          fill="url(#keelRed)"
        />

        {/* 2. Main High-Tensile Steel Hull */}
        <path
          d="M 40 150 L 620 150 Q 665 150 680 120 L 670 190 Q 655 205 610 205 L 50 205 Q 30 185 35 160 Z"
          fill="url(#hullDark)"
          stroke="#334155"
          strokeWidth="1.5"
        />

        {/* 3. 7 Cargo Holds & Hatches (Fully Visible Panamax Configuration) */}
        {[100, 168, 236, 304, 372, 440, 508].map((x, i) => (
          <g key={i}>
            <rect
              x={x}
              y="138"
              width="54"
              height="14"
              rx="2.5"
              fill="url(#cargoHatch)"
              stroke="#64748b"
              strokeWidth="1.2"
            />
            {/* Hatch Cover Ridge */}
            <line x1={x + 6} y1="145" x2={x + 48} y2="145" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" />
          </g>
        ))}

        {/* 4. Electro-Hydraulic Deck Cranes */}
        {[145, 280, 415, 550].map((cx, idx) => (
          <g key={idx} opacity="0.9">
            <rect x={cx} y="112" width="7" height="26" fill="#64748b" rx="1.5" />
            <line x1={cx + 3.5} y1="114" x2={cx + 52} y2="100" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" />
            <line x1={cx + 3.5} y1="114" x2={cx - 18} y2="105" stroke="#64748b" strokeWidth="1.5" />
          </g>
        ))}

        {/* 5. Aft Accommodations Tower & Navigation Bridge (Complete Structure) */}
        <g transform="translate(48, 62)">
          {/* Main 5-Tier Tower Block */}
          <path d="M 12 88 L 12 24 L 56 24 L 56 88 Z" fill="url(#superstructureWhite)" stroke="#cbd5e1" strokeWidth="1.2" />
          
          {/* Bridge Wings & Windows */}
          <rect x="6" y="16" width="56" height="14" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          {[12, 22, 32, 42, 52].map((wx, wi) => (
            <rect key={wi} x={wx} y="20" width="6" height="6" rx="0.5" fill="#0284c7" />
          ))}

          {/* Main Exhaust Funnel with Blue Company Band */}
          <rect x="4" y="36" width="12" height="34" fill="#1e293b" rx="1.5" />
          <rect x="4" y="44" width="12" height="6" fill="#2563eb" />

          {/* Radar Communication Mast */}
          <line x1="34" y1="16" x2="34" y2="-12" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="24" y1="-4" x2="44" y2="-4" stroke="#94a3b8" strokeWidth="1.75" />
          <circle cx="34" cy="-12" r="3" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '2.5s' }} />
        </g>

        {/* 6. Waterline Wave Wake */}
        <path
          d="M 20 208 Q 350 216 680 208"
          stroke="url(#waterFlow)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* 7. Clear Technical Callout (Clean Crisp Font) */}
        <g transform="translate(540, 230)">
          <rect x="-6" y="-10" width="112" height="16" rx="3" fill="#070e1e" stroke="#1e3362" strokeWidth="0.75" />
          <text x="0" y="2" fill="#38bdf8" fontSize="8.5" fontFamily="Inter, sans-serif" fontWeight="700" letterSpacing="0.5">
            PANAMAX • 76k DWT
          </text>
        </g>
      </svg>
    </div>
  );
};
