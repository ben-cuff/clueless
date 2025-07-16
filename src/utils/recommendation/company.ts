import { InterviewWithFeedback } from "@/types/interview";
import { Nullable } from "@/types/util";
import { Company, Goal } from "@prisma/client";

function getCompanyWeights(
  goal: Nullable<Goal>,
  interviews: InterviewWithFeedback[]
): Map<Company, number> {
  const companyWeights = new Map<Company, number>();

  if (goal == null || goal?.companies.length === 0) {
    return companyWeights;
  }

  goal.companies.forEach((company) => {
    companyWeights.set(company, 1);
  });

  const recentCompanyCounts = getRecentInterviewsWithCompaniesCount(interviews);

  reduceCompanyWeightsBasedOnCompanyCounts(companyWeights, recentCompanyCounts);

  return companyWeights;
}

/**
 * Gets the count of companies from the interviews that have been conducted recently.
 * This helps in determining how many times a user has interacted with questions from each company.
 */
function getRecentInterviewsWithCompaniesCount(
  interviews: InterviewWithFeedback[]
): Map<Company, number> {
  const recentCompanyCounts = new Map<Company, number>();

  interviews.forEach((interview) => {
    interview.question.companies.forEach((company) => {
      recentCompanyCounts.set(
        company,
        (recentCompanyCounts.get(company) ?? 0) + 1
      );
    });
  });

  return recentCompanyCounts;
}

/**
 * Reduces company weights if a user has over a certain number of interviews with questions from that company.
 * If a company has been interviewed more than once, its weight is reduced by a penalty factor.
 * This helps to prioritize companies that the user has not interacted with as much but are still part of their goal.
 */
function reduceCompanyWeightsBasedOnCompanyCounts(
  companyWeights: Map<Company, number>,
  recentCompanyCounts: Map<Company, number>
) {
  const INTERVIEW_COMPANY_PENALTY = 0.75;
  const COMPANY_INTERVIEW_THRESHOLD = 1;

  for (const [company, count] of recentCompanyCounts.entries()) {
    if (count >= COMPANY_INTERVIEW_THRESHOLD && companyWeights.has(company)) {
      companyWeights.set(
        company,
        companyWeights.get(company)! * INTERVIEW_COMPANY_PENALTY
      );
    }
  }
}

export { getCompanyWeights };
