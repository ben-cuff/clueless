import { Optional } from '@/types/util';
import { interactionAPI } from '@/utils/interaction-api';
import { useCallback, useEffect } from 'react';
import useDebounce from './use-debouncer';

export default function useDebouncedInteraction(
  value: Optional<string | number | readonly string[]>,
  defaultInteractionName: string = 'change_in_component',
  interactionName?: string,
  delay: number = 500
) {
  const debouncedValue = useDebounce(value, delay);

  const sendInteractionData = useCallback(
    async (value: string) => {
      const pathname = window.location.pathname;
      const name = interactionName ?? defaultInteractionName;
      interactionAPI.addEvent(name, pathname, value);
    },
    [defaultInteractionName, interactionName]
  );

  useEffect(() => {
    if (debouncedValue) {
      sendInteractionData(debouncedValue as string);
    }
  }, [debouncedValue, sendInteractionData]);
}
