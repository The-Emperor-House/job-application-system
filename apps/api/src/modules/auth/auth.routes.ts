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

const router = Router();

router.post("/login", loginHandler);
router.post("/register", registerHandler);
router.post("/verify-otp", verifyOtpHandler);
router.post("/resend-otp", resendOtpHandler);
router.post("/google", googleAuthHandler);
router.get("/me", authenticateToken, meHandler);

export default router;
