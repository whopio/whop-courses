import { NextApiRequest, NextApiResponse } from "next";
import { ZodSchema } from "zod";

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
type ContextExtendorFunction<T, R> = (
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: T
) => R | Promise<R>;

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
  postSafe<D>(
    schema: ZodSchema<D>,
    handler: (
      data: D,
      ctx: T,
      req: NextApiRequest,
      res: NextApiResponse
    ) => any | Promise<any>
  ) {
    this._handlers.POST = async (req, res, ctx) => {
      const data = schema.parse(req.body);
      return handler(data, ctx, req, res);
    };
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

  extend<R>(contextBuilder: ContextExtendorFunction<T, R>) {
    return new API<R>(async (req, res) => {
      const context = await this._contextBuilder(req, res);
      return contextBuilder(req, res, context);
    });
  }

  static contextFunction<I extends {}, R extends {}>(
    fn: ContextExtendorFunction<I, R>
  ) {
    return new APIContextFunction(fn);
  }

  static withContext<R extends {}>(contextFunction: APIContextFunction<{}, R>) {
    return new API<R>(async (req, res) => {
      const context = await contextFunction.call(req, res, {});
      return context;
    });
  }

  static noContext() {
    return new API<null>(async (req, res) => {
      return null;
    });
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

class APIContextFunction<Input extends {}, Result extends {}> {
  fn: ContextExtendorFunction<Input, Result>;

  constructor(fn: ContextExtendorFunction<Input, Result>) {
    this.fn = fn;
  }

  add<NewResult extends {}>(fn: APIContextFunction<Result, NewResult>) {
    return new APIContextFunction<
      Input,
      NewResult & Omit<Result, keyof NewResult>
    >(async (req, res, ctx) => {
      const myctx = await this.fn(req, res, ctx);
      const otherctx = await fn.call(req, res, myctx);
      return { ...myctx, ...otherctx };
    });
  }

  call(req: NextApiRequest, res: NextApiResponse, input: Input) {
    return this.fn(req, res, input);
  }
}
