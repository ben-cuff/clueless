const judge0_api_url =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true";

const CLUELESS_API_ROUTES = {
  createAccount: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
  login: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
  accountWithUserId: (userId: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/account/${userId}`,
  chat: `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
  codeExecution: `${process.env.NEXT_PUBLIC_BASE_URL}/api/run-code`,
  feedbackWithInterviewId: (interviewId: string) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/${interviewId}`,
  feedback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
  interviewWithUserId: (userId: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}`,
  interviewWithUserIdForCode: (userId: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}/code`,
  interviewWithUserIdAndInterviewId: (userId: number, interviewId: string) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}/${interviewId}`,
  questionsSearch: (params: URLSearchParams) =>
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/questions/search?${params.toString()}`,
  questionsById: (id: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/${id}`,
  recommendedQuestions: (userId: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/recommended/${userId}`,
  activityWithUserId: (userId: number) =>
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/activity/${userId}`,
};

export { CLUELESS_API_ROUTES, judge0_api_url };
