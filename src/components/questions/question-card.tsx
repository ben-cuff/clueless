import { READABLE_COMPANIES } from "@/constants/companies";
import { READABLE_DIFFICULTIES } from "@/constants/difficulties";
import { Question } from "@/constants/question";
import { READABLE_TOPICS } from "@/constants/topics";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function QuestionCard({ question }: { question: Question }) {
  const difficultyClassMap: Record<number, string> = {
    1: "text-green-600",
    2: "text-yellow-600",
    3: "text-red-600",
  };

  const leetcodeLink = `https://leetcode.com/problems/${question.titleSlug}`;

  return (
    <Link href={leetcodeLink}>
      <div className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6">
        <h2 className="text-xl font-semibold">
          {question.questionNumber}. {question.title}
        </h2>
        <div className={difficultyClassMap[question.difficulty]}>
          {READABLE_DIFFICULTIES[question.difficulty]}
        </div>
        <div className="ml-5 font-bold">
          {question.companies
            .map((company: string) => READABLE_COMPANIES[company])
            .join(", ")}
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          {question.topics.map((topic: string) => (
            <Badge key={topic} className="px-2 py-1 rounded-full text-sm">
              {READABLE_TOPICS[topic]}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
