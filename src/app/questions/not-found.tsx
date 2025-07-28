import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function NotFoundQuestion() {
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <Card className="w-1/4">
        <CardHeader className='text-red-600'>Not found</CardHeader>
        <CardContent>
          We were unable to find that specific question, please check the
          question number and try again.
        </CardContent>
      </Card>
    </div>
  );
}
