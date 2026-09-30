import React, { useEffect } from 'react';
import { useGame } from '../../context/useGame';
import { PresentationTimer } from './PresentationTimer';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

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
    <div
      style={{ fontFamily: 'system-ui', fontWeight: 'normal' }}
      className="w-full h-full container mx-auto flex flex-col justify-between items-center py-6 px-6 relative select-none"
    >
      {/* Top Banner */}
      <div className="flex items-center max-w-6xl w-full self-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <span
            style={{
              color: '#ffffff',
              fontFamily: 'system-ui',
              fontWeight: 'normal',
              fontSize: '16px',
            }}
            className="tracking-widest uppercase"
          >
            VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT
          </span>
        </div>

        <div className="flex items-center gap-2">
          {obstacle.isFullyRevealed ? (
            <span
              style={{ fontWeight: 'normal', fontSize: '16px' }}
              className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-display uppercase tracking-wider shadow-md"
            >
              ĐÃ GIẢI MÃ
            </span>
          ) : (
            <span
              style={{ fontWeight: 'normal', fontSize: '16px' }}
              className="px-4 py-1.5 rounded-full bg-slate-900 text-white border border-slate-700/80 font-display uppercase tracking-wider shadow-md"
            >
              4 MẢNH GHÉP ẨN
            </span>
          )}
        </div>
      </div>

      {/* Center Zone: Puzzle Board and Word Grid side-by-side */}
      <div className="my-auto flex flex-col lg:flex-row items-center justify-center gap-8 py-3 w-full">
        {/* Left: Puzzle Board Image with 4 pieces */}
        <div
          style={{
            borderRadius: '12px',
            borderWidth: '2px',
          }}
          className="relative w-full max-w-lg aspect-[4/3] overflow-hidden shadow-2xl border-slate-800 bg-slate-950 shrink-0"
        >
          {/* Background Revealed Image */}
          <img
            src={obstacle.imageUrl}
            alt="Chướng ngại vật"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 4 Quadrant Puzzle Overlay */}
          <div
            style={{
              paddingLeft: '0px',
              paddingRight: '0px',
              paddingTop: '0px',
              paddingBottom: '0px',
            }}
            className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 bg-slate-950/40"
          >
            {obstacle.clues.map((clue) => {
              const isRevealed = clue.isRevealed || obstacle.isFullyRevealed;
              return (
                <div
                  key={clue.id}
                  className={`relative flex items-center justify-center transition-all duration-700 ease-in-out ${
                    isRevealed
                      ? 'opacity-0 pointer-events-none scale-95'
                      : 'opacity-100 bg-slate-900/95 backdrop-blur-md'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <span
                      style={{
                        borderRadius: '9999px',
                        fontWeight: 'normal',
                        fontSize: '18px',
                      }}
                      className="w-11 h-11 bg-amber-400 text-black font-display flex items-center justify-center shadow-lg shadow-amber-400/20"
                    >
                      {clue.id}
                    </span>
                    <span
                      style={{ fontWeight: 'normal', fontSize: '13px' }}
                      className="text-slate-300 tracking-wider uppercase"
                    >
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
              className={`w-16 h-16 rounded-full border-2 border-amber-400 bg-slate-950/90 flex items-center justify-center shadow-2xl transition-all duration-700 ${
                obstacle.isFullyRevealed
                  ? 'opacity-0 scale-50'
                  : 'opacity-90 scale-100'
              }`}
            >
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>

          {/* Final Revealed Banner on Puzzle */}
          {obstacle.isFullyRevealed && (
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col items-center text-center animate-scale-up">
              <span
                style={{ fontWeight: 'normal', fontSize: '13px' }}
                className="uppercase tracking-widest text-amber-400"
              >
                CHƯỚNG NGẠI VẬT ĐÃ ĐƯỢC GIẢI MÃ
              </span>
              <h3
                style={{ fontWeight: 'normal' }}
                className="font-display text-3xl md:text-4xl text-white tracking-tight drop-shadow-lg mt-1"
              >
                {obstacle.keyword}
              </h3>
              {winningTeam && (
                <div
                  style={{ borderRadius: '9999px' }}
                  className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-sm"
                >
                  <span style={{ fontWeight: 'normal' }}>Chiến thắng bởi:</span>
                  <span style={{ fontWeight: 'normal' }} className="text-white">
                    {winningTeam.name}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Word Board with Clue Letters Rows */}
        <div
          style={{
            borderWidth: '0px',
            borderRadius: '0px',
            paddingTop: '0px',
            paddingLeft: '0px',
            paddingBottom: '0px',
            paddingRight: '0px',
          }}
          className="flex-1 w-full flex flex-col justify-center bg-transparent shadow-none"
        >
          {/* Header pill displaying number of letters in CNV */}
          <div
            style={{
              marginBottom: '20px',
              paddingBottom: '0px',
            }}
            className="flex items-center justify-between"
          >
            <span
              style={{
                borderRadius: '9999px',
                fontWeight: 'normal',
                fontSize: '14px',
                padding: '6px 16px',
              }}
              className="bg-sky-500/15 border border-sky-400/30 text-sky-300 font-display tracking-wider uppercase inline-flex items-center gap-2 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              CHƯỚNG NGẠI VẬT CÓ {obstacle.keyword.replace(/\s+/g, '').length} CHỮ CÁI
            </span>
          </div>

          {/* Letter Boxes for each clue row */}
          <div className="flex flex-col gap-3.5">
            {obstacle.clues.map((clue) => {
              const cleanAnswer = clue.answer.replace(/\s+/g, '');
              const letters = Array.from(cleanAnswer);
              const isRevealed = clue.isRevealed || obstacle.isFullyRevealed;
              const isActive = clue.id === activeClueId;

              return (
                <div
                  key={clue.id}
                  className={`flex items-center justify-between gap-3 p-2 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-800/80 ring-1 ring-amber-400/50'
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Row of styled letter boxes */}
                  <div className="flex flex-wrap items-center gap-2">
                    {letters.map((char, charIdx) => (
                      <div
                        key={charIdx}
                        style={{
                          fontSize: '32px',
                          lineHeight: '32px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          width: '50px',
                          height: '60px',
                          borderWidth: '0px',
                        }}
                        className={`flex items-center justify-center font-display transition-all duration-500 shadow-md ${
                          isRevealed
                            ? 'bg-emerald-600 text-white animate-scale-up'
                            : 'bg-slate-800 text-transparent hover:bg-slate-750'
                        }`}
                      >
                        {isRevealed ? char : ''}
                      </div>
                    ))}
                  </div>

                  {/* Clue Index Badge on the Right */}
                  <span
                    style={{
                      borderRadius: '9999px',
                      fontWeight: 'normal',
                      fontSize: '14px',
                    }}
                    className={`w-9 h-9 shrink-0 flex items-center justify-center font-display transition-colors border ${
                      isRevealed
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                        : isActive
                        ? 'bg-amber-400 border-amber-300 text-slate-950 font-medium'
                        : 'bg-slate-800/90 border-slate-700/60 text-slate-400'
                    }`}
                  >
                    {clue.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Area: Clue Question Panel or Emergency Obstacle Guess Takeover */}
      <div className="w-full">
        {/* Emergency Mode: Team Guessing Obstacle */}
        {phase === 'OBSTACLE_GUESSING' && activeTeam ? (
          <div
            style={{ borderRadius: '9999px', borderColor: activeTeam.color, padding: '16px 28px' }}
            className="w-full bg-gradient-to-r from-amber-400/40 via-slate-900 to-amber-400/40 border-2 shadow-2xl animate-pulse-subtle flex items-center justify-center gap-4 text-center"
          >
            <div>
              <span
                style={{ fontWeight: 600, fontSize: '16px' }}
                className="tracking-wide text-amber-400 uppercase"
              >
                ĐANG TRẢ LỜI CHƯỚNG NGẠI VẬT
              </span>
              <h2
                style={{ fontWeight: 'normal' }}
                className="font-display text-2xl md:text-3xl text-white tracking-wide mt-0.5"
              >
                {activeTeam.name.toUpperCase()}
              </h2>
            </div>
          </div>
        ) : activeClue ? (
          /* Active Clue Panel */
          <div
            style={{ borderRadius: '24px', paddingTop: '28px', paddingBottom: '28px' }}
            className="bg-slate-900/90 border border-slate-700/60 shadow-xl px-7 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex-1 text-left">
              <div
                style={{ marginBottom: '8px', marginLeft: '0px' }}
                className="flex items-center gap-3"
              >
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '14px',
                    borderRadius: '9999px',
                    borderWidth: '0px',
                    paddingTop: '6px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    paddingBottom: '6px',
                  }}
                  className="bg-amber-400/20 text-amber-400 uppercase tracking-wider"
                >
                  {activeClue.rowLabel}
                </span>
                {phase === 'TEAM_ANSWERING' && activeTeam && (
                  <span
                    style={{ backgroundColor: activeTeam.color, borderRadius: '9999px', fontWeight: 'normal', fontSize: '14px' }}
                    className="px-3 py-0.5 text-white shadow"
                  >
                    {activeTeam.name} ĐANG TRẢ LỜI
                  </span>
                )}
              </div>
              <h3
                style={{ fontWeight: 'normal' }}
                className="font-display text-xl md:text-2xl text-white tracking-tight"
              >
                {activeClue.question}
              </h3>
            </div>

            {/* Timer */}
            <div className="shrink-0 min-w-[140px] flex items-center justify-center">
              <div className="animate-waterfall">
                <PresentationTimer
                  seconds={timerSeconds}
                  totalSeconds={activeClue.timeLimit}
                  isRunning={isTimerRunning}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ fontWeight: 'normal' }}
            className="text-center py-2 text-sm text-slate-400 font-normal"
          >
          
          </div>
        )}
      </div>
    </div>
  );
};
