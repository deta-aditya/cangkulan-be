export type Responder = {
  success(body: Record<string, unknown>): void;
  failure(error: unknown): void;
};
