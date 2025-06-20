import React from "react";
import { GameState } from "@/types/adventure";
import { StatusPanel } from "./ui/Panel";
import { HeartsDisplay } from "./HeartsDisplay";
import { ImageDisplay } from "./ImageDisplay";
import { Heart, Warning, Skull } from "phosphor-react";

interface GameStatusProps {
  gameState: GameState;
  stepImage?: string | null;
}

export function GameStatus({ gameState, stepImage }: GameStatusProps) {
  return (
    <div className="space-y-6">
      {/* Hearts Display */}
      <StatusPanel>
        <h3 className="text-lg font-semibold text-black mb-3 flex items-center gap-2">
          <Heart size={20} weight="fill" className="text-red-500" />
          Health
        </h3>
        <HeartsDisplay hearts={gameState.hearts} />
        {gameState.hearts <= 1 && gameState.hearts > 0 && (
          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg text-red-700 text-xs flex items-center gap-2">
            <Warning size={16} weight="fill" className="text-red-600" />
            Warning: Low health! Be careful with your choices.
          </div>
        )}
        {gameState.hearts === 0 && (
          <div className="mt-3 p-2 bg-red-200 border border-red-400 rounded-lg text-red-800 text-xs font-medium flex items-center gap-2">
            <Skull size={16} weight="fill" className="text-red-800" />
            No health remaining! Your adventure has ended.
          </div>
        )}
      </StatusPanel>

      <ImageDisplay imageUrl={stepImage} alt="Current adventure scene" />
    </div>
  );
}
