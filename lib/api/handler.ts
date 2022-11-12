import { NextApiRequest, NextApiResponse } from "next";
import { UserSession } from "./session";

type RequestContext = {
  user: UserSession | null;
};

type NextFunction = (data: RequestContext) => Promise<any>;
export type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  data: RequestContext,
  next: NextFunction
) => any | Promise<any>;

export function handler(...args: MiddlewareFunction[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (args.length === 0) {
      throw new Error("No middleware provided");
    }

    const next = (index: number) => async (data: RequestContext) => {
      if (index === args.length) return;
      const middleware = args[index];
      return await middleware(req, res, data, next(index + 1));
    };

    try {
      const response = await next(0)({
        user: null,
      });
      if (res.headersSent) return;
      res.json({
        status: "success",
        data: response,
      });
    } catch (error) {
      if (res.headersSent) return;
      res.json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };
}
