import React, { useState } from 'react';
import { useGame } from '../../context/useGame';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  EyeOff,
  Unlock,
} from 'lucide-react';

export const HostObstacleControl: React.FC = () => {
  const { state, dispatch } = useGame();
  const { round2, phase, timerSeconds, isTimerRunning, activeTeamId, teams, scoreModifier } = state;
  const { obstacle, activeClueId } = round2;

  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const activeClue = obstacle.clues.find((c) => c.id === activeClueId);
  const activeTeam = teams.find((t) => t.id === activeTeamId);
  const isShowingScoreboard = phase === 'SHOWING_SCOREBOARD';
  const eligibleTeams = teams.filter((t) => t.canGuessObstacle);

  const handleStartObstacleGuess = (teamId: string) => {
    dispatch({ type: 'START_OBSTACLE_GUESS', teamId });
    setIsGuessModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Vòng 2 */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-xl text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
            VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT
          </span>
          <span className="text-xs text-slate-400 font-medium">
            6 gợi ý mở 6 mảnh tranh • Đoán CNV bất kỳ lúc nào
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Đoán Chướng ngại vật khẩn cấp */}
          <button
            onClick={() => setIsGuessModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-600/20 transition-all cursor-pointer animate-pulse-subtle"
          >
            <AlertTriangle className="w-4 h-4 fill-current" />
            <span>CÓ ĐỘI ĐOÁN CNV!</span>
          </button>

          {/* Toggle scoreboard */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SCOREBOARD' })}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isShowingScoreboard
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isShowingScoreboard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isShowingScoreboard ? 'ẨN BẢNG ĐIỂM' : 'HIỆN BẢNG ĐIỂM'}</span>
          </button>
        </div>
      </div>

      {/* Host Secret Solution Card */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Chướng ngại vật bí mật (Chỉ Host thấy)</span>
            </div>
            <div className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
              {obstacle.keyword}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {obstacle.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!obstacle.isFullyRevealed ? (
              <button
                onClick={() => dispatch({ type: 'REVEAL_FULL_OBSTACLE' })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title={`Lật toàn bộ mảnh ghép khi hết ${obstacle.clues.length} gợi ý`}
              >
                <Unlock className="w-4 h-4 text-amber-400" />
                <span>MỞ TẤT CẢ MẢNH</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-xs font-bold">
                ✓ ĐÃ LẬT TOÀN BỘ TRANH
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách 6 Clues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {obstacle.clues.map((clue) => {
          const isSelected = activeClueId === clue.id;
          return (
            <div
              key={clue.id}
              onClick={() => dispatch({ type: 'SELECT_CLUE', clueId: clue.id })}
              title={isSelected ? 'Bấm để bỏ chọn hàng ngang này' : 'Bấm để chọn hàng ngang'}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative select-none ${
                isSelected
                  ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : clue.isRevealed
                  ? 'bg-slate-900/60 border-emerald-900/40 opacity-80'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-sm ${
                      clue.isRevealed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isSelected
                        ? 'bg-amber-400 text-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {clue.id}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{clue.rowLabel}</h4>
                    <span className="text-[11px] text-slate-400">
                      {clue.isRevealed ? 'Đã mở mảnh ghép' : 'Chưa mở'}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30 animate-pulse-subtle">
                    ĐANG CHỌN
                  </span>
                ) : clue.isRevealed ? (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    ĐÃ MỞ
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-xs text-slate-300 line-clamp-2">
                {clue.question}
              </p>

              {/* Host Answer Preview */}
              <div className="mt-2 text-xs font-semibold text-emerald-400">
                Đáp án: <span className="font-bold">{clue.answer}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Điều khiển Gợi ý đang chọn & Timer */}
      {activeClue && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Đang điều khiển: {activeClue.rowLabel}
              </span>

              {/* Nút bật/tắt hiển thị câu hỏi lên màn chiếu */}
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CLUE_QUESTION' })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  round2.isQuestionVisible
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title={round2.isQuestionVisible ? 'Ẩn câu hỏi trên màn chiếu' : 'Hiện câu hỏi lên màn chiếu'}
              >
                {round2.isQuestionVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{round2.isQuestionVisible ? 'ĐANG HIỆN CÂU HỎI' : 'CÂU HỎI ĐANG ẨN'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch({ type: 'UNSELECT_CLUE' })}
                className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-500/30 transition-all cursor-pointer font-medium"
                title="Bỏ chọn hàng ngang này"
              >
                Bỏ chọn
              </button>
              <div className="text-xs text-slate-400">
                Thời gian: {activeClue.timeLimit}s
              </div>
            </div>
          </div>

          <p className="font-display text-lg font-bold text-white">
            {activeClue.question}
          </p>

          {activeClue.explanation && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">
                Ý nghĩa / Ghi chú
              </span>
              <span>{activeClue.explanation}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800">
            {/* Timer Controller */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-black text-2xl border transition-all ${
                  timerSeconds <= 3 && timerSeconds > 0
                    ? 'bg-rose-950/60 border-rose-500 text-rose-400 animate-pulse-intense'
                    : timerSeconds === 0
                    ? 'bg-rose-950/40 border-rose-600/60 text-rose-400'
                    : 'bg-slate-950 border-amber-500/40 text-amber-400'
                }`}
              >
                {timerSeconds === 0 ? (
                  <span className="text-[9px] font-black uppercase text-rose-300 text-center leading-tight">
                    HẾT<br/>GIỜ
                  </span>
                ) : (
                  timerSeconds
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Nút bật/tắt hiển thị câu hỏi lên màn chiếu */}
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_CLUE_QUESTION' })}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    round2.isQuestionVisible
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 hover:bg-sky-500/30 shadow-sm'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 border-sky-500'
                  }`}
                  title={round2.isQuestionVisible ? 'Ẩn câu hỏi trên màn chiếu' : 'Hiện câu hỏi lên màn chiếu'}
                >
                  {round2.isQuestionVisible ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>ẨN CÂU HỎI</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>HIỆN CÂU HỎI</span>
                    </>
                  )}
                </button>

                {!isTimerRunning ? (
                  <button
                    onClick={() => {
                      if (phase === 'IDLE' || phase === 'RESULT_REVEAL') {
                        dispatch({ type: 'START_QUESTION' });
                      } else {
                        dispatch({ type: 'RESUME_TIMER' });
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{phase === 'IDLE' ? 'BẮT ĐẦU ĐẾM' : 'TIẾP TỤC'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch({ type: 'PAUSE_TIMER' })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>DỪNG</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    dispatch({ type: 'RESET_TIMER', seconds: activeClue.timeLimit })
                  }
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Đặt lại timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thao tác Cue đáp án & Mở mảnh ghép */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Nút CUE ĐÁP ÁN ĐÚNG khi timer đang chạy */}
              {isTimerRunning && !activeClue.isRevealed && (
                <button
                  onClick={() => dispatch({ type: 'CUE_CORRECT_ANSWER', clueId: activeClue.id })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer animate-pulse-subtle"
                  title="Thí sinh trả lời đúng: Ẩn timer, fade out nhạc timer và phát nhạc Solved"
                >
                  <CheckCircle2 className="w-4 h-4 fill-white/20" />
                  <span>CUE ĐÁP ÁN ĐÚNG</span>
                </button>
              )}

              {/* Nút MỞ MẢNH GHÉP NÀY: Dùng khi hết giờ không ai trả lời được (hoặc mở chủ động) */}
              {!activeClue.isRevealed ? (
                <button
                  onClick={() => dispatch({ type: 'REVEAL_CLUE_PIECE', clueId: activeClue.id })}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold transition-all cursor-pointer ${
                    isTimerRunning
                      ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20'
                  }`}
                  title="Mở mảnh ghép này (phát âm thanh mở đáp án khi hết giờ)"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>MỞ MẢNH GHÉP NÀY</span>
                </button>
              ) : (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/60">
                  ✓ Mảnh ghép đã được mở
                </div>
              )}
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • Double-click thẻ đội ở cột bên trái để +10đ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Modal: Có đội đoán Chướng ngại vật */}
      {isGuessModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <AlertTriangle className="w-7 h-7 shrink-0 animate-bounce-sm" />
              <div>
                <h3 className="font-display font-black text-xl text-white">
                  Đoán Chướng Ngại Vật
                </h3>
                <p className="text-xs text-slate-400">
                  Chọn đội đã bấm chuông / giơ tay xin giải mã Chướng ngại vật
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {eligibleTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleStartObstacleGuess(team.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="font-bold text-sm text-slate-100 group-hover:text-white">
                      {team.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-400">
                    {team.score}đ
                  </span>
                </button>
              ))}

              {eligibleTeams.length === 0 && (
                <div className="text-center py-4 text-xs text-rose-400 font-semibold">
                  Tất cả các đội đã bị khóa quyền đoán Chướng ngại vật!
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsGuessModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluating Obstacle Guess (When in OBSTACLE_GUESSING phase) */}
      {phase === 'OBSTACLE_GUESSING' && activeTeam && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 rounded-2xl p-6 shadow-2xl animate-pulse-subtle">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-400">
              TRẠNG THÁI KHẨN CẤP: ĐOÁN CHƯỚNG NGẠI VẬT
            </span>
          </div>

          <div className="font-display font-black text-2xl text-white">
            {activeTeam.name} đang giải đáp chướng ngại vật!
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Từ khóa bí mật: <strong className="text-amber-400">{obstacle.keyword}</strong>. Lắng nghe câu trả lời trực tiếp của đội.
          </p>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Đoán đúng: <strong className="text-emerald-400">+{scoreModifier}đ & Thắng CNV</strong> | Đoán sai: <strong className="text-rose-400">Khóa quyền đoán CNV</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  dispatch({ type: 'SUBMIT_OBSTACLE_GUESS', isCorrect: false })
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>SAI (Khóa quyền)</span>
              </button>

              <button
                onClick={() =>
                  dispatch({
                    type: 'SUBMIT_OBSTACLE_GUESS',
                    isCorrect: true,
                    pointsOverride: scoreModifier,
                  })
                }
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm shadow-xl shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ĐÚNG (+{scoreModifier}đ & MỞ TOÀN BỘ)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
