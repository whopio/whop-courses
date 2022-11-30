import { NextApiRequest, NextApiResponse } from "next";
import { ZodSchema } from "zod";

/*
Some DOCS for this file:

This is a wrapper around the Next.js API routes. It provides a few things:
- A way to add context to the request
- Automatic typing for the request and response
- Post input validation using 'postSafe'

Essentially it makes creating typesafe NextJS API routes quick and easy.

The API is designed to be used like this:
1. Create a context function using API.contextFunction
2. Add the context function to the API using API.withContext
3. Add a handler to the API using API.get, API.post, etc. (or API.zpost, etc. for input validation)
4. Export the API as the default export in the /api/path/to/route.ts file
5. export the response types using 
  export type TMyApiRouteResponse = APIType<typeof handler>

*/
export type ApiSuccessResponse<T> = {
  status: "success";
  data: T;
};
export type ApiErrorResponse = {
  status: "error";
  message: string;
};
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type HandlerFunction<T, Return> = (
  req: NextApiRequest,
  res: NextApiResponse,
  context: T
) => Return | Promise<Return>;
type ContextBuilderFunction<T> = (
  req: NextApiRequest,
  res: NextApiResponse
) => T | Promise<T>;
type ContextExtendorFunction<T, R> = (
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: T
) => R | Promise<R>;

export class API<
  Context,
  Get = never,
  Post = never,
  Put = never,
  Patch = never,
  Delete = never,
  PostBody = undefined,
  PutBody = undefined,
  PatchBody = undefined
