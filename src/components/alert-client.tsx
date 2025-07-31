'use client';

import { useEffect, useRef } from 'react';

export default function AlertClient({ message }: { message: string }) {
  const lastAlertTime = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (
      message &&
      message.trim() !== '' &&
      now - lastAlertTime.current > 5000
    ) {
      alert(message);
      lastAlertTime.current = now;
    }
  }, [message]);
  return <></>;
}
