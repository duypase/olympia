import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/useGame';
import { Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PresentationFinalSummary: React.FC = () => {
  const { state } = useGame();
  const { teams } = state;
  const summary = state.summary || { revealStep: 0, isCreditsPlaying: false, confettiTrigger: 0 };
  const revealStep = summary.revealStep;

  // Sắp xếp các đội theo điểm giảm dần
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...sortedTeams.map((t) => t.score), 10);

  const top1 = sortedTeams[0];
  const top2 = sortedTeams[1];
  const top3 = sortedTeams[2];
  const topOthers = sortedTeams.slice(3, 6);

  const prevConfettiTriggerRef = useRef(0);

  // Kích hoạt pháo hoa khi Top 1 được mở (step 3) hoặc khi Host bấm nút bắn lại pháo hoa
  useEffect(() => {
    if (
      revealStep >= 3 &&
      summary.confettiTrigger &&
      summary.confettiTrigger !== prevConfettiTriggerRef.current
    ) {
      prevConfettiTriggerRef.current = summary.confettiTrigger;
      launchChampionConfetti();
    }
  }, [revealStep, summary.confettiTrigger]);

  // Tự động bắn pháo hoa ngay khi vừa bước sang Step 3
  useEffect(() => {
    if (revealStep === 3) {
      launchChampionConfetti();
    }
  }, [revealStep]);

  const launchChampionConfetti = () => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 50,
        startVelocity: 35,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
        colors: ['#F59E0B', '#EAB308', '#38BDF8', '#EC4899', '#10B981'],
      });
    }, 220);
  };

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 relative select-none"
    >
      {/* Central Content Box */}
      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-4 sm:gap-6 my-auto">


        {/* NỬA TRÊN: BỤC VINH QUANG PODIUM (TOP 1 - 3) */}
        <div className="w-full flex items-end justify-center gap-3 sm:gap-6 xl:gap-8 pt-2">
          {/* BỤC SỐ 2: HẠNG NHÌ (Bên Trái) */}
          <div className="flex flex-col items-center flex-1 max-w-[240px] xl:max-w-[270px] justify-end">
            {/* Slot cố định cho thẻ Hạng Nhì để không bị nhảy kích thước layout */}
            <div className="w-full h-24 mb-3 flex flex-col justify-end">
              <AnimatePresence>
                {revealStep >= 2 && top2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Card Thông Tin Đội */}
                    <div className="w-full bg-slate-900/90 border-2 border-slate-300 rounded-2xl p-4 shadow-xl shadow-slate-300/10 text-center backdrop-blur-md flex flex-col items-center gap-1">
                      <span className="text-sm xl:text-base font-bold text-white line-clamp-1">
                        {top2.name}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-display font-black text-3xl xl:text-4xl text-slate-200">
                          {top2.score}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">ĐIỂM</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Khối Bục Đứng Số 2 */}
            <div
              className={`w-full h-32 sm:h-38 xl:h-44 rounded-t-2xl flex flex-col items-center justify-center p-4 border-t-2 transition-all duration-700 shadow-2xl relative overflow-hidden ${
                revealStep >= 2
                  ? 'bg-gradient-to-b from-slate-400/40 via-slate-600/30 to-slate-900/90 border-slate-300 shadow-slate-400/10'
                  : 'bg-slate-900/30 border-white/10 opacity-30'
              }`}
            >
              <span className="font-display font-black text-6xl xl:text-7xl text-slate-300/40 select-none leading-none">
                2
              </span>
            </div>
          </div>

          {/* BỤC SỐ 1: QUÁN QUÂN (Chính Giữa - Cao Nhất) */}
          <div className="flex flex-col items-center flex-1 max-w-[280px] xl:max-w-[320px] justify-end z-10">
            {/* Slot cố định cho vương miện & thẻ Quán quân */}
            <div className="w-full h-[184px] mb-3 flex flex-col items-center justify-end">
              <AnimatePresence>
                {revealStep >= 3 && top1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Biểu tượng Vương miện Quán Quân */}
                    <div className="relative mb-2">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40"
                      >
                        <Crown className="w-8 h-8 fill-current text-slate-950" />
                      </motion.div>
                    </div>

                    {/* Card Thông Tin Quán Quân */}
                    <div className="w-full bg-gradient-to-b from-amber-950/70 via-slate-900/95 to-slate-900/95 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl shadow-amber-400/20 text-center backdrop-blur-md flex flex-col items-center gap-1.5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-amber-400/5 pointer-events-none" />
                      <span className="text-base xl:text-lg font-black text-white line-clamp-1 tracking-wide">
                        {top1.name}
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-display font-black text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 drop-shadow-md">
                          {top1.score}
                        </span>
                        <span className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">
                          ĐIỂM
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Khối Bục Đứng Số 1 (Cao nhất) */}
            <div
              className={`w-full h-42 sm:h-50 xl:h-56 rounded-t-3xl flex flex-col items-center justify-center p-4 border-t-2 transition-all duration-700 shadow-2xl relative overflow-hidden ${
                revealStep >= 3
                  ? 'bg-gradient-to-b from-amber-500/40 via-amber-600/30 to-slate-900/95 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/30 border-white/10 opacity-30'
              }`}
            >
              <span className="font-display font-black text-7xl xl:text-8xl text-amber-400/40 select-none leading-none">
                1
              </span>
            </div>
          </div>

          {/* BỤC SỐ 3: HẠNG BA (Bên Phải) */}
          <div className="flex flex-col items-center flex-1 max-w-[220px] xl:max-w-[250px] justify-end">
            {/* Slot cố định cho thẻ Hạng Ba */}
            <div className="w-full h-24 mb-3 flex flex-col justify-end">
              <AnimatePresence>
                {revealStep >= 1 && top3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Card Thông Tin Đội */}
                    <div className="w-full bg-slate-900/90 border-2 border-amber-600 rounded-2xl p-4 shadow-xl shadow-amber-700/10 text-center backdrop-blur-md flex flex-col items-center gap-1">
                      <span className="text-sm xl:text-base font-bold text-white line-clamp-1">
                        {top3.name}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-display font-black text-3xl xl:text-4xl text-amber-200">
                          {top3.score}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">ĐIỂM</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Khối Bục Đứng Số 3 */}
            <div
              className={`w-full h-24 sm:h-30 xl:h-36 rounded-t-2xl flex flex-col items-center justify-center p-4 border-t-2 transition-all duration-700 shadow-xl relative overflow-hidden ${
                revealStep >= 1
                  ? 'bg-gradient-to-b from-amber-700/35 via-amber-800/25 to-slate-900/90 border-amber-600 shadow-amber-700/10'
                  : 'bg-slate-900/30 border-white/10 opacity-30'
              }`}
            >
              <span className="font-display font-black text-5xl xl:text-6xl text-amber-600/40 select-none leading-none">
                3
              </span>
            </div>
          </div>
        </div>

        {/* NỬA DƯỚI: DANH SÁCH CÁC VỊ TRÍ TIẾP THEO (XẾP DỌC) */}
        <div
          className={`w-full max-w-md shrink-0 pt-3 min-h-[200px] flex flex-col justify-start transition-opacity duration-500 ${
            revealStep >= 4
              ? 'border-t border-slate-800/80 opacity-100'
              : 'border-t-0 opacity-0 pointer-events-none'
          }`}
        >
          <AnimatePresence>
            {revealStep >= 4 && (
              <motion.div
                key="top-others"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col gap-2"
              >
                <div className="text-center mb-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    CÁC VỊ TRÍ TIẾP THEO (TOP 4 - 6)
                  </span>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {topOthers.map((team, idx) => {
                    const rank = idx + 4;
                    const percent = Math.max(15, Math.min(100, (team.score / maxScore) * 100));

                    return (
                      <div
                        key={team.id}
                        className="bg-slate-900/85 border border-slate-800 rounded-xl px-4 py-2 shadow-md flex items-center justify-between gap-3 relative overflow-hidden backdrop-blur-sm"
                      >
                        {/* Thanh progress bar mờ phía sau */}
                        <div
                          className="absolute inset-y-0 left-0 bg-white/[0.03] pointer-events-none transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />

                        {/* Rank Badge & Tên Đội */}
                        <div className="flex items-center gap-3 relative min-w-0">
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700/80 text-slate-300 font-display font-bold text-xs flex items-center justify-center shrink-0">
                            {rank}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                            {team.name}
                          </span>
                        </div>

                        {/* Điểm số */}
                        <div className="flex items-baseline gap-1 relative shrink-0">
                          <span className="font-display font-bold text-lg sm:text-xl text-amber-400">
                            {team.score}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">Đ</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
