import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  googleAuthSchema,
} from "./auth.schema";

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(email, otp);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function resendOtpHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = resendOtpSchema.parse(req.body);
    const result = await authService.resendOtp(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function googleAuthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { idToken } = googleAuthSchema.parse(req.body);
    const result = await authService.googleAuth(idToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getUserById(req.user!.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
