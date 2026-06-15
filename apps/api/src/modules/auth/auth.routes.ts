import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  verifyOtpHandler,
  resendOtpHandler,
  googleAuthHandler,
  meHandler,
} from "./auth.controller";
import { authenticateToken } from "../../middlewares/auth";
import { loginLimiter, otpLimiter } from "../../middlewares/rateLimit";

const router = Router();

router.post("/login", loginLimiter, loginHandler);
router.post("/register", registerHandler);
router.post("/verify-otp", otpLimiter, verifyOtpHandler);
router.post("/resend-otp", otpLimiter, resendOtpHandler);
router.post("/google", googleAuthHandler);
router.get("/me", authenticateToken, meHandler);

export default router;
