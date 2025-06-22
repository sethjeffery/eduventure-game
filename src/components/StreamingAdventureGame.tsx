"use client";

import React from "react";
import { Choice, DynamicAdventureMetadata } from "@/types/adventure";
import { useStreamingAdventure } from "@/hooks/useStreamingAdventure";
import { StreamingStoryStep } from "./StreamingStoryStep";
import { GameStatus } from "./GameStatus";
import { BackgroundWrapper } from "./ui/BackgroundWrapper";
import { ColoredPanel } from "./ui/Panel";
import { MagicWand, Skull, Target } from "phosphor-react";
import { GradientButton } from "./ui/GradientButton";

interface StreamingAdventureGameProps {
  adventureMetadata: DynamicAdventureMetadata;
  onAdventureComplete: () => void;
}

export function StreamingAdventureGame({
  adventureMetadata,
  onAdventureComplete,
}: StreamingAdventureGameProps) {
  const {
    gameState,
    currentStep,
    isLoadingStep,
    error,
    recentEffects,
    currentStepImage,
    makeChoice,
    continueStory,
    dismissEffects,
    storyHistory,
  } = useStreamingAdventure(adventureMetadata);

  const handleChoice = async (choice: Choice) => {
    await makeChoice(choice);
  };

  const handleContinue = async () => {
    dismissEffects();
    await continueStory();
  };

  const handleNewAdventure = () => {
    onAdventureComplete();
  };

  return (
    <BackgroundWrapper className="p-4">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="lg:w-2/3 space-y-6">
            {/* Story Content - Always use StreamingStoryStep */}
            {(currentStep || error) && (
              <StreamingStoryStep
                currentStep={currentStep}
                effects={recentEffects}
                error={error}
                gameState={gameState}
                isLoadingStep={isLoadingStep}
                onChoice={handleChoice}
                onContinue={handleContinue}
                storyHistory={storyHistory}
              />
            )}

            {/* Game Over */}
            {!isLoadingStep && currentStep?.stepType === "death" && (
              <ColoredPanel color="red" className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                  <Skull size={28} weight="fill" />
                  Game Over!
                </h3>
                <p className="text-red-100 mb-6">
                  You have run out of health! Your adventure has ended. Be more
                  careful next time!
                </p>
                <button
                  onClick={handleNewAdventure}
                  className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
              </ColoredPanel>
            )}

            {/* Game Win */}
            {!isLoadingStep && currentStep?.stepType === "ending" && (
              <ColoredPanel color="purple" className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                  <Target size={28} weight="fill" />
                  Adventure Complete!
                </h3>
                <p className="mb-6">
                  Congratulations! You completed your adventure with{" "}
                  <strong>
                    {gameState.hearts === 1
                      ? "1 heart"
                      : `${gameState.hearts} hearts`}
                  </strong>{" "}
                  remaining.
                  <br />
                  Would you like to start a new adventure?
                </p>
                <GradientButton
                  className="mx-auto"
                  icon={<MagicWand size={20} weight="fill" />}
                  onClick={handleNewAdventure}
                  variant="white"
                  size="lg"
                >
                  Start New Adventure
                </GradientButton>
              </ColoredPanel>
            )}

            {/* Loading indicator for initial load */}
            {!currentStep && !error && isLoadingStep && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-3">
                  <svg
                    className="animate-spin h-8 w-8 text-white"
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
                  <span className="text-xl font-medium text-white">
                    Starting your adventure...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <GameStatus gameState={gameState} stepImage={currentStepImage} />
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
