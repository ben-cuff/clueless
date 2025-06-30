import { Interview } from "@/types/interview";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import InterviewCard from "./interview-card";

export default function InterviewList({
  pastInterviewData,
  handleDeleteInterview,
  router,
}: {
  pastInterviewData?: Interview[];
  router: AppRouterInstance;
  handleDeleteInterview: (userId: number, interviewId: string) => Promise<void>;
}) {
  return (
    <div className="flex flex-col w-full justify-around gap-4 flex-wrap mt-10">
      {pastInterviewData &&
        pastInterviewData.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            handleDeleteInterview={handleDeleteInterview}
            router={router}
          />
        ))}
      {(!pastInterviewData || pastInterviewData.length === 0) && (
        <h3 className="w-full text-3xl text-center">No interviews found</h3>
      )}
    </div>
  );
}
