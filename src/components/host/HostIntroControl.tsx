import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/useGame';
import {
  playGameIntroSound,
  stopGameIntroSound,
  isGameIntroPlaying,
} from '../../utils/audio';
import { ArrowRight, Sparkles, Volume2, Users } from 'lucide-react';

export const HostIntroControl: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  useEffect(() => {
    // Cập nhật trạng thái phát nhạc định kỳ
    const interval = setInterval(() => {
      setIsPlayingMusic(isGameIntroPlaying());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopGameIntroSound();
      setIsPlayingMusic(false);
    } else {
      playGameIntroSound();
      setIsPlayingMusic(true);
    }
  };

  const handleStartRound1 = () => {
    stopGameIntroSound();
    dispatch({ type: 'SET_ROUND', round: 1 });
    dispatch({ type: 'SET_STANDBY', isStandby: true });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Banner Khai Mạc Cuộc Thi */}
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            GIAI ĐOÀN: KHAI MẠC CUỘC THI
          </span>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
          ĐƯỜNG LÊN ĐỈNH OLYMPIA
        </h2>
        <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
          Màn hình chiếu đang hiển thị giao diện khai mạc sân khấu lớn giới thiệu chủ đề Đại đoàn kết và danh sách 6 đội thi.
        </p>

        {/* Nút hành động chính: Chuyển sang Vòng 1 */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handleStartRound1}
            className="flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all transform active:scale-98 cursor-pointer"
          >
            <span>BẮT ĐẦU VÀO VÒNG 1: KHỞI ĐỘNG</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Điều khiển nhạc nền intro-game.ogg */}
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
              isPlayingMusic
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingMusic ? 'Tắt nhạc khai mạc' : 'Bật nhạc khai mạc'}</span>
          </button>
        </div>
      </div>

      {/* Danh sách các đội thi tham dự */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
            <Users className="w-4 h-4 text-amber-400" />
            <span>CÁC ĐỘI THI THAM DỰ ({state.teams.length} ĐỘI)</span>
          </div>
          <span className="text-xs text-slate-400">
            Dùng nút "Quản lý đội" ở thanh trên cùng để đổi tên nếu cần
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {state.teams.map((team, idx) => (
            <div
              key={team.id}
              style={{ borderColor: `${team.color}40` }}
              className="bg-slate-950/70 border rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ backgroundColor: team.color }}
              />
              <span
                style={{ color: team.color }}
                className="text-[11px] font-bold uppercase tracking-wider mb-1"
              >
                Đội {idx + 1}
              </span>
              <span className="font-display font-bold text-white text-sm truncate w-full">
                {team.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
