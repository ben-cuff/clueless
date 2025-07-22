import { millisecondsInSecond } from 'date-fns/constants';
import { useCallback, useEffect, useRef } from 'react';

const MAX_TIME_AFTER_SCROLL_DOWN = millisecondsInSecond / 4;
const MAX_TIME_AFTER_SCROLL_UP = millisecondsInSecond * 10;

export function useAutoScrollToBottom(
  content: unknown,
  scrollAreaSelector = '[data-radix-scroll-area-viewport]'
) {
  const lastScrollDirection = useRef<'up' | 'down'>('down');
  const prevScrollTop = useRef(0);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const lastUserScroll = useRef<number>(0);

  // updates lastUserScrollRef after user scrolls in the container
  useEffect(() => {
    const scrollContainer =
      scrollAreaRef.current?.querySelector(scrollAreaSelector);
    if (!scrollContainer) return;

    const handleUserScroll = () => {
      lastUserScroll.current = Date.now();
      lastScrollDirection.current =
        scrollContainer.scrollTop > prevScrollTop.current ? 'down' : 'up';
      prevScrollTop.current = scrollContainer.scrollTop;
    };

    scrollContainer.addEventListener('scroll', handleUserScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleUserScroll);
    };
  }, [scrollAreaSelector, lastScrollDirection]);

  const handleScrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector(scrollAreaSelector);
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [scrollAreaSelector]);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastScroll = now - lastUserScroll.current;

    const isdocsIdleAfterScrollDown =
      lastScrollDirection.current === 'down' &&
      timeSinceLastScroll > MAX_TIME_AFTER_SCROLL_DOWN;
    const isIdleAfterScrollUp =
      lastScrollDirection.current === 'up' &&
      timeSinceLastScroll > MAX_TIME_AFTER_SCROLL_UP;

    if (isIdleAfterScrollDown || isIdleAfterScrollUp) {
      handleScrollToBottom();
    }
  }, [content, handleScrollToBottom]);

  return {
    scrollAreaRef,
  };
}
