import { QuestionPartial } from '@/types/question';
import { InterviewType } from '@prisma/client';
import CompaniesList from '../companies-list';
import DifficultyBadge from '../difficulty-badge';
import LeetcodeLinkImage from './leetcode-link-image';
import QuestionCardHeader from './question-card-header';
import StartInterviewButton from './start-interview-button';
import TopicsBadges from './topics-badges';

export default function QuestionCard({
  question,
  showButtons = true,
}: {
  question: QuestionPartial;
  showButtons?: boolean;
}) {
  const leetcodeLink = `https://leetcode.com/problems/${question.titleSlug}`;

  return (
    <QuestionCardHeader title={question.title} questionNumber={question.id}>
      <DifficultyBadge
        className="flex justify-center w-1/20"
        difficulty={question.difficulty as 1 | 2 | 3}
      />

      <LeetcodeLinkImage leetcodeURL={leetcodeLink} />
      <CompaniesList
        className="font-bold max-w-1/8"
        companies={question.companies}
      />
      {showButtons && (
        <>
          <StartInterviewButton questionNumber={question.id} />
          <StartInterviewButton
            questionNumber={question.id}
            text="Start Timed Interview"
            type={InterviewType.TIMED}
          />
        </>
      )}
      <TopicsBadges topics={question.topics} />
    </QuestionCardHeader>
  );
}
