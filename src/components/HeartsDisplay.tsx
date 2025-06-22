import React from "react";
import { Heart } from "phosphor-react";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

export function HeartsDisplay({ hearts, maxHearts = 3 }: HeartsDisplayProps) {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: maxHearts }, (_, i) => (
        <span className="relative" key={`heart-${i}`}>
          <Heart
            key={`shadow-${i}`}
            size={20}
            weight="fill"
            className="absolute text-black/25 blur-[2px] translate-y-px"
          />
          <Heart
            key={`empty-${i}`}
            size={20}
            weight="regular"
            className="absolute text-gray-400"
          />
          <Heart
            key={`filled-${i}`}
            size={20}
            weight="fill"
            className={`relative transition-all duration-700 ${
              i < hearts ? "opacity-100 scale-100" : "opacity-0 scale-125"
            }`}
          />
        </span>
      ))}
    </div>
  );
}
