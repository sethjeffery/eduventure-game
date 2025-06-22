export type StepType =
  | "regular"
  | "educational"
  | "consequence-positive"
  | "consequence-negative"
  | "ending"
  | "death";

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
  stepType: StepType;
  hasLoadedContent?: boolean;
  isStreaming?: boolean;
  needsMetadataRegeneration?: boolean;
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
  educationalSubject?: string;
  difficultyLevel?: "easy" | "medium" | "hard";
}

export interface StoryContext {
  theme: string;
  previousChoice: {
    text?: string;
    effectType?: "positive" | "negative" | null;
  };
  gameState: Pick<GameState, "hearts">;
  history: StoryHistory;
  subject: string;
  level: string;
  progress: number;
  stepsComplete: number;
  stepType: StepType;
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
}

// New interface for metadata regeneration
export interface RegenerateMetadataRequest {
  storyContent: string;
  stepTitle: string;
  context: StoryContext;
}

export interface RegenerateMetadataResponse {
  choices: Choice[];
  success: boolean;
  error?: string;
}
