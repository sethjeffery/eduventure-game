import {
  DynamicAdventureMetadata,
  GameState,
  StepType,
  StoryContext,
  StoryHistory,
} from "@/types/adventure";
import { getMaxSteps } from "./getMaxSteps";

const CHANCE_FOR_EDUCATIONAL_CHOICES = 0.7;

const getProgress = (history: StoryHistory, level?: StoryContext["level"]) =>
  Math.round((getStepsComplete(history) / getMaxSteps(level)) * 100);

const getStepsComplete = (history: StoryHistory) =>
  history.filter((step) => step.stepType === "educational").length;

const getStepType = (
  metadata: DynamicAdventureMetadata | null,
  previousChoice: StoryContext["previousChoice"],
  gameState: GameState,
  history: StoryHistory
): StepType => {
  if (gameState.hearts <= 0) {
    return "death";
  }

  const stepsComplete = getStepsComplete(history);

  if (previousChoice.effectType) {
    return previousChoice.effectType === "positive"
      ? "consequence-positive"
      : "consequence-negative";
  }

  if (stepsComplete >= getMaxSteps(metadata?.difficultyLevel)) {
    return "ending";
  }

  if (Math.random() < CHANCE_FOR_EDUCATIONAL_CHOICES) {
    return "educational";
  }

  return "regular";
};

export const buildStoryContext = ({
  metadata,
  previousChoice,
  gameState,
  history,
}: {
  metadata: DynamicAdventureMetadata | null;
  previousChoice: StoryContext["previousChoice"];
  gameState: GameState;
  history: StoryHistory;
}): StoryContext => {
  return {
    ...metadata,
    stepType: getStepType(metadata, previousChoice, gameState, history),
    theme: metadata?.theme ?? "",
    previousChoice,
    gameState,
    subject: metadata?.educationalSubject ?? "",
    level: metadata?.difficultyLevel ?? "easy",
    progress: getProgress(history, metadata?.difficultyLevel),
    stepsComplete: getStepsComplete(history),
    history: [
      ...history.slice(0, -1),
      ...(previousChoice.text
        ? [{ ...history.slice(-1)[0], choice: previousChoice.text }]
        : []),
    ],
  };
};
