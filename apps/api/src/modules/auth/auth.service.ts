import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { AuthProvider, UserRole, User } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { HttpError } from "../../middlewares/errorHandler";
import { sendOtpEmail } from "../../utils/mailer";

const googleClient = new OAuth2Client(env.googleClientId);

function issueToken(user: Pick<User, "id" | "email" | "role">) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
  );
}

function toAuthResult(user: User) {
  return {
    token: issueToken(user),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
    },
  };
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new HttpError(403, "This account has been deactivated", "ACCOUNT_DEACTIVATED");
  }

  if (!user.emailVerified) {
    throw new HttpError(403, "Email not verified", "EMAIL_NOT_VERIFIED");
  }

  return toAuthResult(user);
}

export async function register(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + env.otpExpiresMinutes * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: UserRole.APPLICANT,
      authProvider: AuthProvider.LOCAL,
      emailVerified: false,
      otpCode,
      otpExpiresAt,
    },
  });

  await sendOtpEmail(user.email, otpCode);

  return { email: user.email };
}

export async function verifyOtp(email: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(404, "Account not found");
  }

  if (user.emailVerified) {
    throw new HttpError(400, "Email already verified");
  }

  if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new HttpError(400, "Verification code expired. Please request a new one.");
  }

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
    throw new HttpError(429, "Too many incorrect attempts. Please request a new code.");
  }

  if (user.otpCode !== otp) {
    await prisma.user.update({
      where: { id: user.id },
      data: { otpAttempts: user.otpAttempts + 1 },
    });
    throw new HttpError(400, "Invalid verification code");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, otpCode: null, otpExpiresAt: null, otpAttempts: 0 },
  });

  return toAuthResult(updated);
}

export async function resendOtp(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(404, "Account not found");
  }

  if (user.emailVerified) {
    throw new HttpError(400, "Email already verified");
  }

  if (user.otpExpiresAt) {
    const sentAt = user.otpExpiresAt.getTime() - env.otpExpiresMinutes * 60 * 1000;
    if (Date.now() - sentAt < OTP_RESEND_COOLDOWN_MS) {
      throw new HttpError(429, "Please wait before requesting a new code");
    }
  }

  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + env.otpExpiresMinutes * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode, otpExpiresAt, otpAttempts: 0 },
  });

  await sendOtpEmail(user.email, otpCode);

  return { email: user.email };
}

export async function googleAuth(idToken: string) {
  if (!env.googleClientId) {
    throw new HttpError(500, "Google sign-in is not configured");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new HttpError(400, "Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name ?? email,
        passwordHash: await bcrypt.hash(`${googleId}:${Date.now()}`, 10),
        role: UserRole.APPLICANT,
        authProvider: AuthProvider.GOOGLE,
        googleId,
        avatarUrl: picture,
        emailVerified: true,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId,
        authProvider: AuthProvider.GOOGLE,
        emailVerified: true,
        avatarUrl: user.avatarUrl ?? picture,
      },
    });
  }

  if (!user.isActive) {
    throw new HttpError(403, "This account has been deactivated", "ACCOUNT_DEACTIVATED");
  }

  return toAuthResult(user);
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    address: user.address,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
  };
}
