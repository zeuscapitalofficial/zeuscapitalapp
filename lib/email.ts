import nodemailer from "nodemailer";
import { getPasswordResetHtml } from "./emails/password-reset";
import { getVerificationHtml } from "./emails/verification";

export { getVerificationHtml, getPasswordResetHtml };

// Retrieve Gmail App Password settings from environment
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const SMTP_FROM =
  process.env.SMTP_FROM ||
  `"${process.env.SMTP_USER_NAME || "Zeus Capital"}" <${SMTP_USER}>`;

// Create transporter configured for Google App Passwords
const hasGmailConfig = SMTP_USER && SMTP_PASSWORD;

const transporter = hasGmailConfig
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    })
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Gmail] Email successfully sent to ${to}: "${subject}"`);
    } catch (error) {
      console.error(`[Gmail_ERROR] Failed to send email to ${to}:`, error);
    }
  } else {
    console.log("\n=========================================");
    console.log(
      `[Gmail_LOGGER] (Gmail credentials missing in .env, logging to console)`,
    );
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text:    ${text}`);
    console.log("=========================================\n");
  }
}
