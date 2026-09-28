import React from 'react';

interface PresentationTimerProps {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
}

export const PresentationTimer: React.FC<PresentationTimerProps> = ({
  seconds,
  totalSeconds,
  isRunning,
}) => {
  const isUrgent = seconds <= 3 && seconds > 0;
  const isExpired = seconds === 0;

  // Percentage for circular or linear bar
  const safeTotal = totalSeconds > 0 ? totalSeconds : 12;
  const progressPercent = Math.max(0, Math.min(100, (seconds / safeTotal) * 100));

  // Circular SVG dimensions
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop for high tension */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-300 pointer-events-none ${
            isUrgent
              ? 'bg-rose-500/40 animate-pulse-intense'
              : isRunning
              ? 'bg-amber-400/20'
              : 'bg-transparent'
          }`}
        />

        {/* SVG Circular Countdown */}
        <svg className="w-36 h-36 md:w-44 md:h-44 -rotate-90 transform" viewBox="0 0 128 128">
          {/* Background circle track */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800/80 fill-slate-950/90"
          />

          {/* Animated progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 fill-transparent ${
              isUrgent
                ? 'text-rose-500'
                : isExpired
                ? 'text-slate-700'
                : 'text-amber-400'
            }`}
          />
        </svg>

        {/* Big Digit in Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-display font-black text-5xl md:text-6xl tracking-tighter leading-none ${
              isUrgent
                ? 'text-rose-400 animate-pulse-intense'
                : isExpired
                ? 'text-slate-600'
                : 'text-white'
            }`}
          >
            {seconds}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
            GIÂY
          </span>
        </div>
      </div>
    </div>
  );
};
