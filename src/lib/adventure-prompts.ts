import { StoryContext } from "@/types/adventure";
import { getMaxSteps, gameCompleted, gameOver } from "@/constants";

export class AdventurePrompts {
  static createStoryStepPrompt(context: StoryContext): string {
    const stepIndex = context.storyHistory.length;

    const isStartingStep = context.storyHistory.length === 0;
    const isGameOver = gameOver(context);
    const isGameCompleted = gameCompleted(context);

    const maxSteps = getMaxSteps(context);
    const progressPercentage = Math.round((stepIndex / maxSteps) * 100);

    return `You are an expert interactive storyteller creating a choose-your-own-adventure game for young children. Generate the ${
      isStartingStep ? "OPENING" : "NEXT"
    } story step based on the context provided.

ADVENTURE THEME: "${context.adventureTheme}"

INSTRUCTIONS:
- Do not put any choices, status updates, hearts count or button text within the main content, only define them in the metadata.
${createStoryStepInstructions(context)}
- Use rich descriptions with **bold** and *italic* markdown formatting.
- Consider the player's hearts when crafting the story.
- Keep story coherent with what came before.
- Generate descriptive step IDs that reflect the story path (e.g., "ancient-temple-entrance", "mountain-cave-exploration", "village-merchant-meeting").
- Step IDs should be unique and descriptive of the story location/situation.

STORY PACING GUIDANCE:
${
  progressPercentage <= 20
    ? "- EARLY STORY (0-20%): Establish setting, introduce characters, build world. Focus on exploration and discovery."
    : progressPercentage <= 40
    ? "- EARLY-MID STORY (20-40%): Develop the main conflict, introduce challenges. Start building tension."
    : progressPercentage <= 60
    ? "- MID STORY (40-60%): Escalate conflicts, present major obstacles. This is the heart of the adventure."
    : progressPercentage <= 80
    ? "- LATE-MID STORY (60-80%): Approach climax, increase stakes. Prepare for resolution."
    : "- LATE STORY (80%+): Build toward climax and resolution. Prepare for adventure conclusion."
}

OUTPUT FORMAT:
(1) HEADING (e.g. "# Step Title Here")
(2) STORY CONTENT (markdown-formatted)
${
  context.choiceHadEffects || isGameCompleted || isGameOver
    ? ""
    : "(3) --- (separator)\n(4) YAML METADATA BLOCK"
}

EXAMPLE OUTPUT:

# Step Title Here

The story content goes here with **bold** and *italic* formatting. This should be engaging and move the story forward based on what happened before.

${createStoryStepMetadata(context)}

`;
  }
}

const createStoryStepInstructions = (context: StoryContext) => {
  const isGameOver = gameOver(context);
  const isGameCompleted = gameCompleted(context);

  // ending step
  if (isGameCompleted) {
    return `- The adventure should conclude. Create a satisfying ending based on the player's journey and choices.
- Write 100-180 words in short readable paragraphs of engaging content to finish the story, and nothing else.`;
  }

  // consequence steps
  if (context.choiceHadEffects) {
    if (isGameOver) {
      return `- The player has run out of hearts and died. Create a dramatic death scene that explains how they met their demise based on the story so far. This should be a definitive game over.
- Write 50-150 words in short readable paragraphs of engaging story content and nothing else.`;
    }
    if (context.choiceEffectType === "negative") {
      return `- Write 50-100 words in short readable paragraphs of engaging story content and nothing else.
- The player has made a bad choice and lost a heart. Create a compelling next step that flows naturally from the story and explain the negative consequences.`;
    }
    if (context.choiceEffectType === "positive") {
      return `- Write 50-100 words in short readable paragraphs of engaging story content and nothing else.
- The player has made a good choice. Create a compelling next step that flows positively from the story so far.`;
    }
  }

  // regular step
  return `- Only provide the story content followed by a metadata section, no other text.
- Create a compelling next step that flows naturally from the story so far.
- Write 80-180 words in short readable paragraphs of engaging story content, followed by "---" and the YAML metadata.
- Include choices where some are correct (safe) and others are incorrect (will cause the player to lose a heart).
- Mark choices with correct: true for safe choices and correct: false for dangerous ones.
- Do not give obvious hints about which choices are correct or incorrect.
- Do not repeat a question that has already been asked in the story.`;
};

const createStoryStepMetadata = (context: StoryContext) => {
  const isGameOver = gameOver(context);
  const isGameCompleted = gameCompleted(context);

  if (context.choiceHadEffects || isGameCompleted || isGameOver) {
    return ``;
  }

  if (context.choiceType === "educational") {
    return `---
choices:
  - text: "An incorrect answer"
    correct: false
  - text: "The correct answer"
    correct: true
  - text: "Another incorrect answer"
    correct: false
  - text: "Another incorrect answer"
    correct: false
`;
  }

  return `---
choices:
  - text: "A good choice"
  - text: "A bad choice"
    correct: false
  - text: "Another good choice"
  `;
};
