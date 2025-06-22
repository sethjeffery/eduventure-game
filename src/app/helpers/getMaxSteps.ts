import { StoryContext } from "@/types/adventure";

// Adventure length based on difficulty
export const getMaxSteps = (level?: StoryContext["level"]): number => {
  switch (level) {
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
