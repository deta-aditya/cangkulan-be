import { Request, Response } from "express";
import { CreateGame, parse } from "@/core/games/workflows/create-game";
import { ExpressResponder } from "@/server/response/responder";

export type Controller = {
  handle: (request: Request, response: Response) => Promise<void>;
}

export class CreateGameController implements Controller {
  constructor(
    private createGame: CreateGame,
  ) {}

  async handle(request: Request, response: Response) {
    const responseBuilder = ExpressResponder.of(response);

    parse(request.body)
      .toPromise()
      .then(this.createGame.execute)
      .then(responseBuilder.success)
      .catch(responseBuilder.failure);
  };
}
