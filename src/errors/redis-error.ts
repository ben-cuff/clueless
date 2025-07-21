class RedisServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RedisServerError';
  }
}

export { RedisServerError };
