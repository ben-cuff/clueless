import { DifficultyEnum } from '@/constants/difficulties';
import { InterviewWithFeedback } from '@/types/interview';

function getDifficultyWeights(
  interviews: InterviewWithFeedback[]
): Map<DifficultyEnum, number> {
  const struggleScores: Record<DifficultyEnum, number> =
    getStruggleScores(interviews);

  const struggles = getStruggles(struggleScores);

  const difficultyWeights = new Map<DifficultyEnum, number>();

  if (struggles.length === 0) {
    applyDifficultyWeights('default', difficultyWeights, struggleScores);
  } else {
    const scale = 1 / struggles.length;
    for (const diff of struggles) {
      applyDifficultyWeights(diff, difficultyWeights, struggleScores, scale);
    }
  }

  return difficultyWeights;
}

/**
 * Gets the struggle scores for each difficulty level based on the interviews.
 * If a user has performed poorly on a question, the struggle score for that difficulty increases.
 */
function getStruggleScores(interviews: InterviewWithFeedback[]) {
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

    const isValidDifficulty = DIFFICULTIES.includes(difficulty);
    if (isValidDifficulty) {
      struggleScores[difficulty] += weight;
      counts[difficulty]++;
    }
  });

  // Normalize struggle scores
  for (const diff of DIFFICULTIES) {
    if (counts[diff] > 0) {
      struggleScores[diff] /= counts[diff];
    }
  }

  return struggleScores;
}

/**
 * Gets struggles based on the struggle scores.
 * If a user has a struggle score above a certain threshold for a difficulty,
 * then that difficulty is considered a struggle.
 */
function getStruggles(struggleScores: Record<DifficultyEnum, number>) {
  const EASY_STRUGGLE_THRESHOLD = 0.4;
  const MEDIUM_STRUGGLE_THRESHOLD = 0.3;
  const HARD_STRUGGLE_THRESHOLD = 0.3;
  const struggles: DifficultyEnum[] = [];

  if (struggleScores[DifficultyEnum.EASY] > EASY_STRUGGLE_THRESHOLD) {
    struggles.push(DifficultyEnum.EASY);
  }
  if (struggleScores[DifficultyEnum.MEDIUM] > MEDIUM_STRUGGLE_THRESHOLD) {
    struggles.push(DifficultyEnum.MEDIUM);
  }
  if (struggleScores[DifficultyEnum.HARD] > HARD_STRUGGLE_THRESHOLD) {
    struggles.push(DifficultyEnum.HARD);
  }
  return struggles;
}

/**
 * Each difficulty level has associated weights and boosts:
 * - EASY_WEIGHT, MEDIUM_WEIGHT, HARD_WEIGHT: Base weights for easy, medium, and hard questions.
 * - EASY_BOOST, MEDIUM_BOOST, HARD_BOOST: Boosts for each difficulty based on the user's struggle score.
 */
const BOOSTS_AND_WEIGHTS = {
  [DifficultyEnum.EASY]: {
    EASY_WEIGHT: 1,
    MEDIUM_WEIGHT: 0.9,
    HARD_WEIGHT: 0.5,
    EASY_BOOST: 1,
    MEDIUM_BOOST: 0.8,
    HARD_BOOST: 0.6,
  },
  [DifficultyEnum.MEDIUM]: {
    EASY_WEIGHT: 0.9,
    MEDIUM_WEIGHT: 1,
    HARD_WEIGHT: 0.8,
    EASY_BOOST: 0.9,
    MEDIUM_BOOST: 1,
    HARD_BOOST: 0.9,
  },
  [DifficultyEnum.HARD]: {
    EASY_WEIGHT: 0.5,
    MEDIUM_WEIGHT: 0.9,
    HARD_WEIGHT: 1,
    EASY_BOOST: 0.8,
    MEDIUM_BOOST: 0.9,
    HARD_BOOST: 1,
  },
  ['default']: {
    EASY_WEIGHT: 1,
    MEDIUM_WEIGHT: 1,
    HARD_WEIGHT: 1,
    EASY_BOOST: 1,
    MEDIUM_BOOST: 1,
    HARD_BOOST: 1,
  },
};

function applyDifficultyWeights(
  difficulty: DifficultyEnum | 'default',
  difficultyWeights: Map<DifficultyEnum, number>,
  struggleScores: Record<DifficultyEnum, number>,
  scaler: number = 1
) {
  difficultyWeights.set(
    DifficultyEnum.EASY,
    (difficultyWeights.get(DifficultyEnum.EASY) ?? 0) +
      scaler * BOOSTS_AND_WEIGHTS[difficulty].EASY_WEIGHT +
      BOOSTS_AND_WEIGHTS[difficulty].EASY_BOOST *
        struggleScores[DifficultyEnum.EASY]
  );
  difficultyWeights.set(
    DifficultyEnum.MEDIUM,
    (difficultyWeights.get(DifficultyEnum.MEDIUM) ?? 0) +
      scaler * BOOSTS_AND_WEIGHTS[difficulty].MEDIUM_WEIGHT +
      BOOSTS_AND_WEIGHTS[difficulty].MEDIUM_BOOST *
        struggleScores[DifficultyEnum.MEDIUM]
  );
  difficultyWeights.set(
    DifficultyEnum.HARD,
    (difficultyWeights.get(DifficultyEnum.HARD) ?? 0) +
      scaler * BOOSTS_AND_WEIGHTS[difficulty].HARD_WEIGHT +
      BOOSTS_AND_WEIGHTS[difficulty].HARD_BOOST *
        struggleScores[DifficultyEnum.HARD]
  );
}

export { getDifficultyWeights };