> extends Function {
  private _contextBuilder: ContextBuilderFunction<Context>;
  private _getHandler: HandlerFunction<Context, Get> | undefined;
  private _postHandler: HandlerFunction<Context, Post> | undefined;
  private _putHandler: HandlerFunction<Context, Put> | undefined;
  private _patchHandler: HandlerFunction<Context, Patch> | undefined;
  private _deleteHandler: HandlerFunction<Context, Delete> | undefined;

  private constructor(
    contextBuilder: ContextBuilderFunction<Context>,
    getHandler?: HandlerFunction<Context, Get>,
    postHandler?: HandlerFunction<Context, Post>,
    putHandler?: HandlerFunction<Context, Put>,
    patchHandler?: HandlerFunction<Context, Patch>,
    deleteHandler?: HandlerFunction<Context, Delete>
  ) {
    super("...args", "return this._call(...args)");
    this._contextBuilder = contextBuilder;
    this._getHandler = getHandler;
    this._postHandler = postHandler;
    this._putHandler = putHandler;
    this._patchHandler = patchHandler;
    this._deleteHandler = deleteHandler;
    return new Proxy(this, {
      apply: (target, thisArg, [req, res]) => target._call(req, res),
    });
  }

  get<R>(handler: HandlerFunction<Context, R>) {
    return new API(
      this._contextBuilder,
      handler,
      this._postHandler,
      this._putHandler,
      this._patchHandler,
      this._deleteHandler
    );
  }

  post<R, B = undefined>(handler: HandlerFunction<Context, R>) {
    return new API<Context, Get, R, Put, Patch, Delete, B, PutBody, PatchBody>(
      this._contextBuilder,
      this._getHandler,
      handler,
      this._putHandler,
      this._patchHandler,
      this._deleteHandler
    );
  }
  zpost<D, R>(
    schema: ZodSchema<D>,
    handler: (
      data: D,
      ctx: Context,
      req: NextApiRequest,
      res: NextApiResponse
    ) => R | Promise<R>
  ) {
    return new API<Context, Get, R, Put, Patch, Delete, D, PutBody, PatchBody>(
      this._contextBuilder,
      this._getHandler,
      async (req, res, ctx) => {
        const data = schema.parse(req.body);
        return handler(data, ctx, req, res);
      },
      this._putHandler,
      this._patchHandler,
      this._deleteHandler
    );
  }
  put<R, B = undefined>(handler: HandlerFunction<Context, R>) {
    return new API<
      Context,
      Get,
      Post,
      R,
      Patch,
      Delete,
      PostBody,
      B,
      PatchBody
    >(
      this._contextBuilder,
      this._getHandler,
      this._postHandler,
      handler,
      this._patchHandler,
      this._deleteHandler
    );
  }
  zput<D, R>(
    schema: ZodSchema<D>,
    handler: (
      data: D,
      ctx: Context,
      req: NextApiRequest,
      res: NextApiResponse
    ) => R | Promise<R>
  ) {
    return new API<
      Context,
      Get,
      Post,
      R,
      Patch,
      Delete,
      PostBody,
      D,
      PatchBody
    >(
      this._contextBuilder,
      this._getHandler,
      this._postHandler,
      async (req, res, ctx) => {
        const data = schema.parse(req.body);
        return handler(data, ctx, req, res);
      },
      this._patchHandler,
      this._deleteHandler
    );
  }
  patch<R, B = undefined>(handler: HandlerFunction<Context, R>) {
    return new API<Context, Get, Post, Put, R, Delete, PostBody, PutBody, B>(
      this._contextBuilder,
      this._getHandler,
      this._postHandler,
      this._putHandler,
      handler,
      this._deleteHandler
    );
  }
  zpatch<D, R>(
    schema: ZodSchema<D>,
    handler: (
      data: D,
      ctx: Context,
      req: NextApiRequest,
      res: NextApiResponse
    ) => R | Promise<R>
  ) {
    return new API<Context, Get, Post, Put, R, Delete, PostBody, PutBody, D>(
      this._contextBuilder,
      this._getHandler,
      this._postHandler,
      this._putHandler,
      async (req, res, ctx) => {
        const data = schema.parse(req.body);
        return handler(data, ctx, req, res);
      },
      this._deleteHandler
    );
  }
  delete<R>(handler: HandlerFunction<Context, R>) {
    return new API(
      this._contextBuilder,
      this._getHandler,
      this._postHandler,
      this._putHandler,
      this._patchHandler,
      handler
    );
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

  private getHandler(method: string | undefined) {
    switch (method) {
      case "GET":
        return this._getHandler;
      case "POST":
        return this._postHandler;
      case "PUT":
        return this._putHandler;
      case "PATCH":
        return this._patchHandler;
      case "DELETE":
        return this._deleteHandler;
      default:
        return undefined;
    }
  }

  async _call(req: NextApiRequest, res: NextApiResponse) {
    try {
      console.time(`[api-context] ${req.method} ${req.url}`);
      const context = await this._contextBuilder(req, res);
      console.timeEnd(`[api-context] ${req.method} ${req.url}`);
      const handler = this.getHandler(req.method);
      if (!handler) {
        res.status(405);
        throw new Error(`No handler for method ${req.method}`);
      }

      console.time(`[api] ${req.method} ${req.url}`);
      const response = await handler(req, res, context);
      console.timeEnd(`[api] ${req.method} ${req.url}`);

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

export type APIType<T> = T extends API<
  infer Context,
  infer Get,
  infer Post,
  infer Put,
  infer Patch,
  infer Delete,
  infer PostBody,
  infer PutBody,
  infer PatchBody
>
  ? {
      RESPONSE: {
        GET: Get;
        POST: Post;
        PUT: Put;
        PATCH: Patch;
        DELETE: Delete;
      };
      BODY: {
        GET: never;
        POST: PostBody;
        PUT: PutBody;
        PATCH: PatchBody;
        DELETE: never;
      };
    }
  : never;

export type APIGetResult<T> = APIType<T>["RESPONSE"]["GET"];
export type APIPostResult<T> = APIType<T>["RESPONSE"]["POST"];
export type APIPutResult<T> = APIType<T>["RESPONSE"]["PUT"];
export type APIPatchResult<T> = APIType<T>["RESPONSE"]["PATCH"];
export type APIDeleteResult<T> = APIType<T>["RESPONSE"]["DELETE"];
