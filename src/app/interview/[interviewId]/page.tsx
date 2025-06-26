import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import InterviewQuestionPage from "@/components/interview/interview-question-page";
import { Question_Extended } from "@/types/question";
import { apiQuestions } from "@/utils/questions-api";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ResumeInterviewPage({
  params,
  searchParams,
}: {
  params: { interviewId: string };
  searchParams: { questionNumber: number };
}) {
  const { interviewId } = params;

  const { questionNumber } = searchParams;

  const question: Question_Extended = await apiQuestions.getQuestionById(
    questionNumber
  );
    
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <InterviewQuestionPage
        question={question}
        interviewId={interviewId}
      />
    </Suspense>
  );
}
