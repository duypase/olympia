import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PresentationTimerProps {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  transitionDuration?: number;
}

export const PresentationTimer: React.FC<PresentationTimerProps> = ({
  seconds,
  totalSeconds,
  isRunning,
  transitionDuration = 0.15,
}) => {
  const isUrgent = seconds <= 3 && seconds > 0;
  const isExpired = seconds === 0;

  // Tự động ẩn badge "HẾT GIỜ" sau 5 giây kể từ khi hết giờ
  const [showExpiredBadge, setShowExpiredBadge] = useState(true);

  useEffect(() => {
    if (seconds > 0) {
      setShowExpiredBadge(true);
    } else if (seconds === 0) {
      setShowExpiredBadge(true);
      const timer = setTimeout(() => {
        setShowExpiredBadge(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  // Percentage for circular or linear bar
  const safeTotal = totalSeconds > 0 ? totalSeconds : 12;
  const targetSeconds = isRunning ? Math.max(0, seconds - 1) : seconds;
  const progressPercent = Math.max(
    0,
    Math.min(100, (targetSeconds / safeTotal) * 100),
  );

  // Circular SVG dimensions
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center w-[140px] h-[140px]">
        <AnimatePresence mode="wait">
          {!isExpired ? (
            <motion.div
              key="clock"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                duration: transitionDuration,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex items-center justify-center w-full h-full"
            >
              {/* Glow backdrop (heartbeat chỉ khi còn 3s cuối, không dùng màu đỏ) */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl transition-all duration-300 pointer-events-none ${
                  isUrgent
                    ? "bg-amber-400/30 animate-pulse-intense"
                    : isRunning
                      ? "bg-amber-400/20"
                      : "bg-transparent"
                }`}
              />

              {/* SVG Circular Countdown - transition: none khi chưa chạy để không fill up lúc entrance */}
              <svg
                style={{ width: "140px", height: "140px" }}
                className="-rotate-90 transform"
                viewBox="0 0 128 128"
              >
                {/* Background circle track */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800/80 fill-slate-950/90"
                />

                {/* Animated progress circle - không đổi màu đỏ khi còn 3s */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: isRunning
                      ? "stroke-dashoffset 1s linear, stroke 0.3s ease"
                      : "none",
                  }}
                  className="fill-transparent text-amber-400"
                />
              </svg>

              {/* Digits in Center (chỉ áp dụng heartbeat animate-pulse-intense khi còn 3s cuối, không đổi màu đỏ) */}
              <div
                style={{ width: "140px", height: "140px" }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <span
                  style={{
                    fontStyle: "normal",
                    fontWeight: "normal",
                    textDecorationLine: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    textAlign: "center",
                    width: "110px",
                    height: "60px",
                    lineHeight: "54px",
                    fontVariantNumeric: "tabular-nums",
                    fontSize: "60px",
                  }}
                  className={`tracking-tighter text-white ${
                    isUrgent ? "animate-pulse-intense" : ""
                  }`}
                >
                  {seconds}
                </span>
              </div>
            </motion.div>
          ) : (
            showExpiredBadge && (
              <motion.div
                key="badge-expired"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 0.95, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{
                  duration: transitionDuration,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center justify-center w-full h-full pointer-events-none"
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "black",
                  }}
                  className="px-5 py-3 rounded-full bg-amber-400 text-white shadow-lg border border-white/20 uppercase"
                >
                  HẾT GIỜ
                </span>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
