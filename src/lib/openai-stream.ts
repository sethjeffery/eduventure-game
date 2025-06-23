import { StoryContext } from "@/types/adventure";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import * as yaml from "js-yaml";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface StreamingOptions {
  context: StoryContext;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export class OpenAIStreamingService {
  static validateApiKey(): string | null {
    if (!process.env.OPENAI_API_KEY) {
      return "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file.";
    }
    return null;
  }

  static async createStreamingResponse({
    context,
    systemPrompt,
    userPrompt,
    maxTokens = 800,
    temperature = 0.8,
  }: StreamingOptions): Promise<Response> {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messages: ChatCompletionMessageParam[] = [
            {
              role: "system",
              content: systemPrompt,
            },
            ...context.history
              .slice(context.history.length - 5, context.history.length)
              .flatMap((step) => {
                // Build comprehensive step summary
                let stepSummary = `# ${step.title}\n\n`;

                // For steps with choices, include both beginning and end context
                if (step.choices && step.choices.length > 0) {
                  const content = step.content.split("---")[0];
                  const words = content.split(" ");

                  if (words.length > 100) {
                    // Take first 50 words and last 50 words for context
                    const beginning = words.slice(0, 50).join(" ");
                    const ending = words.slice(-50).join(" ");
                    stepSummary += `${beginning}...\n\n...${ending}`;
                  } else {
                    stepSummary += content;
                  }

                  // Add the choices that were presented
                  stepSummary += `\n\n---\n${yaml.dump({
                    choices: step.choices,
                  })}`;
                } else {
                  // For steps without choices, just include truncated content
                  stepSummary += step.content.slice(0, 200);
                }

                return [
                  {
                    role: "assistant" as const,
                    content: stepSummary,
                  },
                  {
                    role: "user" as const,
                    content: step.choice || "Continue",
                  },
                ];
              }),
            {
              role: "user" as const,
              content: `${userPrompt}\n\nCURRENT GAME STATE:
- Progress: ${context.progress}%`,
            },
          ];

          console.log(messages);

          const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage = `\n\n---ERROR---\nFailed to generate content: ${
            error instanceof Error ? error.message : "Unknown error"
          }`;
          controller.enqueue(new TextEncoder().encode(errorMessage));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  static createErrorResponse(message: string, status: number = 500): Response {
    return new Response(message, { status });
  }
}
