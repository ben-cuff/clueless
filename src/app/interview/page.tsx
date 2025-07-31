'use client';

import InterviewList from '@/components/interview/interview-list';
import InterviewLoading from '@/components/interview/interview-loading';
import { NotificationProvider } from '@/components/providers/notifications-provider';
import { Button } from '@/components/ui/button';
import usePastInterviews from '@/hooks/interview/use-past-interviews';
import { useRouter } from 'next/navigation';

export default function InterviewPage() {
  const { handleDeleteInterview, pastInterviewData, isLoadingInterviews } =
    usePastInterviews();
  const router = useRouter();

  return (
    <NotificationProvider>
      <div className="flex flex-col w-full h-[88vh] justify-center items-center">
        <div className="flex mt-10 gap-2">
          <Button onClick={() => router.push('/interview/new')}>
            Start Random Interview
          </Button>
          <Button onClick={() => router.push('/interview/new?type=TIMED')}>
            Start Random Timed Interview
          </Button>
        </div>
        {isLoadingInterviews ? (
          <InterviewLoading />
        ) : (
          <InterviewList
            pastInterviewData={pastInterviewData}
            handleDeleteInterview={handleDeleteInterview}
            router={router}
          />
        )}
      </div>
    </NotificationProvider>
  );
}
