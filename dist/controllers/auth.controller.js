"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resendVerificationEmail = exports.googleCallback = exports.googleLogin = exports.githubCallback = exports.githubLogin = exports.refreshAccessToken = exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.getMe = exports.login = exports.register = void 0;
const axios_1 = __importDefault(require("axios"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const auth_service_1 = require("../services/auth.service");
const email_service_1 = require("../services/email.service");
const generateToken_1 = require("../utils/generateToken");
const logger_1 = require("../config/logger");
const env_1 = require("../config/env");
const TOKEN_EXPIRY_HOURS = 1;
const buildProviderRedirectUri = (req, provider) => {
    const protocol = req.headers['x-forwarded-proto']?.toString() || req.protocol;
    const host = req.get('host');
    if (!host) {
        throw new ApiError_1.ApiError(500, 'Unable to determine host for OAuth redirect URI.');
    }
    return `${protocol}://${host}/api/auth/${provider}/callback`;
};
const createOrFindSocialUser = async (email, name, avatar) => {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User_1.User.findOne({ email: normalizedEmail });
    if (user) {
        return user;
    }
    const randomPassword = (0, generateToken_1.generateToken)(16);
    user = await User_1.User.create({
        name,
        email: normalizedEmail,
        password: randomPassword,
        avatar: avatar || null,
        role: 'Developer',
    });
    return user;
};
const buildAuthRedirectUrl = (accessToken, refreshToken) => {
    const redirectUrl = new URL(`${env_1.env.clientUrl}/auth/social-callback`);
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('refreshToken', refreshToken);
    return redirectUrl.toString();
};
const getGitHubEmail = async (accessToken) => {
    const response = await axios_1.default.get('https://api.github.com/user/emails', {
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github+json',
        },
    });
    const emails = response.data;
    const primary = emails.find((item) => item.primary && item.verified);
    if (primary)
        return primary.email;
    const verified = emails.find((item) => item.verified);
    if (verified)
        return verified.email;
    throw new ApiError_1.ApiError(400, 'Unable to retrieve a verified GitHub email address.');
};
const getGoogleProfile = async (code, redirectUri) => {
    if (!env_1.env.googleClientId || !env_1.env.googleClientSecret) {
        throw new ApiError_1.ApiError(500, 'Google OAuth is not configured on the server.');
    }
    const tokenResponse = await axios_1.default.post('https://oauth2.googleapis.com/token', new URLSearchParams({
        client_id: env_1.env.googleClientId,
        client_secret: env_1.env.googleClientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
    }).toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
        throw new ApiError_1.ApiError(400, 'Failed to exchange Google authorization code.');
    }
    const profileResponse = await axios_1.default.get('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return profileResponse.data;
};
const getGitHubProfile = async (code, redirectUri) => {
    if (!env_1.env.githubClientId || !env_1.env.githubClientSecret) {
        throw new ApiError_1.ApiError(500, 'GitHub OAuth is not configured on the server.');
    }
    const tokenResponse = await axios_1.default.post('https://github.com/login/oauth/access_token', {
        client_id: env_1.env.githubClientId,
        client_secret: env_1.env.githubClientSecret,
        code,
        redirect_uri: redirectUri,
    }, {
        headers: {
            Accept: 'application/json',
        },
    });
    const githubAccessToken = tokenResponse.data.access_token;
    if (!githubAccessToken) {
        throw new ApiError_1.ApiError(400, 'Failed to exchange GitHub authorization code.');
    }
    const profileResponse = await axios_1.default.get('https://api.github.com/user', {
        headers: {
            Authorization: `token ${githubAccessToken}`,
            Accept: 'application/vnd.github+json',
        },
    });
    const profile = profileResponse.data;
    const email = profile.email || (await getGitHubEmail(githubAccessToken));
    return {
        email,
        name: profile.name || profile.login || 'GitHub User',
        avatar: profile.avatar_url,
    };
};
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new ApiError_1.ApiError(409, 'An account with this email already exists.');
    }
    const verificationToken = (0, generateToken_1.generateToken)(32);
    const verificationExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const user = await User_1.User.create({
        name,
        email,
        password,
        role: role || 'Developer',
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpiration,
    });
    const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
    (0, email_service_1.sendWelcome)(user.email, user.name).catch((err) => logger_1.logger.error('Failed to send welcome email:', err));
    (0, email_service_1.sendVerificationEmail)(user.email, verificationToken).catch((err) => logger_1.logger.error('Failed to send verification email:', err));
    const userResponse = user.toJSON();
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { user: userResponse, accessToken, refreshToken }, 'Account created successfully. Please verify your email.'));
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    // Explicitly select password for comparison
    const user = await User_1.User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password.');
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password.');
    }
    const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
    const userResponse = user.toJSON();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { user: userResponse, accessToken, refreshToken }, 'Login successful'));
};
exports.login = login;
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    const user = await User_1.User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Verification token is invalid or has expired.');
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { message: 'Email verified successfully.' }, 'Email verified successfully.'));
};
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User_1.User.findOne({ email: email.toLowerCase() });
    if (!user) {
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'If an account with that email exists, a verification email has been sent.'));
        return;
    }
    if (user.isEmailVerified) {
        res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Email is already verified.'));
        return;
    }
    const verificationToken = (0, generateToken_1.generateToken)(32);
    const verificationExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpiration;
    await user.save({ validateBeforeSave: false });
    await (0, email_service_1.sendVerificationEmail)(user.email, verificationToken);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'If an account with that email exists, a verification email has been sent.'));
};
exports.resendVerificationEmail = resendVerificationEmail;
const getMe = async (req, res) => {
    const user = await User_1.User.findById(req.user._id).select('-password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { user }, 'User profile retrieved'));
};
exports.getMe = getMe;
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User_1.User.findById(req.user._id).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found.');
    }
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
        throw new ApiError_1.ApiError(400, 'Current password is incorrect.');
    }
    user.password = newPassword;
    await user.save();
    const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken }, 'Password updated successfully'));
};
exports.updatePassword = updatePassword;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User_1.User.findOne({ email: email.toLowerCase() });
    // Always return 200 to avoid user enumeration
    if (!user) {
        res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, {}, 'If an account with that email exists, a password reset link has been sent.'));
        return;
    }
    const resetToken = (0, generateToken_1.generateToken)(32);
    const resetTokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save({ validateBeforeSave: false });
    const emailSent = await (0, email_service_1.sendPasswordReset)(user.email, resetToken);
    if (!emailSent) {
        // Clear token if email failed
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError_1.ApiError(500, 'Failed to send password reset email. Please try again later.');
    }
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, {}, 'If an account with that email exists, a password reset link has been sent.'));
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    const user = await User_1.User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');
    if (!user) {
        throw new ApiError_1.ApiError(400, 'Password reset token is invalid or has expired.');
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
    res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken }, 'Password has been reset successfully. You are now logged in.'));
};
exports.resetPassword = resetPassword;
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError_1.ApiError(400, 'Refresh token is required');
    }
    try {
        const decoded = await (0, auth_service_1.verifyRefreshToken)(refreshToken);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            throw new ApiError_1.ApiError(401, 'User not found');
        }
        const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
        const newRefreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
        res.status(200).json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed successfully'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, 'Invalid or expired refresh token');
    }
};
exports.refreshAccessToken = refreshAccessToken;
const githubLogin = async (req, res) => {
    if (!env_1.env.githubClientId || !env_1.env.githubClientSecret) {
        throw new ApiError_1.ApiError(500, 'GitHub OAuth is not configured on the server.');
    }
    const redirectUri = buildProviderRedirectUri(req, 'github');
    const params = new URLSearchParams({
        client_id: env_1.env.githubClientId,
        redirect_uri: redirectUri,
        scope: 'read:user user:email',
        allow_signup: 'true',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};
exports.githubLogin = githubLogin;
const githubCallback = async (req, res) => {
    const code = req.query.code?.toString();
    if (!code) {
        throw new ApiError_1.ApiError(400, 'GitHub authorization code is required.');
    }
    const redirectUri = buildProviderRedirectUri(req, 'github');
    const profile = await getGitHubProfile(code, redirectUri);
    const user = await createOrFindSocialUser(profile.email, profile.name, profile.avatar);
    const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
    res.redirect(buildAuthRedirectUrl(accessToken, refreshToken));
};
exports.githubCallback = githubCallback;
const googleLogin = async (req, res) => {
    if (!env_1.env.googleClientId || !env_1.env.googleClientSecret) {
        throw new ApiError_1.ApiError(500, 'Google OAuth is not configured on the server.');
    }
    const redirectUri = buildProviderRedirectUri(req, 'google');
    const params = new URLSearchParams({
        client_id: env_1.env.googleClientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};
exports.googleLogin = googleLogin;
const googleCallback = async (req, res) => {
    const code = req.query.code?.toString();
    if (!code) {
        throw new ApiError_1.ApiError(400, 'Google authorization code is required.');
    }
    const redirectUri = buildProviderRedirectUri(req, 'google');
    const profile = await getGoogleProfile(code, redirectUri);
    if (!profile.email) {
        throw new ApiError_1.ApiError(400, 'Unable to retrieve Google account email address.');
    }
    const user = await createOrFindSocialUser(profile.email, profile.name || 'Google User', profile.picture);
    const accessToken = (0, auth_service_1.generateAccessToken)(user._id.toString(), user.role);
    const refreshToken = (0, auth_service_1.generateRefreshToken)(user._id.toString());
    res.redirect(buildAuthRedirectUrl(accessToken, refreshToken));
};
exports.googleCallback = googleCallback;
