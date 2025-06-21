import { NextRequest } from "next/server";
import { RegenerateMetadataRequest, Choice } from "@/types/adventure";
import { OpenAIStreamingService } from "@/lib/openai-stream";
import { validateChoices } from "@/lib/choice-validator";
import OpenAI from "openai";
import * as yaml from "js-yaml";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if API key is configured
    const apiKeyError = OpenAIStreamingService.validateApiKey();
    if (apiKeyError) {
      return OpenAIStreamingService.createErrorResponse(apiKeyError, 500);
    }

    const { storyContent, stepTitle, context }: RegenerateMetadataRequest =
      body;

    if (!storyContent || !stepTitle || !context) {
      return OpenAIStreamingService.createErrorResponse(
        "Story content, step title, and context are required",
        400
      );
    }

    const systemPrompt = `You are an expert at creating valid YAML metadata for choose-your-own-adventure games. 

CRITICAL REQUIREMENTS:
- Generate ONLY the YAML choices section
- Each choice must have a "text" field with a non-empty string
- Each choice must have a "correct" field with a boolean value (true or false)
- Generate 3-4 choices total
- Only one choice should be correct: true for educational steps
- For adventure steps, mark safe choices as correct: true and dangerous ones as correct: false

CONTEXT:
- Educational Subject: ${context.educationalSubject || "N/A"}
- Difficulty Level: ${context.difficultyLevel || "N/A"}
- Step Type: ${context.choiceType || "adventure"}
- Story Title: ${stepTitle}

STORY CONTENT:
${storyContent}

OUTPUT FORMAT (YAML only):
choices:
  - text: "First choice text here"
    correct: false
  - text: "Second choice text here"
    correct: true
  - text: "Third choice text here"
    correct: false`;

    const userPrompt =
      context.choiceType === "educational"
        ? `Generate educational choices related to ${context.educationalSubject} at ${context.difficultyLevel} difficulty level. Make the question feel natural to the story context. Only one choice should be correct.`
        : `Generate adventure choices that fit the story. Mark safe/good choices as correct: true and dangerous/bad choices as correct: false.`;

    // Use non-streaming OpenAI call for precise metadata generation
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent output
      max_tokens: 300,
    });

    const generatedContent = completion.choices[0]?.message?.content?.trim();

    if (!generatedContent) {
      return Response.json(
        { success: false, error: "No content generated", choices: [] },
        { status: 500 }
      );
    }

    try {
      // Parse the YAML content
      const metadata = yaml.load(generatedContent) as { choices: unknown[] };

      if (!metadata?.choices || !Array.isArray(metadata.choices)) {
        throw new Error("Invalid YAML structure");
      }

      // Validate the choices
      if (!validateChoices(metadata.choices)) {
        throw new Error("Generated choices don't match expected schema");
      }

      const validChoices = metadata.choices as Choice[];

      return Response.json({
        success: true,
        choices: validChoices.sort(() => Math.random() - 0.5), // Randomize order
      });
    } catch (parseError) {
      console.error("Failed to parse generated metadata:", parseError);
      console.error("Generated content:", generatedContent);

      return Response.json(
        {
          success: false,
          error: "Failed to parse generated metadata",
          choices: [],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in metadata regeneration:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to regenerate metadata",
        choices: [],
      },
      { status: 500 }
    );
  }
}
