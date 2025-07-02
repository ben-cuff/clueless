"use client";

import { useEffect } from "react";

export default function AlertClient({ message }: { message: string }) {
  useEffect(() => {
    if (message && message.trim() != "") {
      alert(message);
    }
  }, [message]);
  return <></>;
}
