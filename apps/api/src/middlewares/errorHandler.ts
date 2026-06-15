import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";

export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", errors: err.flatten() });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
