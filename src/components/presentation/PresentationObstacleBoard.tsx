import React, { useEffect } from 'react';
import { useGame } from '../../context/useGame';
import { PresentationTimer } from './PresentationTimer';
import confetti from 'canvas-confetti';
import { Sparkles, AlertTriangle } from 'lucide-react';

export const PresentationObstacleBoard: React.FC = () => {
  const { state } = useGame();
  const { round2, phase, timerSeconds, isTimerRunning, activeTeamId, teams } = state;
  const { obstacle, activeClueId, obstacleSolvedBy } = round2;

  const activeClue = obstacle.clues.find((c) => c.id === activeClueId);
  const activeTeam = teams.find((t) => t.id === activeTeamId);
  const winningTeam = teams.find((t) => t.id === obstacleSolvedBy);

  // Trigger confetti when obstacle is solved
  useEffect(() => {
    if (obstacle.isFullyRevealed && obstacleSolvedBy) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        confetti({
          particleCount: 50,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [obstacle.isFullyRevealed, obstacleSolvedBy]);

  return (
    <div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-between py-5 px-6 relative select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-display font-black text-xl md:text-2xl tracking-widest text-amber-400 uppercase">
            VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT
          </span>
        </div>

        <div className="flex items-center gap-2">
          {obstacle.isFullyRevealed ? (
            <span className="px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-display font-black text-sm uppercase tracking-wider">
              ĐÃ GIẢI MÃ
            </span>
          ) : (
            <span className="px-4 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-display font-bold text-sm uppercase tracking-wider">
              4 MẢNH GHÉP ẨN
            </span>
          )}
        </div>
      </div>

      {/* Center Zone: Puzzle Board as Visual Centerpiece */}
      <div className="my-auto flex flex-col items-center justify-center py-2">
        <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950">
          {/* Background Revealed Image */}
          <img
            src={obstacle.imageUrl}
            alt="Chướng ngại vật"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 4 Quadrant Puzzle Overlay */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-slate-950/40">
            {obstacle.clues.map((clue) => {
              const isRevealed = clue.isRevealed || obstacle.isFullyRevealed;
              return (
                <div
                  key={clue.id}
                  className={`relative flex items-center justify-center transition-all duration-700 ease-in-out ${
                    isRevealed
                      ? 'opacity-0 pointer-events-none scale-95'
                      : 'opacity-100 bg-slate-900/95 border-2 border-slate-700/80 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <span className="w-12 h-12 rounded-2xl bg-amber-400 text-black font-display font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20">
                      {clue.id}
                    </span>
                    <span className="font-display font-bold text-xs md:text-sm text-slate-300 tracking-wider uppercase">
                      GỢI Ý {clue.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centerpiece Crest / Star */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-20 h-20 rounded-full border-2 border-amber-400 bg-slate-950/90 flex items-center justify-center shadow-2xl transition-all duration-700 ${
                obstacle.isFullyRevealed
                  ? 'opacity-0 scale-50'
                  : 'opacity-90 scale-100'
              }`}
            >
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>

          {/* Final Revealed Banner on Puzzle */}
          {obstacle.isFullyRevealed && (
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col items-center text-center animate-scale-up">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                CHƯỚNG NGẠI VẬT ĐÃ ĐƯỢC GIẢI MÃ
              </span>
              <h3 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight drop-shadow-lg mt-1">
                {obstacle.keyword}
              </h3>
              {winningTeam && (
                <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-sm font-bold">
                  <span>Chiến thắng bởi:</span>
                  <span className="text-white font-extrabold">{winningTeam.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Area: Clue Question Panel or Emergency Obstacle Guess Takeover */}
      <div className="w-full">
        {/* Emergency Mode: Team Guessing Obstacle */}
        {phase === 'OBSTACLE_GUESSING' && activeTeam ? (
          <div
            className="w-full p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border-2 shadow-2xl animate-pulse-subtle flex items-center justify-center gap-4 text-center"
            style={{ borderColor: activeTeam.color }}
          >
            <AlertTriangle className="w-8 h-8 text-rose-500 animate-bounce-sm" />
            <div>
              <span className="text-xs font-black tracking-widest text-rose-400 uppercase">
                🚨 ĐANG TRẢ LỜI CHƯỚNG NGẠI VẬT!
              </span>
              <h2 className="font-display font-black text-2xl md:text-4xl text-white tracking-wide">
                {activeTeam.name.toUpperCase()}
              </h2>
            </div>
            <AlertTriangle className="w-8 h-8 text-rose-500 animate-bounce-sm" />
          </div>
        ) : activeClue ? (
          /* Active Clue Panel */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {activeClue.rowLabel}
                </span>
                {phase === 'TEAM_ANSWERING' && activeTeam && (
                  <span
                    className="text-xs font-black px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: activeTeam.color }}
                  >
                    {activeTeam.name} ĐANG TRẢ LỜI
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-white">
                {activeClue.question}
              </h3>
            </div>

            {/* Timer */}
            <div className="shrink-0 scale-90">
              <PresentationTimer
                seconds={timerSeconds}
                totalSeconds={activeClue.timeLimit}
                isRunning={isTimerRunning}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-sm text-slate-400 font-medium">
            Chọn câu hỏi gợi ý để mở từng mảnh ghép của Chướng ngại vật.
          </div>
        )}
      </div>
    </div>
  );
};
