import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CircleButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  return (
    <Button
      className={cn(
        className,
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
  );
}
