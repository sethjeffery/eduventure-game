import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  // Feature flag check - return early if image generation is disabled
  if (process.env.ENABLE_IMAGE_GENERATION !== "true") {
    return NextResponse.json(
      { error: "Image generation is disabled" },
      { status: 403 }
    );
  }

  try {
    const { stepDescription, theme } = await request.json();

    if (!stepDescription || !theme) {
      return NextResponse.json(
        { error: "Step description and theme are required" },
        { status: 400 }
      );
    }

    // Create a detailed prompt for DALL-E
    const imagePrompt = createImagePrompt(stepDescription, theme);

    console.log("Generating image with prompt:", imagePrompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

function createImagePrompt(stepDescription: string, theme: string): string {
  // Extract key visual elements from the step description
  const cleanDescription = stepDescription
    .replace(/\*\*/g, "") // Remove markdown bold
    .replace(/\*/g, "") // Remove markdown italic
    .replace(/#{1,6}\s/g, "") // Remove markdown headers
    .replace(/\byou|I\b/gi, "the character")
    .replace(/\byour|my\b/gi, "the character's")
    .slice(0, 200); // Limit length

  let prompt = `A photorealistic fantasy illustration: ${theme}. ${cleanDescription}..."\n\n`;

  prompt += `DO NOT include any text, letters, numbers, or writing in the image.\n\n`;

  // Add style guidelines
  prompt += `The artwork should be:
  - Safe and appropriate for children aged 8-12
  - Fantasy/adventure themed with enchanted elements
  - Inspiring sense of wonder and adventure\n\n`;

  return prompt;
}
