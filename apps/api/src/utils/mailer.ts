import nodemailer from "nodemailer";
import { env } from "../config/env";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!env.smtp.host) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
  }

  return transporter;
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`[OTP] Verification code for ${to}: ${otp}`);
    return;
  }

  await mailer.sendMail({
    from: env.smtp.from,
    to,
    subject: "Your verification code",
    text: `Your verification code is ${otp}. It expires in ${env.otpExpiresMinutes} minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in ${env.otpExpiresMinutes} minutes.</p>`,
  });
}

export async function sendPasswordResetNotification(to: string, name: string): Promise<void> {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`[PASSWORD RESET] Password for ${to} was reset by an administrator`);
    return;
  }

  await mailer.sendMail({
    from: env.smtp.from,
    to,
    subject: "Your password has been reset",
    text: `Hi ${name},\n\nYour password was just reset by an administrator. If you did not expect this, please contact support immediately.`,
    html: `<p>Hi ${name},</p><p>Your password was just reset by an administrator. If you did not expect this, please contact support immediately.</p>`,
  });
}
