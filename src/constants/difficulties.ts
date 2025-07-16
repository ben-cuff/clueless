export const DIFFICULTIES = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export type Difficulty = keyof typeof DIFFICULTIES;

export const READABLE_DIFFICULTIES: Record<number, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};

export interface DifficultyInfo {
  id: Difficulty;
  db: number;
  readable: string;
}

export const DIFFICULTY_LIST: DifficultyInfo[] = Object.entries(
  DIFFICULTIES
).map(([id, db]) => ({
  id: id as Difficulty,
  db: db as number,
  readable: READABLE_DIFFICULTIES[db as number] ?? db,
}));

export enum DifficultyEnum {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}
