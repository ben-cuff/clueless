class PrismaServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrismaServerError';
  }
}

export { PrismaServerError };
