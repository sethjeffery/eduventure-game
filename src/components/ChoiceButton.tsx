import React from "react";
import { Choice } from "@/types/adventure";
import { MarkdownRenderer } from "@/lib/markdown";

interface ChoiceButtonProps {
  choice: Choice;
  onClick: () => void;
  disabled?: boolean;
}

export function ChoiceButton({
  choice,
  onClick,
  disabled = false,
}: ChoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-lg transition-all duration-200 transform shadow-lg min-h-[60px]
        ${
          disabled
            ? "bg-gray-600/25 border-gray-500 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-800 to-pink-500 text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`
          w-3 h-3 rounded-full flex-shrink-0
          ${
            disabled
              ? "bg-gray-500"
              : "bg-gradient-to-r from-purple-400 to-pink-400"
          }
        `}
        />
        <MarkdownRenderer className="font-medium text-lg">
          {disabled || !choice.text ? " " : choice.text}
        </MarkdownRenderer>
      </div>
    </button>
  );
}
