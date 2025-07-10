export interface Question {
  accuracy: number;
  companies: string[];
  createdAt: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  id: number;
  title: string;
  topics: string[];
  updatedAt: string;
  titleSlug: string;
}

export interface Question_Extended extends Question {
  testCases: {
    cpp: string;
    java: string;
    csharp: string;
    python: string;
    javascript: string;
  };
  starterCode: {
    cpp: string;
    java: string;
    csharp: string;
    python: string;
    javascript: string;
  };
  solutions: {
    cpp: string;
    java: string;
    csharp: string;
    python: string;
    javascript: string;
  };
  article: string;
}

export interface QuestionWithRowNumber extends Question {
  row_num?: bigint | number;
}

export type TestcasesKey = keyof Question_Extended["testCases"];
