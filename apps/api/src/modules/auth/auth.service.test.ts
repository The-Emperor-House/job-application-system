import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../middlewares/errorHandler";
import * as mailer from "../../utils/mailer";
import { login, verifyOtp, resendOtp } from "./auth.service";

jest.mock("../../config/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../utils/mailer", () => ({
  sendOtpEmail: jest.fn(),
}));

const mockedPrisma = prisma as unknown as {
  user: { findUnique: jest.Mock; update: jest.Mock };
};

const baseUser = {
  id: 1,
  email: "user@example.com",
  name: "Test User",
  role: "APPLICANT",
  avatarUrl: null,
  authProvider: "LOCAL",
  googleId: null,
  isActive: true,
  emailVerified: true,
  otpCode: null,
  otpExpiresAt: null,
  otpAttempts: 0,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("login", () => {
  it("rejects an unknown email", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await expect(login("nope@example.com", "password")).rejects.toThrow(HttpError);
  });

  it("rejects an incorrect password", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    mockedPrisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash });

    await expect(login(baseUser.email, "wrong-password")).rejects.toThrow("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  });

  it("rejects a deactivated account", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    mockedPrisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash, isActive: false });

    await expect(login(baseUser.email, "correct-password")).rejects.toThrow("บัญชีนี้ถูกปิดใช้งาน");
  });

  it("rejects an unverified account", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    mockedPrisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash, emailVerified: false });

    await expect(login(baseUser.email, "correct-password")).rejects.toThrow("ยังไม่ได้ยืนยันอีเมล");
  });

  it("returns a token and user on success", async () => {
    const passwordHash = await bcrypt.hash("correct-password", 10);
    mockedPrisma.user.findUnique.mockResolvedValue({ ...baseUser, passwordHash });

    const result = await login(baseUser.email, "correct-password");

    expect(result.token).toBeTruthy();
    expect(result.user.email).toBe(baseUser.email);
  });
});

describe("verifyOtp", () => {
  const unverifiedUser = {
    ...baseUser,
    passwordHash: "hash",
    emailVerified: false,
    otpCode: "123456",
    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    otpAttempts: 0,
  };

  it("increments otpAttempts on a wrong code", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ ...unverifiedUser });
    mockedPrisma.user.update.mockResolvedValue({});

    await expect(verifyOtp(unverifiedUser.email, "000000")).rejects.toThrow("รหัสยืนยันไม่ถูกต้อง");

    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: unverifiedUser.id },
      data: { otpAttempts: 1 },
    });
  });

  it("locks out after too many incorrect attempts", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ ...unverifiedUser, otpAttempts: 5 });

    await expect(verifyOtp(unverifiedUser.email, "000000")).rejects.toThrow(
      "กรอกรหัสผิดเกินจำนวนที่กำหนด กรุณาขอรหัสใหม่"
    );
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it("resets otpAttempts and verifies on a correct code", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ ...unverifiedUser, otpAttempts: 3 });
    mockedPrisma.user.update.mockResolvedValue({ ...unverifiedUser, emailVerified: true });

    const result = await verifyOtp(unverifiedUser.email, "123456");

    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: unverifiedUser.id },
      data: { emailVerified: true, otpCode: null, otpExpiresAt: null, otpAttempts: 0 },
    });
    expect(result.token).toBeTruthy();
  });

  it("rejects an expired code", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      ...unverifiedUser,
      otpExpiresAt: new Date(Date.now() - 1000),
    });

    await expect(verifyOtp(unverifiedUser.email, "123456")).rejects.toThrow(
      "รหัสยืนยันหมดอายุ กรุณาขอรหัสใหม่"
    );
  });
});

describe("resendOtp", () => {
  const unverifiedUser = {
    ...baseUser,
    passwordHash: "hash",
    emailVerified: false,
    otpCode: "123456",
    otpAttempts: 4,
  };

  it("rejects requests within the cooldown window", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      ...unverifiedUser,
      otpExpiresAt: new Date(Date.now() + 9.5 * 60 * 1000), // sent ~30s ago for a 10-minute OTP
    });

    await expect(resendOtp(unverifiedUser.email)).rejects.toThrow("กรุณารอสักครู่ก่อนขอรหัสใหม่");
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it("issues a new code and resets otpAttempts after the cooldown", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      ...unverifiedUser,
      otpExpiresAt: new Date(Date.now() - 9 * 60 * 1000), // sent long ago, well past cooldown
    });
    mockedPrisma.user.update.mockResolvedValue({});

    await resendOtp(unverifiedUser.email);

    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: unverifiedUser.id },
      data: { otpCode: expect.any(String), otpExpiresAt: expect.any(Date), otpAttempts: 0 },
    });
    expect(mailer.sendOtpEmail).toHaveBeenCalled();
  });
});
