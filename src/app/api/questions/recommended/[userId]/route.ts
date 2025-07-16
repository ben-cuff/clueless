import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DifficultyEnum } from "@/constants/difficulties";
import { prismaLib } from "@/lib/prisma";
import redisLib from "@/lib/redis";
import { Question } from "@/types/question";
import { Nullable } from "@/types/util";
import {
  ForbiddenError,
  get200Response,
  get400Response,
} from "@/utils/api-responses";
import { Company, Topic } from "@prisma/client";
import { millisecondsInWeek } from "date-fns/constants";
import { getServerSession } from "next-auth";

type InterviewWithFeedback = {
  updatedAt: Date;
  questionNumber: number;
  question: {
    topics: Topic[];
    difficulty: DifficultyEnum;
    companies: Company[];
  };
  feedback: Nullable<{
    id: string;
    interviewId: string;
    feedback: string;
    feedbackNumber: number;
  }>;
};

const BOOSTS_AND_WEIGHTS = {
  [DifficultyEnum.EASY]: {
    EASY_WEIGHT: 0.5,
    MEDIUM_WEIGHT: 0.3,
    HARD_WEIGHT: 0.2,
    EASY_BOOST: 1,
    MEDIUM_BOOST: 0.5,
    HARD_BOOST: 0,
  },
  [DifficultyEnum.MEDIUM]: {
    EASY_WEIGHT: 0.3,
    MEDIUM_WEIGHT: 0.5,
    HARD_WEIGHT: 0.2,
    EASY_BOOST: 0.5,
    MEDIUM_BOOST: 1,
    HARD_BOOST: 0.2,
  },
  [DifficultyEnum.HARD]: {
    EASY_WEIGHT: 0.1,
    MEDIUM_WEIGHT: 0.2,
    HARD_WEIGHT: 0.5,
    EASY_BOOST: 0,
    MEDIUM_BOOST: 0.5,
    HARD_BOOST: 1,
  },
  ["default"]: {
    EASY_WEIGHT: 0.2,
    MEDIUM_WEIGHT: 0.3,
    HARD_WEIGHT: 0.5,
    EASY_BOOST: 0.5,
    MEDIUM_BOOST: 0.5,
    HARD_BOOST: 0.7,
  },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `recommended_questions_${userId}`;

  const cachedData = await redisLib.get(cacheKey);
  if (cachedData) {
    return get200Response(JSON.parse(cachedData));
  }

  const interviews: InterviewWithFeedback[] =
    await prismaLib.interview.findMany({
      where: {
        userId,
      },
      select: {
        updatedAt: true,
        questionNumber: true,
        question: {
          select: {
            topics: true,
            difficulty: true,
            companies: true,
          },
        },
        feedback: true,
      },
    });

  // prisma does not support random ordering directly, so we use a raw query
  const questions: Question[] = await prismaLib.$queryRawUnsafe(
    `SELECT
        "id",
        "title",
        "accuracy", 
        "difficulty",
        "topics",
        "companies",
        "titleSlug" 
       FROM "Question" ORDER BY RANDOM() LIMIT 500;`
  );

  const recommendedQuestions = getRecommendedQuestions(interviews, questions);

  // redisLib.set(cacheKey, JSON.stringify(recommendedQuestions), {
  //   EX: secondsInHour / 2, // cache for half an hour
  // });

  return get200Response(recommendedQuestions);
}

function getRecommendedQuestions(
  interviews: InterviewWithFeedback[],
  questions: Question[]
): Question[] {
  // Filter interviews to only include those with feedback given in the last 30 days
  const recentInterviews = getRecentValidInterviews(interviews);

  // Filter out questions that have received feedback in the last 30 days
  const filteredQuestions = questions.filter(
    (question) =>
      !recentInterviews.some(
        (interview) => interview.questionNumber === question.id
      )
  );

  const topicWeights = getTopicWeights(recentInterviews);
  const difficultyWeights = getDifficultyWeights(recentInterviews);

  // TODO: IMPLEMENT COMPANY WEIGHTS
  const companyWeights = new Map<string, number>();

  const weightedQuestions = getSortedWeightedQuestions(
    filteredQuestions,
    topicWeights,
    difficultyWeights,
    companyWeights
  );

  // get the top 5 questions based on the highest weights
  const recommendedQuestions = weightedQuestions.slice(0, 5);

  return recommendedQuestions;
}

function getRecentValidInterviews(
  interviews: InterviewWithFeedback[]
): InterviewWithFeedback[] {
  const NO_FEEDBACK_NUMBER = -1;

  return interviews.filter(
    (interview) =>
      interview.feedback?.feedbackNumber !== NO_FEEDBACK_NUMBER &&
      interview.updatedAt > new Date(Date.now() - millisecondsInWeek * 4) // within the last 4 weeks
  );
}

/**  ["Arrays", "Trees"] feedbackNumber: 2
 *   ["Dynamic Programming", "Arrays"] feedbackNumber: 3
 *
 *   - Arrays: (1/3 + 1/4)/2 = 0.292
 *   - Trees: (1/3)/1 = 0.333
 *   - Dynamic Programming: (1/4)/1 = 0.25
 *
 * higher weight means user has performed worse on that topic
 */
