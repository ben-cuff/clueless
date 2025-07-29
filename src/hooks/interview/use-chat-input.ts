import { useCallback, useState } from 'react';

export default function useChatInput(
  handleMessageSubmit: (message: string) => Promise<void>
) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!message || message.trim() === '') {
      return;
    }

    setIsDisabled(true);
    await handleMessageSubmit(message);
    setIsDisabled(false);
    setMessage('');
  }, [handleMessageSubmit, message]);

  return {
    isDisabled,
    message,
    setMessage,
    handleSubmit,
  };
}
