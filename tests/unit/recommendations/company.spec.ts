import { DifficultyEnum } from '@/constants/difficulties';
import { InterviewWithFeedback } from '@/types/interview';
import {
  getCompanyWeights,
  getRecentInterviewsWithCompaniesCount,
  reduceCompanyWeightsBasedOnCompanyCounts,
} from '@/utils/recommendation/company';
import { Company, Goal, GoalType } from '@prisma/client';

describe('getRecentInterviewsWithCompaniesCount', () => {
  it('counts companies across all interviews', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        updatedAt: new Date(),
        questionNumber: 1,
        question: {
          topics: [],
          difficulty: DifficultyEnum.EASY,
          companies: [Company.AMAZON, Company.ADOBE],
        },
        feedback: null,
      },
      {
        updatedAt: new Date(),
        questionNumber: 2,
        question: {
          topics: [],
          difficulty: DifficultyEnum.EASY,
          companies: [Company.AMAZON],
        },
        feedback: null,
      },
    ];

    const result = getRecentInterviewsWithCompaniesCount(interviews);

    expect(result.get(Company.AMAZON)).toBe(2);
    expect(result.get(Company.ADOBE)).toBe(1);
  });

  it('returns empty map for no interviews', () => {
    const result = getRecentInterviewsWithCompaniesCount([]);
    expect(result.size).toBe(0);
  });

  it('returns empty map for interviews with no companies', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        updatedAt: new Date(),
        questionNumber: 1,
        question: {
          topics: [],
          difficulty: DifficultyEnum.EASY,
          companies: [],
        },
        feedback: null,
      },
    ];

    const result = getRecentInterviewsWithCompaniesCount(interviews);
    expect(result.size).toBe(0);
  });
});

describe('reduceCompanyWeightsBasedOnCompanyCounts', () => {
  it('reduces weights for companies with multiple interviews', () => {
    const companyWeights = new Map<Company, number>([
      [Company.AMAZON, 1],
      [Company.GOOGLE, 1],
    ]);
    const recentCompanyCounts = new Map<Company, number>([
      [Company.AMAZON, 3],
      [Company.GOOGLE, 1],
    ]);

    reduceCompanyWeightsBasedOnCompanyCounts(
      companyWeights,
      recentCompanyCounts
    );

    expect(companyWeights.get(Company.AMAZON)).toBe(Math.pow(0.75, 2)); // these are hardcoded for now, need to update when constants are changed
    expect(companyWeights.get(Company.GOOGLE)).toBe(1);
  });

  it('does not change weights for companies with one or no interviews', () => {
    const companyWeights = new Map<Company, number>([
      [Company.AMAZON, 1],
      [Company.GOOGLE, 1],
    ]);
    const recentCompanyCounts = new Map<Company, number>([
      [Company.AMAZON, 1],
      [Company.GOOGLE, 0],
    ]);

    reduceCompanyWeightsBasedOnCompanyCounts(
      companyWeights,
      recentCompanyCounts
    );

    expect(companyWeights.get(Company.AMAZON)).toBe(1);
    expect(companyWeights.get(Company.GOOGLE)).toBe(1);
  });

  it('works when count it 2 and does not take math.pow into account', () => {
    const companyWeights = new Map<Company, number>([
      [Company.AMAZON, 1],
      [Company.GOOGLE, 1],
    ]);
    const recentCompanyCounts = new Map<Company, number>([
      [Company.AMAZON, 2],
      [Company.GOOGLE, 2],
    ]);

    reduceCompanyWeightsBasedOnCompanyCounts(
      companyWeights,
      recentCompanyCounts
    );

    expect(companyWeights.get(Company.AMAZON)).toBe(Math.pow(0.75, 1));
    expect(companyWeights.get(Company.GOOGLE)).toBe(Math.pow(0.75, 1));
  });
});

describe('getCompanyWeights', () => {
  const mockGoal = (companies: Company[]): Goal => ({
    companies,
    id: '',
    userId: 0,
    goalType: GoalType.QUESTION,
    value: 0,
    endDate: new Date(),
    beginAt: new Date(),
  });

  it('returns empty map if goal is null', () => {
    const result = getCompanyWeights(null, []);
    expect(result.size).toBe(0);
  });

  it('returns empty map if goal.companies is empty', () => {
    const result = getCompanyWeights(mockGoal([]), []);
    expect(result.size).toBe(0);
  });

  it('returns map with weight 1 for each company in goal', () => {
    const result = getCompanyWeights(
      mockGoal([Company.AMAZON, Company.GOOGLE]),
      []
    );
    expect(result.get(Company.AMAZON)).toBe(1);
    expect(result.get(Company.GOOGLE)).toBe(1);
  });

  it('reduces weights based on recent interview counts', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        updatedAt: new Date(),
        questionNumber: 1,
        question: {
          topics: [],
          difficulty: DifficultyEnum.EASY,
          companies: [Company.AMAZON],
        },
        feedback: null,
      },
      {
        updatedAt: new Date(),
        questionNumber: 2,
        question: {
          topics: [],
          difficulty: DifficultyEnum.EASY,
          companies: [Company.AMAZON],
        },
        feedback: null,
      },
    ];
    const result = getCompanyWeights(
      mockGoal([Company.AMAZON, Company.GOOGLE]),
      interviews
    );
    expect(result.get(Company.AMAZON)).toBe(Math.pow(0.75, 1));
    expect(result.get(Company.GOOGLE)).toBe(1);
  });
});
