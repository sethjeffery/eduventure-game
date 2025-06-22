import { NextRequest } from "next/server";
import { StoryContext } from "@/types/adventure";
import { OpenAIStreamingService } from "@/lib/openai-stream";
import { AdventurePrompts } from "@/lib/adventure-prompts";
import { getMaxSteps } from "@/app/helpers/getMaxSteps";

const getUserPrompt = (context: StoryContext) => {
  switch (context.stepType) {
    case "educational":
      if (context.stepsComplete >= getMaxSteps(context.level) - 1) {
        return `GENERATE A FINAL CHALLENGE: An educational challenge with 3-4 choices related to ${context.subject}. Difficulty: ${context.level}.
- Integrate the question naturally into the story context as a final challenge. Make it feel like part of the adventure, not a quiz.
- Only one choice should be correct (marked with correct: true), others should be incorrect (marked with correct: false).
- Choice text should be in string quotes. Any quotes within the text should be escaped with a backslash.
- Questions should be age-appropriate for 8-12 year olds at ${context.level} difficulty level.
- Do not repeat a question that has already been asked in the story.`;
      }

      return `GENERATE AN EDUCATIONAL STEP: An educational challenge with 3-4 choices related to ${context.subject}. Difficulty: ${context.level}.
- Integrate the question naturally into the story context. Make it feel like part of the adventure, not a quiz.
- Only one choice should be correct (marked with correct: true), others should be incorrect (marked with correct: false).
- Choice text should be in string quotes. Any quotes within the text should be escaped with a backslash.
- Questions should be age-appropriate for 8-12 year olds at ${context.level} difficulty level.
- Do not repeat a question that has already been asked in the story.`;
    case "consequence-negative":
      return `GENERATE A CONSEQUENCE-NEGATIVE STEP: Show the bad consequences of the player's choice, losing a heart.`;
    case "consequence-positive":
      return `GENERATE A CONSEQUENCE-POSITIVE STEP: Show the positive results of the player's choice.`;
    case "ending":
      return `GENERATE AN ENDING STEP: The adventure should conclude. Create a satisfying ending based on the player's journey and choices.`;
    case "death":
      return `GENERATE A DEATH STEP: The player has run out of hearts and died. Create a dramatic death scene that explains how they met their demise based on the story so far. This should be a definitive game over.`;
    default:
      if (context.history.length === 0) {
        return `GENERATE THE INTRODUCTION: Set the opening scene for the story with 2-3 meaningful choices in a random order.`;
      }
      return `GENERATE A REGULAR STEP: Normal story progression with 2-3 meaningful choices in a random order.
- Focus on story progression and character development
- Mark safe choices with correct: true and dangerous choices with correct: false.
- Choice text should be in string quotes. Any quotes within the text should be escaped with a backslash.
- Include choices that could have positive or negative consequences.`;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if API key is configured
    const apiKeyError = OpenAIStreamingService.validateApiKey();
    if (apiKeyError) {
      return OpenAIStreamingService.createErrorResponse(apiKeyError, 500);
    }

    const { context }: { context: StoryContext } = body;

    if (!context) {
      return OpenAIStreamingService.createErrorResponse(
        "Story context is required",
        400
      );
    }

    const systemPrompt = AdventurePrompts.createStoryStepPrompt(context);
    console.log(systemPrompt);

    return OpenAIStreamingService.createStreamingResponse({
      context,
      systemPrompt,
      userPrompt: getUserPrompt(context),
      maxTokens: 1200,
      temperature: 0.8,
    });
  } catch (error) {
    console.error("Error in unified content generation:", error);
    return OpenAIStreamingService.createErrorResponse(
      "Failed to generate content",
      500
    );
  }
}
