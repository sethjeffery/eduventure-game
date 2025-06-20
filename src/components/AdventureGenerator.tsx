"use client";

import React, { useState } from "react";
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

interface AdventureGeneratorProps {
  onAdventureGenerated: (metadata: DynamicAdventureMetadata) => void;
}

type SetupStep = "subject" | "difficulty" | "adventure";

export function AdventureGenerator({
  onAdventureGenerated,
}: AdventureGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>("subject");
  const [educationalSubject, setEducationalSubject] = useState<
    EducationalSubject | string | null
  >(null);
  const [difficultyLevel, setDifficultyLevel] =
    useState<DifficultyLevel | null>(null);
  const [prompt, setPrompt] = useState(() => {
    const randomIndex = Math.floor(Math.random() * ADVENTURE_PROMPTS.length);
    return ADVENTURE_PROMPTS[randomIndex];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubjectSelect = (subject: EducationalSubject | string) => {
    setEducationalSubject(subject);
    setCurrentStep("difficulty");
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setDifficultyLevel(difficulty);
    setCurrentStep("adventure");
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !educationalSubject || !difficultyLevel) {
      setError("Please complete all setup steps.");
      return;
    }

    setIsGenerating(true);
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
        isDynamic: true,
        educationalSubject: subjectString,
        difficultyLevel,
      };

      onAdventureGenerated(metadata);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomPrompt = () => {
    if (isGenerating) return;
    const randomIndex = Math.floor(Math.random() * ADVENTURE_PROMPTS.length);
    setPrompt(ADVENTURE_PROMPTS[randomIndex]);
  };

  const handleBack = () => {
    if (currentStep === "difficulty") {
      setCurrentStep("subject");
      setDifficultyLevel(null);
    } else if (currentStep === "adventure") {
      setCurrentStep("difficulty");
    }
  };

  // Render appropriate step component
  switch (currentStep) {
    case "subject":
      return <SubjectSelectionStep onSubjectSelect={handleSubjectSelect} />;

    case "difficulty":
      return (
        <DifficultySelectionStep
          onDifficultySelect={handleDifficultySelect}
          onBack={handleBack}
        />
      );

    case "adventure":
      return (
        <AdventureSetupStep
          selectedSubject={educationalSubject}
          prompt={prompt}
          isGenerating={isGenerating}
          error={error}
          onPromptChange={setPrompt}
          onRandomPrompt={handleRandomPrompt}
          onGenerate={handleGenerate}
          onBack={handleBack}
        />
      );

    default:
      return null;
  }
}
