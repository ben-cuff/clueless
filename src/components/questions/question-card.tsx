import { Question } from "@/types/question";
import { InterviewType } from "@prisma/client";
import CompaniesList from "../companies-list";
import DifficultyBadge from "../difficulty-badge";
import LeetcodeLinkImage from "./leetcode-link-image";
import QuestionCardHeader from "./question-card-header";
import StartInterviewButton from "./start-interview-button";
import TopicsBadges from "./topics-badges";

export default function QuestionCard({ question }: { question: Question }) {
  const leetcodeLink = `https://leetcode.com/problems/${question.titleSlug}`;

  return (
    <QuestionCardHeader title={question.title} questionNumber={question.id}>
      <DifficultyBadge difficulty={question.difficulty} />
      <CompaniesList
        className="font-bold ml-5"
        companies={question.companies}
      />
      <LeetcodeLinkImage leetcodeURL={leetcodeLink} />
      <StartInterviewButton questionNumber={question.id} />
      <StartInterviewButton
        questionNumber={question.id}
        text="Start Timed Interview"
        type={InterviewType.TIMED}
      />
      <TopicsBadges topics={question.topics} />
    </QuestionCardHeader>
  );
}
