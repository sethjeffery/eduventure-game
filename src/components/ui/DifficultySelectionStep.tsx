import React from "react";
import { BackgroundWrapper } from "./BackgroundWrapper";
import { MenuCard } from "./Panel";
import { GradientButton } from "./GradientButton";
import { GraduationCap, Baby, Robot, Alien } from "phosphor-react";
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
    <BackgroundWrapper className="flex items-center justify-center p-4">
      <MenuCard>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center justify-center gap-3">
            <GraduationCap
              size={32}
              weight="fill"
              className="text-purple-600"
            />
            EduVenture
          </h1>
        </div>

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
                  arrow
                  key={level.id}
                  icon={<Icon size={28} weight="fill" />}
                  onClick={() => onDifficultySelect(level.id)}
                  variant={variant}
                  shadow="light"
                  size="lg"
                  fullWidth
                >
                  <div className="flex flex-col items-start text-shadow-sm">
                    <h3 className="font-bold text-xl">{level.name}</h3>
                    <p className="text-sm">{level.description}</p>
                  </div>
                </GradientButton>
              );
            })}
          </div>

          <BackButton onBack={onBack} />
        </div>
      </MenuCard>
    </BackgroundWrapper>
  );
}
