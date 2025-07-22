export const GoalTabsType = {
  CREATE: 'create',
  UPDATE: 'update',
} as const;

export type GoalTabsType = (typeof GoalTabsType)[keyof typeof GoalTabsType];
