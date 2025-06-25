import InterviewQuestionPage from "@/components/interview/interview-question-page";
import { Question_Extended } from "@/types/question";
import { apiQuestions } from "@/utils/questionsAPI";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

export default async function NewInterviewPage() {
  const numberOfQuestions = 1;
  const interviewId = uuidv4();

  const randomQuestionId = Math.floor(Math.random() * numberOfQuestions) + 1;
  const question: Question_Extended = await apiQuestions.getQuestionById(
    randomQuestionId
  );

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <InterviewQuestionPage question={question} interviewId={interviewId} />
    </Suspense>
  );
}
