import { useCallback, useState } from 'react';

export default function useOpen() {
  const [open, setOpen] = useState(false);

  const handleClickOutsideContainer = useCallback(() => {
    if (open) {
      setOpen(false);
    }
  }, [open]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return { open, handleClickOutsideContainer, toggleOpen };
}
