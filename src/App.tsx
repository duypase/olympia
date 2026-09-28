import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { HostView } from './components/host/HostView';
import { PresentationView } from './components/presentation/PresentationView';
import { Tv, Monitor, Columns, ExternalLink } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'host' | 'presentation' | 'split'>('host');
  const [isStandalonePresentation] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'presentation';
  });

  const openPopoutPresentation = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=presentation`;
    window.open(url, 'OlympiaPresentation', 'width=1280,height=720,menubar=no,toolbar=no,location=no');
  };

  // If this window was opened explicitly as presentation view
  if (isStandalonePresentation) {
    return (
      <GameProvider>
        <PresentationView />
      </GameProvider>
    );
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Development & Operation Mode Switcher Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-400">CHẾ ĐỘ XEM:</span>
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => setViewMode('host')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  viewMode === 'host'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Host View (Điều khiển)</span>
              </button>

              <button
                onClick={() => setViewMode('presentation')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  viewMode === 'presentation'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Presentation View (Màn chiếu)</span>
              </button>

              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View (Chia đôi test)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openPopoutPresentation}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold transition-colors cursor-pointer"
              title="Mở cửa sổ màn hình chiếu riêng để kéo sang máy chiếu/TV phụ"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở cửa sổ máy chiếu (Dual Screen)</span>
            </button>
          </div>
        </div>

        {/* View Container */}
        <div className="flex-1 flex flex-col">
          {viewMode === 'host' && (
            <HostView onOpenPresentationWindow={openPopoutPresentation} />
          )}

          {viewMode === 'presentation' && (
            <div className="flex-1 h-[calc(100vh-41px)]">
              <PresentationView />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-41px)] overflow-hidden">
              {/* Left Column: Host View */}
              <div className="w-full lg:w-1/2 border-r border-slate-800 overflow-y-auto">
                <HostView onOpenPresentationWindow={openPopoutPresentation} />
              </div>

              {/* Right Column: Live Presentation View */}
              <div className="w-full lg:w-1/2 bg-black h-full overflow-hidden flex flex-col justify-center">
                <div className="p-2 bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                  Màn hình chiếu khán giả (Live Preview)
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <PresentationView />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameProvider>
  );
}
