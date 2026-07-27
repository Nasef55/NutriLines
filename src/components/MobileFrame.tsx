import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, isMobileFrame }) => {
  if (!isMobileFrame) {
    return <div className="w-full min-h-screen bg-slate-50">{children}</div>;
  }

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-2 sm:px-4 flex items-center justify-center font-sans antialiased">
      {/* Android / iOS Device Container */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-800 overflow-hidden flex flex-col ring-1 ring-slate-700/50">
        
        {/* Status Bar */}
        <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold z-50 select-none">
          <span>{timeString}</span>

          {/* Camera Notch Punch Hole */}
          <div className="w-16 h-3.5 bg-black rounded-full flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
            <div className="w-1 h-1 rounded-full bg-blue-900/60" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          </div>
        </div>

        {/* Device Screen Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-20 scrollbar-thin">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/40 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
