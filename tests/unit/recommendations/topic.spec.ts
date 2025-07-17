import { DifficultyEnum } from '@/constants/difficulties';
import { InterviewWithFeedback } from '@/types/interview';
import { getTopicWeights } from '@/utils/recommendation/topic';
import { Topic } from '@prisma/client';

describe('getTopicWeights', () => {
  it('applies weights based on interview feedback', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        updatedAt: new Date(),
        questionNumber: 1,
        question: {
          topics: [Topic.ARRAY, Topic.TREE],
          difficulty: DifficultyEnum.EASY,
          companies: [],
        },
        feedback: {
          feedbackNumber: 2,
          id: '',
          interviewId: '',
          feedback: '',
        },
      },
      {
        updatedAt: new Date(),
        questionNumber: 2,
        question: {
          topics: [Topic.DYNAMIC_PROGRAMMING, Topic.ARRAY],
          difficulty: DifficultyEnum.EASY,
          companies: [],
        },
        feedback: {
          feedbackNumber: 3,
          id: '',
          interviewId: '',
          feedback: '',
        },
      },
    ];

    const weights = getTopicWeights(interviews);
    expect(weights.get(Topic.ARRAY)).toBeCloseTo((1 / 3 + 1 / 4) / 2);
    expect(weights.get(Topic.TREE)).toBeCloseTo(1 / 3 / 1);
    expect(weights.get(Topic.DYNAMIC_PROGRAMMING)).toBeCloseTo(1 / 4 / 1);
  });

  it('returns empty map for no interviews', () => {
    const weights = getTopicWeights([]);
    expect(weights.size).toBe(0);
  });

  it('returns topic weights when interview have many topics', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        updatedAt: new Date(),
        questionNumber: 1,
        question: {
          topics: [Topic.ARRAY, Topic.TREE, Topic.GRAPH],
          difficulty: DifficultyEnum.EASY,
          companies: [],
        },
        feedback: {
          feedbackNumber: 1,
          id: '',
          interviewId: '',
          feedback: '',
        },
      },
    ];

    const weights = getTopicWeights(interviews);
    expect(weights.get(Topic.ARRAY)).toBeCloseTo(0.5); // (1/2)/1
    expect(weights.get(Topic.TREE)).toBeCloseTo(0.5); // (1/2)/1
    expect(weights.get(Topic.GRAPH)).toBeCloseTo(0.5); // (1/2)/1
  });

  it('returns topic weights when interviews have many overlapping topics', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        updatedAt: new Date(),
        questionNumber: 1,
        question: {
          topics: [Topic.ARRAY, Topic.TREE],
          difficulty: DifficultyEnum.EASY,
          companies: [],
        },
        feedback: {
          feedbackNumber: 2,
          id: '',
          interviewId: '',
          feedback: '',
        },
      },
      {
        updatedAt: new Date(),
        questionNumber: 2,
        question: {
          topics: [Topic.ARRAY, Topic.GRAPH],
          difficulty: DifficultyEnum.MEDIUM,
          companies: [],
        },
        feedback: {
          feedbackNumber: 3,
          id: '',
          interviewId: '',
          feedback: '',
        },
      },
      {
        updatedAt: new Date(),
        questionNumber: 3,
        question: {
          topics: [Topic.TREE, Topic.GRAPH],
          difficulty: DifficultyEnum.HARD,
          companies: [],
        },
        feedback: {
          feedbackNumber: 5,
          id: '',
          interviewId: '',
          feedback: '',
        },
      },
    ];
    const weights = getTopicWeights(interviews);
    expect(weights.get(Topic.ARRAY)).toBeCloseTo((1 / 3 + 1 / 4) / 2);
    expect(weights.get(Topic.TREE)).toBeCloseTo((1 / 6 + 1 / 3) / 2);
    expect(weights.get(Topic.GRAPH)).toBeCloseTo((1 / 4 + 1 / 6) / 2);
  });
});
