import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

let transporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
  if (!env.smtpUser || !env.smtpPass) {
    logger.warn('SMTP credentials not configured. Email sending is disabled.');
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
      tls: {
        rejectUnauthorized: env.nodeEnv === 'production',
      },
    });
  }

  return transporter;
};

const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> => {
  const transport = getTransporter();

  if (!transport) {
    logger.warn(`Email not sent to ${options.to}: SMTP not configured`);
    return false;
  }

  try {
    const info = await transport.sendMail({
      from: `"CodeForge AI" <${env.emailFrom}>`,
      ...options,
    });
    logger.info(`Email sent to ${options.to}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${options.to}:`, error);
    return false;
  }
};

export const sendPasswordReset = async (email: string, token: string): Promise<boolean> => {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset Your CodeForge AI Password',
    text: `You requested a password reset. Visit this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Reset Your Password</h2>
        <p>You requested a password reset for your CodeForge AI account.</p>
        <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy this link into your browser:</p>
        <p style="word-break: break-all; color: #6366F1;">${resetUrl}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;" />
        <p style="color: #6B7280; font-size: 12px;">
          If you did not request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `,
  });
};

export const sendInvitation = async (
  email: string,
  orgName: string,
  token: string,
  inviterName?: string,
): Promise<boolean> => {
  const inviteUrl = `${env.clientUrl}/accept-invitation?token=${token}`;

  return sendEmail({
    to: email,
    subject: `You're invited to join ${orgName} on CodeForge AI`,
    text: `${inviterName || 'Someone'} has invited you to join ${orgName} on CodeForge AI. Visit this link to accept: ${inviteUrl}\n\nThis invitation expires in 7 days.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">You're Invited to CodeForge AI</h2>
        <p>${inviterName ? `<strong>${inviterName}</strong> has` : 'You have been'} invited you to join 
           <strong>${orgName}</strong> on CodeForge AI — the AI-powered software engineering platform.</p>
        <p>Click below to accept your invitation. This link expires in <strong>7 days</strong>.</p>
        <a href="${inviteUrl}" 
           style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Accept Invitation
        </a>
        <p>Or copy this link into your browser:</p>
        <p style="word-break: break-all; color: #6366F1;">${inviteUrl}</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;" />
        <p style="color: #6B7280; font-size: 12px;">
          If you weren't expecting this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendWelcome = async (email: string, name: string): Promise<boolean> => {
  const loginUrl = `${env.clientUrl}/login`;

  return sendEmail({
    to: email,
    subject: 'Welcome to CodeForge AI!',
    text: `Welcome to CodeForge AI, ${name}! Your account has been created successfully. Visit ${loginUrl} to get started.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Welcome to CodeForge AI, ${name}!</h2>
        <p>Your account has been created successfully. You're ready to start building with AI-powered tools.</p>
        <ul style="line-height: 2;">
          <li>🚀 Create and manage projects</li>
          <li>🐛 Track and resolve issues with AI insights</li>
          <li>📊 Monitor team productivity</li>
          <li>🤖 Generate sprint summaries and release notes with AI</li>
        </ul>
        <a href="${loginUrl}" 
           style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Get Started
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;" />
        <p style="color: #6B7280; font-size: 12px;">
          If you have any questions, reach out to our support team.
        </p>
      </div>
    `,
  });
};
