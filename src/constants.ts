import { StoryContext } from "./types/adventure";

// Adventure length based on difficulty
export const getMaxSteps = (
  context: Pick<StoryContext, "difficultyLevel"> | null
): number => {
  switch (context?.difficultyLevel) {
    case "easy":
      return 7;
    case "medium":
      return 10;
    case "hard":
      return 15;
    default:
      return 7; // Default to easy if no difficulty specified
  }
};

export const gameOver = (context: Pick<StoryContext, "gameState"> | null) => {
  return Boolean(context?.gameState && context.gameState.hearts <= 0);
};

export const gameProgress = (
  context: Pick<
    StoryContext,
    "difficultyLevel" | "storyHistory" | "choiceHadEffects"
  > | null
) => {
  return context
    ? Math.round(
        (context.storyHistory.filter((step) => step.stepType === "educational")
          .length /
          getMaxSteps(context)) *
          100
      )
    : 0;
};

export const gameCompleted = (
  context: Pick<
    StoryContext,
    "difficultyLevel" | "storyHistory" | "choiceHadEffects"
  > | null
) => {
  return Boolean(
    context && gameProgress(context) >= 100 && !context.choiceHadEffects
  );
};

// Educational subjects for 8-12 year olds
export const EDUCATIONAL_SUBJECTS = [
  {
    id: "maths",
    name: "Maths",
    description: "Numbers, calculations, and problem solving",
  },
  {
    id: "science",
    name: "Science",
    description: "Nature, experiments, and discoveries",
  },
  {
    id: "history",
    name: "History",
    description: "Past events, civilizations, and famous people",
  },
  {
    id: "geography",
    name: "Geography",
    description: "Countries, capitals, and natural features",
  },
  {
    id: "language",
    name: "Language Arts",
    description: "Reading, writing, and vocabulary",
  },
  {
    id: "art",
    name: "Art & Culture",
    description: "Artists, music, and creative expression",
  },
] as const;

export const DIFFICULTY_LEVELS = [
  {
    id: "easy",
    name: "Easy",
    description: "Simple questions for beginners",
    color: "green",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Moderate challenge",
    color: "yellow",
  },
  {
    id: "hard",
    name: "Hard",
    description: "Advanced questions",
    color: "red",
  },
] as const;

export type EducationalSubject = (typeof EDUCATIONAL_SUBJECTS)[number]["id"];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]["id"];
