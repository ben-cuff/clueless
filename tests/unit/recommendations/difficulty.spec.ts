import { DifficultyEnum } from '@/constants/difficulties';
import { InterviewWithFeedback } from '@/types/interview';
import {
  applyDifficultyWeights,
  BOOSTS_AND_WEIGHTS,
  createDifficultyWeightsMap,
  EASY_STRUGGLE_THRESHOLD,
  getStruggles,
  getStruggleScores,
  HARD_STRUGGLE_THRESHOLD,
  MEDIUM_STRUGGLE_THRESHOLD,
} from '@/utils/recommendation/difficulty';

describe('getStruggles', () => {
  it('returns an empty array when no struggles are present', () => {
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 0, // 0 indicates no struggle
      [DifficultyEnum.MEDIUM]: 0,
      [DifficultyEnum.HARD]: 0,
    };
    const struggles = getStruggles(struggleScores);
    expect(struggles).toEqual([]);
  });

  it('returns struggles based on defined thresholds', () => {
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: EASY_STRUGGLE_THRESHOLD + 0.1,
      [DifficultyEnum.MEDIUM]: MEDIUM_STRUGGLE_THRESHOLD + 0.1,
      [DifficultyEnum.HARD]: 0,
    };
    const struggles = getStruggles(struggleScores);
    expect(struggles).toEqual([DifficultyEnum.EASY, DifficultyEnum.MEDIUM]);
  });

  it('returns only the difficulties that exceed their respective thresholds', () => {
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: EASY_STRUGGLE_THRESHOLD - 0.1,
      [DifficultyEnum.MEDIUM]: MEDIUM_STRUGGLE_THRESHOLD + 0.2,
      [DifficultyEnum.HARD]: HARD_STRUGGLE_THRESHOLD + 0.1,
    };
    const struggles = getStruggles(struggleScores);
    expect(struggles).toEqual([DifficultyEnum.MEDIUM, DifficultyEnum.HARD]);
  });
});

