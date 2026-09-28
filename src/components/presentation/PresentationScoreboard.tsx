import React from 'react';
import { useGame } from '../../context/useGame';
import { Trophy, Crown } from 'lucide-react';

export const PresentationScoreboard: React.FC = () => {
  const { state } = useGame();
  
  // Sort teams descending by score
  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...state.teams.map((t) => t.score), 10);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center font-display font-black text-lg shadow-lg shadow-amber-400/30">
            <Crown className="w-5 h-5 fill-current" />
          </div>
        );
      case 1:
        return (
          <div className="w-9 h-9 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-display font-bold text-base shadow">
            2
          </div>
        );
      case 2:
        return (
          <div className="w-9 h-9 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-display font-bold text-base shadow">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-display font-semibold text-sm">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-6 px-4 animate-scale-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-10 h-10 text-amber-400 animate-bounce-sm" />
        <div className="text-center">
          <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
            BẢNG XẾP HẠNG
          </h2>
          <p className="text-sm font-semibold tracking-widest text-amber-400 uppercase mt-1">
            ĐƯỜNG LÊN ĐỈNH OLYMPIA
          </p>
        </div>
        <Trophy className="w-10 h-10 text-amber-400 animate-bounce-sm" />
      </div>

      {/* Leaderboard Cards */}
      <div className="w-full flex flex-col gap-4">
        {sortedTeams.map((team, idx) => {
          const percentage = Math.max(12, Math.min(100, (team.score / maxScore) * 100));
          const isLeader = idx === 0 && team.score > 0;

          return (
            <div
              key={team.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                isLeader
                  ? 'bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/40 border-amber-400 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Dynamic Score Bar in Background */}
              <div
                className="absolute inset-y-0 left-0 bg-slate-800/40 pointer-events-none transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative p-4 md:p-5 flex items-center justify-between gap-4">
                {/* Left: Rank & Team Identity */}
                <div className="flex items-center gap-4">
                  {getRankBadge(idx)}

                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full ring-2 ring-white/20 shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <div>
                      <h3 className="font-display font-black text-xl md:text-2xl text-white tracking-tight">
                        {team.name}
                      </h3>
                      {state.round === 2 && !team.canGuessObstacle && (
                        <span className="text-[11px] text-rose-400 font-semibold">
                          Đã mất quyền đoán CNV
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Score */}
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-display font-black text-3xl md:text-5xl tracking-tighter ${
                      isLeader ? 'text-amber-400' : 'text-slate-100'
                    }`}
                  >
                    {team.score}
                  </span>
                  <span className="text-sm font-bold text-slate-400">ĐIỂM</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
