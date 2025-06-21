import React from "react";
import { MagicWand } from "phosphor-react";
import { Tooltip } from "./Tooltip";

interface RandomSuggestionButtonProps {
  onRandomSelect: () => void;
  disabled?: boolean;
  tooltipContent: string;
  className?: string;
  size?: number;
}

export function RandomSuggestionButton({
  onRandomSelect,
  disabled = false,
  tooltipContent,
  className = "",
  size = 20,
}: RandomSuggestionButtonProps) {
  return (
    <Tooltip content={tooltipContent} position="top" className={className}>
      <button
        onClick={onRandomSelect}
        disabled={disabled}
        className="p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
      >
        <MagicWand
          size={size}
          weight="fill"
          className="group-hover:animate-pulse"
        />
      </button>
    </Tooltip>
  );
}
