import {
  COMPANY_SCALER,
  DIFFICULTY_SCALER,
  NOISE_SCALER,
  TOPICS_SCALER,
} from '@/constants/recommendation-scalers';
import { Company, Topic } from '@prisma/client';
import { millisecondsInDay, millisecondsInWeek } from 'date-fns/constants';
import { DifficultyEnum } from '../../../src/constants/difficulties';
import { InterviewWithFeedback } from '../../../src/types/interview';
import { QuestionPartial } from '../../../src/types/question';
import {
  getRecentValidInterviews,
  getRecommendedQuestions,
  getSortedWeightedQuestions,
  getTotalWeightForQuestion,
  removeRecentQuestions,
} from '../../../src/utils/recommendation/get-recommendations';

jest.mock('../../../src/utils/recommendation/company', () => ({
  getCompanyWeights: jest.fn(
    () =>
      new Map([
        ['GOOGLE', 0.8],
        ['META', 0.6],
      ])
  ),
}));

jest.mock('../../../src/utils/recommendation/difficulty', () => ({
  getDifficultyWeights: jest.fn(
    () =>
      new Map([
        [DifficultyEnum.EASY, 0.5],
        [DifficultyEnum.MEDIUM, 0.7],
        [DifficultyEnum.HARD, 0.9],
      ])
  ),
}));

jest.mock('../../../src/utils/recommendation/topic', () => ({
  getTopicWeights: jest.fn(
    () =>
      new Map([
        ['Arrays', 0.6],
        ['Trees', 0.4],
      ])
  ),
}));

const mockQuestions: QuestionPartial[] = [
  {
    id: 1,
    topics: ['ARRAY'],
    difficulty: DifficultyEnum.EASY,
    companies: ['GOOGLE'],
    title: '',
    accuracy: 0,
    prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    titleSlug: null,
  },
  {
    id: 2,
    topics: ['TREE'],
    difficulty: DifficultyEnum.MEDIUM,
    companies: ['META'],
    title: '',
    accuracy: 0,
    prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    titleSlug: null,
  },
  {
    id: 3,
    topics: ['ARRAY', 'TREE'],
    difficulty: DifficultyEnum.HARD,
    companies: ['GOOGLE', 'META'],
    title: '',
    accuracy: 0,
    prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    titleSlug: null,
  },
  {
    id: 4,
    topics: ['ARRAY'],
    difficulty: DifficultyEnum.HARD,
    companies: [],
    title: '',
    accuracy: 0,
    prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    titleSlug: null,
  },
  {
    id: 5,
    topics: ['TREE'],
    difficulty: DifficultyEnum.EASY,
    companies: [],
    title: '',
    accuracy: 0,
    prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    titleSlug: null,
  },
  {
    id: 6,
    topics: ['ARRAY'],
    difficulty: DifficultyEnum.MEDIUM,
    companies: ['META'],
    title: '',
    accuracy: 0,
    prompt: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    titleSlug: null,
  },
];

const now = new Date();
const oldDate = new Date(now.getTime() - millisecondsInWeek * 5); // 5 weeks ago

const mockInterviews: InterviewWithFeedback[] = [
  {
    questionNumber: 1,
    updatedAt: now,
    feedback: {
      feedbackNumber: 1,
      id: '',
      interviewId: '',
      feedback: '',
    },
    question: {
      topics: [],
      difficulty: DifficultyEnum.EASY,
      companies: [],
    },
  },
  {
    questionNumber: 2,
    updatedAt: oldDate,
    feedback: {
      feedbackNumber: 1,
      id: '',
      interviewId: '',
      feedback: '',
    },
    question: {
      topics: [],
      difficulty: DifficultyEnum.EASY,
      companies: [],
    },
  },
  {
    questionNumber: 3,
    updatedAt: now,
    feedback: {
      feedbackNumber: -1,
      id: '',
      interviewId: '',
      feedback: '',
    },
    question: {
      topics: [],
      difficulty: DifficultyEnum.EASY,
      companies: [],
    },
  },
];

