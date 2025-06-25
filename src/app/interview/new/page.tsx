"use client";

import { apiQuestions } from "@/utils/questionsAPI";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewInterviewPage() {
  const numberOfQuestions = 20;
  const [interviewId, setInterviewId] = useState("");
  const [question, setQuestion] = useState<Question>();
  const [isLoadingOnMount, setIsLoadingOnMount] = useState(true);
  useEffect(() => {
    const id = uuidv4();
    setInterviewId(id);

    const randomQuestionId = Math.floor(Math.random() * numberOfQuestions) + 1;

    console.log(randomQuestionId);

    (async () => {
      const fetchedQuestion = await apiQuestions.getQuestionById(
        randomQuestionId
      );
        
      setQuestion(fetchedQuestion);
    })();

    setIsLoadingOnMount(false);
  }, []);
  return <div>New interview page</div>;
}

interface Question {
  questionNumber: number;
  title: string;
  accuracy: number;
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
  topics: string[];
  prompt: string;
  companies: string[];
  difficulty: number;
  createdAt: string;
  updatedAt: string;
  titleSlug?: string;
}
