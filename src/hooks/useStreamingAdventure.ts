"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import * as yaml from "js-yaml";
import {
  DynamicAdventureMetadata,
  GameState,
  StoryStep,
  Choice,
  GameEffect,
  StoryContext,
  StepMetadata,
  StoryHistory,
  RegenerateMetadataRequest,
  RegenerateMetadataResponse,
} from "@/types/adventure";
import { buildStoryContext } from "@/app/helpers/buildStoryContext";
import { validateChoices } from "@/lib/choice-validator";

interface UseStreamingAdventureReturn {
  metadata: DynamicAdventureMetadata | null;
  gameState: GameState;
  currentStep: StoryStep | null;
  isLoadingStep: boolean;
  error: string | null;
  recentEffects: GameEffect[];
  currentStepImage: string | null;
  makeChoice: (choice: Choice) => Promise<void>;
  continueStory: () => Promise<void>;
  dismissEffects: () => void;
  storyHistory: StoryHistory;
}

// Check if image generation is enabled via environment variable
const isImageGenerationEnabled = () => {
  return process.env.NEXT_PUBLIC_ENABLE_IMAGE_GENERATION === "true";
};

export function useStreamingAdventure(
  metadata: DynamicAdventureMetadata | null
): UseStreamingAdventureReturn {
  const [gameState, setGameState] = useState<GameState>({
    hearts: 3,
    score: 0,
  });
  const isStarted = useRef(false);
  const [currentStep, setCurrentStep] = useState<StoryStep | null>(null);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentEffects, setRecentEffects] = useState<GameEffect[]>([]);
  const [currentStepImage, setCurrentStepImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Story history for context
  const [storyHistory, setStoryHistory] = useState<StoryHistory>([]);

  // Regenerate metadata for current step
  const regenerateMetadata = useCallback(
    async (step: StoryStep, context: StoryContext): Promise<Choice[]> => {
      console.log("Regenerating metadata for step:", step.title);

      try {
        const request: RegenerateMetadataRequest = {
          stepContent: step.content,
          stepChoices: step.choices,
          stepTitle: step.title,
          context,
        };

        const response = await fetch("/api/regenerate-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error("Failed to regenerate metadata");
        }

        const result: RegenerateMetadataResponse = await response.json();

        if (!validateChoices(result.choices)) {
          throw new Error(result.error || "Invalid metadata response");
        }

        console.log("Successfully regenerated metadata:", result.choices);
        return result.choices;
      } catch (err) {
        console.error("Failed to regenerate metadata:", err);
        throw err;
      }
    },
    []
  );

  const parseMetadata = useCallback(
    (fullContent: string, context: StoryContext): Partial<StoryStep> => {
      // Check for error messages first
      if (fullContent.includes("---ERROR---")) {
        console.error("Error in generated content:", fullContent);
        return {};
      }

      // Extract title from content
      const titleMatch = fullContent.match(/^# (.+)/m);
      const title = titleMatch ? titleMatch[1] : "Untitled Step";

      // Check if YAML metadata exists
      const yamlMatch = fullContent.match(/\n---\n([\s\S]*?)$/);
      let hasLoadedContent = false;
      let choices: Choice[] = [];
      let content = "";

      if (yamlMatch) {
        // Parse existing YAML metadata
        try {
          const yamlContent = yamlMatch[1].trim();
          const metadata = yaml.load(yamlContent) as StepMetadata;

          // Extract story content (everything between title and YAML)
          const contentMatch = fullContent.match(/^# .+\n\n([\s\S]*?)\n---\n/);
          content = contentMatch ? contentMatch[1].trim() : "";

          hasLoadedContent = true;

          // Store raw choices without validation - validation happens later
          choices = metadata.choices || [];
        } catch {
          // Fall through to handle as no metadata
          return {};
        }
      } else {
        // Extract story content (everything after title)
        const contentMatch = fullContent.match(/^# .+\n\n([\s\S]*)/) ?? "";
        content = contentMatch
          ? contentMatch[1].trim().replace(/---/g, "")
          : "";
      }

      return {
        stepType: context.stepType,
        hasLoadedContent,
        title,
        content,
        choices: choices.sort(() => Math.random() - 0.5),
      };
    },
    []
  );

  // Check if step has sufficient content for image generation (50+ words)
  const hasSufficientContent = useCallback((content: string): boolean => {
    const wordCount = content.trim().split(/\s+/).length;
    return wordCount >= 50 || content.includes("---");
  }, []);

  // Generate image for current step
  const generateStepImage = useCallback(
    async (step: StoryStep) => {
      // Skip image generation if disabled via environment variable
      if (!isImageGenerationEnabled()) {
        console.log("Image generation is disabled via environment variable");
        return;
      }

      if (!metadata?.theme || !step.content || isGeneratingImage) return;

      setIsGeneratingImage(true);
      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stepDescription: step.content,
            theme: metadata.theme,
          }),
        });

        if (!response.ok) {
          // If image generation is disabled (403), silently skip without error
          if (response.status === 403) {
            console.log("Image generation is disabled via feature flag");
            return;
          }
          throw new Error("Failed to generate image");
        }

        const { imageUrl } = await response.json();
        setCurrentStepImage(imageUrl);
      } catch (err) {
        console.error("Failed to generate step image:", err);
        // Don't set error state for image generation failures
      } finally {
        setIsGeneratingImage(false);
      }
    },
    [metadata?.theme, isGeneratingImage]
  );

  const generateStreamingStep = useCallback(
    async (
      gameState: GameState,
      choiceText?: string,
      choiceHadEffects?: boolean,
      choiceEffectType?: "positive" | "negative"
    ): Promise<void> => {
      setIsLoadingStep(true);
      setError(null);
      const prevStep = currentStep;

      try {
        const context: StoryContext = buildStoryContext({
          metadata,
          previousChoice: {
            text: choiceText,
            effectType: choiceHadEffects ? choiceEffectType : null,
          },
          gameState,
          history: storyHistory,
        });

        // Create initial streaming step
        const streamingStep: StoryStep = {
          title: "",
          content: "",
          choices: [],
          hasLoadedContent: false,
          stepType: context.stepType,
          isStreaming: true,
        };

        setCurrentStep({ ...streamingStep });

        const response = await fetch("/api/generate-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "story-step",
            context,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate step");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response stream available");
        }

        let fullContent = "";
        let imageGenerationTriggered = false;
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;

          // Parse streaming content and update the step in real-time
          Object.assign(streamingStep, parseMetadata(fullContent, context));

          setCurrentStep({ ...streamingStep });

          // Trigger image generation when sufficient content is available
          if (
            !imageGenerationTriggered &&
            !choiceHadEffects &&
            streamingStep.content &&
            hasSufficientContent(streamingStep.content)
          ) {
            imageGenerationTriggered = true;
            generateStepImage(streamingStep);
          }
        }

        streamingStep.isStreaming = false;
        streamingStep.hasLoadedContent = true;

        // Final validation: Double-check that the choices are valid and correct
        if (streamingStep.stepType === "educational") {
          try {
            const regeneratedChoices = await regenerateMetadata(
              streamingStep,
              context
            );
            streamingStep.choices = regeneratedChoices;
          } catch (regenerationError) {
            console.error("Failed to regenerate metadata:", regenerationError);
            setError("Failed to generate valid choices. Please try again.");
            return;
          }
        }

        if (prevStep) {
          setStoryHistory((prev) => [
            ...prev.slice(0, -1),
            { ...prevStep, choice: choiceText },
            { ...streamingStep },
          ]);
        } else {
          setStoryHistory((prev) => [...prev, { ...streamingStep }]);
        }

        setCurrentStep(streamingStep);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate step";
        setError(errorMessage);
      } finally {
        setIsLoadingStep(false);
      }
    },
    [
      generateStepImage,
      hasSufficientContent,
      metadata,
      parseMetadata,
      currentStep,
      storyHistory,
      regenerateMetadata,
    ]
  );

  const makeChoice = useCallback(
    async (choice: Choice) => {
      if (!choice) return;

      const newState = {
        ...gameState,
      };

      const effects: GameEffect[] = [];

      // Handle educational step scoring
      if (currentStep?.stepType === "educational") {
        if (choice.correct === true) {
          // Correct answer - gain points
          const scoreGain = 10;
          newState.score += scoreGain;
          effects.push({
            type: "gain_score",
            name: "Score gained",
            value: scoreGain,
          });
        } else if (choice.correct === false) {
          // Incorrect answer - lose points and heart
          const scoreLoss = -5;

          // Only show score loss effect if player actually had points to lose
          if (newState.score + scoreLoss >= 0) {
            newState.score += scoreLoss;
            effects.push({
              type: "lose_score",
              name: "Score lost",
              value: scoreLoss,
            });
          }

          effects.push({
            type: "lose_heart",
            name: "Heart lost",
          });

          newState.hearts = Math.max(0, newState.hearts - 1);
        }
      } else {
        // Non-educational steps - handle traditional heart loss
        if (choice.correct === false) {
          // Incorrect choice - lose a heart
          effects.push({
            type: "lose_heart",
            name: "Heart lost",
          });
          newState.hearts = Math.max(0, newState.hearts - 1);
        }
      }

      setRecentEffects(effects);
      setGameState(newState);

      // Determine effect type for context
      const hasEffects = effects.length > 0;
      const effectType = hasEffects ? "negative" : undefined;

      await generateStreamingStep(
        newState,
        choice.text,
        hasEffects,
        effectType
      );
    },
    [gameState, generateStreamingStep, currentStep?.stepType]
  );

  useEffect(() => {
    if (isStarted.current && metadata) return;

    setStoryHistory([]);
    isStarted.current = Boolean(metadata);

    generateStreamingStep(gameState);
  }, [generateStreamingStep, isStarted, metadata, gameState]);

  const continueStory = useCallback(async () => {
    if (!currentStep) return;
    await generateStreamingStep(gameState, "Continue");
  }, [currentStep, gameState, generateStreamingStep]);

  const dismissEffects = useCallback(() => setRecentEffects([]), []);

  return {
    metadata,
    gameState,
    currentStep,
    isLoadingStep,
    error,
    recentEffects,
    currentStepImage,
    makeChoice,
    continueStory,
    dismissEffects,
    storyHistory,
  };
}
