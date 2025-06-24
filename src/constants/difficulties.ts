export const DIFFICULTIES = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export type Difficulty = keyof typeof DIFFICULTIES;

export const READABLE_DIFFICULTIES: Record<number, string> = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};
