export interface Choice {
  text: string;
  correct?: boolean; // True for correct choices, false for incorrect ones
}

export interface GameCondition {
  // No conditions currently supported - placeholder for future use
  type: never;
  key: string;
  value?: number | boolean;
}

export interface StoryStep {
  title: string;
  content: string;
  choices: Choice[];
  stepType:
    | "regular"
    | "educational"
    | "consequence-positive"
    | "consequence-negative"
    | "ending"
    | "death";
  hasLoadedContent?: boolean;
  isEnding?: boolean;
  isStreaming?: boolean;
}

export type StoryHistory = Array<StoryStep & { choice?: string }>;

export interface GameEffect {
  type: "lose_heart";
  name: string;
}

export interface GameState {
  hearts: number;
}

// New types for dynamic adventure generation
export interface DynamicAdventureMetadata {
  title: string;
  description: string;
  theme: string; // The original prompt/theme
  isDynamic: true;
  educationalSubject?: string;
  difficultyLevel?: "easy" | "medium" | "hard";
}

export interface StoryContext {
  adventureTheme: string;
  choiceText?: string;
  choiceHadEffects?: boolean; // Did the last choice have consequences?
  choiceEffectType?: "positive" | "negative"; // Type of effects from last choice
  gameState: Pick<GameState, "hearts">;
  storyHistory: StoryHistory;
  educationalSubject?: string;
  difficultyLevel?: string;
  choiceType?: "adventure" | "educational"; // Backend determines choice type
}

export interface GenerateStepRequest {
  context: StoryContext;
}

export interface GenerateStepResponse {
  step: StoryStep;
  success: boolean;
  error?: string;
}

export interface StepMetadata {
  id?: string;
  stepType?: StoryStep["stepType"];
  choices?: Choice[];
  isEnding?: boolean;
}