describe('getRecommendedQuestions', () => {
  it('returns top 5 recommended questions excluding recently answered ones', () => {
    const result = getRecommendedQuestions(mockInterviews, mockQuestions, null);
    expect(result.length).toBeLessThanOrEqual(5);
    expect(result.find((q) => q.id === 1)).toBeUndefined();
    expect(result.find((q) => q.id === 2)).toBeDefined();
    expect(result.find((q) => q.id === 3)).toBeDefined();
  });

  it('returns at most 5 questions', () => {
    const result = getRecommendedQuestions([], mockQuestions, null);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('returns empty if no questions are available', () => {
    const result = getRecommendedQuestions([], [], null);
    expect(result).toEqual([]);
  });
});

describe('getTotalWeightForQuestion', () => {
  it('calculates total weight for a question based on topic, difficulty, and company weights', () => {
    const topicWeights: Map<Topic, number> = new Map([
      ['ARRAY', 0.6],
      ['TREE', 0.4],
    ]);
    const difficultyWeights = new Map([
      [DifficultyEnum.EASY, 0.5],
      [DifficultyEnum.MEDIUM, 0.7],
      [DifficultyEnum.HARD, 0.9],
    ]);
    const companyWeights: Map<Company, number> = new Map([
      ['GOOGLE', 0.8],
      ['META', 0.6],
    ]);

    const question: QuestionPartial = {
      id: 1,
      topics: ['ARRAY'],
      difficulty: DifficultyEnum.EASY,
      companies: ['GOOGLE'],
      title: '',
      accuracy: 0,
      prompt: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      titleSlug: null,
    };

    const result = getTotalWeightForQuestion(
      question,
      topicWeights,
      difficultyWeights,
      companyWeights
    );

    expect(result.weight).toBeGreaterThan(0);
    const expectedWeight =
      (topicWeights.get('ARRAY') ?? 0) * TOPICS_SCALER +
      (difficultyWeights.get(DifficultyEnum.EASY) ?? 0) * DIFFICULTY_SCALER +
      (companyWeights.get('GOOGLE') ?? 0) * COMPANY_SCALER;

    // Allow for noise in the result
    expect(result.weight).toBeGreaterThanOrEqual(expectedWeight);
    expect(result.weight).toBeLessThanOrEqual(expectedWeight + NOISE_SCALER);
  });

  it('calculates total weight for a question with multiple topics and companies', () => {
    const topicWeights: Map<Topic, number> = new Map([
      ['ARRAY', 0.6],
      ['TREE', 0.4],
    ]);
    const difficultyWeights = new Map([
      [DifficultyEnum.EASY, 0.5],
      [DifficultyEnum.MEDIUM, 0.7],
      [DifficultyEnum.HARD, 0.9],
    ]);
    const companyWeights: Map<Company, number> = new Map([
      ['GOOGLE', 0.8],
      ['META', 0.6],
    ]);

    const question: QuestionPartial = {
      id: 2,
      topics: ['ARRAY', 'TREE'],
      difficulty: DifficultyEnum.HARD,
      companies: ['GOOGLE', 'META'],
      title: '',
      accuracy: 0,
      prompt: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      titleSlug: null,
    };

    const result = getTotalWeightForQuestion(
      question,
      topicWeights,
      difficultyWeights,
      companyWeights
    );

    const avgTopicWeight =
      ((topicWeights.get('ARRAY') ?? 0) + (topicWeights.get('TREE') ?? 0)) / 2;
    const companyWeight =
      (companyWeights.get('GOOGLE') ?? 0) + (companyWeights.get('META') ?? 0);

    const expectedWeight =
      avgTopicWeight * TOPICS_SCALER +
      (difficultyWeights.get(DifficultyEnum.HARD) ?? 0) * DIFFICULTY_SCALER +
      companyWeight * COMPANY_SCALER;

    expect(result.weight).toBeGreaterThanOrEqual(expectedWeight);
    expect(result.weight).toBeLessThanOrEqual(expectedWeight + NOISE_SCALER);
  });

  it('calculates total weight for a question with no companies', () => {
    const topicWeights: Map<Topic, number> = new Map([
      ['ARRAY', 0.6],
      ['TREE', 0.4],
    ]);
    const difficultyWeights = new Map([
      [DifficultyEnum.EASY, 0.5],
      [DifficultyEnum.MEDIUM, 0.7],
      [DifficultyEnum.HARD, 0.9],
    ]);
    const companyWeights: Map<Company, number> = new Map([
      ['GOOGLE', 0.8],
      ['META', 0.6],
    ]);

    const question: QuestionPartial = {
      id: 3,
      topics: ['TREE'],
      difficulty: DifficultyEnum.MEDIUM,
      companies: [],
      title: '',
      accuracy: 0,
      prompt: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      titleSlug: null,
    };

    const result = getTotalWeightForQuestion(
      question,
      topicWeights,
      difficultyWeights,
      companyWeights
    );

    const topicWeight = topicWeights.get('TREE') ?? 0;
    const difficultyWeight = difficultyWeights.get(DifficultyEnum.MEDIUM) ?? 0;
    const expectedWeight =
      topicWeight * TOPICS_SCALER + difficultyWeight * DIFFICULTY_SCALER;

    expect(result.weight).toBeGreaterThanOrEqual(expectedWeight);
    expect(result.weight).toBeLessThanOrEqual(expectedWeight + NOISE_SCALER);
  });
});

describe('getSortedWeightedQuestions', () => {
  it('returns questions sorted by weight in descending order', () => {
    const topicWeights: Map<Topic, number> = new Map([
      ['ARRAY', 0.6],
      ['TREE', 0.4],
    ]);
    const difficultyWeights = new Map([
      [DifficultyEnum.EASY, 0.5],
      [DifficultyEnum.MEDIUM, 0.7],
      [DifficultyEnum.HARD, 0.9],
    ]);
    const companyWeights: Map<Company, number> = new Map([
      ['GOOGLE', 0.8],
      ['META', 0.6],
    ]);

    const result = getSortedWeightedQuestions(
      mockQuestions,
      topicWeights,
      difficultyWeights,
      companyWeights
    );

    expect(result.length).toBe(mockQuestions.length);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].weight).toBeGreaterThanOrEqual(result[i].weight);
    }
  });
});

