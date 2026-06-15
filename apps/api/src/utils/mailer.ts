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
    subject: "รหัสยืนยันของคุณ",
    text: `รหัสยืนยันของคุณคือ ${otp} รหัสนี้จะหมดอายุภายใน ${env.otpExpiresMinutes} นาที`,
    html: `<p>รหัสยืนยันของคุณคือ <strong>${otp}</strong></p><p>รหัสนี้จะหมดอายุภายใน ${env.otpExpiresMinutes} นาที</p>`,
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
    subject: "รหัสผ่านของคุณถูกรีเซ็ต",
    text: `สวัสดีคุณ ${name}\n\nรหัสผ่านของคุณถูกรีเซ็ตโดยผู้ดูแลระบบ หากคุณไม่ได้คาดหวังการเปลี่ยนแปลงนี้ กรุณาติดต่อฝ่ายสนับสนุนทันที`,
    html: `<p>สวัสดีคุณ ${name}</p><p>รหัสผ่านของคุณถูกรีเซ็ตโดยผู้ดูแลระบบ หากคุณไม่ได้คาดหวังการเปลี่ยนแปลงนี้ กรุณาติดต่อฝ่ายสนับสนุนทันที</p>`,
  });
}
