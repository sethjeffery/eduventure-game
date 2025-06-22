import React, { useState } from "react";
import { GradientButton } from "./GradientButton";
import { RandomSuggestionButton } from "./RandomSuggestionButton";
import { MagicWand, Star } from "phosphor-react";
import BackButton from "./BackButton";
import { ADVENTURE_PROMPTS } from "@/constants/subjects";

interface AdventureSetupStepProps {
  error: string | null;
  onPromptSelect: (prompt: string) => void;
  onBack: () => void;
}

export function AdventureSetupStep({
  error,
  onPromptSelect,
  onBack,
}: AdventureSetupStepProps) {
  const [prompt, setPrompt] = useState(
    ADVENTURE_PROMPTS[Math.floor(Math.random() * ADVENTURE_PROMPTS.length)]
  );

  const handleRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * ADVENTURE_PROMPTS.length);
    setPrompt(ADVENTURE_PROMPTS[randomIndex]);
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div>
        <label
          htmlFor="prompt"
          className="block text-lg font-semibold text-black mb-2"
        >
          Describe your adventure setting:
        </label>

        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A pirate treasure hunt on a mysterious island with ancient curses..."
            className="w-full h-32 p-4 pr-12 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-black placeholder-gray-500 shadow bg-white"
            maxLength={100}
          />
          <RandomSuggestionButton
            onRandomSelect={handleRandomPrompt}
            tooltipContent="Get a random idea"
            className="absolute top-3 right-3"
            size={20}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 text-left">
          <MagicWand size={14} />
          Click the magic wand for a random idea
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-800 border border-red-400 text-white px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <BackButton onBack={onBack} />

        <GradientButton
          onClick={() => onPromptSelect(prompt)}
          disabled={!prompt.trim()}
          variant="primary"
          size="lg"
          icon={<Star size={20} weight="fill" />}
          className="transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          <span className="hidden md:block">Start My Adventure</span>
          <span className="block md:hidden">Start</span>
        </GradientButton>
      </div>
    </div>
  );
}
