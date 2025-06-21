import { Choice } from "@/types/adventure";

/**
 * Choice Validation System
 *
 * This module provides validation utilities for choice metadata returned by the AI.
 * When the AI generates invalid choice metadata, the system automatically triggers
 * metadata regeneration to ensure valid choices are always available.
 *
 * Expected Choice Schema:
 * - text: non-empty string (required)
 * - correct: boolean (optional, used for educational validation)
 *
 * Integration with Metadata Regeneration:
 * 1. parseMetadata stores raw choices without filtering
 * 2. generateStreamingStep does final validation at completion
 * 3. If ANY choices are invalid, ALL choices are regenerated (safe approach)
 * 4. New API endpoint /api/regenerate-metadata generates valid choices
 * 5. UI shows "AI is improving choices" indicator during regeneration
 *
 * IMPORTANT: We never filter/sanitize choices because removing an invalid choice
 * could accidentally remove the only correct answer, making educational steps impossible.
 */

/**
 * Validates that ALL choices match the expected schema:
 * - text: non-empty string
 * - correct: optional boolean
 *
 * Returns false if ANY choice is invalid, ensuring all-or-nothing validation.
 */
export function validateChoices(choices: unknown[]): choices is Choice[] {
  if (!Array.isArray(choices) || choices.length === 0) {
    return false;
  }

  return choices.every((choice) => {
    if (!choice || typeof choice !== "object") {
      return false;
    }

    const { text, correct } = choice as Record<string, unknown>;

    if (typeof text === "number" || typeof text === "boolean") {
      (choice as Choice).text = text.toString();
    }

    if (typeof text !== "string" || text.trim().length === 0) {
      return false;
    }

    // correct must be boolean or undefined
    if (correct !== undefined && typeof correct !== "boolean") {
      return false;
    }

    return true;
  });
}
