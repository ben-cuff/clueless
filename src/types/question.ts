export interface Question {
  accuracy: number;
  companies: string[];
  createdAt: string;
  difficulty: number;
  prompt: string;
  questionNumber: number;
  title: string;
  topics: string[];
  updatedAt: string;
  titleSlug: string;
}

export interface Question_Extended extends Question {
  testcases: {
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

export type TestcasesKey = keyof Question_Extended["testcases"];