function getTopicWeights(
  interviews: InterviewWithFeedback[]
): Map<string, number> {
  const topicWeights = new Map<string, number>();
  const topicCounts = new Map<string, number>();

  interviews.forEach((interview) => {
    const weight = 1 / ((interview?.feedback?.feedbackNumber ?? 0) + 1);

    interview.question.topics.forEach((topic) => {
      const currentCount = topicCounts.get(topic) ?? 0;
      topicCounts.set(topic, currentCount + 1);

      const currentWeight = topicWeights.get(topic) ?? 0;
      topicWeights.set(topic, currentWeight + weight);
    });
  });

  for (const [topic, weight] of topicWeights.entries()) {
    const count = topicCounts.get(topic) ?? 1;
    topicWeights.set(topic, weight / count);
  }

  return topicWeights;
}

function getDifficultyWeights(
  interviews: InterviewWithFeedback[]
): Map<number, number> {
  const HARD_STRUGGLE_THRESHOLD = 0.3;
  const MEDIUM_STRUGGLE_THRESHOLD = 0.3;
  const EASY_STRUGGLE_THRESHOLD = 0.4;

  const DIFFICULTIES = [
    DifficultyEnum.EASY,
    DifficultyEnum.MEDIUM,
    DifficultyEnum.HARD,
  ];

  const struggleScores: Record<DifficultyEnum, number> = {
    [DifficultyEnum.EASY]: 0,
    [DifficultyEnum.MEDIUM]: 0,
    [DifficultyEnum.HARD]: 0,
  };
  const counts: Record<DifficultyEnum, number> = {
    [DifficultyEnum.EASY]: 0,
    [DifficultyEnum.MEDIUM]: 0,
    [DifficultyEnum.HARD]: 0,
  };

  interviews.forEach((interview) => {
    const weight = 1 / ((interview?.feedback?.feedbackNumber ?? 0) + 1);
    const difficulty = interview.question.difficulty;

    if (difficulty && DIFFICULTIES.includes(difficulty)) {
      struggleScores[difficulty] += weight;
      counts[difficulty]++;
    }
  });

  for (const diff of DIFFICULTIES) {
    if (counts[diff] > 0) {
      struggleScores[diff] /= counts[diff];
    }
  }

  const difficultyWeights = new Map<DifficultyEnum, number>();

  if (struggleScores[DifficultyEnum.EASY] > EASY_STRUGGLE_THRESHOLD) {
    applyDifficultyWeights(
      DifficultyEnum.EASY,
      difficultyWeights,
      struggleScores
    );
  } else if (
    struggleScores[DifficultyEnum.MEDIUM] > MEDIUM_STRUGGLE_THRESHOLD
  ) {
    applyDifficultyWeights(
      DifficultyEnum.MEDIUM,
      difficultyWeights,
      struggleScores
    );
  } else if (struggleScores[DifficultyEnum.HARD] > HARD_STRUGGLE_THRESHOLD) {
    applyDifficultyWeights(
      DifficultyEnum.HARD,
      difficultyWeights,
      struggleScores
    );
  } else {
    applyDifficultyWeights("default", difficultyWeights, struggleScores);
  }

  return difficultyWeights;
}

function applyDifficultyWeights(
  difficulty: DifficultyEnum | "default",
  difficultyWeights: Map<DifficultyEnum, number>,
  struggleScores: Record<DifficultyEnum, number>
) {
  difficultyWeights.set(
    DifficultyEnum.EASY,
    BOOSTS_AND_WEIGHTS[difficulty].EASY_WEIGHT +
      BOOSTS_AND_WEIGHTS[difficulty].EASY_BOOST *
        struggleScores[DifficultyEnum.EASY]
  );
  difficultyWeights.set(
    DifficultyEnum.MEDIUM,
    BOOSTS_AND_WEIGHTS[difficulty].MEDIUM_WEIGHT +
      BOOSTS_AND_WEIGHTS[difficulty].MEDIUM_BOOST *
        struggleScores[DifficultyEnum.MEDIUM]
  );
  difficultyWeights.set(
    DifficultyEnum.HARD,
    BOOSTS_AND_WEIGHTS[difficulty].HARD_WEIGHT +
      BOOSTS_AND_WEIGHTS[difficulty].HARD_BOOST *
        struggleScores[DifficultyEnum.HARD]
  );
}

/**
 * For example, if the topicWeights map contains {'Arrays': 0.5, 'Dynamic Programming': 0.7, 'Trees': 0.3}
 * and a question has the topics ['Arrays', 'Trees'], then the question's weight would be calculated as 0.5 + 0.3 = 0.8.
 * After calculating the weights for all questions, they are sorted in descending order based on their weights.
 */
function getSortedWeightedQuestions(
  questions: Question[],
  topicWeights: Map<string, number>,
  difficultyWeights: Map<number, number>,
  companyWeights: Map<string, number>
): Question[] {
  const TOPICS_SCALER = 1;
  const DIFFICULTY_SCALER = 1;
  const COMPANY_SCALER = 1;

  // sum up the weights for each question based on its topics
  const weightedQuestions = questions.map((question) => {
    let totalWeight = 0;

    question.topics.forEach((topic) => {
      totalWeight += (topicWeights.get(topic) ?? 0) * TOPICS_SCALER;
    });

    totalWeight +=
      (difficultyWeights.get(question.difficulty) ?? 0) * DIFFICULTY_SCALER;

    question.companies.forEach((company) => {
      totalWeight += (companyWeights.get(company) ?? 0) * COMPANY_SCALER;
    });

    return {
      ...question,
      weight: totalWeight,
    };
  });

  weightedQuestions.sort((a, b) => b.weight - a.weight);
  return weightedQuestions;
}
