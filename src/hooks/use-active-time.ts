import { useCallback, useEffect, useRef } from "react";

export default function useActiveTime(
  maxLastActive = 30 * 1000,
  updatePeriod = 10 * 1000,
  userId: number | null = null
) {
  const lastActive = useRef(Date.now());
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  const onActiveTime = useCallback(() => {
    console.log(updatePeriod);
    console.log(userId);
  }, [updatePeriod, userId]);

  const handleActivity = useCallback(() => {
    lastActive.current = Date.now();
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    timer.current = setInterval(() => {
      if (Date.now() - lastActive.current < maxLastActive) {
        if (onActiveTime) {
          onActiveTime();
        }
      }
    }, updatePeriod);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(timer.current);
    };
  }, [onActiveTime, handleActivity, updatePeriod, maxLastActive]);
}
