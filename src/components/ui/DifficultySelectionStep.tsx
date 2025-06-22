import React from "react";
import { GradientButton } from "./GradientButton";
import { Baby, Robot, Alien } from "phosphor-react";
import { DIFFICULTY_LEVELS, DifficultyLevel } from "@/constants";
import BackButton from "./BackButton";

const DIFFICULTY_LEVELS_ICONS: Record<
  (typeof DIFFICULTY_LEVELS)[number]["id"],
  React.ElementType
> = {
  easy: Baby,
  medium: Robot,
  hard: Alien,
} as const;

interface DifficultySelectionStepProps {
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
}

export function DifficultySelectionStep({
  onDifficultySelect,
  onBack,
}: DifficultySelectionStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-black mb-6">
        Choose your difficulty level:
      </h2>

      <div className="space-y-4">
        {DIFFICULTY_LEVELS.map((level) => {
          const Icon = DIFFICULTY_LEVELS_ICONS[level.id];

          // Map difficulty colors to gradient button variants
          const variant =
            level.color === "green"
              ? "success"
              : level.color === "yellow"
              ? "warning"
              : "danger";

          return (
            <GradientButton
              align="left"
              arrow
              key={level.id}
              icon={<Icon size={28} weight="fill" />}
              onClick={() => onDifficultySelect(level.id)}
              variant={variant}
              shadow="light"
              size="lg"
              fullWidth
            >
              <div className="flex flex-col text-shadow-sm">
                <h3 className="text-2xl font-[family-name:var(--font-adventure)]">
                  {level.name}
                </h3>
                <p className="text-sm">{level.description}</p>
              </div>
            </GradientButton>
          );
        })}
      </div>

      <BackButton onBack={onBack} />
    </div>
  );
}
