"use client";

import CodePlayground from "@/components/interview/code-playground";
import { Message } from "@/types/message";
import { Question_Extended } from "@/types/question";
import { apiQuestions } from "@/utils/questionsAPI";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewInterviewPage() {
  const numberOfQuestions = 20;
  const interviewId = uuidv4();

  const [question, setQuestion] = useState<Question_Extended>();
  const [isLoadingOnMount, setIsLoadingOnMount] = useState(true);
  const [messages, setMessages] = useState<Message[]>();

  useEffect(() => {
    const randomQuestionId = Math.floor(Math.random() * numberOfQuestions) + 1;

    (async () => {
      const fetchedQuestion = await apiQuestions.getQuestionById(
        randomQuestionId
      );

      setMessages([
        {
          role: "model",
          parts: [
            {
              text:
                "Welcome to the interview! Before we begin, do you have any questions? " +
                "When you're ready, please talk through your approach to the problem before you start coding. " +
                "Explaining your thought process and communication skills are an important part of the interview.",
            },
          ],
        },
      ]);

      setQuestion(fetchedQuestion);
    })();

    setIsLoadingOnMount(false);
  }, []);

  const handleCodeSave = useCallback(async (code: string) => {
    console.log(code);
  }, []);

  const handleMessageSubmit = useCallback(async (message: string) => {
    console.log(message);
  }, []);
  return (
    <div>
      {question != null && messages ? (
        <CodePlayground
          question={question}
          handleCodeSave={handleCodeSave}
          messages={messages}
          handleMessageSubmit={handleMessageSubmit}
        />
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
