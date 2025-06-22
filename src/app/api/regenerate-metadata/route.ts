import { NextRequest } from "next/server";
import {
  RegenerateMetadataRequest,
  Choice,
  StoryContext,
} from "@/types/adventure";
import { OpenAIStreamingService } from "@/lib/openai-stream";
import { validateChoices } from "@/lib/choice-validator";
import OpenAI from "openai";
import * as yaml from "js-yaml";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to validate if choices are correct for the given content
async function validateChoicesForContent(
  stepContent: string,
  choices: Choice[]
): Promise<boolean> {
  const validationPrompt = `Validate if the given choices are appropriate and correct for the story content. Respond only with 'VALID' or 'INVALID'.

STORY CONTENT:
${stepContent}

CHOICES:
${choices
  .map(
    (choice, index) =>
      `${index + 1}. "${choice.text}" (marked as ${
        choice.correct ? "CORRECT" : "INCORRECT"
      })`
  )
  .join("\n")}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert validator for an educational adventure game. Respond with only 'VALID' or 'INVALID'.

VALIDATION CRITERIA:
- Only one choice should be marked as correct, and it should be the factually correct answer
- All choices should be relevant to the story content
- Choice texts should be appropriate and make sense in context
`,
        },
        {
          role: "user",
          content: validationPrompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
    });

    const response = completion.choices[0]?.message?.content?.trim();

    return response?.startsWith("VALID") ?? false;
  } catch (error) {
    console.error("Error validating choices:", error);
    return false;
  }
}

// Function to generate new choices
async function generateNewChoices(
  stepContent: string,
  context: StoryContext
): Promise<Choice[]> {
  const systemPrompt = `You are an expert at creating valid YAML metadata for choose-your-own-adventure games. 

CRITICAL REQUIREMENTS:
- Generate ONLY a YAML choices section.
- Each choice must have a "text" field with a non-empty string
- Each choice must have a "correct" field with a boolean value (true or false)
- Generate 3-4 choices total
- Only one choice should be correct

CONTEXT:
- Educational Subject: ${context.subject}
- Difficulty Level: ${context.level}

OUTPUT FORMAT (YAML only):
choices:
  - text: "First choice text here"
    correct: true
  - text: "Second choice text here"
    correct: false
  - text: "Third choice text here"
    correct: false`;

  const userPrompt = `Generate educational choices in YAML format for the current story content. Make the question feel natural to the story context. Only one choice should be correct.

STORY CONTENT:
${stepContent}  
`;

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
    temperature: 0.3,
    max_tokens: 300,
  });

  const generatedContent = completion.choices[0]?.message?.content
    ?.trim()
    .replace(/^```[\w]*/gm, "");

  if (!generatedContent) {
    throw new Error("No content generated");
  }

  // Parse the YAML content
  const metadata = yaml.load(generatedContent) as { choices: unknown[] };

  if (!metadata?.choices || !Array.isArray(metadata.choices)) {
    throw new Error("Invalid YAML structure");
  }

  // Validate the choices
  if (!validateChoices(metadata.choices)) {
    throw new Error("Generated choices don't match expected schema");
  }

  return metadata.choices as Choice[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if API key is configured
    const apiKeyError = OpenAIStreamingService.validateApiKey();
    if (apiKeyError) {
      return OpenAIStreamingService.createErrorResponse(apiKeyError, 500);
    }

    const { stepContent, stepChoices, context }: RegenerateMetadataRequest =
      body;

    let finalChoices = stepChoices ?? [];

    if (!stepContent || !context) {
      return OpenAIStreamingService.createErrorResponse(
        "Story content, step title, and context are required",
        400
      );
    }

    // Attempt this 3 times before giving up
    for (let i = 0; i < 3; i++) {
      if (Array.isArray(finalChoices) && finalChoices.length > 0) {
        // Validate if the provided choices are correct for the content
        if (await validateChoicesForContent(stepContent, finalChoices)) {
          // Choices are valid, return OK
          return Response.json({
            success: true,
            choices: finalChoices.sort(() => Math.random() - 0.5),
            message: "Existing choices are valid",
          });
        } else {
          // Choices are invalid, we'll generate new ones
          console.log(`Existing choices invalid`, finalChoices);
        }
      }

      finalChoices = await generateNewChoices(stepContent, context);
    }

    throw new Error("Failed to generate new choices after 3 attempts");
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
