import InterviewLoading from "@/components/interview/interview-loading";
import InterviewQuestionPage from "@/components/interview/interview-question-page";
import { Question_Extended } from "@/types/question";
import { apiQuestions } from "@/utils/questions-api";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

export default async function NewInterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const numberOfQuestions = 3586;
  const interviewId = uuidv4();

  const randomQuestionId = Math.floor(Math.random() * numberOfQuestions) + 1;

  const resolvedSearchParams = await searchParams;
  const questionNumberParam = resolvedSearchParams["questionNumber"];
  const questionNumber = Array.isArray(questionNumberParam)
    ? questionNumberParam[0]
    : questionNumberParam;

  const questionId = questionNumber ? Number(questionNumber) : randomQuestionId;
  
  const question: Question_Extended = await apiQuestions.getQuestionById(
    questionId
  );

  if (question == null) {
    redirect("/interview");
  }

  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewQuestionPage question={question} interviewId={interviewId} />
    </Suspense>
  );
}
