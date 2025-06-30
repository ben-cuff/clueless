"use client";

import InterviewList from "@/components/interview/interview-list";
import InterviewLoading from "@/components/interview/interview-loading";
import { Button } from "@/components/ui/button";
import usePastInterviews from "@/hooks/use-past-interviews";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const { handleDeleteInterview, pastInterviewData, isLoadingInterviews } =
    usePastInterviews();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col w-full h-vh justify-center items-center">
        <Button
          onClick={() => router.push("/interview/new")}
          className="hover:cursor-pointer mt-10"
        >
          Start Random Interview
        </Button>
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
    </>
  );
}
