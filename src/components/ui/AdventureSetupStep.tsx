import React from "react";
import { BackgroundWrapper } from "./BackgroundWrapper";
import { MenuCard } from "./Panel";
import { GradientButton } from "./GradientButton";
import { RandomSuggestionButton } from "./RandomSuggestionButton";
import { Target, Spinner, Mountains, MagicWand } from "phosphor-react";
import { EducationalSubject } from "@/constants";
import BackButton from "./BackButton";

interface AdventureSetupStepProps {
  selectedSubject: EducationalSubject | string | null;
  prompt: string;
  isGenerating: boolean;
  error: string | null;
  onPromptChange: (prompt: string) => void;
  onRandomPrompt: () => void;
  onGenerate: () => void;
  onBack: () => void;
}

export function AdventureSetupStep({
  selectedSubject,
  prompt,
  isGenerating,
  error,
  onPromptChange,
  onRandomPrompt,
  onGenerate,
  onBack,
}: AdventureSetupStepProps) {
  const EDUCATIONAL_SUBJECTS = [
    { id: "maths", name: "Maths" },
    { id: "science", name: "Science" },
    { id: "history", name: "History" },
    { id: "geography", name: "Geography" },
    { id: "language", name: "Language Arts" },
    { id: "art", name: "Art & Culture" },
  ] as const;

  const selectedSubjectData = EDUCATIONAL_SUBJECTS.find(
    (s) => s.id === selectedSubject
  );

  // Get display name for the subject
  const getSubjectDisplayName = () => {
    if (!selectedSubject) return "";
    if (typeof selectedSubject === "string" && !selectedSubjectData) {
      // Custom subject
      return selectedSubject;
    }
    return selectedSubjectData?.name.toLowerCase() || selectedSubject;
  };

  return (
    <BackgroundWrapper className="flex items-center justify-center p-4">
      <MenuCard>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center justify-center gap-3">
            <Mountains size={32} weight="fill" className="text-purple-600" />
            EduVenture Generator
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
              className="block text-lg font-semibold text-black mb-3"
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

          {/* Streaming Content Display */}
          {isGenerating && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Target size={20} weight="fill" className="text-blue-600" />
                Starting Your Educational Adventure...
              </h3>
              <p className="text-sm text-blue-700">
                Preparing your {getSubjectDisplayName()} adventure!
              </p>
            </div>
          )}

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
