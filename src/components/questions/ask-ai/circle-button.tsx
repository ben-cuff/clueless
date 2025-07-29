import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CircleButton({
  containerClassName,
  buttonClassName,
  onClick,
}: {
  containerClassName?: string;
  buttonClassName?: string;
  onClick: () => void;
}) {
  return (
    <div className={containerClassName}>
      <Button
        className={cn(
          buttonClassName,
          'rounded-full w-16 h-16 p-2 flex items-center justify-center'
        )}
        variant="secondary"
        onClick={onClick}
      >
        <Image
          src="/google-gemini-logo.png"
          alt="gemini logo"
          width="100"
          height="100"
        />
      </Button>
    </div>
  );
}
