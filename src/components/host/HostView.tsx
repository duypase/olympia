import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/useGame';
import { HostQuestionControl } from './HostQuestionControl';
import { HostObstacleControl } from './HostObstacleControl';
import { HostScoreboardCard } from './HostScoreboardCard';
import { HostTeamManagerModal } from './HostTeamManagerModal';
import { isMuted, setMuted } from '../../utils/audio';
import {
  Tv,
  Volume2,
  VolumeX,
  Users,
  ExternalLink,
} from 'lucide-react';

interface HostViewProps {
  onOpenPresentationWindow?: () => void;
}

export const HostView: React.FC<HostViewProps> = ({ onOpenPresentationWindow }) => {
  const { state, dispatch } = useGame();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [muted, setMutedState] = useState(isMuted());

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  // Keyboard Hotkeys for Host
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Space: Toggle timer
      if (e.code === 'Space') {
        e.preventDefault();
        if (state.isTimerRunning) {
          dispatch({ type: 'PAUSE_TIMER' });
        } else if (state.phase === 'QUESTION_ACTIVE') {
          dispatch({ type: 'RESUME_TIMER' });
        } else if (state.phase === 'IDLE') {
          dispatch({ type: 'START_QUESTION' });
        }
      }

      // Hotkeys 1..4: Select team
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const teamIndex = parseInt(e.code.replace('Digit', ''), 10) - 1;
        if (state.teams[teamIndex]) {
          dispatch({ type: 'SELECT_TEAM_FOR_ANSWER', teamId: state.teams[teamIndex].id });
        }
      }

      // Enter: Submit correct if a team is answering
      if (e.code === 'Enter' && state.phase === 'TEAM_ANSWERING' && state.activeTeamId) {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_ANSWER', isCorrect: true });
      }

      // Escape: Submit wrong if a team is answering
      if (e.code === 'Escape' && state.phase === 'TEAM_ANSWERING' && state.activeTeamId) {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_ANSWER', isCorrect: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, dispatch]);

  const handleSelectTeam = (teamId: string) => {
    dispatch({ type: 'SELECT_TEAM_FOR_ANSWER', teamId });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-display font-black text-black text-base shadow-md shadow-amber-500/20">
            Ω
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              <span>HOST CONTROLLER</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                LIVE ENGINE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Đường lên đỉnh Olympia × HQ Trivia
            </p>
          </div>
        </div>

        {/* Round Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => dispatch({ type: 'SET_ROUND', round: 1 })}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              state.round === 1
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VÒNG 1: KHỞI ĐỘNG
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_ROUND', round: 2 })}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              state.round === 2
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mở cửa sổ trình chiếu ra màn hình thứ 2 */}
          <button
            onClick={() => {
              if (onOpenPresentationWindow) {
                onOpenPresentationWindow();
              } else {
                window.open(`${window.location.origin}${window.location.pathname}?view=presentation`, '_blank', 'width=1280,height=720');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
            title="Mở màn hình chiếu trên cửa sổ riêng (dành cho máy chiếu/TV)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Màn hình chiếu</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </button>

          {/* Âm thanh */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              muted
                ? 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-slate-800 border-slate-700 text-amber-400'
            }`}
            title={muted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quản lý danh sách đội */}
          <button
            onClick={() => setIsTeamModalOpen(true)}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
            title="Cấu hình đội thi"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Quản lý đội ({state.teams.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Top Control Block based on active Round */}
        <section className="flex-1">
          {state.round === 1 ? <HostQuestionControl /> : <HostObstacleControl />}
        </section>

        {/* Bottom Scoreboard Section */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                BẢNG ĐIỂM CÁC ĐỘI ({state.teams.length} ĐỘI)
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                • Bấm chọn đội giơ tay để trả lời • Chỉnh điểm trực tiếp bằng nút +/-
              </span>
            </div>

            <div className="text-xs text-slate-400">
              Trạng thái màn hình chiếu:{' '}
              <strong className={state.phase === 'SHOWING_SCOREBOARD' ? 'text-amber-400' : 'text-slate-400'}>
                {state.phase === 'SHOWING_SCOREBOARD' ? 'Đang hiện bảng điểm' : 'Đang ẩn bảng điểm'}
              </strong>
            </div>
          </div>

          {/* Grid of Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {state.teams.map((team) => (
              <HostScoreboardCard
                key={team.id}
                team={team}
                isSelectedForAnswer={state.activeTeamId === team.id}
                onSelectAnswer={() => handleSelectTeam(team.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Team Manager Modal */}
      <HostTeamManagerModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
};