describe('applyDifficultyWeights', () => {
  it('applies weights and boosts correctly for a given difficulty', () => {
    const difficultyWeights = new Map<DifficultyEnum, number>([
      [DifficultyEnum.EASY, 0],
      [DifficultyEnum.MEDIUM, 0],
      [DifficultyEnum.HARD, 0],
    ]);
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 2,
      [DifficultyEnum.MEDIUM]: 1,
      [DifficultyEnum.HARD]: 0.5,
    };

    applyDifficultyWeights(
      DifficultyEnum.EASY,
      difficultyWeights,
      struggleScores
    );

    expect(difficultyWeights.get(DifficultyEnum.EASY)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY]
    );
    expect(difficultyWeights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_BOOST *
          struggleScores[DifficultyEnum.MEDIUM]
    );
    expect(difficultyWeights.get(DifficultyEnum.HARD)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_BOOST *
          struggleScores[DifficultyEnum.HARD]
    );
  });

  it('uses the scaler parameter to scale weights and boosts', () => {
    const difficultyWeights = new Map<DifficultyEnum, number>([
      [DifficultyEnum.EASY, 0],
      [DifficultyEnum.MEDIUM, 0],
      [DifficultyEnum.HARD, 0],
    ]);
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 1,
      [DifficultyEnum.MEDIUM]: 2,
      [DifficultyEnum.HARD]: 3,
    };

    const scaler = 2;

    applyDifficultyWeights(
      DifficultyEnum.EASY,
      difficultyWeights,
      struggleScores,
      scaler
    );

    expect(difficultyWeights.get(DifficultyEnum.EASY)).toBeCloseTo(
      scaler * BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY]
    );
    expect(difficultyWeights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      scaler * BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_BOOST *
          struggleScores[DifficultyEnum.MEDIUM]
    );
    expect(difficultyWeights.get(DifficultyEnum.HARD)).toBeCloseTo(
      scaler * BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_BOOST *
          struggleScores[DifficultyEnum.HARD]
    );
  });

  it('applies weights and boosts correctly for a default difficulty', () => {
    const difficultyWeights = new Map<DifficultyEnum, number>([
      [DifficultyEnum.EASY, 0],
      [DifficultyEnum.MEDIUM, 0],
      [DifficultyEnum.HARD, 0],
    ]);
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 1,
      [DifficultyEnum.MEDIUM]: 2,
      [DifficultyEnum.HARD]: 3,
    };

    applyDifficultyWeights('default', difficultyWeights, struggleScores);

    expect(difficultyWeights.get(DifficultyEnum.EASY)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS['default'].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS['default'].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY]
    );
    expect(difficultyWeights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS['default'].MEDIUM_WEIGHT +
        BOOSTS_AND_WEIGHTS['default'].MEDIUM_BOOST *
          struggleScores[DifficultyEnum.MEDIUM]
    );
    expect(difficultyWeights.get(DifficultyEnum.HARD)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS['default'].HARD_WEIGHT +
        BOOSTS_AND_WEIGHTS['default'].HARD_BOOST *
          struggleScores[DifficultyEnum.HARD]
    );
  });

  it('applies weights correctly for hard difficulty', () => {
    const difficultyWeights = new Map<DifficultyEnum, number>([
      [DifficultyEnum.EASY, 0],
      [DifficultyEnum.MEDIUM, 0],
      [DifficultyEnum.HARD, 0],
    ]);
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 1,
      [DifficultyEnum.MEDIUM]: 2,
      [DifficultyEnum.HARD]: 3,
    };

    applyDifficultyWeights(
      DifficultyEnum.HARD,
      difficultyWeights,
      struggleScores
    );

    expect(difficultyWeights.get(DifficultyEnum.EASY)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY]
    );
    expect(difficultyWeights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].MEDIUM_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].MEDIUM_BOOST *
          struggleScores[DifficultyEnum.MEDIUM]
    );
    expect(difficultyWeights.get(DifficultyEnum.HARD)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].HARD_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].HARD_BOOST *
          struggleScores[DifficultyEnum.HARD]
    );
  });
});

describe('getStruggleScores', () => {
  it('returns zero struggle scores when no interviews are given', () => {
    const interviews: InterviewWithFeedback[] = [];
    const scores = getStruggleScores(interviews);
    expect(scores).toEqual({
      [DifficultyEnum.EASY]: 0,
      [DifficultyEnum.MEDIUM]: 0,
      [DifficultyEnum.HARD]: 0,
    });
  });

  it('calculates struggle scores for single interview per difficulty', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        question: {
          difficulty: DifficultyEnum.EASY,
          topics: [],
          companies: [],
        },
        feedback: {
          feedbackNumber: 0,
          id: '',
          interviewId: '',
          feedback: '',
        },
        updatedAt: new Date(),
        questionNumber: 0,
      },
      {
        question: {
          difficulty: DifficultyEnum.MEDIUM,
          topics: [],
          companies: [],
        },
        feedback: {
          feedbackNumber: 1,
          id: '',
          interviewId: '',
          feedback: '',
        },
        updatedAt: new Date(),
        questionNumber: 0,
      },
      {
        question: {
          difficulty: DifficultyEnum.HARD,
          topics: [],
          companies: [],
        },
        feedback: {
          feedbackNumber: 2,
          id: '',
          interviewId: '',
          feedback: '',
        },
        updatedAt: new Date(),
        questionNumber: 0,
      },
    ];
    const scores = getStruggleScores(interviews);
    expect(scores[DifficultyEnum.EASY]).toBeCloseTo(1);
    expect(scores[DifficultyEnum.MEDIUM]).toBeCloseTo(0.5);
    expect(scores[DifficultyEnum.HARD]).toBeCloseTo(1 / 3);
  });

  it('averages struggle scores for multiple interviews of same difficulty', () => {
    const interviews: InterviewWithFeedback[] = [
      {
        question: {
          difficulty: DifficultyEnum.EASY,
          topics: [],
          companies: [],
        },
        feedback: {
          feedbackNumber: 0,
          id: '',
          interviewId: '',
          feedback: '',
        },
        updatedAt: new Date(),
        questionNumber: 0,
      },
      {
        question: {
          difficulty: DifficultyEnum.EASY,
          topics: [],
          companies: [],
        },
        feedback: {
          feedbackNumber: 1,
          id: '',
          interviewId: '',
          feedback: '',
        },
        updatedAt: new Date(),
        questionNumber: 0,
      },
      {
        question: {
          difficulty: DifficultyEnum.EASY,
          topics: [],
          companies: [],
        },
        feedback: {
          feedbackNumber: 3,
          id: '',
          interviewId: '',
          feedback: '',
        },
        updatedAt: new Date(),
        questionNumber: 0,
      },
    ];
    const scores = getStruggleScores(interviews);
    expect(scores[DifficultyEnum.EASY]).toBeCloseTo((1 + 0.5 + 0.25) / 3);
    expect(scores[DifficultyEnum.MEDIUM]).toBe(0);
    expect(scores[DifficultyEnum.HARD]).toBe(0);
  });
});

