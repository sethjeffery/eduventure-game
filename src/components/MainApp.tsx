"use client";

import React, { useCallback, useState } from "react";
import { DynamicAdventureMetadata } from "@/types/adventure";
import { StreamingAdventureGame } from "./StreamingAdventureGame";
import { AdventureGenerator } from "./AdventureGenerator";

type AppState = "menu" | "playing-dynamic";

export function MainApp() {
  const [appState, setAppState] = useState<AppState>("menu");
  const [dynamicAdventure, setDynamicAdventure] =
    useState<DynamicAdventureMetadata | null>(null);

  const handleAdventureGenerated = useCallback(
    (metadata: DynamicAdventureMetadata) => {
      console.log("handleAdventureGenerated", metadata);
      setDynamicAdventure(metadata);
      setAppState("playing-dynamic");
    },
    []
  );

  const handleBackToMenu = useCallback(() => {
    setAppState("menu");
    setDynamicAdventure(null);
  }, []);

  if (appState === "playing-dynamic" && dynamicAdventure) {
    return (
      <StreamingAdventureGame
        adventureMetadata={dynamicAdventure}
        onAdventureComplete={handleBackToMenu}
      />
    );
  }

  return <AdventureGenerator onAdventureGenerated={handleAdventureGenerated} />;
}