describe('getRecentValidInterviews', () => {
  it('returns interviews that are recent and have valid feedback', () => {
    const now = new Date();
    const recentInterview: InterviewWithFeedback = {
      questionNumber: 10,
      updatedAt: now,
      feedback: {
        feedbackNumber: 2,
        id: '',
        interviewId: '',
        feedback: '',
      },
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const result = getRecentValidInterviews([recentInterview]);
    expect(result).toEqual([recentInterview]);
  });

  it('filters out interviews with feedbackNumber === -1', () => {
    const now = new Date();
    const invalidFeedbackInterview: InterviewWithFeedback = {
      questionNumber: 11,
      updatedAt: now,
      feedback: {
        feedbackNumber: -1,
        id: '',
        interviewId: '',
        feedback: '',
      },
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const result = getRecentValidInterviews([invalidFeedbackInterview]);
    expect(result).toEqual([]);
  });

  it('filters out interviews older than 30 days', () => {
    const oldDate = new Date(Date.now() - 31 * millisecondsInDay); // 31 days ago
    const oldInterview: InterviewWithFeedback = {
      questionNumber: 12,
      updatedAt: oldDate,
      feedback: {
        feedbackNumber: 1,
        id: '',
        interviewId: '',
        feedback: '',
      },
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const result = getRecentValidInterviews([oldInterview]);
    expect(result).toEqual([]);
  });

  it('returns empty array if input is empty', () => {
    const result = getRecentValidInterviews([]);
    expect(result).toEqual([]);
  });

  it('returns only interviews that are both recent and have valid feedback', () => {
    const now = new Date();
    const oldDate = new Date(Date.now() - 40 * millisecondsInDay); // 40 days ago
    const validRecent: InterviewWithFeedback = {
      questionNumber: 14,
      updatedAt: now,
      feedback: {
        feedbackNumber: 1,
        id: '',
        interviewId: '',
        feedback: '',
      },
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const invalidOld: InterviewWithFeedback = {
      questionNumber: 15,
      updatedAt: oldDate,
      feedback: {
        feedbackNumber: 1,
        id: '',
        interviewId: '',
        feedback: '',
      },
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const invalidFeedback: InterviewWithFeedback = {
      questionNumber: 16,
      updatedAt: now,
      feedback: {
        feedbackNumber: -1,
        id: '',
        interviewId: '',
        feedback: '',
      },
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const result = getRecentValidInterviews([
      validRecent,
      invalidOld,
      invalidFeedback,
    ]);
    expect(result).toEqual([validRecent]);
  });

  it('filters out interviews with null feedback', () => {
    const now = new Date();
    const interviewWithNullFeedback: InterviewWithFeedback = {
      questionNumber: 17,
      updatedAt: now,
      feedback: null,
      question: {
        topics: [],
        difficulty: DifficultyEnum.EASY,
        companies: [],
      },
    };
    const result = getRecentValidInterviews([interviewWithNullFeedback]);
    expect(result).toEqual([]);
  });
});

describe('removeRecentQuestions', () => {
  it('removes questions that were answered in interviews', () => {
    const result = removeRecentQuestions(mockInterviews, mockQuestions);

    expect(result.length).toBeLessThan(mockQuestions.length);
    expect(result.find((q) => q.id === 1)).toBeUndefined();
    expect(result.find((q) => q.id === 2)).toBeUndefined();
  });

  it('returns all questions if no recent interviews', () => {
    const result = removeRecentQuestions([], mockQuestions);
    expect(result).toEqual(mockQuestions);
  });
});
