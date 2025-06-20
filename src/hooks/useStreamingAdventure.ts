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
} from "@/types/adventure";
import { gameCompleted, gameOver } from "@/constants";

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
  canMakeChoice: (choice: Choice) => boolean;
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

  const canMakeChoice = useCallback((): boolean => {
    // All choices are available since no conditions are supported
    return true;
  }, []);

  const parseMetadata = useCallback(
    (
      fullContent: string,
      storyHistory: StoryHistory,
      choiceHadEffects?: boolean,
      choiceEffectType?: "positive" | "negative"
    ): Partial<StoryStep> => {
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
          choices = metadata.choices?.filter((choice) => choice) || [];
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

      // Infer step type and behavior based on StoryContext data
      // Check if player is dead (0 hearts)
      if (gameOver({ gameState: { hearts: gameState.hearts } })) {
        return {
          title,
          content,
          stepType: "death",
          isEnding: true,
        };
      }

      if (
        gameCompleted({
          difficultyLevel: metadata?.difficultyLevel,
          storyHistory,
          choiceHadEffects,
        })
      ) {
        return {
          title,
          content,
          stepType: "ending",
          isEnding: true,
        };
      }

      if (choiceHadEffects) {
        return {
          title,
          content,
          stepType:
            choiceEffectType === "negative"
              ? "consequence-negative"
              : "consequence-positive",
        };
      }

      return {
        hasLoadedContent,
        title,
        content,
        isEnding: false,
        choices: choices.sort(() => Math.random() - 0.5),
      };
    },
    [gameState.hearts, metadata?.difficultyLevel]
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

      // Determine choice type: 50% educational, 50% adventure (only for regular steps with educational context)
      const shouldUseEducationalChoices =
        metadata?.educationalSubject &&
        !choiceHadEffects &&
        gameState.hearts > 0 &&
        !gameCompleted({
          ...metadata,
          storyHistory,
          choiceHadEffects,
        }) &&
        Math.random() < 0.7; // 70% chance

      // Create initial streaming step
      const streamingStep: StoryStep = {
        title: "",
        content: "",
        choices: [],
        hasLoadedContent: false,
        stepType: shouldUseEducationalChoices ? "educational" : "regular",
        isEnding: false,
        isStreaming: true,
      };

      setCurrentStep({ ...streamingStep });

      try {
        const context: StoryContext = {
          ...metadata,
          adventureTheme: metadata?.theme ?? "",
          choiceText,
          choiceHadEffects,
          choiceEffectType,
          gameState,
          storyHistory: [
            ...storyHistory.slice(0, -1),
            ...(choiceText
              ? [{ ...storyHistory.slice(-1)[0], choice: choiceText }]
              : []),
          ],
          choiceType: shouldUseEducationalChoices ? "educational" : "adventure",
        };

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
          Object.assign(
            streamingStep,
            parseMetadata(
              fullContent,
              [...storyHistory, streamingStep],
              choiceHadEffects,
              choiceEffectType
            )
          );

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
    ]
  );

  const makeChoice = useCallback(
    async (choice: Choice) => {
      if (!choice) return;

      const newState = {
        ...gameState,
      };

      // Handle the new correct/incorrect choice logic
      if (choice.correct === false) {
        // Incorrect choice - lose a heart
        const effect = { type: "lose_heart" as const, name: "Heart lost" };
        setRecentEffects([effect]);
        newState.hearts = Math.max(0, newState.hearts - 1);
      } else {
        // Correct choice or no effect - clear any previous effects
        setRecentEffects([]);
      }

      setGameState(newState);

      // Determine effect type for context
      const hasEffects = choice.correct === false;
      const effectType = hasEffects ? "negative" : undefined;

      await generateStreamingStep(
        newState,
        choice.text,
        hasEffects,
        effectType
      );
    },
    [gameState, generateStreamingStep]
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
    canMakeChoice,
    dismissEffects,
    storyHistory,
  };
}
