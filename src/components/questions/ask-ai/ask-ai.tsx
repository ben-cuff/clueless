import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCallback, useState } from 'react';
import CircleButton from './circle-button';

export default function AskAI() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const submitQuestionQuery = useCallback(() => {
    setMessage('');
  }, []);

  return (
    <div className="fixed right-20 bottom-20 z-50 flex flex-col items-end">
      <div className="relative">
        <div
          className={`transition-all duration-300 ${
            open
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          <Card className="flex flex-col w-full max-w-md shadow-lg min-w-100 min-h-40">
            <CardHeader>Ask AI for Questions</CardHeader>
            <CardContent className="flex flex-1 flex-col h-full">
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
                  className="w-full resize-none max-h-10"
                />
                <Button type="submit" className="h-full my-auto py-4">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="absolute -bottom-6 -right-6">
          <CircleButton onClick={() => setOpen((prev) => !prev)} />
        </div>
      </div>
    </div>
  );
}
