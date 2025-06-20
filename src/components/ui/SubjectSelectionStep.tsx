import React, { useState } from "react";
import clsx from "clsx";
import { BackgroundWrapper } from "./BackgroundWrapper";
import { MenuCard } from "./Panel";
import { GradientButton, GradientButtonWithIcon } from "./GradientButton";
import { RandomSuggestionButton } from "./RandomSuggestionButton";
import {
  GraduationCap,
  Calculator,
  Flask,
  Buildings,
  Globe,
  BookOpen,
  Palette,
} from "phosphor-react";
import { EDUCATIONAL_SUBJECTS, EducationalSubject } from "@/constants";
import { SUBJECT_SUGGESTIONS } from "@/constants/subjects";

const EDUCATIONAL_SUBJECTS_ICONS = {
  maths: Calculator,
  science: Flask,
  history: Buildings,
  geography: Globe,
  language: BookOpen,
  art: Palette,
} as const;

const SUBJECT_COLORS: Record<
  EducationalSubject,
  {
    gradient: string;
    hoverGradient: string;
    shadow: string;
    iconBg: string;
  }
> = {
  maths: {
    gradient: "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600",
    hoverGradient: "hover:from-blue-500 hover:via-blue-600 hover:to-indigo-700",
    shadow: "shadow-blue-200",
    iconBg: "bg-gradient-to-br from-blue-700/50 to-blue-800/25",
  },
  science: {
    gradient: "bg-gradient-to-br from-red-400 via-red-500 to-red-600",
    hoverGradient: "hover:from-red-500 hover:via-red-600 hover:to-red-700",
    shadow: "shadow-red-200",
    iconBg: "bg-gradient-to-br from-red-700/50 to-red-800/25",
  },
  history: {
    gradient: "bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600",
    hoverGradient:
      "hover:from-amber-500 hover:via-amber-600 hover:to-orange-700",
    shadow: "shadow-amber-200",
    iconBg: "bg-gradient-to-br from-amber-700/50 to-amber-800/25",
  },
  geography: {
    gradient: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600",
    hoverGradient:
      "hover:from-emerald-500 hover:via-emerald-600 hover:to-green-700",
    shadow: "shadow-emerald-200",
    iconBg: "bg-gradient-to-br from-emerald-700/50 to-emerald-800/25",
  },
  language: {
    gradient: "bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600",
    hoverGradient:
      "hover:from-indigo-500 hover:via-indigo-600 hover:to-purple-700",
    shadow: "shadow-indigo-200",
    iconBg: "bg-gradient-to-br from-indigo-700/50 to-indigo-800/25",
  },
  art: {
    gradient: "bg-gradient-to-br from-pink-400 via-pink-500 to-rose-600",
    hoverGradient: "hover:from-pink-500 hover:via-pink-600 hover:to-rose-700",
    shadow: "shadow-pink-200",
    iconBg: "bg-gradient-to-br from-pink-700/50 to-pink-800/25",
  },
};

interface SubjectSelectionStepProps {
  onSubjectSelect: (subject: EducationalSubject | string) => void;
}

export function SubjectSelectionStep({
  onSubjectSelect,
}: SubjectSelectionStepProps) {
  const [customSubject, setCustomSubject] = useState("");

  const handleCustomSubjectSubmit = () => {
    if (customSubject.trim()) {
      onSubjectSelect(customSubject.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomSubjectSubmit();
    }
  };

  const handleRandomSubject = () => {
    const randomIndex = Math.floor(Math.random() * SUBJECT_SUGGESTIONS.length);
    const randomSubject = SUBJECT_SUGGESTIONS[randomIndex];
    setCustomSubject(randomSubject);
  };

  return (
    <BackgroundWrapper className="flex items-center justify-center p-4">
      <MenuCard>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center justify-center gap-3">
            <GraduationCap
              size={32}
              weight="fill"
              className="text-purple-600"
            />
            EduVenture
          </h1>
          <p className="text-gray-600">
            Learn while you adventure! Choose your subject to study:
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center text-black mb-6">
            What subject should I test you on?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDUCATIONAL_SUBJECTS.map((subject) => {
              const colors = SUBJECT_COLORS[subject.id];
              const Icon = EDUCATIONAL_SUBJECTS_ICONS[subject.id];

              return (
                <GradientButton
                  key={subject.id}
                  onClick={() => onSubjectSelect(subject.id)}
                  variant="custom"
                  size="lg"
                  fullWidth
                  gradient={colors.gradient}
                  hoverGradient={colors.hoverGradient}
                  shadow="light"
                  iconBg={colors.iconBg}
                  className="p-6"
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <div
                        className={clsx(
                          "p-3 rounded-full inset-shadow-sm group-hover:bg-opacity-70 transition-all duration-300",
                          colors.iconBg
                        )}
                      >
                        <Icon
                          size={28}
                          weight="fill"
                          className="drop-shadow-sm"
                        />
                      </div>
                      <div className="text-left text-shadow-sm">
                        <h3 className="font-bold text-xl mb-1 drop-shadow-sm">
                          {subject.name}
                        </h3>
                        <p className="text-sm opacity-90 font-medium">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </GradientButton>
              );
            })}
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 font-medium bg-white px-2">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Custom Subject Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-black">
              Enter any subject you&apos;d like to learn about:
            </h3>

            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Astronomy, Psychology, Cooking, Music Theory..."
                  className="w-full px-4 py-3 pr-12 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-black placeholder-gray-500 shadow bg-white"
                />
                <RandomSuggestionButton
                  onRandomSelect={handleRandomSubject}
                  tooltipContent="Get a random subject idea"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  size={18}
                />
              </div>

              <GradientButtonWithIcon
                onClick={handleCustomSubjectSubmit}
                disabled={!customSubject.trim()}
                variant="primary"
                size="md"
                arrow
              >
                Continue
              </GradientButtonWithIcon>
            </div>
          </div>
        </div>
      </MenuCard>
    </BackgroundWrapper>
  );
}
