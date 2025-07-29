import React from 'react';

export default function AskAIContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed right-20 bottom-20 z-50 flex flex-col items-end">
      <div className="relative">{children}</div>
    </div>
  );
}
