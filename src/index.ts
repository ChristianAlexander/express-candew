import { CanDew } from "candew";
import { Handler, Request, Response, NextFunction } from "express";

import { NotAllowedError } from "./error";

export function CanDewMiddleware<Action = any, Context = any>(
  canDew: CanDew<Action, Context>,
  contextProvider: ContextProvider<Context> = RequestUserContextProvider
): (action: Action, targetProvider?: TargetProvider | any) => Handler {
  return (action: Action, targetProvider?: TargetProvider) => async (
    req,
    _res,
    next
  ) => {
    let target: any;
    if (typeof targetProvider === "function") {
      target = targetProvider(req);
    } else {
      target = targetProvider;
    }

    if (await canDew.can(contextProvider(req), action, target)) {
      return next();
    }

    return next(new NotAllowedError(action));
  };
}

export type ContextProvider<Context = any> = (req: Request & any) => Context;
export type TargetProvider<Target = any> = (req: Request & any) => Target;

export function RequestUserContextProvider<User = any>(
  req: Request & { user: User }
) {
  return req.user;
}

export function CanDewErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof NotAllowedError) {
    res.status(403).send("Action not allowed.");
    return;
  }

  next();
}
