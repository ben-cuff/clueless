import CompaniesList from '@/components/companies-list';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Company, InterviewType } from '@prisma/client';
import StartInterviewButton from '../start-interview-button';

export default function QuestionAdditionalInfoCard({
  companies,
  id,
  accuracy,
  className = 'h-full min-w-100',
}: {
  companies: Company[];
  id: number;
  accuracy: number;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>Additional Information</CardHeader>
      <CardContent>
        <CompaniesList text="Tagged Companies: " companies={companies} />
        <p className="text-sm">Average Accuracy: {accuracy.toPrecision(2)}%</p>
        <div className="mt-2 flex flex-col gap-2 w-1/2 mx-auto">
          <StartInterviewButton
            questionNumber={id}
            text="Start Interview"
            type={InterviewType.UNTIMED}
          />
          <StartInterviewButton
            questionNumber={id}
            text="Start Timed Interview"
            type={InterviewType.TIMED}
          />
        </div>
      </CardContent>
    </Card>
  );
}
