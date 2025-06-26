import { Question } from "@/types/question";
import Link from "next/link";
import DifficultyBadge from "../difficulty-badge";
import CompaniesList from "./companies-list";
import QuestionCardHeader from "./question-card-header";
import TopicsBadges from "./topics-badges";

export default function QuestionCard({ question }: { question: Question }) {
  const leetcodeLink = `https://leetcode.com/problems/${question.titleSlug}`;

  return (
    <Link href={leetcodeLink}>
      <QuestionCardHeader
        title={question.title}
        questionNumber={question.questionNumber}
      >
        <DifficultyBadge difficulty={question.difficulty} />
        <CompaniesList companies={question.companies} />
        <TopicsBadges topics={question.topics} />
      </QuestionCardHeader>
    </Link>
  );
}
