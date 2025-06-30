import { useCallback, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useFeedback(interviewId: string) {
  const [isModalOpen, setIsModalOpened] = useState(true);

  const toggleModal = useCallback(() => {
    setIsModalOpened(!isModalOpen);
  }, [isModalOpen]);

  return { isModalOpen, toggleModal };
}
