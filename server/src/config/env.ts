import dotenv from 'dotenv';
dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

const parseNumber = (key: string, fallback: number): number => {
  const rawValue = process.env[key];
  if (!rawValue) return fallback;

  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new Error(`Environment variable ${key} must be a valid number.`);
  }

  return value;
};

const readString = (key: string, fallback = ''): string => {
  return process.env[key]?.trim() || fallback;
};

const readNodeEnv = (): NodeEnv => {
  const value = readString('NODE_ENV', 'development');
  if (value === 'development' || value === 'test' || value === 'production') {
    return value;
  }
  throw new Error('NODE_ENV must be one of: development, test, production.');
};

const requireEnv = (keys: string[]): void => {
  const missingVars = keys.filter((key) => !readString(key));
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

requireEnv(['MONGODB_URI']);

if (process.env.NODE_ENV === 'production') {
  requireEnv(['JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL']);
}

const port = parseNumber('PORT', 5000);

export const env = {
  port,
  nodeEnv: readNodeEnv(),
  mongoUri: readString('MONGODB_URI'),
  jwtSecret: readString('JWT_SECRET', 'fallback-secret-change-in-development'),
  jwtExpiresIn: readString('JWT_EXPIRES_IN', '7d'),
  jwtRefreshSecret: readString('JWT_REFRESH_SECRET', 'fallback-refresh-secret-change-in-development'),
  jwtRefreshExpiresIn: readString('JWT_REFRESH_EXPIRES_IN', '30d'),
  clientUrl: readString('CLIENT_URL', 'http://localhost:5173'),
  backendUrl: readString('BACKEND_URL', `http://localhost:${port}`),
  geminiApiKey: readString('GEMINI_API_KEY'),
  githubClientId: readString('GITHUB_CLIENT_ID'),
  githubClientSecret: readString('GITHUB_CLIENT_SECRET'),
  googleClientId: readString('GOOGLE_CLIENT_ID'),
  googleClientSecret: readString('GOOGLE_CLIENT_SECRET'),
  smtpHost: readString('SMTP_HOST', 'smtp.gmail.com'),
  smtpPort: parseNumber('SMTP_PORT', 587),
  smtpUser: readString('SMTP_USER'),
  smtpPass: readString('SMTP_PASS'),
  emailFrom: readString('EMAIL_FROM', 'noreply@codeforge.ai'),
  rateLimitWindowMs: parseNumber('RATE_LIMIT_WINDOW_MS', 900000),
  rateLimitMax: parseNumber('RATE_LIMIT_MAX', 100),
};
