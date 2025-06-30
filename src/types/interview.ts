export interface Interview {
  code: string;
  codeLanguage: string;
  completed: boolean;
  createdAt: string;
  feedback: string | null;
  id: string;
  messages: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  questionNumber: number;
  updatedAt: string;
  userId: number;
  question: { difficulty: 1 | 2 | 3; title: string };
}
