import React from "react";
import { BackgroundWrapper } from "./BackgroundWrapper";
import { MenuCard } from "./Panel";
import { GradientButton } from "./GradientButton";
import { RandomSuggestionButton } from "./RandomSuggestionButton";
import { Target, Spinner, Mountains, MagicWand } from "phosphor-react";
import BackButton from "./BackButton";

interface AdventureSetupStepProps {
  prompt: string;
  isGenerating: boolean;
  error: string | null;
  onPromptChange: (prompt: string) => void;
  onRandomPrompt: () => void;
  onGenerate: () => void;
  onBack: () => void;
}

export function AdventureSetupStep({
  prompt,
  isGenerating,
  error,
  onPromptChange,
  onRandomPrompt,
  onGenerate,
  onBack,
}: AdventureSetupStepProps) {
  return (
    <BackgroundWrapper className="flex items-center justify-center p-4">
      <MenuCard>
        <div className="text-center mb-8">
          <h1 className="text-4xl text-black mb-2 flex items-center justify-center gap-3 font-[family-name:var(--font-adventure)]">
            <Mountains size={32} weight="fill" className="text-purple-600" />
            Theme Generator
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Your adventure will include both exciting story choices and
            educational questions!
          </p>
        </div>

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
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="e.g., A pirate treasure hunt on a mysterious island with ancient curses..."
                className="w-full h-32 p-4 pr-12 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-black placeholder-gray-500 shadow bg-white"
                disabled={isGenerating}
                maxLength={100}
              />
              <RandomSuggestionButton
                onRandomSelect={onRandomPrompt}
                disabled={isGenerating}
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
              onClick={onGenerate}
              disabled={isGenerating || !prompt.trim()}
              variant="primary"
              size="lg"
              icon={
                isGenerating ? (
                  <Spinner size={20} className="animate-spin" />
                ) : (
                  <Target size={20} weight="fill" />
                )
              }
              className="transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              <span className="hidden md:block">
                {isGenerating
                  ? "Generating Adventure..."
                  : "Start Learning Adventure"}
              </span>
              <span className="block md:hidden">
                {isGenerating ? "Generating..." : "Start"}
              </span>
            </GradientButton>
          </div>
        </div>
      </MenuCard>
    </BackgroundWrapper>
  );
}
