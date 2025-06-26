import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import InterviewQuestionPage from "@/components/interview/interview-question-page";
import { Question_Extended } from "@/types/question";
import { apiQuestions } from "@/utils/questions-api";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

export default async function NewInterviewPage({
  searchParams,
}: {
  searchParams: { questionNumber: number };
}) {
  const numberOfQuestions = 3586;
  const interviewId = uuidv4();

  const randomQuestionId = Math.floor(Math.random() * numberOfQuestions) + 1;

  const { questionNumber } = searchParams;

  const questionId = questionNumber ? questionNumber : randomQuestionId;
  const question: Question_Extended = await apiQuestions.getQuestionById(
    questionId
  );

  const session = await getServerSession(authOptions);
  if (!session || typeof session.user.id !== "number") {
    redirect("/");
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <InterviewQuestionPage
        question={question}
        interviewId={interviewId}
      />
    </Suspense>
  );
}
