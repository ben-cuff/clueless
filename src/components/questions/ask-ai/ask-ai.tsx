import ClickOutsideContainer from '@/components/click-outside-container';
import useOpen from '@/hooks/use-open';
import AskAICard from './ask-ai-card';
import AskAIContainer from './ask-ai-container';
import CircleButton from './circle-button';
export default function AskAI() {
  const { open, handleClickOutsideContainer, toggleOpen } = useOpen();

  return (
    <ClickOutsideContainer handleClickOutside={handleClickOutsideContainer}>
      <AskAIContainer>
        <AskAICard open={open} />
        <CircleButton
          containerClassName="absolute -bottom-6 -right-6"
          onClick={toggleOpen}
        />
      </AskAIContainer>
    </ClickOutsideContainer>
  );
}
