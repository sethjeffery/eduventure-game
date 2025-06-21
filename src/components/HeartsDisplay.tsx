import React from "react";
import { Heart } from "phosphor-react";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

export function HeartsDisplay({ hearts, maxHearts = 3 }: HeartsDisplayProps) {
  const heartIcons = [];

  // Add filled hearts
  for (let i = 0; i < maxHearts; i++) {
    heartIcons.push(
      <span className="relative">
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
            i < hearts ? "opacity-100 sacle-100" : "opacity-0 scale-125"
          }`}
        />
      </span>
    );
  }

  return <div className="flex space-x-1">{heartIcons}</div>;
}
