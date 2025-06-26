"use client";

import CodePlayground from "@/components/interview/code-playground";
import { Message } from "@/types/message";
import { Question_Extended } from "@/types/question";
import { chatAPI } from "@/utils/chat-api";
import { interviewAPI } from "@/utils/interview-api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function InterviewQuestionPage({
  interviewId,
  question,
}: {
  interviewId: string;
  question: Question_Extended;
}) {
  // this will be refactored into a useInterview Hook in a later PR

  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const [messages, setMessages] = useState<Message[]>([
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
  const [isStreaming, setIsStreaming] = useState(false);
  const codeRef = useRef("");

  const handleCodeSave = useCallback(
    async (code: string) => {
      interviewAPI.updateCodeForInterview(
        userId?.toString() || "",
        interviewId,
        code
      );
    },
    [interviewId, userId]
  );

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = {
      role: "user",
      parts: [
        {
          text: message.trim(),
        },
      ],
    };
    setMessages((prev) => [...(prev ?? []), userMessage]);
    return userMessage;
  }, []);

  const streamModelResponse = useCallback(
    async (userMessage: Message) => {
      const userMessageWithCode = {
        ...userMessage,
        parts: [
          {
            text:
              userMessage.parts[0].text +
              "\n\nThe user's current code looks like as follows, this was included automatically, they did not choose to include it:\n\n" +
              codeRef.current,
          },
        ],
      };

      const response = await chatAPI.getGeminiResponse(
        messages ?? [],
        userMessageWithCode
      );

      if (!response || !response.body) {
        alert("An unexpected error occurred");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      setIsStreaming(true);
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
      setIsStreaming(false);
    },
    [messages]
  );

  useEffect(() => {
    (async () => {
      if (!isStreaming) {
        await interviewAPI.createOrUpdateInterview(
          userId?.toString() || "",
          interviewId,
          messages,
          question.questionNumber,
          codeRef.current,
          "python"
        );
      }
    })();
  }, [interviewId, isStreaming, messages, question.questionNumber, userId]);

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
    <CodePlayground
      question={question}
      handleCodeSave={handleCodeSave}
      messages={messages}
      handleMessageSubmit={handleMessageSubmit}
      codeRef={codeRef}
    />
  );
}
