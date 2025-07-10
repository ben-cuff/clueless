const judge0_api_url =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const CLUELESS_API_ROUTES = {
  createAccount: `${BASE_URL}/api/auth/register`,
  login: `${BASE_URL}/api/auth/login`,
  accountWithUserId: (userId: number) => `${BASE_URL}/api/account/${userId}`,
  chat: `${BASE_URL}/api/chat`,
  codeExecution: `${BASE_URL}/api/run-code`,
  feedbackWithInterviewId: (interviewId: string) =>
    `${BASE_URL}/api/feedback/${interviewId}`,
  feedback: `${BASE_URL}/api/feedback`,
  interviewWithUserId: (userId: number) =>
    `${BASE_URL}/api/interview/${userId}`,
  interviewWithUserIdForCode: (userId: number) =>
    `${BASE_URL}/api/interview/${userId}/code`,
  interviewWithUserIdAndInterviewId: (userId: number, interviewId: string) =>
    `${BASE_URL}/api/interview/${userId}/${interviewId}`,
  questionsSearch: (params: URLSearchParams) =>
    `${BASE_URL}/api/questions/search?${params.toString()}`,
  questionsById: (id: number) => `${BASE_URL}/api/questions/${id}`,
  recommendedQuestions: (userId: number) =>
    `${BASE_URL}/api/questions/recommended/${userId}`,
  activityWithUserId: (userId: number) => `${BASE_URL}/api/activity/${userId}`,
  goalWithUserId: (userId: number) => `${BASE_URL}/api/goal/${userId}`,
  goalProgressWithUserId: (userId: number) =>
    `${BASE_URL}/api/goal/${userId}/progress`,
  notificationsWithUserId: (userId: number) =>
    `${BASE_URL}/api/notification/${userId}`,
  interactions: `${BASE_URL}/api/interactions`,
};

export { CLUELESS_API_ROUTES, judge0_api_url };
