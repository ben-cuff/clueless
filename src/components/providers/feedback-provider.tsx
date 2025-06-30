"use client";

import { createContext } from "react";

export const FeedbackContext = createContext(false);

export default function FeedbackProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: boolean;
}) {
  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}
