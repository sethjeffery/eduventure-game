import React, { useState, useEffect } from "react";
import { Trophy } from "phosphor-react";

interface ScoreDisplayProps {
  score: number;
  animate?: boolean;
  scoreChange?: number; // For animation when score changes
}

export function ScoreDisplay({
  score,
  animate = false,
  scoreChange,
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    if (animate && scoreChange !== undefined && scoreChange !== 0) {
      // Animate score counting up/down
      const startScore = score - scoreChange;
      const duration = 500; // 500ms animation
      const steps = 10;
      const increment = scoreChange / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newScore = Math.round(startScore + increment * currentStep);
        setDisplayScore(newScore);

        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayScore(score);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setDisplayScore(score);
    }
  }, [score, animate, scoreChange]);

  return (
    <div className="flex items-center gap-2 relative">
      <Trophy
        size={20}
        weight="fill"
        className="absolute translate-y-px text-black/25 blur-[2px]"
      />
      <Trophy size={20} weight="fill" className="text-yellow-400 relative" />
      <span
        className={`font-bold text-lg transition-all duration-300 ${
          animate && scoreChange !== undefined && scoreChange !== 0
            ? scoreChange > 0
              ? "text-green-400 scale-110"
              : "text-red-400 scale-110"
            : "text-white scale-100"
        }`}
      >
        {displayScore}
      </span>
    </div>
  );
}
