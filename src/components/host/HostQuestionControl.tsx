import React from 'react';
import { useGame } from '../../context/useGame';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const HostQuestionControl: React.FC = () => {
  const { state, dispatch } = useGame();
  const { round1, phase, timerSeconds, isTimerRunning, activeTeamId, scoreModifier, teams } = state;
  const currentQ = round1.questions[round1.currentQuestionIndex];
  const activeTeam = teams.find((t) => t.id === activeTeamId);

  const isShowingScoreboard = phase === 'SHOWING_SCOREBOARD';

  return (
    <div className="flex flex-col gap-5">
      {/* Top Header: Tiến trình câu hỏi & Điều hướng */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-xl text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
            CÂU {round1.currentQuestionIndex + 1} / {round1.questions.length}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Vòng 1: Khởi động (10 câu cạnh tranh)
          </span>
        </div>

        {/* Nút lùi / tiến câu hỏi */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => dispatch({ type: 'PREV_QUESTION' })}
            disabled={round1.currentQuestionIndex === 0 || isTimerRunning}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title="Câu trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
            disabled={round1.currentQuestionIndex === round1.questions.length - 1 || isTimerRunning}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title="Câu tiếp theo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-slate-800 mx-1.5" />

          {/* Nút Hiện / Ẩn Bảng Điểm trên màn hình chiếu */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SCOREBOARD' })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isShowingScoreboard
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isShowingScoreboard ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>ẨN BẢNG ĐIỂM</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>HIỆN BẢNG ĐIỂM</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Question Card with Answer Preview for Host */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
          Nội dung câu hỏi
        </div>
        <p className="font-display text-xl md:text-2xl font-bold text-white leading-snug">
          {currentQ?.question}
        </p>

        {/* Options list if available */}
        {currentQ?.options && currentQ.options.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {currentQ.options.map((opt, i) => (
              <div
                key={i}
                className="bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="truncate">{opt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Host Secret Reference Answer */}
        <div className="mt-5 p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Đáp án mẫu (Chỉ Host thấy)
            </div>
            <div className="text-base font-bold text-emerald-100">
              {currentQ?.answer}
            </div>
          </div>
        </div>
      </div>

      {/* Timer & Primary Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Timer Control */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              timerSeconds <= 3 && timerSeconds > 0
                ? 'bg-rose-950/60 border-rose-500 text-rose-400 animate-pulse-intense shadow-lg shadow-rose-900/30'
                : timerSeconds === 0
                ? 'bg-slate-950 border-slate-800 text-slate-500'
                : 'bg-slate-950 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/10'
            }`}
          >
            <Clock className="w-4 h-4 mb-0.5 opacity-60" />
            <span className="font-display font-black text-3xl tracking-tighter">
              {timerSeconds}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <button
                  onClick={() => {
                    if (phase === 'IDLE' || phase === 'RESULT_REVEAL') {
                      dispatch({ type: 'START_QUESTION' });
                    } else {
                      dispatch({ type: 'RESUME_TIMER' });
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{phase === 'IDLE' ? 'BẮT ĐẦU CÂU HỎI' : 'TIẾP TỤC ĐẾM'}</span>
                </button>
              ) : (
                <button
                  onClick={() => dispatch({ type: 'PAUSE_TIMER' })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>TẠM DỪNG</span>
                </button>
              )}

              <button
                onClick={() =>
                  dispatch({
                    type: 'RESET_TIMER',
                    seconds: currentQ?.timeLimit || 12,
                  })
                }
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Đặt lại đồng hồ"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              Phím tắt: [Space] Bật/Dừng timer • [1-4] Chọn đội giơ tay
            </span>
          </div>
        </div>

        {/* Modifier: Tuỳ chỉnh điểm cộng */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Điểm khi ĐÚNG:</span>
          {[5, 10, 15, 20].map((pts) => (
            <button
              key={pts}
              onClick={() => dispatch({ type: 'SET_SCORE_MODIFIER', points: pts })}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                scoreModifier === pts
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              +{pts}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Evaluation Area - Only visible or prominent when a team is selected */}
      {activeTeam ? (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-5 shadow-xl animate-pulse-subtle">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: activeTeam.color }}
              />
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Đội được chọn trả lời
                </div>
                <div className="text-xl font-black text-white font-display">
                  {activeTeam.name}
                </div>
              </div>
            </div>

            {/* Quyết định Đúng / Sai */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => dispatch({ type: 'SUBMIT_ANSWER', isCorrect: false })}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
                <span>SAI (0đ)</span>
              </button>

              <button
                onClick={() =>
                  dispatch({
                    type: 'SUBMIT_ANSWER',
                    isCorrect: true,
                    pointsOverride: scoreModifier,
                  })
                }
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>ĐÚNG (+{scoreModifier})</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Chờ đội giơ tay... Click vào card của đội ở bảng dưới để chọn.</span>
          </div>

          <button
            onClick={() => dispatch({ type: 'SKIP_QUESTION' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
            <span>BỎ QUA CÂU</span>
          </button>
        </div>
      )}

      {/* Result banner if in RESULT_REVEAL */}
      {phase === 'RESULT_REVEAL' && (
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-200">
              Kết quả vừa ghi nhận: {round1.lastResult} ({round1.lastPointsAwarded > 0 ? `+${round1.lastPointsAwarded}đ` : '0đ'})
            </span>
          </div>
          <button
            onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md cursor-pointer"
          >
            <span>SANG CÂU TIẾP THEO</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
