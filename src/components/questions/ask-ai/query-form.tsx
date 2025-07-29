import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SetStateAction } from 'react';

export default function QueryForm({
  message,
  submitQuestionQuery,
  isLoading,
  setMessage,
}: {
  message: string;
  submitQuestionQuery: () => Promise<void>;
  isLoading: boolean;
  setMessage: React.Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <Label className="mt-auto">Enter a message here:</Label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (message.trim() !== '') {
            submitQuestionQuery();
          }
        }}
        className="flex flex-row my-2 gap-2"
      >
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="w-full resize-none max-h-10 max-w-80"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (message.trim() !== '') {
                submitQuestionQuery();
              }
            }
          }}
        />
        <Button
          type="submit"
          className="h-full my-auto py-4"
          disabled={isLoading}
        >
          Submit
        </Button>
      </form>
    </>
  );
}
