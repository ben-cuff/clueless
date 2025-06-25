"use client";

import CodePlayground from "@/components/interview/code-playground";
import { Question_Extended } from "@/types/question";
import { apiQuestions } from "@/utils/questionsAPI";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewInterviewPage() {
  const numberOfQuestions = 20;
  const [interviewId, setInterviewId] = useState("");
  const [question, setQuestion] = useState<Question_Extended>();
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

  async function handleCodeSave(code: string) {
    console.log(code);
  }
  return (
    <div>
      {question != null ? (
        <CodePlayground question={question} handleCodeSave={handleCodeSave} />
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
