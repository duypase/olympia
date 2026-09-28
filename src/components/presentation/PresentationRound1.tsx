import React, { useEffect } from 'react';
import { useGame } from '../../context/useGame';
import { PresentationTimer } from './PresentationTimer';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export const PresentationRound1: React.FC = () => {
  const { state } = useGame();
  const { round1, phase, timerSeconds, isTimerRunning, activeTeamId, teams } = state;
  const currentQ = round1.questions[round1.currentQuestionIndex];
  const activeTeam = teams.find((t) => t.id === activeTeamId);

  // Trigger confetti on correct answer
  useEffect(() => {
    if (phase === 'RESULT_REVEAL' && round1.lastResult === 'CORRECT') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    }
  }, [phase, round1.lastResult]);

  return (
    <div className="w-full h-full max-w-6xl mx-auto flex flex-col justify-between py-6 px-6 relative select-none">
      {/* Top Banner: Round Name & Question Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-display font-black text-xl md:text-2xl tracking-widest text-amber-400 uppercase">
            VÒNG 1: KHỞI ĐỘNG
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-full font-display font-black text-lg md:text-xl text-white tracking-wide shadow-md">
          CÂU {round1.currentQuestionIndex + 1} / {round1.questions.length}
        </div>
      </div>

      {/* Center Zone: Question & Big Timer */}
      <div className="my-auto flex flex-col items-center justify-center gap-8 text-center py-4">
        {/* Timer Component */}
        <PresentationTimer
          seconds={timerSeconds}
          totalSeconds={currentQ?.timeLimit || 12}
          isRunning={isTimerRunning}
        />

        {/* Big Question Typography */}
        <div className="max-w-4xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-snug drop-shadow-md">
            {currentQ?.question}
          </h2>
        </div>

        {/* Options (if available) */}
        {currentQ?.options && currentQ.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mt-2">
            {currentQ.options.map((opt, i) => (
              <div
                key={i}
                className="bg-slate-900/90 border border-slate-700/60 rounded-2xl px-5 py-3.5 text-left text-lg md:text-xl text-slate-200 font-semibold flex items-center gap-3.5 shadow-md"
              >
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-black font-display font-black text-sm flex items-center justify-center shrink-0 shadow">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="truncate">{opt}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Status Banner at Bottom */}
      <div className="w-full flex justify-center pb-2">
        {/* Phase: Team Answering */}
        {phase === 'TEAM_ANSWERING' && activeTeam && (
          <div
            className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-slate-900/95 border-2 shadow-2xl animate-pulse-subtle"
            style={{ borderColor: activeTeam.color }}
          >
            <div
              className="w-5 h-5 rounded-full animate-ping"
              style={{ backgroundColor: activeTeam.color }}
            />
            <span className="font-display font-black text-2xl md:text-3xl text-white tracking-wide">
              {activeTeam.name.toUpperCase()} ĐANG TRẢ LỜI
            </span>
          </div>
        )}

        {/* Phase: Result Reveal */}
        {phase === 'RESULT_REVEAL' && (
          <div className="animate-scale-up">
            {round1.lastResult === 'CORRECT' && (
              <div className="flex items-center gap-3.5 px-8 py-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-2xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <span className="font-display font-black text-2xl md:text-4xl text-white tracking-wide">
                  ✓ CHÍNH XÁC +{round1.lastPointsAwarded}
                </span>
              </div>
            )}

            {round1.lastResult === 'WRONG' && (
              <div className="flex items-center gap-3.5 px-8 py-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-300 shadow-2xl shadow-rose-500/20">
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                <span className="font-display font-black text-2xl md:text-4xl text-white tracking-wide">
                  × KHÔNG CHÍNH XÁC
                </span>
              </div>
            )}

            {round1.lastResult === 'TIMEOUT' && (
              <div className="flex items-center gap-3.5 px-8 py-4 rounded-2xl bg-slate-900/90 border-2 border-amber-500 text-amber-300 shadow-2xl">
                <Clock className="w-8 h-8 text-amber-400 shrink-0" />
                <span className="font-display font-black text-xl md:text-3xl text-white tracking-wide">
                  HẾT GIỜ / KHÔNG CÓ CÂU TRẢ LỜI
                </span>
              </div>
            )}

            {round1.lastResult === 'SKIPPED' && (
              <div className="flex items-center gap-3.5 px-8 py-4 rounded-2xl bg-slate-900/90 border-2 border-slate-600 text-slate-400 shadow-xl">
                <span className="font-display font-black text-xl md:text-2xl text-slate-200">
                  BỎ QUA CÂU HỎI
                </span>
              </div>
            )}
          </div>
        )}

        {/* Phase: Question Active (Ready for buzzer/hand-raise) */}
        {phase === 'QUESTION_ACTIVE' && (
          <div className="text-sm font-semibold tracking-wider text-slate-400 uppercase bg-slate-900/80 px-6 py-2 rounded-full border border-slate-800">
            CÁC ĐỘI GIƠ TAY ĐỂ GIÀNH QUYỀN TRẢ LỜI
          </div>
        )}

        {/* Phase: Idle */}
        {phase === 'IDLE' && (
          <div className="text-sm font-semibold tracking-wider text-amber-400/80 uppercase bg-slate-900/80 px-6 py-2 rounded-full border border-slate-800">
            CHỜ HOST PHÁT LỆNH BẮT ĐẦU CÂU HỎI...
          </div>
        )}
      </div>
    </div>
  );
};