describe('createDifficultyWeightsMap', () => {
  it('applies default weights when there are no struggles', () => {
    const struggles: DifficultyEnum[] = [];
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 0,
      [DifficultyEnum.MEDIUM]: 0,
      [DifficultyEnum.HARD]: 0,
    };

    const weights = createDifficultyWeightsMap(struggles, struggleScores);

    expect(weights.get(DifficultyEnum.EASY)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS['default'].EASY_WEIGHT
    );
    expect(weights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS['default'].MEDIUM_WEIGHT
    );
    expect(weights.get(DifficultyEnum.HARD)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS['default'].HARD_WEIGHT
    );
  });

  it('applies weights based on struggles', () => {
    const struggles: DifficultyEnum[] = [DifficultyEnum.EASY];
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 1,
      [DifficultyEnum.MEDIUM]: 0,
      [DifficultyEnum.HARD]: 0,
    };

    const weights = createDifficultyWeightsMap(struggles, struggleScores);

    expect(weights.get(DifficultyEnum.EASY)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY]
    );
    expect(weights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_WEIGHT
    );
    expect(weights.get(DifficultyEnum.HARD)).toBeCloseTo(
      BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_WEIGHT
    );
  });

  it('applies scaled weights for each struggle (struggles here are easy and hard)', () => {
    const struggles: DifficultyEnum[] = [
      DifficultyEnum.EASY,
      DifficultyEnum.HARD,
    ];
    const struggleScores: Record<DifficultyEnum, number> = {
      [DifficultyEnum.EASY]: 2,
      [DifficultyEnum.MEDIUM]: 1,
      [DifficultyEnum.HARD]: 3,
    };

    const scale = 1 / struggles.length;
    const weights = createDifficultyWeightsMap(struggles, struggleScores);

    expect(weights.get(DifficultyEnum.EASY)).toBeCloseTo(
      scale * BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY] +
        scale * BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].EASY_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].EASY_BOOST *
          struggleScores[DifficultyEnum.EASY]
    );

    expect(weights.get(DifficultyEnum.MEDIUM)).toBeCloseTo(
      scale * BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].MEDIUM_BOOST *
          struggleScores[DifficultyEnum.MEDIUM] +
        scale * BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].MEDIUM_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].MEDIUM_BOOST *
          struggleScores[DifficultyEnum.MEDIUM]
    );

    expect(weights.get(DifficultyEnum.HARD)).toBeCloseTo(
      scale * BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.EASY].HARD_BOOST *
          struggleScores[DifficultyEnum.HARD] +
        scale * BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].HARD_WEIGHT +
        BOOSTS_AND_WEIGHTS[DifficultyEnum.HARD].HARD_BOOST *
          struggleScores[DifficultyEnum.HARD]
    );
  });
});
