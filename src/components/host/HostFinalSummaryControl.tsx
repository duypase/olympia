import React from 'react';
import { useGame } from '../../context/useGame';
import {
  Trophy,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Music,
  CheckCircle2,
} from 'lucide-react';

export const HostFinalSummaryControl: React.FC = () => {
  const { state, dispatch } = useGame();
  const { teams } = state;
  const summary = state.summary || { revealStep: 0, isCreditsPlaying: false, confettiTrigger: 0 };
  const revealStep = summary.revealStep;

  // Sắp xếp các đội theo điểm giảm dần
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const STEPS = [
    { step: 0, label: 'BƯỚC 0', title: 'Sân khấu bục Podium sẵn sàng', desc: 'Chưa mở đội nào' },
    { step: 1, label: 'BƯỚC 1', title: 'Công bố TOP 3', desc: 'Hạng Ba (Huy chương Đồng)' },
    { step: 2, label: 'BƯỚC 2', title: 'Công bố TOP 2', desc: 'Hạng Nhì (Huy chương Bạc)' },
    { step: 3, label: 'BƯỚC 3', title: 'Xướng danh QUÁN QUÂN', desc: 'Hạng Nhất (Huy chương Vàng & Confetti)' },
    { step: 4, label: 'BƯỚC 4', title: 'Công bố TOP 4 - 6', desc: 'Nửa dưới màn chiếu' },
  ];



  return (
    <div className="flex flex-col gap-6">
      {/* Khung điều khiển chính */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-sm">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white tracking-wide">
                ĐIỀU KHIỂN TỔNG KẾT & TRAO GIẢI
              </h2>
              <p className="text-xs text-slate-400">
                Lần lượt công bố thứ hạng theo nhịp kịch tính: Top 3 → Top 2 → Top 1 → Top 4-6
              </p>
            </div>
          </div>

          {/* Music Control & Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CREDITS_MUSIC' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                summary.isCreditsPlaying
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400'
              }`}
              title="Bật/Tắt nhạc nền credits.wav"
            >
              <Music className="w-3.5 h-3.5" />
              <span>{summary.isCreditsPlaying ? 'NHẠC CREDITS: ĐANG PHÁT' : 'NHẠC CREDITS: TẮT'}</span>
            </button>

            <button
              onClick={() => dispatch({ type: 'TRIGGER_SUMMARY_CONFETTI' })}
              disabled={revealStep < 3}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-black border border-amber-500/30 hover:border-amber-400 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              title="Bắn lại pháo hoa ăn mừng Quán quân trên màn chiếu"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bắn pháo hoa</span>
            </button>

            <button
              onClick={() => dispatch({ type: 'RESET_SUMMARY_STEP' })}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all cursor-pointer"
              title="Đặt lại về Bước 0 (Chưa mở kết quả)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thanh tiến trình hiển thị 5 bước */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
          {STEPS.map((s) => {
            const isPassed = revealStep >= s.step;
            const isCurrent = revealStep === s.step;

            return (
              <button
                key={s.step}
                onClick={() => dispatch({ type: 'SET_SUMMARY_STEP', step: s.step })}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                    : isPassed
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span className={isCurrent ? 'text-amber-300' : isPassed ? 'text-slate-400' : 'text-slate-600'}>
                    {s.label}
                  </span>
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className={`text-xs font-bold leading-tight line-clamp-1 ${isCurrent ? 'text-white' : isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {s.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* CỤM 2 NÚT ĐIỀU KHIỂN CHÍNH: QUAY LẠI (PREV) & TIẾP TỤC (NEXT) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Trạng thái màn chiếu:
            </span>
            <span className="text-sm font-black text-amber-400">
              {STEPS[revealStep]?.title}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Nút Quay Lại (Trước) */}
            <button
              onClick={() => dispatch({ type: 'PREV_SUMMARY_STEP' })}
              disabled={revealStep === 0}
              className="w-32 sm:w-36 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer select-none"
              title="Quay lại bước công bố trước đó"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>

            {/* Nút Tiếp Tục (Sau) */}
            <button
              onClick={() => dispatch({ type: 'NEXT_SUMMARY_STEP' })}
              disabled={revealStep >= 4}
              className="w-32 sm:w-36 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer select-none"
              title="Chuyển sang bước công bố tiếp theo"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bảng Xem Trước Thứ Hạng dành cho MC / Host */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              BẢNG XẾP HẠNG TOÀN CUỘC THI (DÀNH CHO HOST THEO DÕI)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {revealStep === 4 ? 'Toàn bộ kết quả đã được công bố trên TV' : `Đã công bố ${revealStep}/4 giai đoạn`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedTeams.map((team, idx) => {
            const rank = idx + 1;
            let targetStep = 4;
            let rankBadge = `${rank}`;
            let badgeBg = 'bg-slate-800 text-slate-400';

            if (rank === 1) {
              targetStep = 3;
              rankBadge = 'Quán Quân (1)';
              badgeBg = 'bg-amber-400 text-slate-950 font-black';
            } else if (rank === 2) {
              targetStep = 2;
              rankBadge = 'Hạng Nhì (2)';
              badgeBg = 'bg-slate-300 text-slate-950 font-bold';
            } else if (rank === 3) {
              targetStep = 1;
              rankBadge = 'Hạng Ba (3)';
              badgeBg = 'bg-amber-800 text-amber-100 font-bold';
            }

            const isRevealedOnTv = revealStep >= targetStep;

            return (
              <div
                key={team.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isRevealedOnTv
                    ? 'bg-slate-800/90 border-slate-700'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md shrink-0 ${badgeBg}`}>
                    {rankBadge}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white truncate block">
                      {team.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isRevealedOnTv ? '✓ Đang hiện trên TV' : 'Chưa mở trên TV'}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="font-display font-black text-xl text-amber-400">
                    {team.score}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">Đ</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
