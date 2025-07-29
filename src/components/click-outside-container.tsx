import { useEffect, useRef } from 'react';

export default function ClickOutsideContainer({
  children,
  handleClickOutside,
}: {
  children: React.ReactNode;
  handleClickOutside: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClickOutside();
      }
    }

    document.addEventListener('mousedown', onDocumentClick);
    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
    };
  }, [handleClickOutside]);

  return <div ref={containerRef}>{children}</div>;
}
