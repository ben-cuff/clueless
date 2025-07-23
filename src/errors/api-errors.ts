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

export { AccountAPIError, ActivityAPIError, AuthError, ChatAPIError };
