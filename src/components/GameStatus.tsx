import React from "react";
import { GameState, GameEffect } from "@/types/adventure";
import { StatusPanel } from "./ui/Panel";
import { HeartsDisplay } from "./HeartsDisplay";
import { ScoreDisplay } from "./ScoreDisplay";
import { ImageDisplay } from "./ImageDisplay";
import { Skull } from "phosphor-react";

interface GameStatusProps {
  gameState: GameState;
  stepImage?: string | null;
  recentEffects?: GameEffect[];
}

export function GameStatus({
  gameState,
  stepImage,
  recentEffects = [],
}: GameStatusProps) {
  // Calculate score change for animation
  const scoreEffect = recentEffects.find(
    (effect) => effect.type === "gain_score" || effect.type === "lose_score"
  );
  const scoreChange = scoreEffect?.value || 0;

  return (
    <>
      <div className="hidden lg:block space-y-2">
        {/* Hearts Display */}
        <StatusPanel
          className={
            gameState.hearts <= 1
              ? "relative after:shadow-[0_0_10px_red] after:pulse after:content-[''] after:absolute after:rounded-lg"
              : ""
          }
        >
          <h3 className="text-lg font-semibold text-white text-shadow-sm text-shadow-black/10 flex items-center gap-2">
            Health
            <HeartsDisplay hearts={gameState.hearts} />
          </h3>

          {gameState.hearts <= 1 && gameState.hearts > 0 && (
            <div className="mt-2 rounded-lg text-xs flex items-center gap-2">
              Warning: Low health! Be careful with your choices.
            </div>
          )}
          {gameState.hearts === 0 && (
            <div className="mt-2 rounded-lg text-xs flex items-center gap-2">
              <Skull size={16} weight="fill" />
              No health remaining! Your adventure has ended.
            </div>
          )}
        </StatusPanel>

        {/* Score Display */}
        <StatusPanel>
          <h3 className="text-lg font-semibold text-white text-shadow-sm text-shadow-black/10 flex items-center gap-2">
            Score
            <ScoreDisplay
              score={gameState.score}
              animate={scoreChange !== 0}
              scoreChange={scoreChange}
            />
          </h3>
        </StatusPanel>

        <ImageDisplay imageUrl={stepImage} alt="Current adventure scene" />
      </div>

      <div className="block lg:hidden">
        <StatusPanel
          className={
            gameState.hearts <= 1
              ? "relative after:shadow-[0_0_10px_red] after:pulse after:content-[''] after:absolute after:rounded-lg"
              : ""
          }
        >
          <div className="flex items-center gap-2 justify-between">
            <HeartsDisplay hearts={gameState.hearts} />
            <ScoreDisplay
              score={gameState.score}
              animate={scoreChange !== 0}
              scoreChange={scoreChange}
            />
          </div>
        </StatusPanel>
      </div>
    </>
  );
}
