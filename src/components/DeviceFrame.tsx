import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  Maximize2, 
  Minimize2,
  Sparkles
} from 'lucide-react';

export type DeviceMode = 'ios' | 'android' | 'responsive';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('ios');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Device Mode Switcher Floating Bar */}
      <aside aria-label="Device view options" className="w-full max-w-md mx-auto mb-3 hidden sm:flex items-center justify-between px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-white z-40">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>MIT ADT Campus Mobile View</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setDeviceMode('ios')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
              deviceMode === 'ios'
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>iOS iPhone</span>
          </button>

          <button
            onClick={() => setDeviceMode('android')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
              deviceMode === 'android'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Android Pixel</span>
          </button>

          <button
            onClick={() => setDeviceMode('responsive')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
              deviceMode === 'responsive'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Fullscreen / Responsive"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* Main View Wrapper */}
      {deviceMode === 'responsive' ? (
        <div className="w-full max-w-md min-h-screen bg-white shadow-2xl relative">
          {children}
        </div>
      ) : (
        <div className={`relative transition-all duration-300 ${
          deviceMode === 'ios'
            ? 'w-full sm:w-[412px] sm:h-[870px] sm:rounded-[50px] sm:border-[10px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/80'
            : 'w-full sm:w-[412px] sm:h-[870px] sm:rounded-[42px] sm:border-[9px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/80'
        } bg-white shadow-2xl overflow-hidden flex flex-col`}>
          
          {/* iOS Dynamic Island & Status Bar */}
          {deviceMode === 'ios' && (
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between text-slate-900 select-none">
              <span className="text-xs font-black tracking-tight">9:41</span>

              {/* Dynamic Island pill */}
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 text-[8px] text-white font-mono shadow-xs">
                <span className="text-amber-400 text-[8px]">● MIT ADT</span>
                <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-slate-800">
                <span className="text-[10px] font-bold tracking-tight">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-2.5 border border-slate-900 rounded-sm p-0.5 flex items-center">
                    <div className="h-full w-full bg-slate-900 rounded-xs" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Android Punch Hole & Status Bar */}
          {deviceMode === 'android' && (
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-5 pt-2 pb-1 flex items-center justify-between text-slate-900 select-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">10:00</span>
                <span className="text-[10px] font-bold text-[#8B0000]">MIT ADT</span>
              </div>

              {/* Center Camera Punch-hole */}
              <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-200" />

              <div className="flex items-center gap-2 text-slate-800">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 fill-slate-800" />
              </div>
            </div>
          )}

          {/* Device Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar bg-slate-50">
            {children}
          </div>

          {/* iOS / Android Bottom Home Bar */}
          <div className="sticky bottom-0 z-50 bg-white/90 backdrop-blur-md pb-2 pt-1 flex items-center justify-center">
            {deviceMode === 'ios' ? (
              <div className="w-32 h-1 bg-slate-400 rounded-full" />
            ) : (
              <div className="w-24 h-1 bg-slate-500 rounded-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
