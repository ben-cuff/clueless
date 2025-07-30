import React, { SetStateAction } from 'react';
import { Button } from '../ui/button';

export default function OverrideCodeEditorButton({
  setIsCoding,
  className,
}: {
  setIsCoding: React.Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  return (
    <Button
      onClick={() => {
        setIsCoding(true);
      }}
      className={className}
    >
      Force Begin Coding
    </Button>
  );
}
