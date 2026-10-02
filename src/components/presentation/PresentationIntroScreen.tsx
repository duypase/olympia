import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/useGame';
import {
  playGameIntroSound,
  stopGameIntroSound,
  getGameIntroAudio,
} from '../../utils/audio';
import { Trophy, Users } from 'lucide-react';

export const PresentationIntroScreen: React.FC = () => {
  const { state } = useGame();
  const { teams } = state;

  // Tự động phát nhạc nền khai mạc cuộc thi khi mount, dừng khi rời màn hình
  useEffect(() => {
    playGameIntroSound();

    // Hỗ trợ trường hợp trình duyệt chặn Autoplay trước khi người dùng click/nhấn phím
    const handleUserGesture = () => {
      const audio = getGameIntroAudio();
      if (audio && audio.paused) {
        playGameIntroSound();
      }
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('keydown', handleUserGesture, { once: true });

    return () => {
      stopGameIntroSound();
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, []);

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 'normal' }}
      className="relative w-full h-full flex flex-col justify-between items-center py-8 px-6 select-none overflow-hidden"
    >
      {/* Dynamic Background Stage Glow Layers */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none opacity-40 transition-all duration-1000 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.38) 0%, rgba(180,83,9,0.18) 50%, transparent 80%)',
          animationDuration: '5s',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[110px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, transparent 70%)',
        }}
      />


      {/* Center Zone: Grand Title & Topic */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-5xl px-4">
        {/* Trophy / Laurel Icon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/40 flex items-center justify-center shadow-2xl shadow-amber-500/20"
        >
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400 drop-shadow-md" />
        </motion.div>

        {/* Big Grand Olympia Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            letterSpacing: '0.04em',
            fontWeight: 900,
            lineHeight: 1.25,
          }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider uppercase drop-shadow-2xl py-2 bg-gradient-to-b from-white via-amber-100 to-amber-400 bg-clip-text text-transparent"
        >
          ĐƯỜNG LÊN ĐỈNH OLYMPIA
        </motion.h1>

        {/* Topic Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 px-6 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 shadow-lg backdrop-blur-md"
        >
          <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-200 tracking-wide">
            CHỦ ĐỀ: <span className="text-amber-300 font-bold">ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC & ĐOÀN KẾT QUỐC TẾ</span>
          </p>
        </motion.div>

        {/* Subtle Horizontal Divider */}
        <div className="mt-8 h-[2px] w-48 rounded-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent shadow-sm" />
      </div>

      {/* Bottom Area: Competing Teams Showcase Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="flex items-center justify-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>CÁC ĐỘI THI TRANH TÀI</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {teams.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + idx * 0.08 }}
              style={{
                borderColor: `${team.color}50`,
                boxShadow: `0 4px 20px -2px ${team.color}25`,
              }}
              className="bg-slate-900/90 border rounded-xl p-3 flex flex-col items-center justify-center text-center backdrop-blur-sm relative group overflow-hidden"
            >
              {/* Team color accent line */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ backgroundColor: team.color }}
              />
              <span
                style={{
                  color: team.color,
                  backgroundColor: `${team.color}15`,
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1.5"
              >
                {idx + 1}
              </span>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-white tracking-wide truncate w-full">
                {team.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
