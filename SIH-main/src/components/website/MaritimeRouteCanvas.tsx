import React from 'react';

export const MaritimeRouteCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="maritimeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="0.75" />
          </pattern>

          {/* Route Gradients */}
          <linearGradient id="routeGradientAus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="routeGradientUS" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="routeGradientIndo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#maritimeGrid)" />

        {/* Global Hub Nodes - Repositioned Away from Title and KPI text */}
        {/* India East Coast Destination Hub (Paradip / Vizag) */}
        <g transform="translate(720, 180)">
          <circle r="14" fill="rgba(6, 182, 212, 0.1)" className="animate-ping" style={{ animationDuration: '3.5s' }} />
          <circle r="6" fill="#06b6d4" fillOpacity="0.25" />
          <circle r="3.5" fill="#38bdf8" filter="url(#glow)" />
          <text x="10" y="3" fill="#38bdf8" fontSize="9" fontFamily="Inter, monospace" fontWeight="600" letterSpacing="0.4">
            INDIA (PARADIP)
          </text>
        </g>

        {/* Australia (Hay Point / Dalrymple Bay) */}
        <g transform="translate(920, 380)">
          <circle r="4" fill="#3b82f6" />
          <circle r="2" fill="#93c5fd" />
          <text x="-80" y="3" fill="#64748b" fontSize="8" fontFamily="Inter, monospace">
            HAY POINT (AU)
          </text>
        </g>

        {/* Indonesia (Taboneo) */}
        <g transform="translate(830, 270)">
          <circle r="3.5" fill="#10b981" />
          <circle r="1.8" fill="#a7f3d0" />
          <text x="8" y="3" fill="#64748b" fontSize="8" fontFamily="Inter, monospace">
            TABONEO (ID)
          </text>
        </g>

        {/* Mozambique (Maputo) */}
        <g transform="translate(560, 360)">
          <circle r="3.5" fill="#f59e0b" />
          <circle r="1.8" fill="#fde68a" />
          <text x="-65" y="3" fill="#64748b" fontSize="8" fontFamily="Inter, monospace">
            MAPUTO (MZ)
          </text>
        </g>

        {/* Primary Maritime Curved Route Lines */}
        {/* Route 1: Australia -> India */}
        <path
          d="M 920 380 Q 840 290 720 180"
          stroke="url(#routeGradientAus)"
          strokeWidth="1.75"
          strokeDasharray="5 4"
          fill="none"
          filter="url(#glow)"
        />

        {/* Route 2: Indonesia -> India */}
        <path
          d="M 830 270 Q 770 220 720 180"
          stroke="url(#routeGradientIndo)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Route 3: Mozambique -> India */}
        <path
          d="M 560 360 Q 640 270 720 180"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Moving Particles along Route 1 (Australia to Paradip) */}
        <circle r="3" fill="#38bdf8" filter="url(#glow)">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 920 380 Q 840 290 720 180" />
        </circle>
        <circle r="1.5" fill="#ffffff">
          <animateMotion dur="5s" repeatCount="indefinite" path="M 920 380 Q 840 290 720 180" />
        </circle>

        {/* Moving Particle along Route 2 (Indonesia) */}
        <circle r="2" fill="#10b981">
          <animateMotion dur="4s" repeatCount="indefinite" path="M 830 270 Q 770 220 720 180" />
        </circle>

        {/* Moving Particle along Route 3 (Mozambique) */}
        <circle r="2" fill="#f59e0b">
          <animateMotion dur="6.5s" repeatCount="indefinite" path="M 560 360 Q 640 270 720 180" />
        </circle>
      </svg>
    </div>
  );
};
