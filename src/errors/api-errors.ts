class AccountAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountAPIError';
  }
}

class ActivityAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActivityAPIError';
  }
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

class ChatAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatAPIError';
  }
}

class FeedbackAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeedbackAPIError';
  }
}

class GoalsAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoalsAPIError';
  }
}

class InterviewAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InterviewAPIError';
  }
}

export {
  AccountAPIError,
  ActivityAPIError,
  AuthError,
  ChatAPIError,
  FeedbackAPIError,
  GoalsAPIError,
  InterviewAPIError,
};
