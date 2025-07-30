import { FeedbackContext } from '@/components/providers/feedback-provider';
import { UserIdContext } from '@/components/providers/user-id-provider';
import PROMPT_MESSAGES from '@/constants/prompt-messages';
import { AuthError, InterviewAPIError } from '@/errors/api-errors';
import { GeminiError } from '@/errors/gemini';
import { NotFoundError } from '@/errors/not-found';
import { Message, MessageRoleType } from '@/types/message';
import { Nullable } from '@/types/util';
import getMessageObject from '@/utils/ai-message';
import { ChatAPI } from '@/utils/api/chat-api';
import { InterviewAPI } from '@/utils/api/interview-api';
import { errorLog } from '@/utils/logger';
import { InterviewType } from '@prisma/client';
import {
  millisecondsInMinute,
  millisecondsInSecond,
  secondsInHour,
} from 'date-fns/constants';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function useInterview(
  interviewId: string,
  questionNumber: number,
  type: InterviewType = InterviewType.UNTIMED
) {
  const [messages, setMessages] = useState<Message[]>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [timer, setTimer] = useState<Nullable<number>>(null);
  const [isCoding, setIsCoding] = useState(false);
  const userId = useContext(UserIdContext);
  const isFeedback = useContext(FeedbackContext);
  const codeRef = useRef('');
  const hasMounted = useRef(false);
  const languageRef = useRef('python');
  const router = useRouter();

  const TIME_LIMIT = type === InterviewType.TIMED ? secondsInHour / 2 : null; // thirty minutes for timed interviews

  const createOrUpdateInterview = useCallback(async () => {
    try {
      await InterviewAPI.createOrUpdateInterview(
        userId || -1,
        interviewId,
        messages!,
        questionNumber,
        codeRef.current,
        languageRef.current,
        type
      );
    } catch (error) {
      if (error instanceof AuthError) {
        alert(error.message);
        return;
      } else if (error instanceof InterviewAPIError) {
        errorLog('Interview API error: ' + error.message);
        return;
      }
      errorLog('Unexpected error during interview update: ' + error);
    }
  }, [userId, interviewId, messages, questionNumber, type]);

  const handleCodeSave = useCallback(
    async (code: string) => {
      const MIN_MESSAGES_TO_SAVE_CODE = 3;

      if (code && messages && messages.length >= MIN_MESSAGES_TO_SAVE_CODE) {
        try {
          await InterviewAPI.updateCodeForInterview(
            userId || -1,
            interviewId,
            code,
            languageRef.current
          );
        } catch (error) {
          if (error instanceof AuthError) {
            alert(error.message);
            return;
          } else if (error instanceof NotFoundError) {
            createOrUpdateInterview();
          } else if (error instanceof InterviewAPIError) {
            errorLog('Interview API error: ' + error.message);
            return;
          }
          errorLog('Unexpected error during code save: ' + error);
        }
      }
    },
    [createOrUpdateInterview, interviewId, messages, userId]
  );

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = getMessageObject(
      MessageRoleType.USER,
      message
    );
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
              PROMPT_MESSAGES.USER_CODE_INCLUSION_MESSAGE +
              codeRef.current,
          },
        ],
      };

      let response: Response | undefined;
      try {
        response = await ChatAPI.getGeminiResponse(
          messages ?? [],
          userMessageWithCode,
          questionNumber
        );
      } catch (error) {
        if (error instanceof AuthError) {
          alert(error.message);
          return;
        } else if (error instanceof GeminiError) {
          errorLog('Gemini API error: ' + error.message);
          handleStreamingError(setMessages, setIsStreaming);
          return;
        }
        alert('An unexpected error occurred, please retry later');
        errorLog('Unexpected error during streaming: ' + error);
        return;
      }

      if (!response || !response.body) {
        errorLog('No response or response body from Gemini API');
        handleStreamingError(setMessages, setIsStreaming);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      setIsStreaming(true);
      let done = false;
      try {
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
      } catch (error) {
        errorLog('Error during reading response stream: ' + error);
        handleStreamingError(setMessages, setIsStreaming);
        return;
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
        getMessageObject(MessageRoleType.MODEL, ''),
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

  // updates the interview in the backend
  useEffect(() => {
    if (hasMounted.current) {
      (async () => {
        if (!isStreaming && messages && messages?.length > 1) {
          createOrUpdateInterview();

          const lastMessageContainsEndInterviewStatement =
            doesLastMessageContain(
              messages,
              PROMPT_MESSAGES.END_INTERVIEW_TEXT
            );

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
    createOrUpdateInterview,
  ]);

  // runs on mount to fetch the interview messages if they exist
  useEffect(() => {
    (async () => {
      try {
        const interviewData = await InterviewAPI.getInterview(
          userId || -1,
          interviewId
        );
        setMessages(interviewData.messages);
      } catch (error) {
        if (error instanceof AuthError) {
          alert('Authentication error. Please log in again.');
        } else if (error instanceof NotFoundError) {
          // expected to happen on first load if interview does not exist
        } else if (error instanceof InterviewAPIError) {
          errorLog(`Failed to fetch interview: ${error.message}`);
          alert(`Failed to fetch interview: ${error.message}`);
        } else {
          errorLog(`Unexpected error fetching interview: ${error}`);
        }
        setMessages([
          getMessageObject(
            MessageRoleType.MODEL,
            type === InterviewType.TIMED
              ? PROMPT_MESSAGES.INITIAL_MESSAGE_TIMED
              : PROMPT_MESSAGES.INITIAL_MESSAGE_UNTIMED
          ),
        ]);
      } finally {
        setIsLoadingMessages(false);
      }
    })();
  }, [interviewId, type, userId]);

  // sets up nudges on an interval
  useEffect(() => {
    let prevCode = codeRef.current;
    let prevMessages = JSON.stringify(messages);

    const DURATION_BETWEEN_NUDGES = millisecondsInMinute * 3;

    const interval = setInterval(() => {
      const areCodeAndMessagesUnchanged =
        prevCode === codeRef.current &&
        prevMessages === JSON.stringify(messages);

      const isPreviousMessageNudge = doesLastMessageContain(
        messages,
        PROMPT_MESSAGES.NUDGE_MESSAGE
      );

      if (
        areCodeAndMessagesUnchanged &&
        !isPreviousMessageNudge &&
        !isFeedback
      ) {
        setMessages((prev) => [
          ...(prev ?? []),
          getMessageObject(
            MessageRoleType.MODEL,
            PROMPT_MESSAGES.NUDGE_MESSAGE
          ),
        ]);
      } else {
        prevCode = codeRef.current;
        prevMessages = JSON.stringify(messages);
      }
    }, DURATION_BETWEEN_NUDGES);

    return () => clearInterval(interval);
  }, [codeRef, isFeedback, messages]);

  // sets up the timer for timed interviews
  useEffect(() => {
    if (type !== InterviewType.TIMED) return;

    if (timer === null && TIME_LIMIT) {
      setTimer(TIME_LIMIT);
      return;
    }

    if (timer === 0) {
      setMessages((prev) => [
        ...(prev ?? []),
        getMessageObject(
          MessageRoleType.MODEL,
          PROMPT_MESSAGES.OUT_OF_TIME_MESSAGE
        ),
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

  useEffect(() => {
    if (
      !isCoding &&
      messages &&
      messages.some(
        (msg) =>
          msg.parts &&
          msg.parts.length > 0 &&
          msg.parts[0].text.includes(PROMPT_MESSAGES.BEGIN_CODING_MESSAGE)
      )
    ) {
      setIsCoding(true);
    }
  }, [messages, isCoding]);

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
    isCoding,
    setIsCoding,
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

function handleStreamingError(
  setMessages: Dispatch<SetStateAction<Message[] | undefined>>,
  setIsStreaming: Dispatch<SetStateAction<boolean>>
) {
  setMessages((prev) => {
    const updated = [...(prev ?? [])];

    const newMessageObject = getMessageObject(
      MessageRoleType.MODEL,
      PROMPT_MESSAGES.MODEL_ERROR_MESSAGE
    );
    if (updated.length === 0) {
      return [newMessageObject];
    }
    updated[updated.length - 1] = newMessageObject;
    return updated;
  });
  setIsStreaming(false);
}
