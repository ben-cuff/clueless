import { useState } from 'react';
import AskAICard from './ask-ai-card';
import AskAIContainer from './ask-ai-container';
import CircleButton from './circle-button';

export default function AskAI() {
  const [open, setOpen] = useState(false);

  return (
    <AskAIContainer>
      <AskAICard open={open} />
      <CircleButton
        containerClassName="absolute -bottom-6 -right-6"
        onClick={() => setOpen((prev) => !prev)}
      />
    </AskAIContainer>
  );
}
