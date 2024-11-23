import { Request, Response } from "express";

export type Controller = {
  handle: (request: Request, response: Response) => Promise<void>;
};
