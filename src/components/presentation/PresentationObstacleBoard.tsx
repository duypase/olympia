import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../../context/useGame";
import { PresentationTimer } from "./PresentationTimer";
import confetti from "canvas-confetti";
import {
  fadeAndStopTimerSoundtrack,
  playSolvedRound2,
  playClueRevealSound,
  playRound2ChooseRowSound,
  playObstacleSolvedSound,
  playRound2OpenClueSound,
  stopRound2OpenClueSound,
  playRound2SolvingKeywordSound,
  stopRound2SolvingKeywordSound,
  stopTimerSoundtrack,
  getAssetUrl,
} from "../../utils/audio";
import round2VisualClueImg from "../../assets/round2_visual_clue.png";

interface ClueLetterBoxProps {
  char: string;
  charIdx: number;
  rowIdx: number;
  isActive: boolean;
  isRevealed: boolean;
}

const ClueLetterBox: React.FC<ClueLetterBoxProps> = ({
  char,
  charIdx,
  rowIdx,
  isActive,
  isRevealed,
}) => {
  const wasActiveRef = useRef(false);

  if (isActive) {
    wasActiveRef.current = true;
  } else if (!isRevealed) {
    wasActiveRef.current = false;
  }

  // Góc xoay 3D:
  // - Khi chưa chọn: 0°
  // - Khi chọn hàng ngang: lật 180° (mặt trắng State 2)
  // - Khi công bố đáp án:
  //   + Nếu đang active (đang ở 180°): lật tiếp sang 360° để lộ mặt chữ State 3
  //   + Nếu chưa từng active (đang ở 0°): lật sang 180° để lộ mặt chữ State 3
  const targetRotation = isRevealed
    ? wasActiveRef.current
      ? 360
      : 180
    : isActive
      ? 180
      : 0;

  const flipDelay = isRevealed
    ? charIdx * 0.08
    : isActive
      ? charIdx * 0.1
      : charIdx * 0.04;

  const flipDuration = isRevealed ? 0.6 : isActive ? 0.6 : 0.4;
  const waterfallDelay = rowIdx * 0.08 + (charIdx + 1) * 0.025;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
        delay: waterfallDelay,
      }}
      style={{ perspective: 1000 }}
      className="w-[36px] h-[46px] sm:w-[42px] sm:h-[52px] xl:w-[50px] xl:h-[60px] relative select-none"
    >
      {/* Khối lật 3D Flip Card */}
      <motion.div
        initial={false}
        animate={{ rotateY: targetRotation }}
        transition={{
          duration: flipDuration,
          ease: [0.23, 1, 0.32, 1],
          delay: flipDelay,
        }}
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        {/* Mặt trước (0° và 360°):
            - Ở 0° khi Inactive: ô màu xám mờ rỗng bg-white/10
            - Ở 360° khi đã mở đáp án từ hàng ngang Active: ô màu xám mờ kèm ký tự chữ cái màu trắng
        */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className={`absolute inset-0 rounded-[4px] flex items-center justify-center bg-white/10 ${
            isRevealed && wasActiveRef.current
              ? "text-white font-display text-2xl sm:text-3xl xl:text-[32px] font-medium leading-none"
              : ""
          }`}
        >
          {isRevealed && wasActiveRef.current ? char : null}
        </div>

        {/* Mặt sau (180°):
            - Ở 180° khi Active: ô màu trắng sáng bg-white (State 2 khi Host chọn hàng ngang)
            - Ở 180° khi mở đáp án từ hàng ngang chưa từng active: ô màu xám mờ kèm ký tự chữ cái
        */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className={`absolute inset-0 rounded-[4px] flex items-center justify-center ${
            isRevealed && !wasActiveRef.current
              ? "bg-white/10 text-white font-display text-2xl sm:text-3xl xl:text-[32px] font-medium leading-none"
              : "bg-white shadow-sm"
          }`}
        >
          {isRevealed && !wasActiveRef.current ? char : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PresentationObstacleBoard: React.FC = () => {
  const { state } = useGame();
  const { round2, phase, timerSeconds, isTimerRunning, activeTeamId, teams } =
    state;
  const { obstacle, activeClueId, obstacleSolvedBy } = round2;

  const activeClue = obstacle.clues.find((c) => c.id === activeClueId);
  const activeTeam = teams.find((t) => t.id === activeTeamId);
  const winningTeam = teams.find((t) => t.id === obstacleSolvedBy);

  // Khi hết giờ, sau 5 giây tự động ẩn badge
  const [isExpiredHidden, setIsExpiredHidden] = useState(false);
  // Ẩn timer ngay khi Host bấm CUE ĐÁP ÁN ĐÚNG
  const [isCueHidden, setIsCueHidden] = useState(false);

  const prevCueTriggerRef = useRef<number | undefined>(undefined);
  const prevRevealTriggerRef = useRef<number | undefined>(undefined);
  const prevChooseRowTriggerRef = useRef<number | undefined>(undefined);
  const prevObstacleSolvedTriggerRef = useRef<number | undefined>(undefined);

  // Reset ẩn timer khi đổi hàng ngang hoặc về IDLE
  useEffect(() => {
    setIsCueHidden(false);
  }, [activeClueId, phase]);

  // Phát âm thanh mở màn hình Round 2 khi chuyển từ standby sang màn hình chính, dọn dẹp khi unmount
  useEffect(() => {
    playRound2OpenClueSound();
    return () => {
      stopRound2OpenClueSound();
      stopRound2SolvingKeywordSound();
    };
  }, []);

  // Dừng âm thanh mở màn hình khi bắt đầu đếm giờ hoặc khi chọn hàng ngang
  useEffect(() => {
    if (isTimerRunning || activeClueId !== null) {
      stopRound2OpenClueSound();
    }
  }, [isTimerRunning, activeClueId]);

  // Phát sfx hồi hộp khi có đội bấm chuông xin đoán chướng ngại vật
  useEffect(() => {
    if (phase === "OBSTACLE_GUESSING") {
      playRound2SolvingKeywordSound();
    } else {
      stopRound2SolvingKeywordSound();
    }
  }, [phase]);

  // Lắng nghe sự kiện Host chọn một hàng ngang
  useEffect(() => {
    if (
      round2.chooseRowTrigger &&
      round2.chooseRowTrigger !== prevChooseRowTriggerRef.current
    ) {
      prevChooseRowTriggerRef.current = round2.chooseRowTrigger;
      if (Date.now() - round2.chooseRowTrigger < 5000) {
        playRound2ChooseRowSound();
      }
    }
  }, [round2.chooseRowTrigger]);

  // Lắng nghe sự kiện từ khóa chướng ngại vật được giải
  useEffect(() => {
    if (
      round2.obstacleSolvedTrigger &&
      round2.obstacleSolvedTrigger !== prevObstacleSolvedTriggerRef.current
    ) {
      prevObstacleSolvedTriggerRef.current = round2.obstacleSolvedTrigger;
      if (Date.now() - round2.obstacleSolvedTrigger < 5000) {
        stopTimerSoundtrack();
        playObstacleSolvedSound();
      }
    }
  }, [round2.obstacleSolvedTrigger]);

  // Lắng nghe sự kiện Host CUE ĐÁP ÁN ĐÚNG trong lúc timer đang chạy
  useEffect(() => {
    if (
      round2.cueCorrectTrigger &&
      round2.cueCorrectTrigger !== prevCueTriggerRef.current
    ) {
      prevCueTriggerRef.current = round2.cueCorrectTrigger;
      setIsCueHidden(true);
      fadeAndStopTimerSoundtrack(600);
      playSolvedRound2();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899"],
      });
    }
  }, [round2.cueCorrectTrigger]);

  // Lắng nghe sự kiện Host bấm MỞ MẢNH GHÉP NÀY sau khi hết giờ
  useEffect(() => {
    if (
      round2.clueRevealTrigger &&
      round2.clueRevealTrigger !== prevRevealTriggerRef.current
    ) {
      prevRevealTriggerRef.current = round2.clueRevealTrigger;
      playClueRevealSound();
    }
  }, [round2.clueRevealTrigger]);

  useEffect(() => {
    if (timerSeconds > 0 || phase === "IDLE") {
      setIsExpiredHidden(false);
    } else if (timerSeconds === 0) {
      setIsExpiredHidden(false);
      const timer = setTimeout(() => {
        setIsExpiredHidden(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [timerSeconds, phase]);

  const isTimerVisible = phase !== "IDLE" && !isExpiredHidden && !isCueHidden;

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
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: "normal",
      }}
      className="w-full h-full container mx-auto flex flex-col justify-between items-center py-6 px-6 relative select-none"
    >
      {/* Top Banner */}
      <div className="flex items-center max-w-6xl w-full self-center justify-between border-b border-slate-800/80 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <span
            style={{
              color: "#ffffff",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: "15px",
              lineHeight: "1.4",
            }}
            className="tracking-widest uppercase"
          >
            VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT
          </span>
        </div>

        <div className="flex items-center gap-2">
          {obstacle.isFullyRevealed ? (
            <span
              style={{ fontWeight: "normal", fontSize: "16px" }}
              className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-display uppercase tracking-wider shadow-md"
            >
              ĐÃ GIẢI MÃ
            </span>
          ) : (
            <span
              style={{ fontWeight: "normal", fontSize: "16px" }}
              className="px-4 py-1.5 rounded-full bg-slate-900 text-white border border-slate-700/80 font-display uppercase tracking-wider shadow-md"
            >
              {obstacle.clues.length} MẢNH GHÉP ẨN
            </span>
          )}
        </div>
      </div>

      {/* Center Zone: Title + Puzzle Board and Word Grid */}
      <div className="my-auto flex flex-col items-center justify-center gap-6 py-2 w-full max-w-6xl">
        {/* Tiêu đề Chướng ngại vật nằm trong màn hình chính (trên khối Puzzle và Hàng ngang) */}
        <h2 className="font-display font-bold text-xl md:text-2xl lg:text-3xl text-white uppercase drop-shadow-sm text-center leading-normal py-1">
          CHƯỚNG NGẠI VẬT CÓ {obstacle.keyword.replace(/\s+/g, "").length} CHỮ
          CÁI
        </h2>

        {/* 2 Cột: Puzzle Board & Bảng hàng ngang side-by-side */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
          {/* Left: Puzzle Board Image with 6 pieces (Figma: 507px x 380px, rx=4px) */}
          <div className="relative w-full max-w-[507px] aspect-[4/3] overflow-hidden shadow-2xl rounded-[4px] border border-white/10 bg-white/[0.04] shrink-0">
            {/* Background Revealed Image */}
            <img
              src={
                obstacle.imageUrl
                  ? getAssetUrl(obstacle.imageUrl)
                  : getAssetUrl("/round2_visual_clue.png")
              }
              alt="Chướng ngại vật"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith("/round2_visual_clue.png")) {
                  target.src = getAssetUrl("/round2_visual_clue.png");
                } else if (round2VisualClueImg && target.src !== round2VisualClueImg) {
                  target.src = round2VisualClueImg;
                }
              }}
            />

            {/* 6 Puzzle Overlay Tiles with gap-0 */}
            <div
              style={{
                paddingLeft: "0px",
                paddingRight: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
              className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-0"
            >
              {obstacle.clues.map((clue) => {
                const isRevealed = clue.isRevealed || obstacle.isFullyRevealed;
                return (
                  <div
                    key={clue.id}
                    className={`relative flex items-center justify-center transition-[opacity,transform] duration-700 ease-in-out ${
                      isRevealed
                        ? "opacity-0 pointer-events-none scale-95"
                        : "opacity-100 bg-slate-900 border border-slate-700/60"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1.5 text-center p-2">
                      <span
                        style={{
                          borderRadius: "9999px",
                          fontWeight: "normal",
                          fontSize: "16px",
                        }}
                        className="w-9 h-9 bg-amber-400 text-black font-display flex items-center justify-center shadow-lg shadow-amber-400/20"
                      >
                        {clue.id}
                      </span>
                      <span
                        style={{ fontWeight: "normal", fontSize: "12px" }}
                        className="text-slate-300 tracking-wider uppercase"
                      >
                        GỢI Ý {clue.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Revealed Banner on Puzzle */}
            {obstacle.isFullyRevealed && (
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col items-center text-center animate-scale-up">
                <span
                  style={{ fontWeight: "normal", fontSize: "13px" }}
                  className="uppercase tracking-widest text-amber-400"
                >
                  CHƯỚNG NGẠI VẬT ĐÃ ĐƯỢC GIẢI MÃ
                </span>
                <h3
                  style={{ fontWeight: "normal" }}
                  className="font-display text-3xl md:text-4xl text-white tracking-tight drop-shadow-lg mt-1"
                >
                  {obstacle.keyword}
                </h3>
                {winningTeam && (
                  <div
                    style={{ borderRadius: "9999px" }}
                    className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-sm"
                  >
                    <span style={{ fontWeight: "normal" }}>
                      Chiến thắng bởi:
                    </span>
                    <span
                      style={{ fontWeight: "normal" }}
                      className="text-white"
                    >
                      {winningTeam.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Word Board with Clue Letters Rows (Figma: Badge on Left, 50x60 boxes, 4 states) */}
          <div className="flex-1 w-full flex flex-col justify-center bg-transparent shadow-none">
            {/* Letter Boxes for each clue row */}
            <div className="flex flex-col gap-1.5">
              {obstacle.clues.map((clue, rowIdx) => {
                const cleanAnswer = clue.answer.replace(/\s+/g, "");
                const letters = Array.from(cleanAnswer);
                const isRevealed = clue.isRevealed || obstacle.isFullyRevealed;
                const isActive = clue.id === activeClueId;

                return (
                  <div
                    key={clue.id}
                    className="flex items-center gap-6 p-0.5 rounded transition-colors duration-300"
                  >
                    {/* Badge số hàng 34x35 ở BÊN TRÁI theo Figma */}
                    <motion.div
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                        delay: rowIdx * 0.08,
                      }}
                      className={`w-[34px] h-[35px] rounded-full flex items-center justify-center font-display font-bold text-base shrink-0 shadow-sm transition-colors ${
                        isActive
                          ? "bg-amber-400 text-slate-950"
                          : isRevealed
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white"
                      }`}
                    >
                      {clue.id}
                    </motion.div>

                    {/* Dãy các Ô chữ có hiệu ứng Flip Card 3D khi chọn hàng ngang và khi công bố đáp án */}
                    <div className="flex items-center gap-1">
                      {letters.map((char, charIdx) => (
                        <ClueLetterBox
                          key={charIdx}
                          char={char}
                          charIdx={charIdx}
                          rowIdx={rowIdx}
                          isActive={isActive}
                          isRevealed={isRevealed}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Reserved height container to completely isolate layout and eliminate any jerk/khựng */}
      <div className="w-full max-w-7xl self-center h-32 sm:h-36 lg:h-40 shrink-0 relative flex items-center justify-center">
        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {/* Emergency Mode: Team Guessing Obstacle */}
            {phase === "OBSTACLE_GUESSING" && activeTeam ? (
              <motion.div
                key="obstacle-guessing"
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  borderRadius: "9999px",
                  borderColor: activeTeam.color,
                  padding: "16px 28px",
                  willChange: "transform, opacity",
                }}
                className="w-full bg-gradient-to-r from-amber-400/40 via-slate-900 to-amber-400/40 border-2 shadow-2xl animate-pulse-subtle flex items-center justify-center gap-4 text-center pointer-events-auto"
              >
                <div>
                  <span
                    style={{ fontWeight: 600, fontSize: "16px" }}
                    className="tracking-wide text-amber-400 uppercase"
                  >
                    ĐANG TRẢ LỜI CHƯỚNG NGẠI VẬT
                  </span>
                  <h2
                    style={{ fontWeight: "normal" }}
                    className="font-display text-2xl md:text-3xl text-white tracking-wide mt-0.5"
                  >
                    {activeTeam.name.toUpperCase()}
                  </h2>
                </div>
              </motion.div>
            ) : activeClue && round2.isQuestionVisible ? (
              /* Active Clue Panel */
              <motion.div
                key={`clue-card-${activeClue.id}`}
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  borderRadius: "24px",
                  paddingTop: "28px",
                  paddingBottom: "28px",
                  willChange: "transform, opacity",
                }}
                className="w-full bg-slate-900/90 border border-slate-700/60 shadow-xl px-7 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto"
              >
                <div className="flex-1 text-left">
                  <div
                    style={{ marginBottom: "8px", marginLeft: "0px" }}
                    className="flex items-center gap-3"
                  >
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: "14px",
                        borderRadius: "9999px",
                        borderWidth: "0px",
                        paddingTop: "6px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingBottom: "6px",
                      }}
                      className="bg-amber-400/20 text-amber-400 uppercase tracking-wider"
                    >
                      {activeClue.rowLabel}
                    </span>
                    {phase === "TEAM_ANSWERING" && activeTeam && (
                      <span
                        style={{
                          backgroundColor: activeTeam.color,
                          borderRadius: "9999px",
                          fontWeight: "normal",
                          fontSize: "14px",
                        }}
                        className="px-3 py-0.5 text-white shadow"
                      >
                        {activeTeam.name} ĐANG TRẢ LỜI
                      </span>
                    )}
                  </div>
                  <h3
                    style={{ fontWeight: "normal" }}
                    className="font-display text-xl max-w-3xl md:text-2xl text-white"
                  >
                    {activeClue.question}
                  </h3>
                </div>

                {/* Timer - Motion transition mượt mà không khựng */}
                <div className="shrink-0 min-w-[140px] flex items-center justify-center select-none">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isTimerVisible ? 1 : 0,
                      y: isTimerVisible ? 0 : -32,
                      scale: isTimerVisible ? 1 : 0.9,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      pointerEvents: isTimerVisible ? "auto" : "none",
                    }}
                  >
                    <PresentationTimer
                      seconds={timerSeconds}
                      totalSeconds={activeClue.timeLimit}
                      isRunning={isTimerRunning}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
