import { Activity, GoalType } from '@prisma/client';

const ACTIVITY_FIELD_MAP: Record<GoalType, keyof Activity> = {
  QUESTION: 'questions',
  SECOND: 'seconds',
};

export { ACTIVITY_FIELD_MAP };
