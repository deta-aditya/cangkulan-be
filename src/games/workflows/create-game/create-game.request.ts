import { CoreError, CoreErrors } from "@/common/core-error";
import { Result } from "@/common/result";
import { z } from "zod";

export const CreateGameRequestSchema = z.object({
  cardsPerPlayer: z.number(),
  numberOfPlayers: z.number(),  
});

export type CreateGameRequest = z.infer<typeof CreateGameRequestSchema>;

export const parse = (value: unknown): Result<CreateGameRequest, CoreError> => {
  const parsed = CreateGameRequestSchema.safeParse(value);

  if (parsed.success) {
    return Result.ok(parsed.data);
  }
  return Result.err(CoreErrors.parseRequestError({ message: parsed.error.message }));
}
