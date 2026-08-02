import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";

const RESEND_API_URL = "https://api.resend.com/emails";

export interface InviteEmailParams {
  to: string;
  inviteUrl: string;
  workspaceName: string;
  invitedByName: string;
  role: string;
  expiresAt: Date;
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

export function isEmailConfigured(): boolean {
  return isResendConfigured() || isSmtpConfigured();
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Docsync <invites@docsync.local>";
}

function buildInviteHtml({
  workspaceName,
  invitedByName,
  role,
  inviteUrl,
  expiresAt,
}: InviteEmailParams): string {
  const expiresLabel = expiresAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const roleLabel = role === "admin" ? "an admin" : "a member";
  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #15131a;">
      <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 12px;">You're invited to ${workspaceName}</h1>
      <p style="font-size: 15px; line-height: 1.6; color: #5c5966; margin: 0 0 24px;">
        ${invitedByName} invited you to collaborate in the <strong>${workspaceName}</strong> workspace as <strong>${roleLabel}</strong>.
        This invitation expires on <strong>${expiresLabel}</strong>.
      </p>
      <a href="${inviteUrl}" style="display: inline-block; background: #5b4bff; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">
        Accept invitation
      </a>
      <p style="font-size: 13px; line-height: 1.6; color: #8d8796; margin: 24px 0 0;">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <span style="color: #5b4bff; word-break: break-all;">${inviteUrl}</span>
      </p>
    </div>
  `;
}

async function sendViaResend(params: InviteEmailParams): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const html = buildInviteHtml(params);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromEmail(),
        to: [params.to],
        subject: `You're invited to join ${params.workspaceName}`,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error("Invite email failed to send", {
        action: "email:invite",
        status: "failure",
        provider: "resend",
        message: `Resend returned ${response.status}: ${body}`,
      });
      return { sent: false };
    }

    logger.info("Invite email sent", {
      action: "email:invite",
      status: "success",
      provider: "resend",
      to: params.to,
      workspaceId: undefined,
    });
    return { sent: true };
  } catch (error) {
    logger.error("Invite email failed to send", {
      action: "email:invite",
      status: "failure",
      provider: "resend",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return { sent: false };
  }
}

async function sendViaSmtp(params: InviteEmailParams): Promise<{ sent: boolean }> {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: params.to,
      subject: `You're invited to join ${params.workspaceName}`,
      html: buildInviteHtml(params),
    });

    logger.info("Invite email sent", {
      action: "email:invite",
      status: "success",
      provider: "smtp",
      host: process.env.SMTP_HOST,
      to: params.to,
      workspaceId: undefined,
    });
    return { sent: true };
  } catch (error) {
    logger.error("Invite email failed to send", {
      action: "email:invite",
      status: "failure",
      provider: "smtp",
      host: process.env.SMTP_HOST,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return { sent: false };
  }
}

export async function sendInviteEmail(params: InviteEmailParams): Promise<{
  sent: boolean;
}> {
  if (isResendConfigured()) {
    return sendViaResend(params);
  }

  if (isSmtpConfigured()) {
    return sendViaSmtp(params);
  }

  logger.info("Invite email skipped (no email provider configured)", {
    action: "email:invite",
    status: "success",
    to: params.to,
  });
  return { sent: false };
}
