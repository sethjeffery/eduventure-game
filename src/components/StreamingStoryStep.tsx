import React from "react";
import { StoryStep, Choice, GameState, GameEffect } from "@/types/adventure";
import { ContentPanel } from "./ui/Panel";
import { ChoiceButton } from "./ChoiceButton";
import { GameNotifications } from "./GameNotifications";
import { MarkdownRenderer } from "@/lib/markdown";
import { StoryHistory } from "@/types/adventure";

interface StreamingStoryStepProps {
  currentStep: StoryStep | null;
  effects: GameEffect[];
  error: string | null;
  gameState: GameState;
  isLoadingStep: boolean;
  onChoice: (choice: Choice) => Promise<void>;
  onContinue: () => Promise<void>;
  canMakeChoice: (choice: Choice) => boolean;
  storyHistory: StoryHistory;
}

export function StreamingStoryStep({
  currentStep,
  effects,
  error,
  gameState,
  isLoadingStep,
  onChoice,
  onContinue,
  canMakeChoice,
  storyHistory,
}: StreamingStoryStepProps) {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!currentStep) {
    return (
      <ContentPanel>
        <div className="text-center">
          <div className="inline-flex items-center space-x-3">
            <svg
              className="animate-spin h-6 w-6 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg font-medium text-black">
              AI is beginning your story...
            </span>
          </div>
        </div>
      </ContentPanel>
    );
  }

  return (
    <ContentPanel>
      <div className="space-y-6">
        {/* Step Title */}
        {currentStep.title && (
          <h2 className="text-3xl font-bold text-black text-center">
            {currentStep.title}
          </h2>
        )}

        {/* Story Content */}
        {currentStep.content && (
          <div className="prose prose-lg max-w-none">
            <MarkdownRenderer className="text-black leading-relaxed text-lg">
              {currentStep.content}
            </MarkdownRenderer>
          </div>
        )}

        {/* Game Effects Notifications */}
        {gameState.hearts > 0 && currentStep.hasLoadedContent && (
          <GameNotifications effects={effects} />
        )}

        {/* Regular Choices */}
        {currentStep.choices.length > 0 &&
        ["regular", "educational"].includes(currentStep.stepType) &&
        !currentStep.isEnding ? (
          <div className="grid gap-3">
            {currentStep.choices.map((choice, index) => (
              <ChoiceButton
                key={index}
                choice={choice}
                onClick={() => onChoice(choice)}
                disabled={!canMakeChoice(choice) || isLoadingStep}
              />
            ))}
          </div>
        ) : (
          !isLoadingStep &&
          !currentStep.isEnding &&
          gameState.hearts > 0 && (
            <>
              <div className="space-y-4 text-center">
                <p className="text-gray-600 text-sm mb-4">
                  The story continues...
                </p>
                <button
                  onClick={onContinue}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Continue Adventure
                </button>
              </div>
            </>
          )
        )}

        {/* Streaming indicator */}
        {currentStep.isStreaming && (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-sm font-medium opacity-75">
              {storyHistory.length === 0
                ? "AI is writing your story..."
                : "AI is continuing your story..."}
            </span>
          </div>
        )}
      </div>
    </ContentPanel>
  );
}
