class AccountAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountAPIError';
  }
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export { AccountAPIError, AuthError };
