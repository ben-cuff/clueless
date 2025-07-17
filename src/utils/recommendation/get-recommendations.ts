import { CORE_QUESTIONS } from '@/constants/core-questions';
import { DifficultyEnum } from '@/constants/difficulties';
import {
  COMPANY_SCALER,
  DIFFICULTY_SCALER,
  NOISE_SCALER,
  TOPICS_SCALER,
} from '@/constants/recommendation-scalers';
import { InterviewWithFeedback } from '@/types/interview';
import { QuestionPartial } from '@/types/question';
import { Nullable } from '@/types/util';
import { Company, Topic } from '@prisma/client';
import { millisecondsInDay } from 'date-fns/constants';
import { getCompanyWeights } from './company';
import { getDifficultyWeights } from './difficulty';
import { getTopicWeights } from './topic';

function getRecommendedQuestions(
  interviews: InterviewWithFeedback[],
  questions: QuestionPartial[],
  companies: Nullable<Company[]>
): QuestionPartial[] {
  // Filter interviews to only include those with feedback given in the last 30 days
  const recentInterviews = getRecentValidInterviews(interviews);

  // Filter out questions that have received feedback recently
  const filteredQuestions = removeRecentQuestions(recentInterviews, questions);

  const topicWeights = getTopicWeights(recentInterviews);
  const difficultyWeights = getDifficultyWeights(recentInterviews);
  const companyWeights = getCompanyWeights(companies, recentInterviews);

  if (difficultyWeights == null) {
    return CORE_QUESTIONS as QuestionPartial[];
  }

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
  const LONGEST_VALID_INTERVIEW_DAYS = 30;

  return interviews.filter(
    (interview) =>
      interview.feedback != null &&
      interview.feedback?.feedbackNumber !== NO_FEEDBACK_NUMBER &&
      interview.updatedAt >
        new Date(Date.now() - millisecondsInDay * LONGEST_VALID_INTERVIEW_DAYS) // within the last 30 days
  );
}

function removeRecentQuestions(
  interviews: InterviewWithFeedback[],
  questions: QuestionPartial[]
) {
  return questions.filter(
    (question) =>
      !interviews.some((interview) => interview.questionNumber === question.id)
  );
}

/**
 * For example, if the topicWeights map contains {'Arrays': 0.5, 'Dynamic Programming': 0.7, 'Trees': 0.3},
 * the difficultyWeights map contains {EASY: 0.4, MEDIUM: 0.6, HARD: 0.8},
 * and the companyWeights map contains {'Google': 0.2, 'Meta': 0.1},
 * then for a question with topics ['Arrays', 'Trees'], difficulty HARD, and companies ['Google'],
 * the question's weight would be calculated as:
 * (0.5 + 0.3) * TOPICS_SCALER + 0.8 * DIFFICULTY_SCALER + 0.2 * COMPANY_SCALER + noise * NOISE_SCALER,
 * where noise is a random value between 0 and NOISE_SCALER.
 * After calculating the weights for all questions, they are sorted in descending order based on their weights.
 */
function getSortedWeightedQuestions(
  questions: QuestionPartial[],
  topicWeights: Map<Topic, number>,
  difficultyWeights: Map<DifficultyEnum, number>,
  companyWeights: Map<Company, number>
): QuestionPartial[] & { weight: number }[] {
  const weightedQuestions = questions.map((question) => {
    return getTotalWeightForQuestion(
      question,
      topicWeights,
      difficultyWeights,
      companyWeights
    );
  });

  weightedQuestions.sort((a, b) => b.weight - a.weight);
  return weightedQuestions;
}

// Calculates the total weight for a question based on its topics, difficulty, companies and scalers.
function getTotalWeightForQuestion(
  question: QuestionPartial,
  topicWeights: Map<Topic, number>,
  difficultyWeights: Map<DifficultyEnum, number>,
  companyWeights: Map<Company, number>
): QuestionPartial & { weight: number } {
  let totalWeight = 0;

  const numTopics = question.topics.length || 1;
  question.topics.forEach((topic) => {
    totalWeight += ((topicWeights.get(topic) ?? 0) * TOPICS_SCALER) / numTopics;
  });

  const difficultyWeight =
    (difficultyWeights.get(question.difficulty) ?? 0) * DIFFICULTY_SCALER;
  totalWeight += difficultyWeight;

  question.companies.forEach((company) => {
    totalWeight += (companyWeights.get(company) ?? 0) * COMPANY_SCALER;
  });

  totalWeight += Math.random() * NOISE_SCALER;

  return {
    ...question,
    weight: totalWeight,
  };
}

export {
  getRecentValidInterviews,
  getRecommendedQuestions,
  getSortedWeightedQuestions,
  getTotalWeightForQuestion,
  NOISE_SCALER,
  removeRecentQuestions,
};
