"use client";

import React, { useCallback, useState } from "react";
import { DynamicAdventureMetadata } from "@/types/adventure";
import {
  EDUCATIONAL_SUBJECTS,
  EducationalSubject,
  DifficultyLevel,
} from "@/constants";
import { ADVENTURE_PROMPTS } from "@/constants/subjects";
import { SubjectSelectionStep } from "./ui/SubjectSelectionStep";
import { DifficultySelectionStep } from "./ui/DifficultySelectionStep";
import { AdventureSetupStep } from "./ui/AdventureSetupStep";
import { EduVentureIcon } from "./ui/EduVentureIcon";
import { MenuCard } from "./ui/Panel";
import { BackgroundWrapper } from "./ui/BackgroundWrapper";

interface AdventureGeneratorProps {
  onAdventureGenerated: (metadata: DynamicAdventureMetadata) => void;
}

type SetupStep = "subject" | "difficulty" | "adventure";

function CurrentStep({
  step,
  onDifficultySelect,
  onSubjectSelect,
  onBack,
  onPromptSelect,
  error,
}: {
  step: SetupStep;
  onDifficultySelect: (difficulty: DifficultyLevel) => void;
  onSubjectSelect: (subject: EducationalSubject | string) => void;
  onBack: () => void;
  onPromptSelect: (prompt: string) => void;
  error: string | null;
}) {
  switch (step) {
    case "subject":
      return (
        <SubjectSelectionStep
          onSubjectSelect={onSubjectSelect}
          onBack={onBack}
        />
      );
    case "difficulty":
      return (
        <DifficultySelectionStep
          onDifficultySelect={onDifficultySelect}
          onBack={onBack}
        />
      );
    case "adventure":
      return (
        <AdventureSetupStep error={error} onPromptSelect={onPromptSelect} />
      );
    default:
      return null;
  }
}

export function AdventureGenerator({
  onAdventureGenerated,
}: AdventureGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>("adventure");

  const [educationalSubject, setEducationalSubject] = useState<
    EducationalSubject | string
  >("");

  const [, setDifficultyLevel] = useState<DifficultyLevel>("easy");

  const [prompt, setPrompt] = useState(() => {
    const randomIndex = Math.floor(Math.random() * ADVENTURE_PROMPTS.length);
    return ADVENTURE_PROMPTS[randomIndex];
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubjectSelect = useCallback(
    (subject: EducationalSubject | string) => {
      setEducationalSubject(subject);
      setCurrentStep("difficulty");
    },
    []
  );

  const handleGenerate = useCallback(
    async (
      educationalSubject: EducationalSubject | string,
      difficultyLevel: DifficultyLevel,
      prompt: string
    ) => {
      if (!prompt.trim() || !educationalSubject || !difficultyLevel) {
        setError("Please complete all setup steps.");
        return;
      }

      setError(null);

      try {
        // Convert EducationalSubject to string if needed
        const subjectString =
          typeof educationalSubject === "string"
            ? educationalSubject
            : EDUCATIONAL_SUBJECTS.find((s) => s.id === educationalSubject)
                ?.name || educationalSubject;

        // Create metadata with educational features
        const metadata: DynamicAdventureMetadata = {
          title: "Your Educational Adventure Begins...",
          description: `An educational adventure: ${prompt.trim()}`,
          theme: prompt.trim(),
          educationalSubject: subjectString,
          difficultyLevel,
        };

        onAdventureGenerated(metadata);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    },
    [onAdventureGenerated]
  );

  const handleDifficultySelect = useCallback(
    (difficulty: DifficultyLevel) => {
      setDifficultyLevel(difficulty);
      handleGenerate(educationalSubject, difficulty, prompt);
    },
    [educationalSubject, handleGenerate, prompt]
  );

  const handlePromptSelect = useCallback((prompt: string) => {
    setPrompt(prompt);
    setCurrentStep("subject");
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === "difficulty") {
      setCurrentStep("subject");
    } else if (currentStep === "subject") {
      setCurrentStep("adventure");
    }
  }, [currentStep]);

  // Render appropriate step component
  return (
    <BackgroundWrapper className="flex items-center justify-center p-4">
      <MenuCard>
        <h1 className="text-4xl text-black mb-4 flex items-center justify-center gap-3 font-[family-name:var(--font-adventure)]">
          <EduVentureIcon size={32} />
          EduVenture
        </h1>
        <CurrentStep
          step={currentStep}
          onDifficultySelect={handleDifficultySelect}
          onSubjectSelect={handleSubjectSelect}
          onBack={handleBack}
          onPromptSelect={handlePromptSelect}
          error={error}
        />
      </MenuCard>
    </BackgroundWrapper>
  );
}
