// Educational subjects for 8-12 year olds
export const EDUCATIONAL_SUBJECTS = [
  {
    id: "maths",
    name: "Maths",
    description: "Numbers, calculations, and problem solving",
  },
  {
    id: "science",
    name: "Science",
    description: "Nature, experiments, and discoveries",
  },
  {
    id: "history",
    name: "History",
    description: "Past events, civilizations, and famous people",
  },
  {
    id: "geography",
    name: "Geography",
    description: "Countries, capitals, and natural features",
  },
  {
    id: "language",
    name: "Language Arts",
    description: "Reading, writing, and vocabulary",
  },
  {
    id: "art",
    name: "Art & Culture",
    description: "Artists, music, and creative expression",
  },
] as const;

export const DIFFICULTY_LEVELS = [
  {
    id: "easy",
    name: "Easy",
    description: "Simple questions for beginners",
    color: "green",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Moderate challenge",
    color: "yellow",
  },
  {
    id: "hard",
    name: "Hard",
    description: "Advanced questions",
    color: "red",
  },
] as const;

export type EducationalSubject = (typeof EDUCATIONAL_SUBJECTS)[number]["id"];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]["id"];
