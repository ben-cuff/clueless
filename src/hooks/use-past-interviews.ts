import { UserIdContext } from '@/components/providers/user-id-provider';
import { AuthError, InterviewAPIError } from '@/errors/api-errors';
import { NotFoundError } from '@/errors/not-found';
import { Interview } from '@/types/interview';
import { InterviewAPI } from '@/utils/interview-api';
import { errorLog } from '@/utils/logger';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function usePastInterviews() {
  const [pastInterviewData, setPastInterviewData] = useState<Interview[]>();
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const userId = useContext(UserIdContext);

  useEffect(() => {
    (async () => {
      if (userId !== -1) {
        try {
          const data = await InterviewAPI.getInterviewsByUserId(userId);
          setPastInterviewData(data);
        } catch (error) {
          if (error instanceof AuthError) {
            alert('Authentication error. Please log in again.');
          } else if (error instanceof InterviewAPIError) {
            alert(`Failed to fetch past interviews: ${error.message}`);
            errorLog('Failed to fetch past interviews: ' + error);
          } else {
            alert(`Unexpected error fetching past interviews: ${error}`);
            errorLog('Unexpected error fetching past interviews: ' + error);
          }
        }
      }
      setIsLoadingInterviews(false);
    })();
  }, [userId]);

  const handleDeleteInterview = useCallback(
    async (userId: number, interviewId: string) => {
      setPastInterviewData((prev) => {
        return prev?.filter((interview) => interview.id !== interviewId);
      });
      try {
        await InterviewAPI.deleteInterview(userId, interviewId);
      } catch (error) {
        if (error instanceof AuthError) {
          alert('Authentication error. Please log in again.');
        } else if (error instanceof NotFoundError) {
          alert(`Interview with ID ${interviewId} not found.`);
        } else if (error instanceof InterviewAPIError) {
          alert(`Failed to delete interview: ${error.message}`);
          errorLog(`Failed to delete interview: ${error.message}`);
        } else {
          alert(`Unexpected error deleting interview: ${error}`);
          errorLog(`Unexpected error deleting interview: ${error}`);
        }
      }
    },
    []
  );

  return {
    handleDeleteInterview,
    pastInterviewData,
    isLoadingInterviews,
  };
}
