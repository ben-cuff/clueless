import { UserIdContext } from '@/components/providers/user-id-provider';
import {
  END_INTERVIEW_TEXT,
  INITIAL_MESSAGE_TIMED,
  INITIAL_MESSAGE_UNTIMED,
  MODEL_ERROR_MESSAGE,
  NUDGE_MESSAGE,
  OUT_OF_TIME_MESSAGE,
  USER_CODE_INCLUSION_MESSAGE,
} from '@/constants/prompt-fillers';
import { Message } from '@/types/message';
import { Nullable } from '@/types/util';
import { getMessageObject } from '@/utils/ai-message';
import { chatAPI } from '@/utils/chat-api';
import { interviewAPI } from '@/utils/interview-api';
import { InterviewType } from '@prisma/client';
import {
  millisecondsInMinute,
  millisecondsInSecond,
  secondsInHour,
} from 'date-fns/constants';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

export default function useInterview(
  interviewId: string,
  questionNumber: number,
  type: InterviewType = InterviewType.UNTIMED
) {
  const [messages, setMessages] = useState<Message[]>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [timer, setTimer] = useState<Nullable<number>>(null);
  const userId = useContext(UserIdContext);
  const codeRef = useRef('');
  const hasMounted = useRef(false);
  const languageRef = useRef('python');
  const router = useRouter();

  const TIME_LIMIT = type === InterviewType.TIMED ? secondsInHour / 2 : null;

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
    const userMessage: Message = getMessageObject('user', message);
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

          const newMessageObject = getMessageObject(
            'model',
            MODEL_ERROR_MESSAGE
          );
          if (updated.length === 0) {
            return [newMessageObject];
          }
          updated[updated.length - 1] = newMessageObject;
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      if (!response || !response.body) {
        alert('An unexpected error occurred');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

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
      setMessages((prev) => [...(prev ?? []), getMessageObject('model', '')]);

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
            languageRef.current,
            type
          );

          const lastMessageContainsEndInterviewStatement =
            doesLastMessageContain(messages, END_INTERVIEW_TEXT);

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
  }, [
    interviewId,
    isStreaming,
    messages,
    questionNumber,
    userId,
    router,
    type,
  ]);

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
        setMessages([
          getMessageObject(
            'model',
            type === InterviewType.TIMED
              ? INITIAL_MESSAGE_TIMED
              : INITIAL_MESSAGE_UNTIMED
          ),
        ]);
      }
      setIsLoadingMessages(false);
    })();
  }, [interviewId, type, userId]);

  useEffect(() => {
    let prevCode = codeRef.current;
    let prevMessages = JSON.stringify(messages);

    const DURATION_BETWEEN_NUDGES = millisecondsInMinute * 2;

    const interval = setInterval(() => {
      const areCodeAndMessagesUnchanged =
        prevCode === codeRef.current &&
        prevMessages === JSON.stringify(messages);

      const isPreviousMessageNudge = doesLastMessageContain(
        messages,
        NUDGE_MESSAGE
      );

      if (areCodeAndMessagesUnchanged && !isPreviousMessageNudge) {
        setMessages((prev) => [
          ...(prev ?? []),
          getMessageObject('model', NUDGE_MESSAGE),
        ]);
      } else {
        prevCode = codeRef.current;
        prevMessages = JSON.stringify(messages);
      }
    }, DURATION_BETWEEN_NUDGES);

    return () => clearInterval(interval);
  }, [codeRef, messages]);

  useEffect(() => {
    if (type !== InterviewType.TIMED) return;

    if (timer === null && TIME_LIMIT) {
      setTimer(TIME_LIMIT);
      return;
    }

    if (timer === 0) {
      setMessages((prev) => [
        ...(prev ?? []),
        getMessageObject('model', OUT_OF_TIME_MESSAGE),
      ]);
      handleEndInterview();
      return;
    }

    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev ?? 0) - 1);
      }, millisecondsInSecond);
      return () => clearInterval(interval);
    }
  }, [type, TIME_LIMIT, timer, handleEndInterview]);

  return {
    handleCodeSave,
    messages,
    handleMessageSubmit,
    codeRef,
    isLoadingMessages,
    handleEndInterview,
    userId,
    languageRef,
    timer,
  };
}

function doesLastMessageContain(
  messages: Message[] | undefined,
  text: string
): boolean {
  if (!messages || messages.length === 0) {
    return false;
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage.parts || lastMessage.parts.length === 0) {
    return false;
  }

  return lastMessage.parts[0].text.includes(text);
}
