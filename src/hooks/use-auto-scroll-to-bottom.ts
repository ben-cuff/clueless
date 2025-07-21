import { useCallback, useEffect, useRef } from 'react';

export function useAutoScrollToBottom(
  content: unknown,
  scrollAreaSelector = '[data-radix-scroll-area-viewport]'
) {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const lastUserScrollRef = useRef<number>(0);

  const MAX_TIME_AFTER_SCROLL = 250; // 1/4 of a second

  // updates lastUserScrollRef after user scrolls in the container
  useEffect(() => {
    const scrollContainer =
      scrollAreaRef.current?.querySelector(scrollAreaSelector);
    if (!scrollContainer) return;

    const handleUserScroll = () => {
      lastUserScrollRef.current = Date.now();
    };

    scrollContainer.addEventListener('scroll', handleUserScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleUserScroll);
    };
  }, [scrollAreaSelector]);

  const handleScrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector(scrollAreaSelector);
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [scrollAreaSelector]);

  // scrolls to bottom if the user has not scrolled in the last MAX_TIME_AFTER_SCROLL
  useEffect(() => {
    const now = Date.now();
    if (now - lastUserScrollRef.current > MAX_TIME_AFTER_SCROLL) {
      handleScrollToBottom();
    }
  }, [content, handleScrollToBottom]);

  return {
    scrollAreaRef,
  };
}
