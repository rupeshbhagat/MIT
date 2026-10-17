import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export const MitLogo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  light = false 
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* University Crest SVG */}
      <div className={`relative ${sizeMap[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#8B0000] via-[#9B111E] to-[#590000] p-1.5 shadow-md shadow-[#8B0000]/25 flex items-center justify-center border border-[#D97706]/40`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full text-white"
        >
          {/* Iconic Vishwashanti Dome & Knowledge Torch */}
          {/* Base pedestal */}
          <path d="M20 85H80V89H20V85Z" fill="#F59E0B" />
          <path d="M26 80H74V83H26V80Z" fill="#FDE68A" />
          
          {/* Classical Temple Pillars */}
          <path d="M30 54H34V78H30V54Z" fill="white" />
          <path d="M48 54H52V78H48V54Z" fill="white" />
          <path d="M66 54H70V78H66V54Z" fill="white" />
          
          {/* Central Dome Arch */}
          <path 
            d="M24 52C24 38 35 27 50 27C65 27 76 38 76 52H24Z" 
            fill="white" 
            fillOpacity="0.95" 
          />
          {/* Dome Ribs */}
          <path d="M50 27V52" stroke="#8B0000" strokeWidth="2.5" />
          <path d="M37 32C42 38 43 45 43 52" stroke="#8B0000" strokeWidth="1.8" />
          <path d="M63 32C58 38 57 45 57 52" stroke="#8B0000" strokeWidth="1.8" />

          {/* Golden Kalash / Finial on top */}
          <circle cx="50" cy="22" r="3.5" fill="#F59E0B" />
          <path d="M50 14L53 20H47L50 14Z" fill="#F59E0B" />

          {/* Flame of Knowledge */}
          <path 
            d="M50 11C47 8 53 5 50 2C52 4 54 7 50 11Z" 
            fill="#EF4444" 
          />
        </svg>

        {/* Small gold sparkle badge */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight leading-none ${light ? 'text-white' : 'text-slate-900'} ${size === 'lg' ? 'text-lg' : 'text-base'}`}>
              MIT ADT
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#8B0000] text-amber-300 border border-amber-400/40 tracking-wider">
              CAMPUS
            </span>
          </div>
          <span className={`text-[10px] font-medium tracking-wide uppercase ${light ? 'text-slate-300' : 'text-slate-500'}`}>
            World Peace University • Pune
          </span>
        </div>
      )}
    </div>
  );
};
