import { StoryContext } from "@/types/adventure";

export class AdventurePrompts {
  static createStoryStepPrompt(context: StoryContext): string {
    const isStartingStep = context.history.length === 0;

    return `You are an expert interactive storyteller creating a choose-your-own-adventure game for young children. Generate the ${
      isStartingStep ? "OPENING" : "NEXT"
    } story step based on the context provided.

ADVENTURE THEME: "${context.theme}"

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
  context.progress <= 20
    ? "- EARLY STORY (0-20%): Establish setting, introduce characters, build world. Focus on exploration and discovery."
    : context.progress <= 40
    ? "- EARLY-MID STORY (20-40%): Develop the main conflict, introduce challenges. Start building tension."
    : context.progress <= 60
    ? "- MID STORY (40-60%): Escalate conflicts, present major obstacles. This is the heart of the adventure."
    : context.progress <= 80
    ? "- LATE-MID STORY (60-80%): Approach climax, increase stakes. Prepare for resolution."
    : "- LATE STORY (80%+): Build toward climax and resolution. Prepare for adventure conclusion."
}

OUTPUT FORMAT:
(1) HEADING (e.g. "# Step Title Here")
(2) STORY CONTENT (markdown-formatted)
${
  ["regular", "educational"].includes(context.stepType)
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
  switch (context.stepType) {
    case "ending": {
      return `- The adventure should conclude. Create a satisfying ending based on the player's journey and choices.
- Write 100-180 words in short readable paragraphs of engaging content to finish the story, and nothing else.`;
    }
    case "death": {
      return `- The player has run out of hearts and died. Create a dramatic death scene that explains how they met their demise based on the story so far. This should be a definitive game over.
- Write 50-150 words in short readable paragraphs of engaging story content and nothing else.`;
    }
    case "consequence-negative": {
      return `- Write 50-100 words in short readable paragraphs of engaging story content and nothing else.
- The player has made a bad choice and lost a heart. Create a compelling next step that flows naturally from the story and explain the negative consequences.`;
    }
    case "consequence-positive": {
      return `- Write 50-100 words in short readable paragraphs of engaging story content and nothing else.
- The player has made a good choice. Create a compelling next step that flows positively from the story so far.`;
    }
    default: {
      return `- Only provide the story content followed by a metadata section, no other text.
- Create a compelling next step that flows naturally from the story so far.
- Write 80-180 words in short readable paragraphs of engaging story content, followed by "---" and the YAML metadata.
- Include choices where some are correct (safe) and up to one may be incorrect (causing the player to lose a heart).
- Mark choices with correct: true for safe choices and correct: false for dangerous ones.
- Do not give obvious hints about which choices are correct or incorrect.
- Do not repeat a question that has already been asked in the story.`;
    }
  }
};

const createStoryStepMetadata = (context: StoryContext) => {
  switch (context.stepType) {
    case "consequence-negative":
    case "consequence-positive":
    case "death":
    case "ending": {
      return ``;
    }

    case "educational": {
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
    default: {
      return `---
choices:
  - text: "A good choice"
    correct: true
  - text: "A bad choice"
    correct: false
  - text: "Another good choice"
    correct: true
  `;
    }
  }
};
