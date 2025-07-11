import { interactionAPI } from "@/utils/interaction-api";
import { useCallback, useEffect } from "react";
import useDebounce from "./use-debouncer";

export default function useDebouncedInteraction(
  value: string | number | readonly string[] | undefined,
  defaultInteractionName: string = "change_in_component",
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
    console.log(debouncedValue);
  }, [debouncedValue, sendInteractionData]);
}
