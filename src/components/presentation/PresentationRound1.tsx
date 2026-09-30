import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/useGame';
import { PresentationTimer } from './PresentationTimer';
import { getCorrectOptionIndex } from '../../data/mockQuestions';
import { playCorrect, playWrong, playRound1NextQuestionSound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle } from 'lucide-react';

let lastPlayedNextQTrigger = 0;

export const PresentationRound1: React.FC = () => {
  const { state } = useGame();
  const { round1, phase, timerSeconds, isTimerRunning } = state;
  const currentQ = round1.questions[round1.currentQuestionIndex];
  const correctOptionIndex = getCorrectOptionIndex(currentQ);

  // Trigger sound effect on opening a new question in Round 1
  useEffect(() => {
    if (
      round1.nextQuestionTrigger &&
      round1.nextQuestionTrigger !== lastPlayedNextQTrigger
    ) {
      lastPlayedNextQTrigger = round1.nextQuestionTrigger;
      // Only play if trigger was dispatched recently (< 5 seconds) to avoid playback on stale page loads
      if (Date.now() - round1.nextQuestionTrigger < 5000) {
        playRound1NextQuestionSound();
      }
    }
  }, [round1.nextQuestionTrigger]);

  // Khi hết giờ, sau 5 giây tự động ẩn badge và chuyển translateY từ 20px về lại -75px
  const [isExpiredHidden, setIsExpiredHidden] = useState(false);

  useEffect(() => {
    if (timerSeconds > 0 || phase === 'IDLE') {
      setIsExpiredHidden(false);
    } else if (timerSeconds === 0) {
      setIsExpiredHidden(false);
      const timer = setTimeout(() => {
        setIsExpiredHidden(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [timerSeconds, phase]);

  const isTimerVisible = phase !== 'IDLE' && !isExpiredHidden;

  // Trigger sound effect & confetti on answer reveal
  const prevResultRef = useRef<string | null>(null);
  const prevOptionRef = useRef<number | null>(null);

  useEffect(() => {
    const isNewReveal =
      round1.selectedOptionIndex !== null &&
      (round1.selectedOptionIndex !== prevOptionRef.current ||
        round1.lastResult !== prevResultRef.current);

    if (isNewReveal && phase === 'RESULT_REVEAL') {
      if (round1.lastResult === 'CORRECT') {
        playCorrect();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } else if (round1.lastResult === 'WRONG') {
        playWrong();
      }
    }
    prevResultRef.current = round1.lastResult;
    prevOptionRef.current = round1.selectedOptionIndex;
  }, [phase, round1.lastResult, round1.selectedOptionIndex]);

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 'normal' }}
      className="w-full h-full max-w-6xl mx-auto flex flex-col justify-between py-6 px-6 relative select-none"
    >
      {/* Top Banner: Round Name & Question Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <span
            style={{
              color: '#ffffff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: '15px',
            }}
            className="tracking-widest uppercase"
          >
            VÒNG 1: KHỞI ĐỘNG
          </span>
        </div>

        <div
          style={{ fontWeight: 'normal', fontSize: '16px' }}
          className="bg-slate-900 px-4 py-1.5 rounded-full font-display text-white tracking-wide shadow-md"
        >
          CÂU {round1.currentQuestionIndex + 1} / {round1.questions.length}
        </div>
      </div>

      {/* Center Zone: Question & Big Timer */}
      <div
        key={`q-${round1.currentQuestionIndex}`}
        className="my-auto flex flex-col items-center justify-center text-center py-2 w-full relative"
      >
        {/* Timer Component - Motion transition mượt mà không khựng */}
        <div
          style={{ minHeight: '140px' }}
          className="flex items-center justify-center select-none"
        >
          <motion.div
            initial={false}
            animate={{
              opacity: isTimerVisible ? 1 : 0,
              y: isTimerVisible ? 0 : -32,
              scale: isTimerVisible ? 1 : 0.9,
            }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              pointerEvents: isTimerVisible ? 'auto' : 'none',
            }}
          >
            <PresentationTimer
              seconds={timerSeconds}
              totalSeconds={currentQ?.timeLimit || 10}
              isRunning={isTimerRunning}
            />
          </motion.div>
        </div>

        {/* Khung Câu hỏi & Các đáp án: Motion chuyển mượt mà giữa y: -75 và y: 20 */}
        <motion.div
          initial={false}
          animate={{
            y: isTimerVisible ? 20 : -75,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full flex flex-col items-center justify-center gap-5 md:gap-6"
        >
          {/* Big Question Typography - Waterfall entrance with responsive sizing for long text */}
          <div
            className="max-w-4xl px-2 animate-waterfall"
            style={{ animationDelay: '120ms' }}
          >
            <h2
              style={{ fontWeight: 'normal' }}
              className={`font-display text-white tracking-tight leading-snug drop-shadow-md transition-all ${
                (currentQ?.question.length || 0) > 130
                  ? 'text-2xl sm:text-3xl md:text-4xl'
                  : (currentQ?.question.length || 0) > 80
                  ? 'text-3xl sm:text-3xl md:text-4xl'
                  : 'text-3xl sm:text-4xl md:text-5xl'
              }`}
            >
              {currentQ?.question}
            </h2>
          </div>

          {/* Options (with direct highlight for correct/wrong answers & waterfall cascade entrance) */}
          {currentQ?.options && currentQ.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mt-2 items-stretch">
              {currentQ.options.map((opt, i) => {
                const isSelected = round1.selectedOptionIndex === i;
                const isCorrectOption = i === correctOptionIndex;
                const hasResult = round1.selectedOptionIndex !== null;

                let optionStyle = 'bg-slate-900/90 text-slate-200 shadow-md';
                let badgeStyle = 'bg-slate-800 text-amber-400';
                let statusIcon: React.ReactNode = null;

                if (hasResult) {
                  if (isSelected && isCorrectOption) {
                    // Đáp án được chọn và ĐÚNG: Nổi bật màu xanh lá
                    optionStyle = 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 scale-[1.02] ring-2 ring-emerald-300';
                    badgeStyle = 'bg-white text-emerald-800 font-black';
                    statusIcon = <CheckCircle2 className="w-7 h-7 text-white shrink-0 ml-auto mt-0.5 animate-bounce-sm" />;
                  } else if (isSelected && !isCorrectOption) {
                    // Đáp án được chọn và SAI: Nổi bật màu đỏ
                    optionStyle = 'bg-rose-600 text-white shadow-xl shadow-rose-500/30 scale-[1.02] ring-2 ring-rose-300';
                    badgeStyle = 'bg-white text-rose-800 font-black';
                    statusIcon = <XCircle className="w-7 h-7 text-white shrink-0 ml-auto mt-0.5" />;
                  } else if (isCorrectOption) {
                    // Khi chọn sai: TỰ ĐỘNG HIGHLIGHT LUÔN ĐÁP ÁN ĐÚNG màu xanh lá
                    optionStyle = 'bg-emerald-600/90 text-white shadow-lg ring-2 ring-emerald-400 animate-pulse-subtle';
                    badgeStyle = 'bg-emerald-400 text-black font-black';
                    statusIcon = <CheckCircle2 className="w-7 h-7 text-emerald-100 shrink-0 ml-auto mt-0.5" />;
                  } else {
                    // Các đáp án khác bị làm mờ
                    optionStyle = 'bg-slate-900/40 text-slate-500 opacity-30';
                    badgeStyle = 'bg-slate-900 text-slate-600';
                  }
                }

                // Custom option pill styling: smooth rounded corners that fit both 1-line and multi-line perfectly
                const optionPillStyle: React.CSSProperties = {
                  borderRadius: '1.25rem',
                  animationDelay: `${200 + i * 90}ms`
                };

                // Custom badge styles for options 1, 2, 3, 4
                const badgeLetterStyle: React.CSSProperties = {
                  fontWeight: 'bold',
                  fontSize: '18px',
                  borderRadius: '9999px',
                  ...(i === 2 ? { lineHeight: '24px' } : {}),
                };

                // Custom text styles for options 1, 2, 3, 4
                const optionTextStyle: React.CSSProperties = {
                  fontWeight: 'normal',
                  ...(i === 2 ? { fontSize: '18px' } : {}),
                };

                return (
                  <div
                    key={i}
                    style={optionPillStyle}
                    className={`animate-waterfall px-5 py-4 text-left text-base md:text-lg lg:text-xl font-bold flex items-start gap-4 transition-all duration-300 ${optionStyle}`}
                  >
                    <span
                      style={badgeLetterStyle}
                      className={`w-9 h-9 flex items-center justify-center shrink-0 mt-0.5 shadow ${badgeStyle}`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span
                      style={optionTextStyle}
                      className="flex-1 break-words leading-relaxed"
                    >
                      {opt}
                    </span>
                    {statusIcon}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
