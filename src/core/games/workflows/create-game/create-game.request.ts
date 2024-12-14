import { z } from "npm:zod";
import { CoreError, CoreErrors } from "@/core/common/core-error.ts";
import { Result } from "@/core/common/result.ts";

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
  return Result.err(
    CoreErrors.parseRequestError({ message: parsed.error.message }),
  );
};
