export const GoalTabModes = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type GoalTabModes = (typeof GoalTabModes)[keyof typeof GoalTabModes];

export const GoalCategoryTabs = {
  HOURS: 'hours',
  QUESTIONS: 'questions',
} as const;

export type GoalCategoryTabs =
  (typeof GoalCategoryTabs)[keyof typeof GoalCategoryTabs];
