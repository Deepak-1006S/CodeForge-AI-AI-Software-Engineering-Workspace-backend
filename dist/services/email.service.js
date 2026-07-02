"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcome = exports.sendInvitation = exports.sendPasswordReset = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
let transporter = null;
const getTransporter = () => {
    if (!env_1.env.smtpUser || !env_1.env.smtpPass) {
        logger_1.logger.warn('SMTP credentials not configured. Email sending is disabled.');
        return null;
    }
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            host: env_1.env.smtpHost,
            port: env_1.env.smtpPort,
            secure: env_1.env.smtpPort === 465,
            auth: {
                user: env_1.env.smtpUser,
                pass: env_1.env.smtpPass,
            },
            tls: {
                rejectUnauthorized: env_1.env.nodeEnv === 'production',
            },
        });
    }
    return transporter;
};
const sendEmail = async (options) => {
    const transport = getTransporter();
    if (!transport) {
        logger_1.logger.warn(`Email not sent to ${options.to}: SMTP not configured`);
        return false;
    }
    try {
        const info = await transport.sendMail({
            from: `"CodeForge AI" <${env_1.env.emailFrom}>`,
            ...options,
        });
        logger_1.logger.info(`Email sent to ${options.to}: ${info.messageId}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error(`Failed to send email to ${options.to}:`, error);
        return false;
    }
};
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${env_1.env.clientUrl}/auth/verify/${token}`;
    return sendEmail({
        to: email,
        subject: 'Verify your CodeForge AI email address',
        text: `Please verify your email by visiting this link: ${verificationUrl}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4F46E5;">Verify Your Email</h2>
        <p>Thanks for signing up for CodeForge AI. Please verify your email address to activate your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy this link into your browser:</p>
        <p style="word-break: break-all; color: #6366F1;">${verificationUrl}</p>
      </div>
    `,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordReset = async (email, token) => {
    const resetUrl = `${env_1.env.clientUrl}/reset-password?token=${token}`;
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
exports.sendPasswordReset = sendPasswordReset;
const sendInvitation = async (email, orgName, token, inviterName) => {
    const inviteUrl = `${env_1.env.clientUrl}/accept-invitation?token=${token}`;
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
exports.sendInvitation = sendInvitation;
const sendWelcome = async (email, name) => {
    const loginUrl = `${env_1.env.clientUrl}/login`;
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
exports.sendWelcome = sendWelcome;
