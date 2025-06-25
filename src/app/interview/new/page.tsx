"use client";

import CodePlayground from "@/components/interview/code-playground";
import { Message } from "@/types/message";
import { Question_Extended } from "@/types/question";
import { chatAPI } from "@/utils/chatAPI";
import { apiQuestions } from "@/utils/questionsAPI";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewInterviewPage() {
  const numberOfQuestions = 1;
  const interviewId = uuidv4();

  const [question, setQuestion] = useState<Question_Extended>();
  const [messages, setMessages] = useState<Message[]>();
  const [isLoadingAIResponse, setisLoadingAIResponse] = useState(false);

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
  }, []);

  const handleCodeSave = useCallback(async (code: string) => {
    console.log(code);
  }, []);

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = {
      role: "user",
      parts: [{ text: message.trim() }],
    };
    setMessages((prev) => [...(prev ?? []), userMessage]);
    return userMessage;
  }, []);

  const streamModelResponse = useCallback(
    async (userMessage: Message) => {
      const response = await chatAPI.getGeminiResponse(
        messages ?? [],
        userMessage
      );

      if (!response || !response.body) {
        alert("An unexpected error occurred");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (!done) {
          const chunk = decoder.decode(result.value);
          content += chunk;

          setMessages((prev) => {
            const updated = [...(prev || [])];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              parts: [{ text: content }],
            };
            return updated;
          });
        }
      }
    },
    [messages]
  );

  const handleMessageSubmit = useCallback(
    async (message: string) => {
      const userMessage = addUserMessage(message);

      // adds a placeholder for the model's response
      setMessages((prev) => [
        ...(prev ?? []),
        {
          role: "model",
          parts: [{ text: "" }],
        },
      ]);

      await streamModelResponse(userMessage);
    },
    [addUserMessage, streamModelResponse]
  );

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
