import { Question } from '@prisma/client';

export type QuestionPartial = Pick<
  Question,
  | 'accuracy'
  | 'createdAt'
  | 'difficulty'
  | 'prompt'
  | 'id'
  | 'title'
  | 'updatedAt'
  | 'titleSlug'
  | 'companies'
  | 'topics'
>;

export interface QuestionWithRowNumber extends QuestionPartial {
  row_num?: bigint | number;
}

export type TestcasesKey = keyof Question['testCases'];
