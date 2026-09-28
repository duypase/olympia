import React, { useState } from 'react';
import { useGame } from '../../context/useGame';
import { PresentationRound1 } from './PresentationRound1';
import { PresentationObstacleBoard } from './PresentationObstacleBoard';
import { PresentationScoreboard } from './PresentationScoreboard';
import { Maximize2, Minimize2 } from 'lucide-react';

export const PresentationView: React.FC = () => {
  const { state } = useGame();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col justify-between relative select-none">
      {/* Subtle TV Stage Glow Background */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-500/10 via-blue-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

      {/* Floating Fullscreen / TV Badge Button */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 shadow-lg cursor-pointer transition-colors"
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình (F11)'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Presentation Stage */}
      <main className="flex-1 w-full h-full flex items-center justify-center relative z-10">
        {state.phase === 'SHOWING_SCOREBOARD' ? (
          <PresentationScoreboard />
        ) : state.round === 1 ? (
          <PresentationRound1 />
        ) : (
          <PresentationObstacleBoard />
        )}
      </main>

      {/* Minimal Footer Live Indicator */}
      <footer className="relative z-10 px-6 py-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-widest uppercase">LIVE BROADCAST</span>
        </div>
        <div className="tracking-widest font-mono text-slate-600">
          OLYMPIA × HQ TRIVIA ENGINE
        </div>
      </footer>
    </div>
  );
};
