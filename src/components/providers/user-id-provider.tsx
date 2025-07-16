'use client';

import { createContext } from 'react';

export const UserIdContext = createContext(-1);

export default function UserIdProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: number;
}) {
  return (
    <UserIdContext.Provider value={value}>{children}</UserIdContext.Provider>
  );
}
