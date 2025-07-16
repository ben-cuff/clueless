import { UserIdContext } from '@/components/providers/user-id-provider';
import { Interview } from '@/types/interview';
import { interviewAPI } from '@/utils/interview-api';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function usePastInterviews() {
  const [pastInterviewData, setPastInterviewData] = useState<Interview[]>();
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const userId = useContext(UserIdContext);

  useEffect(() => {
    (async () => {
      if (userId !== -1) {
        const data = await interviewAPI.getInterviewsByUserId(userId);
        setPastInterviewData(data);
      }
      setIsLoadingInterviews(false);
    })();
  }, [userId]);

  const handleDeleteInterview = useCallback(
    async (userId: number, interviewId: string) => {
      setPastInterviewData((prev) => {
        return prev?.filter((interview) => interview.id !== interviewId);
      });
      await interviewAPI.deleteInterview(userId, interviewId);
    },
    []
  );

  return {
    handleDeleteInterview,
    pastInterviewData,
    isLoadingInterviews,
  };
}
