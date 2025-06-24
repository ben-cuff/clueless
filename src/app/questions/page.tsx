"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { READABLE_COMPANIES } from "@/constants/companies";
import { READABLE_DIFFICULTIES } from "@/constants/difficulties";
import { READABLE_TOPICS } from "@/constants/topics";
import { apiQuestions } from "@/utils/questionsAPI";
import { useEffect, useState } from "react";

type Question = {
  accuracy: number;
  companies: string[];
  createdAt: string;
  difficulty: number;
  prompt: string;
  questionNumber: number;
  title: string;
  topics: string[];
  updatedAt: string;
};

export default function QuestionsPage() {
  const [questionsData, setQuestionsData] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await apiQuestions.getQuestions();
      setQuestionsData(data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="w-full text-2xl font-bold mb-6">Questions</h1>
      {isLoading ? (
        <div className="flex flex-col w-full space-y-2">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6"
            >
              <Skeleton className="h-7 w-10 rounded" />
              <Skeleton className="h-7 w-48 rounded" />
              <Skeleton className="h-7 w-20 rounded ml-5" />
              <div className="flex flex-wrap gap-2 ml-auto">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : questionsData ? (
        <div className="flex flex-col w-full space-y-2">
          {questionsData.map((q, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6"
            >
              <h2 className="text-xl font-semibold">
                {q.questionNumber}. {q.title}
              </h2>
              <div
                className={
                  q.difficulty === 1
                    ? "text-green-600"
                    : q.difficulty === 2
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {READABLE_DIFFICULTIES[q.difficulty]}
              </div>
              <div className="ml-5 font-bold">
                {q.companies
                  .map((company) => READABLE_COMPANIES[company])
                  .join(", ")}
              </div>
              <div className="flex flex-wrap gap-2 ml-auto">
                {q.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-card rounded-full text-sm"
                  >
                    {READABLE_TOPICS[topic]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No questions found.</div>
      )}
    </div>
  );
}
