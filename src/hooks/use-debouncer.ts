// from https://medium.com/@sankalpa115/usedebounce-hook-in-react-2c71f02ff8d8

import { useEffect, useState } from 'react';

export default function useDebounce(value: unknown, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
