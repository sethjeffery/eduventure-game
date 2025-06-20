import React from "react";
import { Heart } from "phosphor-react";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
}

export function HeartsDisplay({ hearts, maxHearts = 3 }: HeartsDisplayProps) {
  const heartIcons = [];

  // Add filled hearts
  for (let i = 0; i < hearts; i++) {
    heartIcons.push(
      <Heart
        key={`filled-${i}`}
        size={20}
        weight="fill"
        className="text-red-500"
      />
    );
  }

  // Add empty hearts
  for (let i = hearts; i < maxHearts; i++) {
    heartIcons.push(
      <Heart
        key={`empty-${i}`}
        size={20}
        weight="regular"
        className="text-gray-400"
      />
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-sm font-medium text-gray-700 mr-2">Health:</span>
      <div className="flex space-x-1">{heartIcons}</div>
    </div>
  );
}
