import { UserIdContext } from "@/components/providers/user-id-provider";
import {
  INITIAL_MESSAGE,
  MODEL_ERROR_MESSAGE,
  NUDGE_MESSAGE,
  USER_CODE_INCLUSION_MESSAGE,
} from "@/constants/prompt-fillers";
import { Message } from "@/types/message";
import { getMessageObject } from "@/utils/ai-message";
import { chatAPI } from "@/utils/chat-api";
import { interviewAPI } from "@/utils/interview-api";
import { millisecondsInMinute } from "date-fns/constants";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function useInterview(
  interviewId: string,
  questionNumber: number
) {
  const [messages, setMessages] = useState<Message[]>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const userId = useContext(UserIdContext);
  const codeRef = useRef("");
  const hasMounted = useRef(false);
  const languageRef = useRef("python");
  const router = useRouter();

  const handleCodeSave = useCallback(
    async (code: string) => {
      if (code)
        await interviewAPI.updateCodeForInterview(
          userId || -1,
          interviewId,
          code,
          languageRef.current
        );
    },
    [interviewId, userId]
  );

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = getMessageObject("user", message);
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
              USER_CODE_INCLUSION_MESSAGE +
              codeRef.current,
          },
        ],
      };

      const response = await chatAPI.getGeminiResponse(
        messages ?? [],
        userMessageWithCode,
        questionNumber
      );

      if (!response?.ok) {
        setMessages((prev) => {
          const updated = [...(prev ?? [])];
          updated[updated.length - 1] = getMessageObject(
            "model",
            MODEL_ERROR_MESSAGE
          );
          return updated;
        });
        setIsStreaming(false);
        return;
      }

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

            const lastMessageIndex = updated.length - 1;
            updated[lastMessageIndex] = {
              ...updated[lastMessageIndex],
              parts: [{ text: content }],
            };
            return updated;
          });
        }
      }
      setIsStreaming(false);
    },
    [messages, questionNumber]
  );

  const handleMessageSubmit = useCallback(
    async (message: string) => {
      const userMessage = addUserMessage(message);

      // adds a placeholder for the model's response
      setMessages((prev) => [...(prev ?? []), getMessageObject("model", "")]);

      await streamModelResponse(userMessage);
    },
    [addUserMessage, streamModelResponse]
  );

  const handleEndInterview = useCallback(() => {
    router.push(
      `/interview/feedback/${interviewId}?questionNumber=${questionNumber}`
    );
  }, [interviewId, questionNumber, router]);

  // updates the interview in the backend
  useEffect(() => {
    if (hasMounted.current) {
      (async () => {
        if (!isStreaming && messages && messages?.length > 1) {
          await interviewAPI.createOrUpdateInterview(
            userId || -1,
            interviewId,
            messages!,
            questionNumber,
            codeRef.current,
            languageRef.current
          );

          const lastMessageContainsEndInterviewStatement = messages[
            messages.length - 1
          ].parts[0].text
            .toLowerCase()
            .includes("end interview");

          if (lastMessageContainsEndInterviewStatement) {
            router.push(
              `/interview/feedback/${interviewId}?questionNumber=${questionNumber}`
            );
          }
        }
      })();
    } else {
      hasMounted.current = true;
    }
  }, [interviewId, isStreaming, messages, questionNumber, userId, router]);

  // runs on mount to fetch the interview messages if they exist
  useEffect(() => {
    (async () => {
      const interviewData = await interviewAPI.getInterview(
        userId || -1,
        interviewId
      );
      if (!interviewData.error) {
        setMessages(interviewData.messages);
      } else {
        setMessages([getMessageObject("model", INITIAL_MESSAGE)]);
      }
      setIsLoadingMessages(false);
    })();
  }, [interviewId, userId]);

  useEffect(() => {
    let prevCode = codeRef.current;
    let prevMessages = JSON.stringify(messages);

    const interval = setInterval(() => {
      const areCodeAndMessagesUnchanged =
        prevCode === codeRef.current &&
        prevMessages === JSON.stringify(messages);

      const isPreviousMessageNudge =
        messages?.[messages.length - 1].parts[0].text === NUDGE_MESSAGE;

      if (areCodeAndMessagesUnchanged && !isPreviousMessageNudge) {
        setMessages((prev) => [
          ...(prev ?? []),
          getMessageObject("model", NUDGE_MESSAGE),
        ]);
      } else {
        prevCode = codeRef.current;
        prevMessages = JSON.stringify(messages);
      }
    }, millisecondsInMinute);

    return () => clearInterval(interval);
  }, [codeRef, messages]);

  return {
    handleCodeSave,
    messages,
    handleMessageSubmit,
    codeRef,
    isLoadingMessages,
    handleEndInterview,
    userId,
    languageRef,
  };
}
