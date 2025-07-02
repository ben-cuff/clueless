import { UserIdContext } from "@/components/providers/user-id-provider";
import { initialMessage, userCodeInclusion } from "@/constants/prompt-fillers";
import { Message } from "@/types/message";
import { chatAPI } from "@/utils/chat-api";
import { interviewAPI } from "@/utils/interview-api";
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
  const router = useRouter();

  const handleCodeSave = useCallback(
    async (code: string) => {
      if (code)
        interviewAPI.updateCodeForInterview(userId || -1, interviewId, code);
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
              userMessage.parts[0].text + userCodeInclusion + codeRef.current,
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
          const updated = [...(prev || [])];
          updated[updated.length - 1] = {
            role: "model",
            parts: [
              {
                text: "An error occurred while generating the response. Please try again later.",
              },
            ],
          };
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
    [messages, questionNumber]
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

  const handleEndInterview = useCallback(() => {
    router.push(
      `/interview/feedback/${interviewId}?questionNumber=${questionNumber}`
    );
  }, [interviewId, questionNumber, router]);

  useEffect(() => {
    if (hasMounted.current) {
      (async () => {
        if (!isStreaming) {
          await interviewAPI.createOrUpdateInterview(
            userId || -1,
            interviewId,
            messages!,
            questionNumber,
            codeRef.current,
            "python"
          );
          if (
            messages &&
            messages[messages?.length - 1].parts[0].text
              .toLowerCase()
              .includes("thank you for your time")
          ) {
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

  useEffect(() => {
    (async () => {
      const interviewData = await interviewAPI.getInterview(
        userId || -1,
        interviewId
      );
      if (!interviewData.error) {
        setMessages(interviewData.messages);
      } else {
        setMessages([
          {
            role: "model",
            parts: [
              {
                text: initialMessage,
              },
            ],
          },
        ]);
      }
      setIsLoadingMessages(false);
    })();
  }, [interviewId, userId]);

  return {
    handleCodeSave,
    messages,
    handleMessageSubmit,
    codeRef,
    isLoadingMessages,
    handleEndInterview,
  };
}
