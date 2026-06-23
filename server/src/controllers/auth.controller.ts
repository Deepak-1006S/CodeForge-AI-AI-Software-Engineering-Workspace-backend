import axios from 'axios';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/auth.service';
import { sendPasswordReset, sendWelcome } from '../services/email.service';
import { generateToken } from '../utils/generateToken';
import { logger } from '../config/logger';
import { env } from '../config/env';

const TOKEN_EXPIRY_HOURS = 1;

const buildProviderRedirectUri = (_req: Request, provider: string): string => {
  return `${env.backendUrl}/api/auth/${provider}/callback`;
};

const createOrFindSocialUser = async (email: string, name: string, avatar?: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalizedEmail });
  if (user) {
    return user;
  }

  const randomPassword = generateToken(16);
  user = await User.create({
    name,
    email: normalizedEmail,
    password: randomPassword,
    avatar: avatar || null,
    role: 'Developer',
  });

  return user;
};

const buildAuthRedirectUrl = (accessToken: string, refreshToken: string) => {
  const redirectUrl = new URL(`${env.clientUrl}/auth/social-callback`);
  redirectUrl.searchParams.set('accessToken', accessToken);
  redirectUrl.searchParams.set('refreshToken', refreshToken);
  return redirectUrl.toString();
};

const getGitHubEmail = async (accessToken: string): Promise<string> => {
  const response = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const emails = response.data as Array<{ email: string; primary: boolean; verified: boolean }>;
  const primary = emails.find((item) => item.primary && item.verified);
  if (primary) return primary.email;

  const verified = emails.find((item) => item.verified);
  if (verified) return verified.email;

  throw new ApiError(400, 'Unable to retrieve a verified GitHub email address.');
};

const getGoogleProfile = async (code: string, redirectUri: string) => {
  if (!env.googleClientId || !env.googleClientSecret) {
    throw new ApiError(500, 'Google OAuth is not configured on the server.');
  }

  const tokenResponse = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const accessToken = tokenResponse.data.access_token;
  if (!accessToken) {
    throw new ApiError(400, 'Failed to exchange Google authorization code.');
  }

  const profileResponse = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return profileResponse.data as {
    email?: string;
    name?: string;
    picture?: string;
  };
};

const getGitHubProfile = async (code: string, redirectUri: string) => {
  if (!env.githubClientId || !env.githubClientSecret) {
    throw new ApiError(500, 'GitHub OAuth is not configured on the server.');
  }

  const tokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: env.githubClientId,
      client_secret: env.githubClientSecret,
      code,
      redirect_uri: redirectUri,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );

  const githubAccessToken = tokenResponse.data.access_token;
  if (!githubAccessToken) {
    throw new ApiError(400, 'Failed to exchange GitHub authorization code.');
  }

  const profileResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${githubAccessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const profile = profileResponse.data as {
    email?: string;
    name?: string;
    login?: string;
    avatar_url?: string;
  };

  const email = profile.email || (await getGitHubEmail(githubAccessToken));
  return {
    email,
    name: profile.name || profile.login || 'GitHub User',
    avatar: profile.avatar_url,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({ name, email, password, role: role || 'Developer' });

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Send welcome email async (don't block response)
  sendWelcome(user.email, user.name).catch((err) =>
    logger.error('Failed to send welcome email:', err),
  );

  const userResponse = user.toJSON();

  res.status(201).json(
    new ApiResponse(
      201,
      { user: userResponse, accessToken, refreshToken },
      'Account created successfully',
    ),
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Explicitly select password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  const userResponse = user.toJSON();

  res.status(200).json(
    new ApiResponse(200, { user: userResponse, accessToken, refreshToken }, 'Login successful'),
  );
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json(new ApiResponse(200, { user }, 'User profile retrieved'));
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect.');
  }

  user.password = newPassword;
  await user.save();

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  res
    .status(200)
    .json(
      new ApiResponse(200, { accessToken, refreshToken }, 'Password updated successfully'),
    );
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return 200 to avoid user enumeration
  if (!user) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          'If an account with that email exists, a password reset link has been sent.',
        ),
      );
    return;
  }

  const resetToken = generateToken(32);
  const resetTokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = resetTokenExpiry;
  await user.save({ validateBeforeSave: false });

  const emailSent = await sendPasswordReset(user.email, resetToken);
  if (!emailSent) {
    // Clear token if email failed
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Failed to send password reset email. Please try again later.');
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        'If an account with that email exists, a password reset link has been sent.',
      ),
    );
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new ApiError(400, 'Password reset token is invalid or has expired.');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        'Password has been reset successfully. You are now logged in.',
      ),
    );
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    const decoded = await verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        'Token refreshed successfully',
      ),
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

export const githubLogin = async (req: Request, res: Response): Promise<void> => {
  if (!env.githubClientId || !env.githubClientSecret) {
    throw new ApiError(500, 'GitHub OAuth is not configured on the server.');
  }

  const redirectUri = buildProviderRedirectUri(req, 'github');
  const params = new URLSearchParams({
    client_id: env.githubClientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    allow_signup: 'true',
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code?.toString();
  if (!code) {
    throw new ApiError(400, 'GitHub authorization code is required.');
  }

  const redirectUri = buildProviderRedirectUri(req, 'github');
  const profile = await getGitHubProfile(code, redirectUri);
  const user = await createOrFindSocialUser(profile.email, profile.name, profile.avatar);

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  res.redirect(buildAuthRedirectUrl(accessToken, refreshToken));
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  if (!env.googleClientId || !env.googleClientSecret) {
    throw new ApiError(500, 'Google OAuth is not configured on the server.');
  }

  const redirectUri = buildProviderRedirectUri(req, 'google');
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code?.toString();
  if (!code) {
    throw new ApiError(400, 'Google authorization code is required.');
  }

  const redirectUri = buildProviderRedirectUri(req, 'google');
  const profile = await getGoogleProfile(code, redirectUri);
  if (!profile.email) {
    throw new ApiError(400, 'Unable to retrieve Google account email address.');
  }

  const user = await createOrFindSocialUser(profile.email, profile.name || 'Google User', profile.picture);
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  res.redirect(buildAuthRedirectUrl(accessToken, refreshToken));
};
