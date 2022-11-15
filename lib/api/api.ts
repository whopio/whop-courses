import { NextApiRequest, NextApiResponse } from "next";

export type ApiResponse<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      message: string;
    };

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type HandlerFunction<T> = (
  req: NextApiRequest,
  res: NextApiResponse,
  context: T
) => any | Promise<any>;
type ContextBuilderFunction<T> = (
  req: NextApiRequest,
  res: NextApiResponse
) => T | Promise<T>;

export class API<T> extends Function {
  private _handlers: Partial<Record<RequestMethod, HandlerFunction<T>>> = {};
  private _contextBuilder: ContextBuilderFunction<T>;

  constructor(contextBuilder: ContextBuilderFunction<T>) {
    super("...args", "return this._call(...args)");
    this._contextBuilder = contextBuilder;
    this._handlers = {};
    return new Proxy(this, {
      apply: (target, thisArg, [req, res]) => target._call(req, res),
    });
  }

  get(handler: HandlerFunction<T>) {
    this._handlers.GET = handler;
    return this;
  }
  post(handler: HandlerFunction<T>) {
    this._handlers.POST = handler;
    return this;
  }
  put(handler: HandlerFunction<T>) {
    this._handlers.PUT = handler;
    return this;
  }
  patch(handler: HandlerFunction<T>) {
    this._handlers.PATCH = handler;
    return this;
  }
  delete(handler: HandlerFunction<T>) {
    this._handlers.DELETE = handler;
    return this;
  }

  async _call(req: NextApiRequest, res: NextApiResponse) {
    try {
      const context = await this._contextBuilder(req, res);
      const handler = this._handlers[req.method as RequestMethod];
      if (!handler) {
        res.status(405);
        throw new Error(`No handler for method ${req.method}`);
      }

      const response = await handler(req, res, context);

      if (res.headersSent) return;
      res.json({
        status: "success",
        data: response,
      });
    } catch (error) {
      if (res.headersSent) return;
      if (res.statusCode === 200) res.status(500);
      res.json({
        status: "error",
        message: (error as Error).message,
      });
    }
  }
}

export const BaseAPI = new API((req, res) => {
  return null;
});
